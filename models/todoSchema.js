const mongoose = require('mongoose')
const workSchema = mongoose.Schema({
    "todoList": [],
    "workList": [],
    "doneList": [],
})

module.exports = mongoose.model("works", workSchema, "works")