# Jokes App - Node.js + Angular/Vue
A Fullstack web application implemented using TypeScript language.

## Implemented Scenarios:

As an user:

* I can see a list of existing jokes in an organized way.
* I can sort the list by type, setup and Id.
* I can change the page size.
* I can navigate through the list of jokes using pagination.
* I can get a random Joke.
* I can add a new Joke using Generative AI.
* I can listen any displayed joke using a button.
* I can remove any joke by using the trash-icon button.

## Technical Details

* Used a Monorepo-structure based on Nx, which contains a `server` and `client` applications. 
* The `server` application is a Node.js implementation of the server code, which is based on the provided API.
* The `client` application is the frontend application based on the latest Angular version.
* The `libs/joke-item` is an independent library to create a reusable web component. It's based on Vue.js
* All UI components are based on PrimeNG(Angula application) and PrimeVue(Vue.js library)

## Additional tasks performed
* Considered a long-term vision for the implementation and it can support multiple applications, libraries and shared code.
* The Server application has been deployed on Google Cloud.
* The Client application has been deployed on Firebase hosting.

<img src="./screenshots/jokes-application.gif?raw=true" width="400">

* Focus on responsive behavior. The app runs well on Desktop and mobile browsers.

<img src="./screenshots/mobile.png?raw=true" width="400">

* Text to Speech feature based on Web Speech API implemented.
* Generative AI integration to allow adding new Jokes to the app.





