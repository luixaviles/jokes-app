<template>
  <div>
    <h1>Hello world</h1>
    <h2>{{ joke.setup }}</h2>
    <p>{{ joke.punchline }}</p>
  </div>
</template>

<script>
console.log('hello from component');
// import vueCustomElement from 'vue-custom-element';
// import * as Vue from 'vue';

// Vue.use(vueCustomElement);
const JokeRowVueComponent = {
    props: {
    joke: {
      type: Object,
      required: true,
    },
  },
}

// customElements.define('joke-row', JokeRowVueComponent);
export default JokeRowVueComponent;
</script>

<style scoped>
/* Add your component styles here */
</style>
