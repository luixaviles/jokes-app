
import { defineCustomElement } from 'vue';
import JokeItemComponent from './lib/joke-item.ce.vue';

// convert into custom element constructor
export const JokeItemElement = defineCustomElement(JokeItemComponent);

// register global typings
declare module 'vue' {
    export interface GlobalComponents {
      'CorpJokeItem': typeof JokeItemElement,
    }
  }

// register
customElements.define('corp-joke-item', JokeItemElement);

