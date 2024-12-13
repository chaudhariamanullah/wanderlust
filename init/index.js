const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/listing.js")

const Mongoose_URL = "mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(Mongoose_URL)
}

main().then( ()=>{
    console.log("DB Is Connected.")
}).catch( ()=>{
    console.log("DB Connection Failed.")
});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner: "67553529c8eac8fc2a23e386"}));
    await Listing.insertMany(initData.data);
    console.log("done")
};

initDB();


