<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="container">
      <div class="filter-nav">
        <span>Sort by:</span>
        <span class="def">Default</span>
        <a @click="sortGoods" href="javascript:void(0);">
          Price
          <svg class="icon-arrow-short">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""></use>
          </svg>
        </a>
      </div>
      <div class="goods-container">
        <div class="price-wrap">
          <div class="price-filter">
            <dl>
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0);" v-bind:class="{'cur':priceChecked}"></a>
              </dd>
              <dd v-for="(item, index) in priceFilter">
                <a href="javascript:void(0);" v-bind:class="{'cur':priceChecked}"></a>
              </dd>
            </dl>
          </div>
        </div>
        <div class="list-wrap">
          <ul>
            <li class="item" v-for="item in goodsList">
              <div class="pic">
                <a href="javascript:void(0);">
                  <img v-bind:src="'/static/'+item.productImage">
                </a>
                <div class="info">
                  <div class="info-name">{{item.productName}}</div>
                  <div class="info-price">{{item.salePrice}}</div>
                  <div>
                    <a href="javascript:void(0);" class="btn btn-cart" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div class="accessory-result-page accessory-page">-->
      <!--<div class="container">-->
        <!--<div class="filter-nav">-->
          <!--<span class="sortby">Sort by:</span>-->
          <!--<a href="javascript:void(0)" class="default cur">Default</a>-->
          <!--<a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>-->
          <!--<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>-->
        <!--</div>-->
        <!--<div class="accessory-result">-->
          <!--&lt;!&ndash; filter &ndash;&gt;-->
          <!--<div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">-->
            <!--<dl class="filter-price">-->
              <!--<dt>Price:</dt>-->
              <!--<dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{cur: priceChecked=='all'}">All</a></dd>-->
              <!--<dd v-for="(price,index) in priceFilter">-->
                <!--<a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{cur:priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>-->
              <!--</dd>-->
            <!--</dl>-->
          <!--</div>-->

          <!--&lt;!&ndash; search result accessories list &ndash;&gt;-->
          <!--<div class="accessory-list-wrap">-->
            <!--<div class="accessory-list col-4">-->
              <!--<ul>-->
                <!--<li v-for="item in goodsList">-->
                  <!--<div class="pic">-->
                    <!--<a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>-->
                  <!--</div>-->
                  <!--<div class="main">-->
                    <!--<div class="name">{{item.productName}}</div>-->
                    <!--<div class="price">{{item.salePrice}}</div>-->
                    <!--<div class="btn-area">-->
                      <!--<a href="javascript:;" class="btn btn&#45;&#45;m">加入购物车</a>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</li>-->
              <!--</ul>-->
              <!--<div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
                <!--<img v-if="loading" src="../assets/loading-spinning-bubbles.svg"/>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
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
            sortFlag: true,
            page: 1,
            pageSize: 8,
            busy: true,
            loading: false,
            priceFilter: [
              {
                  startPrice: '0.00',
                  endPrice: '500'
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
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false
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
          var param = {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortFlag?1:-1,
            priceLevel: this.priceChecked
          };
          this.loading = true;
          axios.get("/goods",{
              params: param
          }).then((result)=>{
            let res = result.data;
            console.log(res);
            this.loading = false;
            if(res.status==0) {
                if(flag) {
                    //需要累加
                  this.goodsList = this.goodsList.concat(res.result.list);
                  if(res.result.count == 0) {
                      this.busy = true;
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
                if(res.status===0) {
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
