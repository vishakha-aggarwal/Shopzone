const mongoose = require("mongoose");

const connectDatabase = ()=>{
    // console.log(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((data) =>{
        console.log(`Mongodb connected with server ${data.connection.host}`);
    })
}

module.exports = connectDatabase;