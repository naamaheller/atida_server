const mongoose = require('mongoose');
const { config } = require('dotenv')

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    console.log("mongo connect started");

    await mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${encodeURIComponent(process.env.PASS_DB)}@cluster0.s9376.mongodb.net/ATIDA2025`);

    console.log("mongo connect work");

}