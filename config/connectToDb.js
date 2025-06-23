const mongoose = require("mongoose");
const mongo_password = process.env.mongo_password;
const mongo_uri = process.env.mongo_uri
.replace("<db_password>", mongo_password);

const connectToDb = async ()=>{
    const connected = await mongoose.connect(mongo_uri);
    if (connected) {
        console.log("App Connected To Database")
    }else{
        console.log("App Failed To Connect To DataBase")
    }
};
connectToDb()
module.exports = connectToDb;