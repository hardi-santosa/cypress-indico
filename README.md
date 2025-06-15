# README #

### What is this repository for? ###

This is repo use for selection QA on indico

### How do I get set up? ###

**1.** Assume that you have node installed.

**2.** Clone this repo

**3.** Access the folder

**4.** Install all dependencies
```sh
$ npm ci
or
$ npm install
```

**5.** Install Cypress as global or local
```sh
$ npm install cypress -g
or
$ npm install cypress --save-dev
```

**6.** Copy environment and set the value
```sh
$ cp cypress.env.json.example cypress.env.json
```

**7.** Open test-runner
```sh
$ npm run cypress:open
```
Kindly add project folder manually if the project view is empty

**8.** Run test:
```sh
$ npm test
```

when use windows
1. create new folder
2. npm init
3. intsall cypress
 ```sh
$ npm install cypress -g
or
$ npm install cypress --save-dev
```
4. run by 
```sh
$ npx cypress open
```
5. select folder than run test
