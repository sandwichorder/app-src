# Sorion sandwich order app source

## Instalation & running
You need [NodeJS](https://nodejs.org/en/) installed on your PC as well as some terminal tool like [Git Bash](https://git-for-windows.github.io/).
Open Git Bash in directory where you want to pull the repository.
```
npm install -g ionic
git clone https://github.com/sandwichorder/app-src.git
cd app-src/
npm install
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
