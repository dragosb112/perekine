var processArgs = [];

process.argv.forEach((val, index) => {
    processArgs.push(val);    
});

module.exports = processArgs;