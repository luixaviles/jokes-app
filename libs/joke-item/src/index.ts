
import { defineCustomElement } from 'vue';
import  JokeItemComponent from './lib/joke-item.ce.vue';

// convert into custom element constructor
const JokeItemElement = defineCustomElement(JokeItemComponent);

// register
customElements.define('corp-joke-item', JokeItemElement);

