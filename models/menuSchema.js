const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const menuSchema = new mongoose.Schema({
    "menuType": String,
    "menuName": String,
    "menuCode": String,
    "menuId": String,
    "path": String,
    "icon": String,
    "component": String,//组件地址
    "menuState": Number,//菜单状态
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

module.exports = mongoose.model("menu", menuSchema, "menus")