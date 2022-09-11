const app = require("./app");

// const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

const connectDatabase = require("./config/database.js");

if(process.env.NODE_ENV!=="production")
    require("dotenv").config({path:"backend/config/config.env"});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//handling uncaught exception
process.on("uncaughtException", err =>{
    console.log(err);
    console.log("Shutting down server due to errors");

    server.close(() => {
        process.exit(1);
    })
})

connectDatabase();


app.get("/", (req, res) => {
    res.json("server started");
})

const server = app.listen(process.env.PORT, (req, res) => {
    console.log(`server started on port ${process.env.PORT}`);
})

//unhandled promise rejection
process.on("unhandledRejection", err =>{
    console.log(err);
    console.log("Shutting down server due to errors");

    server.close(() => {
        process.exit(1);
    })
})