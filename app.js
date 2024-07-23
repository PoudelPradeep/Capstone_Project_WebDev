const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
//const ejs = require("ejs");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("connected to the database")
})




app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended : true }))
app.use(methodOverride('_method'));
app.use(express.json());




app.get("/" , (req , res) => {
    res.send("hi. I am root")
})

app.get("/testListing", async (req , res) => {
    let sampleTesting = new Listing({
        title : "My new Villa",
        description : "by the beach",
        price : 1200,
        location : "Calangute, Goa",
        country : "India"
    })
    await sampleTesting.save()
    .then(() => {
        console.log("saved successfully");
    });

    res.send("successfull testing")
    
})

app.get("/Listings" , async (req , res) => {
    const allListing  = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    
})

app.get("/Listings/new" , async (req , res) => {
    res.render("listings/new.ejs");
})

app.get("/Listings/:id", async ( req , res) => {
    
    let {id} = req.params;
    let dataBasedOnId = await Listing.findById(id);
    console.log(dataBasedOnId);
    res.render("listings/show.ejs",{dataBasedOnId});
})

app.get("/Listings/:id/edit", async (req  , res) => {
    console.log(req.params);
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})

app.put("/Listings/:id" , async (req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , req.body.listing);
    res.redirect(`/Listings/${id}`);
    //let listing = await Listing.findOneAndUpdate(id , )
})

app.post("/Listings", async (req, res) => {
    //console.log(req.body.listing)
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/Listings");
})

app.delete("/Listings/:id"  , async (req , res) => {
    let {id} = req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect(`/Listings`);
} )




app.listen(8080 , () => {
    console.log("port 8080 has started to listen");
}) 