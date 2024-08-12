const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to the MongoDB database using Mongoose
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Set EJS as the view engine and configure paths for views and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Override HTTP methods (e.g., using a query parameter) for forms
app.use(methodOverride('_method'));

// Use EJS-Mate as the template engine for EJS
app.engine("ejs", ejsMate);

// Serve static files (CSS, JavaScript, images) from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));

// Root route - simple response to test if the server is running
app.get("/", (req, res) => {
    res.send("Hi. I am root");
});

// Test route to create and save a sample listing in the database
app.get("/testListing", async (req, res) => {
    let sampleTesting = new Listing({
        title: "My new Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });
    await sampleTesting.save()
        .then(() => {
            console.log("Saved successfully");
        });

    res.send("Successful testing");
});

// Route to display all listings - wrapped in error-handling middleware
app.get("/Listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

// Route to render the form for creating a new listing
app.get("/Listings/new", async (req, res) => {
    res.render("listings/new.ejs");
});

// Route to display a specific listing by its ID - wrapped in error-handling middleware
app.get("/Listings/:id", wrapAsync(async (req, res) => {
    console.log("From GET /Listings/:id");
    let { id } = req.params;
    let dataBasedOnId = await Listing.findById(id);
    console.log(dataBasedOnId);
    res.render("listings/show.ejs", { listing: dataBasedOnId });
}));

// Route to render the form for editing an existing listing
app.get("/Listings/:id/edit", async (req, res) => {
    console.log(req.params);
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Route to update a specific listing by its ID - wrapped in error-handling middleware
app.put("/Listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/Listings/${id}`);
}));

// Route to create a new listing - wrapped in error-handling middleware
app.post(
    "/Listings",
    wrapAsync(async (req, res, next) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for Listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/Listings");
    })
);

// Route to delete a specific listing by its ID
app.delete("/Listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect(`/Listings`);
});

// Catch-all route for handling requests to non-existent routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.log("Entered final error handler");
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});

// Start the server and listen on port 8080
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
