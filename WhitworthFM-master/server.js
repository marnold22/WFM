var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var _ = require('underscore');
var workerList = new Array();
var sigkill = false;



if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        var env = process.env;
        var worker = cluster.fork(env);

        workerList.push(worker);
    }

    process.on('SIGUSR2', function () {
        console.log("Received SIGUSR2 from system");
        console.log("There are " + workerList.length + " workers running");
        workerList.forEach(function (worker) {
            console.log("Sending STOP message to worker PID=" + worker.pid);
            worker.send({cmd: "stop"});
        });
    });

    process.on('SIGINT', function () {
        sigint = true;
        process.exit();
    });

    //Manage Timeouts
    var timeouts = [];
    cluster.on('fork', function(worker){

    })

    cluster.on('exit', function (worker) {
        if (sigkill) {
            logger.warn("SIGKINT received - not respawning workers");
            return;
        }
        var newWorker = cluster.fork();
        //we're not sentimental
        console.log('Worker ' + worker.pid + ' died and it will be re-spawned');

        removeWorkerFromListByPID(worker.pid);
        workerList.push(newWorker);
    });
} else {

    require('./web-server');
}

function removeWorkerFromListByPID(pid) {
    var counter = -1;
    workerList.forEach(function (worker) {
        ++counter;
        if (worker.pid === pid) {
            workerList.splice(counter, 1);
        }
    });
}