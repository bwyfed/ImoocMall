<template>
  <div id="app">
    <img src="./assets/logo.png">
    <counter :num="num_p" @incre="num_p++" @decre="num_p--"></counter>
    <router-view class="main"></router-view>
    <router-view class="left" name="title"></router-view>
    <router-view class="right" name="image"></router-view>
  </div>
</template>

<script>
  import Counter from './components/Counter';
export default {
    name: 'app',
    components: {
        Counter
    },
    data() {
        return {
            "num_p": 10
        }
    }
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
