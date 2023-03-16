const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    "userId": Number,
    "username": String,
    "password": String,
    "sex": Number,
    "status" : {
        type:Number,
        default:1
    },// 1: 正常 0: 停用
    "role": {
        type: Number,
        default: 1
    }, // 0系统管理员, 1普通用户
    "createTime": {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("users", userSchema, "users")