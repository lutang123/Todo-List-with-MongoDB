const express = require("express")
// this is to get the data posted from html file, we need to install first and then tell app to use it.
const bodyParser = require("body-parser")

const app = express()

// we need to write $npm install ejs, but we don't need to require ejs, we need to tell our app to use ejs
// the view engine by default will go to the directory "views" and look for the file with .ejs that we are going to render
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

// use the static method from express to access local file, because our css file is on our local
app.use(express.static("public"))

// const is JavaScript can be edited if it is an array or object
const items = ["Eat well", "Do some exercise", "Sleep well"]

app.get("/", function(req, res) {
  let today = new Date()  // similiar as the code var tom1 = new Audio("sounds/tom-1.mp3");  tom1.play();
  console.log("today is " + today)
  let options = {weekday: "long", day: "numeric", month: "long",year: "numeric"}
  let day = today.toLocaleDateString("en-US", options);
  // in the ejs file, we have: <h1> <%= listTitle %> </h1> and <p><%= newListItems[i] %></p>
  res.render("list", {listTitle: day, newListItems: items})
  //before posting, it will show items as ["Eat well", "Do some exercise", "Sleep well"]
})

app.post("/", function(req, res) {
  let item = req.body.newItem
  items.push(item)
  console.log(req.body)
  console.log(req.body.button)
  res.redirect("/")
  })
// Browser send POST request, we can pass the data from our web page to our server and send a response. Our response is to send the data back to the browser, still display the homepage but with the new data, namely a new list.
// app.post("/", function(req, res) {
//   let item = req.body.newItem
//   if (req.body.button === "dream") {
//     dreamLists.push(item)
//     console.log(req.body)
//     console.log(req.body.button)
//     res.redirect("/dream")
//   } else {
//     items.push(item)
//     res.redirect("/")
//   }
// })

const dreamLists = ["Travel around the world", "Starting my own business", "Maybe go to space someday"]

app.get("/dream", function(req, res) {
  res.render("dream", {listTitle: "Dream List", newListItems: dreamLists})
})

app.post("/dream", function(req, res) {
  let item = req.body.newDream
  dreamLists.push(item)
  console.log("In dream page:" +req.body) //why it does not print?
  console.log("In dream page:" +req.body.dreamButton) //why it does not print?
  res.redirect("/dream")
})

// process.env.PORT ||
app.listen(3000, function() {
  console.log("server is running on Heroku and port 3000")
})
