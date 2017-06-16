// Process Arguments 

var args = {};

/**
 * set runMode
 * dev = run server on localhost
 * live = run server on public ip
 */
if (process.argv[2]) {
    args.runMode = process.argv[2];
}

/**
 * set output path (logger, scraper)
 */
args.outputPath = process.argv[3] || "./output";

module.exports = args;