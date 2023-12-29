const mongoose = require('mongoose')
const roleSchema = mongoose.Schema({
    "roleName": String,
    "remark": String,
    permissionList: {
        checkedKeys: [],
        halfCheckedKeys: []
    },
    permissionId: Array,
    "createTime": {
        type: Date,
        default: Date.now()
    },
    "updateTime": {
        type: Date,
        default: Date.now()
    },//更新时间
})

module.exports = mongoose.model("roles", roleSchema, "roles")