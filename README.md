## Danish Fungal Atlas 

> An online database of georeferenced biodiversity data about Fungi including Lichens.

## Prerequisites

**Data stores**

* MySQL 5.7.12
* Redis 3.0

**Tools**

* Node.js v6+
* npm (which comes bundled with Node) 
* git
* grunt-cli
* bower

**Optional**

The project has been bootstrapped with the Yeoman scaffolding tool, using the [angular-fullstack] (https://github.com/DaftMonk/generator-angular-fullstack) generator. While the Yeoman tool itself is not mandatory for the project to run, it provides some helpful generators for routes, services etc. for developers.

Therefore it is recomended to follow 
* [this setup guide](http://yeoman.io/codelab/setup.html) to setup yeoman
* Install the [angular-fullstack] (https://github.com/DaftMonk/generator-angular-fullstack) generator

You will find valuable information about the development setup and application structure in the [angular-fullstack] (https://github.com/DaftMonk/generator-angular-fullstack) git repo.

## Create database in MySQL


```bash
mysql -u <username> -p <password>
```
```bash
mysql> create database svampeatlas;
```
```bash
mysql> exit;
```
```bash
mysql -u <username> -p <password> < svampeatlas.sql
```

## Configuration

Edit this file and update it according to your development database settings:

    server/config/environment/development.js
	

## Install dependencies

In the root directory (where package.json and bower.json are placed):

```bash
npm install
```
```bash
bower install
```


## Run the application

To run the application in dev mode:

```bash
grunt serve 
```

To build and run the application in prod mode:

```bash
grunt serve:dist 
```
This will build and package the app into the dist folder.

## Copyright
Copyright (c) 2017 Natural History of Denmark