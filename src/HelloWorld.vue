<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <p>Welcome to your Vue.js application!</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      message: 'Hello, Vue World!'
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  color: #42b983;
}
</style>