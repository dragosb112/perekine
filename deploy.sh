#!/bin/bash

#create output folders
#scraper
mkdir -p ./scraper/output/logs;
mkdir -p ./scraper/output/twitter;

#server
mkdir -p ./server/output/logs;
mkdir -p ./server/public/javascripts/lib;

#download dependencies
wget -O ./server/public/javascripts/lib/angular.min.js "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js";
wget -O ./server/public/javascripts/lib/angular.min.js.map "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js.map";

#resolve npm dependencies
npm install;
