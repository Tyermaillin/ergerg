const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Saliens', {
    useNewUrlParser: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('DB Connected!');
})

module.exports = {mongoose}