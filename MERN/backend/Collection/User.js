const mongo = require("mongoose")

const user_structure = mongo.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        default:"Karachi",
    },
    Record_time:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongo.model("users",user_structure)