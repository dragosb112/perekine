var StateMachine = require('javascript-state-machine');

var ScraperStateMachine = function(onStartCallback,
    onStopCallback,
    onPauseCallback){
// finite state machine
var fsm = StateMachine.create({
    initial: 'stopped',
    events: [{
            name: 'start',
            from: ['stopped', 'running', 'paused'],
            to: 'running'
        },
        {
            name: 'stop',
            from: ['running', 'paused', 'stopped'],
            to: 'stopped'
        },
        {
            name: 'pause',
            from: 'running',
            to: 'paused'
        },
    ],
    callbacks: {
        onstart: onStartCallback,
        onstop: onStopCallback,
        onpause: onPauseCallback,
    }
});

return fsm;
};

module.exports = ScraperStateMachine;