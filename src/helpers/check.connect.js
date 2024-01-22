'use strict'
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection${numConnection}`);
}

const checkOverLoad = () => {
    setInterval( () => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //example 
        const maxConenection = numCores * 5;
        console.log(`Num connection: ${numConnection}`)
        console.log(`Memory used: ${memoryUsage/1024/1024} mb`)
        if (numCores > maxConenection){
            console.log(`Connection overload detected!`);
        }
    }, _SECOND)
}

module.exports = {
    countConnect,
    checkOverLoad
};