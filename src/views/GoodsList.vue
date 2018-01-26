<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter 当视口小于一定值时，此区域会被隐藏掉 -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{cur: priceChecked=='all'}">All</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{cur:priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <!--<div class="price">{{item.productPrice}}</div>-->
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
                <!--
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
                -->
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img v-if="loading" src="../assets/loading-spinning-bubbles.svg"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import "../assets/css/base.css"
  import "../assets/css/product.css"
  import NavHeader from '@/components/NavHeader.vue'
  import NavFooter from '@/components/NavFooter.vue'
  import NavBread from '@/components/NavBread.vue'
  import axios from 'axios'
  export default {
      data() {
          return {
            goodsList: [],
            sortFlag: true, //排序是升序true还是降序false
            page: 1,  //当前页码
            pageSize: 8,  //每页显示的条目数
            busy: true,
            loading: false, //是否显示加载效果
            priceFilter: [
              {
                  startPrice: '0.00',
                  endPrice: '100.00'
              },
              {
                startPrice: '100.00',
                endPrice: '500.00'
              },
              {
                startPrice: '500.00',
                endPrice: '1000.00'
              },
              {
                startPrice: '1000.00',
                endPrice: '5000.00'
              }
            ],
            priceChecked: 'all',//当前选中的是哪一项价格
            filterBy: false, //控制抽屉是否显示
            overLayFlag: false  //控制遮罩是否显示
          }
      },
      components: {
        NavHeader,
        NavFooter,
        NavBread
      },
      mounted: function() {
          this.getGoodsList();
      },
      methods: {
        getGoodsList(flag) {
            /*
            let _this = this;
            axios.get("/goods").then((result)=> {
                var res = result.data;
                if(res.status ===0) {
                  _this.goodsList = res.result.list;
                } else {
                  _this.goodsList = [];
                }
            });
            */
          var param = {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortFlag?1:-1,
            priceLevel: this.priceChecked //用于价格过滤
          };
          this.loading = true; //加载效果展示
          axios.get("/goods",{
              params: param
          }).then((response)=>{
            let res = response.data;
            this.loading = false; //隐藏加载效果
            if(res.status===0) {
                if(flag) {
                  //需要累加
                  this.goodsList = this.goodsList.concat(res.result.list);
                  if(res.result.count === 0) { //已经没有数据了
                      this.busy = true; //禁用滚动加载
                  } else {
                      this.busy = false;
                  }
                } else {
                    //第一次进入或者不需要分页
                  this.goodsList = res.result.list;
                  this.busy = false; //起用滚动
                }
            } else {
              this.goodsList = [];
            }
          })
        },
        sortGoods() { //排序
          this.sortFlag = !this.sortFlag;
          //点击排序后从第1页开始，重新获取列表
          this.page = 1;
          this.getGoodsList();
        },
        setPriceFilter(index) {
            this.priceChecked = index;
//            this.closePop();  //选中价格后，关闭遮罩层
            this.page = 1;
            this.getGoodsList();
        },
        loadMore() {
            this.busy = true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);
        },
        addCart(productId) {
            axios.post("/goods/addCart",{
                productId: productId
            }).then((res)=>{
                if(res.data.status===0) {
                    alert("加入成功");
                } else {
                    alert("msg:"+res.msg);
                }
            })
        },
        showFilterPop() {
              this.filterBy = true;
              this.overLayFlag = true;
        },
        closePop() {
          this.filterBy = false;
          this.overLayFlag = false;
        }
      }
  }
</script>
