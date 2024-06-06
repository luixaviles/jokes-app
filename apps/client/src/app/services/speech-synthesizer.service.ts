import { Injectable } from '@angular/core';
import { Joke } from '../model/joke.interface';

@Injectable({
  providedIn: 'root',
})
export class SpeechSynthesizerService {
  speechSynthesizer!: SpeechSynthesisUtterance;

  constructor() {
    this.initSynthesis();
  }

  initSynthesis(): void {
    this.speechSynthesizer = new SpeechSynthesisUtterance();
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1;
    this.speechSynthesizer.pitch = 1;
    this.speechSynthesizer.lang = 'en-US';
  }

  speak(message: string): void {
    this.speechSynthesizer.text = message;
    speechSynthesis.speak(this.speechSynthesizer);
  }

  tellJoke(joke: Joke): void {
    const message = `${joke.setup}. ${joke.punchline}`;
    this.speak(message); 
  }
}
