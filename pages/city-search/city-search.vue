<template>
	<view class="container">
		<!-- 城市搜索 -->
		<search-area @focus="isReach = true" @searc="searchHandle"></search-area>

		<!-- 城市列表 -->
		<view v-show="!isReach">
			<scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true" :scroll-into-view="toIndex"
			 @scroll="scrollHandle">
				<view class="block">

					<!-- 热门城市 -->
					<view class="area list-item" id="hot">
						<view class="title-wrapp">
							<view class="title">
								<text class="l">热门城市</text>
							</view>
						</view>
						<view class="ul" v-if="hotcites.length">
							<view class="li" :class="{ active: selectedCityId === item.cityId }" hover-class="hover" v-for="item in hotcites" :key="item.cityId" @click="selectCity(item)">{{ item.cityName }}</view>
						</view>
					</view>

					<!-- 最近使用 -->
					<view class="area list-item recent-used" id="recent" v-if="recentCities.length">
						<view class="title-wrapp">
							<view class="title">
								<text class="l">最近使用</text>
								<text class="r" @click="clearRecentCities">
									<image class="link" src="@/static/icon/delete.png" mode="aspectFit" @tap="handlerDelete"></image>
								</text>
							</view>
						</view>
						<view class="ul" v-if="recentCities.length">
							<view class="li" :class="{ active: selectedCityId === item.cityId }" hover-class="hover" v-for="item in recentCities" :key="item.cityId" @click="selectCity(item)">{{ item.cityName || item.city }}</view>
						</view>
					</view>
					<!-- 字母索引 -->
					<view class="area list-item letter-index" id="letter-index">
						<view class="title-wrapp">
							<view class="title">
								<text class="l">字母索引</text>
								<text class="r">
									<text class="iconfont icon-delete"></text>
								</text>
							</view>
						</view>
						<view class="ul">
							<view class="li letter-item" :class="{ active: selectedCityId === item.cityId }" hover-class="hover" v-for="item in alphabet.filter(item=> !['area', 'hot'].includes(item))" @touchstart="getLetter" @touchend="setLetter" :id="item">{{ item }}</view>
						</view>
					</view>
				</view>
				<!-- 城市列表  -->
				<view class="city-list">
					<view class="list list-item" v-for="(item, key) of cities" :key="key" :id="key">
						<view class="title">{{ key }}</view>
						<view class="item borderBottom" hover-class="hover" v-for="innerItem in item" :key="innerItem.cityId" @click="selectCity(innerItem)">
							{{ innerItem.city }}
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 字母列表 -->
			<view class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
				<view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter" :id="item">
					<view v-if="item !== 'area'" class="item" :class="{ active: currentLetter == item }">
						{{ item == "hot" ? "热" : item }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import City from "./city.json";
	import SearchArea from './city-search-area.vue'
	export default {
		components: {
			SearchArea
		},
		data() {
			return {
				isIPX: null,
				regionId: null, //区域ID
				isToggle: true,
				isReach: false,
				inputValue: "",
				searchData: [], //搜索的数据
				isClearBtn: false,

				regionList: City.data.area, //区域列表,模拟数据请自行修改
				cityId: null, //城市ID
				cityName: null, //城市名
				areaName: '东城区', //区域名,模拟数据请自行修改

				hotcites: City.data.hotcity, //热门城市，模拟数据请自行修改
				cities: City.data.cities, //城市列表,拟数据请自行修改
				recentCities: [{ cityId: 22, cityName: '上海' }], //最近使用的城市
				selectedCityId: null, //当前选中的城市ID

				alphabet: City.data.alphabet, //字母列表
				toIndex: "", //跳转的索引的字母
				tipsLetter: "", //滑动显示字母
				timer: null,
				hasNoData: false,
				searchFocus: false,
				letterDetails: [],
				currentLetter: "area" //默认选择hot
			};
		},
		watch: {
			// 城市搜索输入框
			inputValue(newVal) {
				this.isClearBtn = newVal ? true : false;

				if (this.timer) {
					clearTimeout(this.timer);
				}

				if (!this.inputValue) {
					this.searchData = [];
					return;
				}
				this.timer = setTimeout(() => {
					const result = [];
					for (let i in this.cities) {
						this.cities[i].forEach(item => {
							if (
								item.spell.includes(this.inputValue) ||
								item.city.includes(this.inputValue)
							) {
								result.push(item);
							}
						});
					}
					this.searchData = result;
					if (this.searchData.length === 0) {
						this.hasNoData = true;
					} else {
						this.hasNoData = false;
					}
				}, 500);
			},
			isReach(val) {
				this.searchFocus = val;
			}
		},
		created() {
			//真实数据请求...
			// 从本地存储加载最近使用的城市
			this.loadRecentCities();
		},
		methods: {
			searchHandle(val) {
				console.log("搜索词", val)
			},
			//列表滚动，和右边字母表对应
			scrollHandle(e) {
					let view = uni.createSelectorQuery().in(this).selectAll(".list-item");
					view.boundingClientRect(d => {
						let top = d[0].top;
						d.forEach(item => {
							item.top = item.top - top;
							item.bottom = item.bottom - top;
							this.letterDetails.push({
								id: item.id,
								top: item.top,
								bottom: item.bottom
							});
						});
					}).exec();

					const scrollTop = e.detail.scrollTop;
					this.letterDetails.some(item => {
						if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
							this.currentLetter = item.id;
							//当前固定用的是粘性定位，如果不用粘性定位，在这里设置
							return true;
						}
					});
			},
			handlerDelete() {
				this.recentCities = [];
				uni.setStorageSync('recentCities', this.recentCities);
			},

			//搜索
			searchChange(e) {
				let {
					value
				} = e.detail;
				this.inputValue = value;
			},

			//搜索结果列表数据
			citySearchList(item) {
				console.log('选择的城市：', item)
				this.selectCity(item);
			},

			//搜索按钮点击
			handleSearch() {
				// 搜索逻辑已在inputValue的watch中处理
			},

			selectCity(item) {
				console.log('选择的城市：', item)
				this.selectedCityId = item.cityId;
				// 添加到最近使用
				this.addToRecentCities(item);
				//当前项目是需要选择到区域，所以选择城市后回到区县的地方
				this.toIndex = "area";
				setTimeout(()=>{
					this.toIndex = "";
				},1000)
			},

			//添加到最近使用
			addToRecentCities(item) {
				// 移除已存在的相同城市
				this.recentCities = this.recentCities.filter(city => city.cityId !== item.cityId);
				// 添加到开头
				this.recentCities.unshift({
					cityId: item.cityId,
					cityName: item.cityName || item.city,
					city: item.city,
					spell: item.spell
				});
				// 最多保留8个
				if (this.recentCities.length > 8) {
					this.recentCities = this.recentCities.slice(0, 8);
				}
				// 保存到本地存储
				uni.setStorageSync('recentCities', this.recentCities);
			},

			//加载最近使用的城市
			loadRecentCities() {
				try {
					const recent = uni.getStorageSync('recentCities');
					if (recent && Array.isArray(recent)) {
						this.recentCities = recent;
					}
				} catch (e) {
					console.error('加载最近使用城市失败', e);
				}
			},

			//清空最近使用
			clearRecentCities() {
				uni.showModal({
					title: '提示',
					content: '确定要清空最近使用的城市吗？',
					success: (res) => {
						if (res.confirm) {
							this.recentCities = [];
							uni.removeStorageSync('recentCities');
						}
					}
				});
			},
			
			//区域选择
					selectRegion(item) {
						console.log('选择的区域是：', item)
					},

			//触发开始
			touchStart(e) {
				// console.log(e);
			},
			//移动时
			touchMove(e) {
				uni.vibrateShort();
				let y = e.touches[0].clientY;
				let offsettop = e.currentTarget.offsetTop;

				//判断选择区域,只在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 15); //右边每个字母元素的高度
					let letter = this.alphabet[num];
					this.tipsLetter = letter;

					let curentLetter = this.letterTransform(letter);
					uni.showToast({
						title: curentLetter,
						icon: "none",
						duration: 1000
					});
				}
			},
			//触发结束
			touchEnd() {
				this.toIndex = this.tipsLetter;
			},
			//移动开始获取字母，并放大提示
			getLetter(e) {
				uni.vibrateShort();
				let {
					id
				} = e.currentTarget;
				this.tipsLetter = id;

				let curentLetter = this.letterTransform(id);
				uni.showToast({
					title: curentLetter,
					icon: "none",
					duration: 1000
				});
			},
			//移动结束设置字母，赋值到toIndex
			setLetter() {
				this.toIndex = this.tipsLetter;
			},

			//提示字母转换
			letterTransform(letter) {
				let str = "";
				if (letter == "area") {
					str = "区县";
				} else if (letter == "hot") {
					str = "热门";
				} else {
					str = letter;
				}

				return str;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		background: #F8F8F8;
		position: relative;
	}

	.borderBottom {
		position: relative;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}


	.city-search-wrap {
		width: 100%;
		padding: 0;
		box-sizing: border-box;

		.search {
			width: 100%;
			height: 88rpx;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #222;
			padding: 0 30rpx;
			box-sizing: border-box;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 100;
			background: #fff;
			/* #ifdef H5 */
				position: fixed;
				left: 0;
				top: 4;
				z-index: 100;
				background: #fff;
			/* #endif */

			.back-icon {
				font-size: 36rpx;
				color: #222;
				margin-right: 20rpx;
				padding: 10rpx;
				line-height: 1;
			}

			.l-search {
				flex: 1;
				position: relative;
				height: 60rpx;
				line-height: 60rpx;
				
				.icon-search {
					font-size: 28rpx;
					position: absolute;
					left: 20rpx;
					top: 50%;
					transform: translateY(-50%);
					color: #8e8f97;
					z-index: 2;
				}

				.input-search {
					width: 100%;
					height: 60rpx;
					box-sizing: border-box;
					padding: 0 60rpx 0 60rpx;
					text-align: left;
					background: #f4f5f9;
					border-radius: 50rpx;
					border: 0;
					font-size: 28rpx;
					color: #222;
				}

				.clear-input {
					font-size: 30rpx;
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					padding: 10rpx;
					color: #8e8f97;
					z-index: 2;
				}
			}

			.r-search-btn {
				margin-left: 20rpx;
				padding: 0 24rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #ffde45;
				border: 0;
				border-radius: 10rpx;
				font-size: 28rpx;
				color: #222;
				font-weight: 500;
				white-space: nowrap;
			}
		}
	}

	.reach-content {
		padding-top: 88rpx;
		background: #fff;
		min-height: calc(100vh - 88rpx);

		.li {
			font-size: 32rpx;
			color: #333;
			padding: 24rpx 30rpx;
			position: relative;
			background: #fff;
		}
	}

	.block {
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.borderBottom {
		position: relative;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: calc(100% - 50rpx);
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}

	.top-search {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		
		.item {
			background: #f4f5f9;
			border-radius: 50rpx;
			font-size: 28rpx;
			text-align: left;
			color: #8e8f97;
			padding: 0 20rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			/* #ifdef MP-ALIPAY */
				height: 60rpx;
				line-height: 60rpx;
			/* #endif */
			text {
				padding-left: 20rpx;
				color: #8e8f97;
			}

			.icon-search {
				font-size: 28rpx;
				color: #8e8f97;
				font-weight: 700;
			}
		}
	}

	.scroll-view {
		width: 100%;
		height: calc(100vh - 80rpx);
		box-sizing: border-box;
	}
	.recent-used.area {
		margin-bottom: 0;
	}
	.area {
		margin-bottom: 20rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 20rpx;

		.title-wrapp {
			position: sticky;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 1;
		}

		.title {
			width: 100%;
			box-sizing: border-box;
			font-size: 30rpx;
			font-weight: 500;
			color: #222;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.l {
				font-size: 30rpx;
				font-weight: 500;
				color: #222;
			}

			.r {
				font-size: 24rpx;
				color: #8e8f97;
				display: flex;
				align-items: center;
				padding: 10rpx;
				cursor: pointer;

				.iconfont {
					font-size: 28rpx;
					color: #8e8f97;
				}
			}
		}

		.ul {
			display: flex;
			flex-wrap: wrap;
			margin-right: -20rpx;

			.li {
				width: calc((100% - 60rpx) / 4);
				padding: 0;
				box-sizing: border-box;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 26rpx;
				color: #222;
				border-radius: 6rpx;
				margin: 0 14rpx 14rpx 0;
				background: #F9F9F9;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 0 6rpx;

				&.active {
					font-weight: 500;
					background: #ffebee;
					color: #FF0101;
				}
			}

			.hover {
				background: #FFF5F5;
				color: #FF0101;
			}
		}
	}
	.letter-index  {
		.ul{
			display: grid;
			grid-template-columns: repeat(9, 1fr);
			gap: 10rpx;
			.letter-item {
				width: auto !important;
			}
		}
	}
	.city-list {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;

		.list {
			margin-bottom: 20rpx;
			.title {
				height: 60rpx;
				line-height: 60rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: #272636;
				position: sticky;
				top: 0;
				left: 0;
				z-index: 2;
			}

			.item {
				display: flex;
				align-items: center;
				height: 80rpx;
				color: #666666;
				font-size: 26rpx;
				opacity: 0.6;
				// border-bottom: 1px solid #f3f3f3;

				&::after {
					left: 0;
					width: calc(100% - 30rpx);
					background: #d2d2d2;
				}
			}

			.hover {
				background: #f4f5f9;

				&::after {
					background: #f4f5f9;
				}
			}
		}

		.list-item {
			padding: 20rpx;
			border-radius: 20rpx;
			background: #fff;
		}
	}

	.alphabet {
		position: fixed;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 30rpx;
		text-align: center;
		font-size: 20rpx;
		font-weight: 700;
		color: #666;
		z-index: 100;
		padding: 20rpx 0;
		border-radius: 30rpx;
		background: rgba(109, 109, 109, 0.19);

		> view {
			.item {
				height: 30rpx;
				line-height: 30rpx;
				padding: 2rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.active {
				color: #222;
			}
		}
	}

	.has-no-data {
		font-size: 24rpx;
		text-align: center;
		color: #8e8f97;
		margin-top: 50rpx;
	}
	.link{
		width: 28rpx;
		height: 30rpx;
	}
</style>
