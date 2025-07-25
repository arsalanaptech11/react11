const mongo = require("mongoose")
require("dotenv").config()

const db_url = process.env.URL

const Database_connect = async function(){
    if(!db_url){
        console.log("URL NOT WORKING")
    }
    else{
        try {
            mongo.connect(db_url);
            console.log("Database Connected")
            
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = Database_connect;