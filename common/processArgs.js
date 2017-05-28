var processArgs = [];
var processArgs2 = {};

process.argv.forEach((val, index) => {
    processArgs.push(val);
});

if (process.argv[2]) {
    processArgs2.runMode = process.argv[2];
}


processArgs2.outputPath = process.argv[3] || "./output";

module.exports = {
    Args: processArgs,
    Args2: processArgs2

};