import { Route } from '@angular/router';
import { JokeListComponent } from './joke-list/joke-list.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent
    }
];
