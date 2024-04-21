const mongoose = require('mongoose')
 require('dotenv').config()
const dbConnect=()=>{
    try {
        mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`)
        console.log("DB Connected Successfully")
     } catch (error) {
        console.log( " Data base error")
        
     }
}

module.exports = dbConnect