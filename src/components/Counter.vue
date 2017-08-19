<template>
  <div>
    <button @click="increment">+</button>
    <button v-on:click="decrement">-</button>
    <p><span>counter component:{{num}}</span></p>
  </div>
</template>

<script>
  export default {
      props: ['num'],
    data () {
      return {

      }
    },
    methods: {
      increment() {
        //Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders.
        // Instead, use a data or computed property based on the prop's value.
          //this.num++;
          this.$emit('incre');
          import('../util');  //模块的异步加载，如果之前没有加载，则会在第一次的时候引入加载
      },
      decrement() {
          //this.num--;
          this.$emit('decre');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
