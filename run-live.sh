#!/bin/bash

# kill all first
killall node

# run processes
node ./scraper/app.js -live ./scraper/output &
node ./server/bin/www -live ./server/output &