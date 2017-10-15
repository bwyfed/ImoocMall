<template>
  <div id="app">
    <!--
    <div>
    <b-nav>
      <b-nav-item active>Active</b-nav-item>
      <b-nav-item>Link</b-nav-item>
      <b-nav-item>Another Link</b-nav-item>
      <b-nav-item disabled>Disabled</b-nav-item>
    </b-nav>
    </div>
    <div>
    <b-container class="bv-exmple-row">
      <b-row>
        <b-col>1 of 3</b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
      </b-row>
    </b-container>
    </div>


    <b-alert show>Default Alert</b-alert>
    -->
    <router-view class="main"></router-view>
    <router-view class="left" name="title"></router-view>
    <router-view class="right" name="image"></router-view>
  </div>
</template>

<script>
//  import {bAlert, bBtn, bCollapse,bNav,bNavItem,bContainer,bRow,bCol} from 'bootstrap-vue/lib/components'
export default {
    name: 'app'
  /*
  components: {
        bAlert, bBtn, bCollapse, bNav, bNavItem, bContainer, bRow, bCol
  }
  */
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  .left,.right {
    float: left;
    width: 49%;
    border: 1px solid gray;
  }
</style>
