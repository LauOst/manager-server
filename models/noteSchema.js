const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const menuSchema = new mongoose.Schema({
    "noteName": String,
    "noteCode": String,
    "noteId": String,
    "orderNo": String,//订单号
    "noteState": String,//项目状态(1:开启, 2: 关闭)
    "totalHours": Number,//总工时
    "remainHours": Number,//剩余工时
    "director": String,//负责人
    "children": {
        type: Array,
        default: []
    },
    "parentId": {
        type: Schema.Types.Mixed,
        ref: "Language"
    },
    "createTime": {
        type: Date,
        default: Date.now()
    },//创建时间
    "updateTime": {
        type: Date,
        default: Date.now()
    },//更新时间
})

module.exports = mongoose.model("note", menuSchema, "notes")