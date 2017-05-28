#!/bin/bash

# kill all processes
killall node

# run processes
node ./scraper/app.js -dev ./scraper/output &
node ./server/bin/www -dev ./server/output &