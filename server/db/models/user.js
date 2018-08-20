const mongoose = require('mongoose')
const Schema = mongoose.Schema

const salienSchema = new Schema({

    salien_item: {
        type: Object,
    },
})

const Salien = mongoose.model('Salien', salienSchema)

module.exports = {Salien}