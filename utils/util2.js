var api = require('@/config/api.js');
import Dialog from '@/wxcomponents/vant/dist/dialog/dialog.js';

function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()


	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const gotoLogin = (function gotoLogin() {
	let time = Date.now()
	return () => {
		getApp().setLoginProps(false)
	}
})();
/**
 * 封装微信的 request,支持 token 无感刷新
 */
let isRefreshing = false; // 是否正在刷新 token
let failedQueue = []; // 存放等待重试的请求

// 请求队列处理函数
const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// 处理 token 过期：清除缓存 + 跳转登录
function handleTokenExpired(res) {
	const clearKeys = [
		'token', 'refresh_token', 'token_type',
		'user', 'timer', 'currPage'
	];
	clearKeys.forEach(key => uni.removeStorageSync(key));

	// 清除定时器
	const timer = uni.getStorageSync('timer');
	if (timer) {
		clearInterval(timer);
		uni.removeStorageSync('timer');
	}

	// 当前页面不是首页或我的页，则跳转登录
	const pages = getCurrentPages();
	const currPage = pages[pages.length - 1]?.route;
	const notLoginPages = ['pages/index/index', 'pages/my/my'];

	if (currPage && !notLoginPages.includes(currPage)) {
		uni.setStorageSync('currPage', currPage);
		Dialog.alert({
			title: '温馨提示',
			message: res.msg,
			zIndex: 2000,
			confirmButtonText: '重新登录'
		}).then(() => {
			// 示例：跳转到登录页
			uni.reLaunch({
				url: '/packageB/login/login'
			});
		});
	}
}

// 刷新 token 请求函数
function refreshToken() {
	return new Promise((resolve, reject) => {
		const refresh = uni.getStorageSync('refresh_token');
		if (!refresh) {
			reject(new Error('No refresh_token'));
			return;
		}

		wx.request({
			url: api.oauthLogin, // 刷新token接口
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic c2FiZXI6c2FiZXJfc2VjcmV0',
				'Tenant-Id': '000000'
			},
			data: {
				grant_type: 'refresh_token',
				refresh_token: refresh
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data.access_token) {
					const newToken = res.data.access_token;
					const newRefreshToken = res.data.refresh_token || refresh;
					const tokenType = res.data.token_type || 'Bearer';
					// 保存新 token
					uni.setStorageSync('token', newToken);
					uni.setStorageSync('refresh_token', newRefreshToken);
					uni.setStorageSync('token_type', tokenType);

					resolve(newToken);
				} else {
					reject(new Error('Refresh failed'));
				}
			},
			fail: () => reject(new Error('Network error')),
		});
	});
}

/**
 * 封装 request
 */
function request(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
	const token = uni.getStorageSync('token');
	const config = {
		url: url,
		data: data,
		method: method,
		header: {
			'Content-Type': header,
			'Tenant-Id': '000000',
			'token': token || '',
			'Blade-Auth': (uni.getStorageSync('token_type') || 'Bearer') + ' ' + (token || ''),
			'Authorization': 'Basic c2FiZXI6c2FiZXJfc2VjcmV0',
		}
	};

	return new Promise((resolve, reject) => {
		const requestNow = () => {
			wx.request({
				...config,
				success: function(res) {
					if (res.statusCode === 200) {
						// 数据预处理（如图片 URL 截取）
						const jx = (data) => {
							for (let key in data) {
								if (data[key] instanceof Object) {
									jx(data[key]);
								} else if (key === 'list_pic_url') {
									data[key] = data[key]?.split('#$#')[0] || data[key];
								}
							}
						};
						jx(res.data);
						//成功返回
						if (res.data.code == 5001 || res.data.code == 4000) {
							const pages = getCurrentPages();
							const currPage = pages[pages.length - 1]?.route;
							const notLoginPages = ['pages/index/index', 'pages/my/my'];

							const originalRequest = {
								resolve,
								reject,
								config
							};

							if (!uni.getStorageSync('refresh_token')) {
								handleTokenExpired(res.data);
								return;
							}

							if (!isRefreshing) {
								isRefreshing = true;

								refreshToken()
									.then(newToken => {
										// 更新 header
										originalRequest.config.header['token'] = newToken;
										originalRequest.config.header['Blade-Auth'] =
											`${uni.getStorageSync('token_type')} ${newToken}`;

										// 重试原请求
										request(originalRequest.config.url, originalRequest
												.config.data, originalRequest.config.method,
												header)
											.then(res => originalRequest.resolve(res))
											.catch(err => originalRequest.reject(err));

										// 通知队列
										processQueue(null, newToken);
									})
									.catch(() => {
										handleTokenExpired(res.data);
										return;
										processQueue(new Error('Refresh failed'), null);
									})
									.finally(() => {
										isRefreshing = false;
									});
							}

							// 所有其他请求进入队列等待
							failedQueue.push(originalRequest);
						}
						// 其他业务错误
						else {
							resolve(res.data);
						}
					} else {
						reject(res);
					}
				},
				fail: (err) => {
					reject(err);
				},
				complete: () => {
					wx.stopPullDownRefresh();
					wx.hideLoading();
				}
			});
		};

		requestNow();
	});
}

