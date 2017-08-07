# Sorion sandwich order app source

## Instalation
You need [NodeJS](https://nodejs.org/en/) installed on your PC as well as some terminal tool like [Git Bash](https://git-for-windows.github.io/) and a code editor, i would suggest [Webstorm](https://www.jetbrains.com/webstorm/) or [Atom](https://atom.io/).

Open Git Bash in directory where you want to pull the repository.
```
npm install -g ionic
git clone https://github.com/sandwichorder/app-src.git
cd app-src/
npm install
npm install --save-dev --save-exact ionic@latest
npm install --save-dev --save-exact @ionic/cli-plugin-ionic-angular@latest
```
## Building
```
ionic build
```
This will build all the files into the www/ directory. After build commit code to Git.
## Running
```
ionic serve
```
## References
[Ionic 2 components](http://ionicframework.com/docs/components/#overview)

[Angular 2](https://angular.io/docs)

[Typescript](http://www.typescriptlang.org/docs/handbook/basic-types.html)
