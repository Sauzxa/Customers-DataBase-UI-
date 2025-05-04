const express = require('express');
const mongoose = require("mongoose");
const livereload = require("livereload"); // Add livereload package
const connectLivereload = require("connect-livereload");
require("dotenv").config()
const app = express();
const url = process.env.MONGO_URl;
const port = process.env.PORT

app.use(express.urlencoded({extended : true}))
var moment = require("moment") // library for time handiling
var methodOverride = require("method-override")
app.use(methodOverride('_methode')) // to override the methode ex : post -> put // to change datac//_methode howa li nasta3mlo bach ndir override

//
app.set('view engine', 'ejs'); 
app.use(express.static('public'));

// Setup livereload server
const liveReloadServer = livereload.createServer(); // Create a LiveReload server
liveReloadServer.watch(__dirname + "/public"); // Watch the 'public' directory for changes

// Automatique refresh using connect-livereload middleware
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/"); // Refresh the page
  }, 100);
});
// MongoDB connection
mongoose.connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
 
   // import customer
 const Customer = require('./models/customerSchema')
  

  // get all data  // render all objects + stack the result in an array
  app.get("/" , (req,res)=>{
    Customer.find()
    .then((result)=>{
      console.log(result);
      
      res.render("index" ,{arr :result , moment:moment}) // cuz in index.ejs i name it moment also
    }).catch((err)=>{
      console.log(err);
      
    })
  })

 
// get and render the add page 
app.get('/user/add.html', (req, res) => {
  res.render("user/add"); // conditional rendering (render the add.ejs)
});
// edit Customer 
app.get('/edit/:id', (req, res) => {
 Customer.findById(req.params.id).then((result)=>{
   res.render("user/edit", {object : result}); 

 })



});
// rendering the view page // only for the clicked one 
app.get('/user/:id',(req,res)=>{
   
  Customer.findById(req.params.id)
  .then((result)=>{
   console.log(result);
   
    res.render("user/view",{object : result , moment : moment})
   
  }).catch((err)=>{
    console.log(err);
      
 })


})


// post request // create the doucment in the collection 'Customer'
app.post("/user/add.html", (req, res) => {
  console.log("Received form data:", req.body);  // Log the form data for inspection

  Customer.create(req.body)
    .then(() => {
      console.log("Document saved successfully");
      res.redirect('/');
    })
    .catch((err) => {
      console.error("Error saving document:", err);
      res.status(500).send("An error occurred while saving the document.");
    });
});
// search the Customers  

app.post("/search", (req, res) => {
         Customer.find( {
          $or: [
            { firstName: req.body.searchText },
            { lastName: req.body.searchText }
          ]
        }).then((result)=>{
             res.render('user/search', {arr : result})
             
         })
         .catch((err)=>{
          console.log(err);
          
         })
   

});



// put request // change it in database
app.put("/edit/:id", (req, res) => {

     Customer.updateOne({_id : req.params.id} , req.body) // update with the body content
     .then((params)=>{
      res.redirect('/')
     })
     .catch((err)=>{
      console.log(err);
      
     })
});

//delete Customer 
app.delete("/delete/:id", (req, res) => {

  Customer.deleteOne({_id : req.params.id}) // update with the body content
  .then(()=>{
   res.redirect('/')
  })
  .catch((err)=>{
   console.log(err);
   
  })
});