function requestWeChat(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {

	return new Promise(function(resolve, reject) {
		wx.request({
			url: url,
			data: data,
			method: method,
			header: {
				'Content-Type': header,
				'token': uni.getStorageSync('token') == '' ? 0 : uni.getStorageSync('token'),
				'Tenant-Id': "000000",
				'Blade-Auth': uni.getStorageSync('token_type') +
					' ' + uni.getStorageSync('token'),
				'Authorization': 'Basic c2FiZXI6c2FiZXJfc2VjcmV0',
			},
			success: function(res) {
				// wx.hideLoading();
				if (res.statusCode == 200) {
					let pages = getCurrentPages()
					let currPage = pages[pages.length - 1].route
					const jx = (data) => {
						for (let key in data) {
							if (data[key] instanceof Object) {
								jx(data[key])
							} else if (key === 'list_pic_url') {
								data[key] = data[key] && data[key].split('#$#')[0]
								console.error(`${key}: ${data[key]}`, data)
							}
						}
					}
					jx(res.data)
					resolve(res.data);
					// }
				} else {
					reject(res.errMsg);
				}

			},
			fail: function(err) {
				reject(err)
			},
			complete: function(res) {
				wx.stopPullDownRefresh()
				wx.hideLoading();
			}
		})
	});
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
	return new Promise(function(resolve, reject) {
		wx.checkSession({
			success: function() {
				resolve(true);
			},
			fail: function() {
				reject(false);
			}
		})
	});
}

/**
 * 调用微信登录
 */
function login() {
	return new Promise(function(resolve, reject) {
		wx.login({
			success: function(res) {
				if (res.code) {
					resolve(res);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

function redirect(url) {

	//判断页面是否需要登录
	if (false) {
		uni.reLaunch({
			url: "/packageB/login/login"
		})
		return false;
	} else {
		wx.redirectTo({
			url: url
		});
	}
}

function showErrorToast(msg, cb) {
	wx.showToast({
		title: msg,
		image: '/static/images/icon_error.png',
		success: cb
	})
}

function showSuccessToast(msg) {
	wx.showToast({
		title: msg,
	})
}

function checkNetStatu() {
	var statu = true
	return new Promise(r => {
		wx.getNetworkType({
			success: function(res) {
				var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi, none, unknown
				if (networkType == "none") {
					//没有网络连接
					statu = false
				} else if (networkType == "unknown") {
					//未知的网络类型
					statu = false
				}
				r(statu)
			}
		})
	})
}

//判断是否空值
function isNotEmpty(value) {
	return value !== null && value !== undefined && value !== '' && value !== 0 && value !== false;
}

//
function getProjectLocation() {
	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			const latitude = res.latitude
			const longitude = res.longitude
			uni.setStorageSync('location', {
				latitude,
				longitude
			})

			request(api.getProjectList, {
				current: 1,
				size: 1,
				longitude,
				latitude
			}, 'get').then((res) => {
				uni.hideLoading()
				if (res.code === 200 || res.code === '200') {
					if (res.data.records.length > 0) {
						var projInfos = res.data.records[0]
						projInfos.projectId = JSON.parse(JSON.stringify(projInfos.id))
						projInfos.id = JSON.parse(JSON.stringify(projInfos.regionId))

						// 获取缓存中选中的学校信息
						let selectedSchool = uni.getStorageSync('locationCityInfo');
						if (!selectedSchool) {
							uni.setStorageSync('locationCityInfo', projInfos);
							uni.setStorageSync('locationCity', projInfos.communityName);
						}

						if (uni.getStorageSync('user')) {
							request(api.dataInsert, {
								regionId: projInfos.regionId,
								communityId: projInfos.projectId,
								userId: uni.getStorageSync('user').id,
							}).then((res) => {
								if (res.code === 200 || res.code === '200') {
									uni.setStorageSync('openModuleId', res.data)
								}
							}).catch(() => {})

						}
						this.getProjInfo(projInfos)
					} else { //如果附近没有社区根据当前经纬度获取附近社区
						// this.getLocation2(longitude, latitude, 2)
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			}).catch(() => {
				uni.hideLoading()
			})

		},
		fail: (err) => {
			uni.setStorageSync('location', {
				latitude: '',
				longitude: ''
			})
			this.getProjectList('', '')
		}
	})
}

//更新用户信息
function updateUserInfo() {
	request(api.getUserInfo, {}, 'get').then((response) => {
		if (response.code === '200' || response.code === 200) {
			uni.setStorage({
				key: 'user',
				data: response.data,
			})
		}
	}).catch(function(error) {
		uni.hideLoading();
	})
}

//增加商品销量
function addProductSalesNum(params) {
	request(api.addProductSalesNum, params, 'post').then((response) => {
		if (response.code === '200' || response.code === 200) {}
	}).catch(function(error) {
		uni.hideLoading();
	})
}


function isWithin24Hours(date1, date2) {
	const oneDay = 86400000; // 24小时的毫秒数
	const difference = Math.abs(date2.getTime() - date1.getTime());
	return difference < oneDay;
}

//增加天数
function AddDays(date, days) {
	var nd = date;
	nd = nd.valueOf();
	nd = nd + days * 24 * 60 * 60 * 1000;
	nd = new Date(nd);
	var y = nd.getFullYear();
	var m = nd.getMonth() + 1;
	var d = nd.getDate();
	if (m <= 9) m = "0" + m;
	if (d <= 9) d = "0" + d;
	var cdate = y + "-" + m + "-" + d;
	return cdate;
}

function roleRoleName(roleName) {
	let roleNumber = 0
	switch (roleName) {
		case 'pingtai':
			roleNumber = 1
			break;
		case 'zhongxin':
			roleNumber = 2
			break;
		default:
			roleNumber = 3
	}
	return roleNumber;
}



module.exports = {
	AddDays,
	addProductSalesNum,
	isWithin24Hours,
	getProjectLocation,
	updateUserInfo,
	formatTime,
	request,
	requestWeChat,
	redirect,
	showErrorToast,
	showSuccessToast,
	checkSession,
	login,
	isNotEmpty,
	checkNetStatu,
	roleRoleName,
}