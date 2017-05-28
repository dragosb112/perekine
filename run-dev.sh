#!/bin/bash

node ./scraper/app.js -dev ./scraper/output &
node ./server/bin/www -dev ./server/output &