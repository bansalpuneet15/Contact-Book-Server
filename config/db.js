const mongoose = require("mongoose");
const config = require("config"); // npm install config kara tha vo wala hai
const db = config.get("mongoURL");

const connectDB = async () => {
    try {
        mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connected....");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

