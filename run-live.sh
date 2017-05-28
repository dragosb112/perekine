#!/bin/bash

node ./scraper/app.js -live ./scraper/output &
node ./server/bin/www -live ./server/output &