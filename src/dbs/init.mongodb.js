'use strict'

const mongoose = require('mongoose');
const {db:{host,name,port}} = require('../configs/config.mongodb');
const connectionString = `mongodb://${host}:${port}/${name}`;
const {countConnect} = require('../helpers/check.connect');
class Database{
    constructor(){
        this.connect();
    }
   
    connect(type = 'mongodb'){
        if (1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug',{color: true})
        }
        console.log(connectionString);
        mongoose.connect(connectionString, {
            maxPoolSize: 50
        })
        .then( _ => console.log(`Connected`))
        .catch(err => console.log("Lỗi kết nối tới cơ sở dữ liệu", err) );
    }

    static getInstance() {
        if (!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;