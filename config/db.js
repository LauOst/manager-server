/**
 * 数据库连接
 * */
const mongoose = require('mongoose');
// const config = require('./index')
const log4js = require('./../utils/log4j')
main().catch(err => log4js.error(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Note');
}