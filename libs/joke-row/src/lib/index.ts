import { defineCustomElement } from 'vue'
import JokeRowVueComponent from './joke-row.vue'

// convert into custom element constructor
const JokeRowVueElement = defineCustomElement(JokeRowVueComponent)
// register
customElements.define('joke-row', JokeRowVueElement)