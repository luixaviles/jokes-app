import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { Joke } from '../model/joke.interface';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';
import { getJokeFromEvent } from '../services/utils';
import { JokesService } from '../services/jokes.service';

import '@joke-item/joke-item';
@Component({
  selector: 'corp-joke-row',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, DividerModule, ConfirmDialogModule,
    ToastModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService, MessageService],
  templateUrl: './joke-row.component.html',
  styleUrl: './joke-row.component.scss',
})
export class JokeRowComponent {
  readonly jokeService = inject(JokesService);
  readonly speechSynthesizerService = inject(SpeechSynthesizerService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  _joke: Joke | undefined;

  @Input() set joke(joke: Joke | undefined) {
    this._joke = joke;
  }
  get joke(): Joke | undefined {
    return this._joke;
  }

  @Output() removeConfirmed = new EventEmitter<void>();

  listen(event: Event) {
    const joke = getJokeFromEvent(event);
    this.speechSynthesizerService.tellJoke(joke);
  }
  edit(event: Event) {
    const joke = (event as CustomEvent<Joke>).detail;
  }
  remove(event: Event) {
    const joke = (event as CustomEvent<Joke>).detail;
    this.confirm(event);
  }

  confirm(event: Event) {
    const joke = getJokeFromEvent(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.jokeService.removeJoke(joke.id).subscribe(() => {
          this.removeConfirmed.emit();
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Record deleted',
          });
        });
      },
    });
  }
}
