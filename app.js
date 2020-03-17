const express = require("express")
// this is to get the data posted from html file, we need to install first and then tell app to use it.
const bodyParser = require("body-parser")

const date = require(__dirname + "/date.js")

const app = express()

// we need to write $npm install ejs, but we don't need to require ejs, we need to tell our app to use ejs
// the view engine by default will go to the directory "views" and look for the file with .ejs that we are going to render
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

// use the static method from express to access local file, because our css file is on our local
app.use(express.static("public"))


// database
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({name: String})

const ItemModel = mongoose.model("ItemCollection", itemSchema)

const item1 = new ItemModel({name: "Eat well"})
const item2 = new ItemModel({name: "Do some exercise"})
const item3 = new ItemModel({name: "Sleep well"})

const defaultItems  = [item1, item2, item3]

const deletedSchema = new mongoose.Schema({name: String})

const deletedModel = mongoose.model("deletedItem", deletedSchema)

// from version 2
// // const is JavaScript can be edited if it is an array or object
// const items = ["Eat well", "Do some exercise", "Sleep well"]
//
// const dreamLists = ["Travel around the world", "Starting my own business", "Maybe go to space someday"]

app.get("/", function(req, res) {

  let day = date.getDate();  //date refers to date.js that we have required, and getDate() is the function we defined.

  ItemModel.find({}, function(err, fruits) {  // fruits can be any word and it refers to the collections

    if (fruits.length === 0) {

      ItemModel.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully saved default items to DB")
        }
      })
      res.redirect("/") // if i don't write this, it's still working, why??
    }
      else {
        res.render("list", {listTitle: day, newListItems: fruits})
    }
  })
})
  // in the ejs file, we have: <h1> <%= listTitle %> </h1> and <p><%= newListItems[i] %></p>
  // res.render("list", {listTitle: day, newListItems: items})
  //before posting, it will show items as ["Eat well", "Do some exercise", "Sleep well"]

app.post("/", function(req, res) {
  const newItem = new ItemModel({name: req.body.newItem})
  if (newItem.length === 0) {
    res.redirect("/")
  } else {
    newItem.save()
    res.redirect("/")
  }
})

app.post("/completed", function(req, res) {

  console.log(req.body)
  console.log(req.body.deletedItem)

  const deletedItem = new deletedModel({name: req.body.deletedItem})
  if (deletedItem.length === 0) {
    deletedModel.deleteOne({name: deletedItem}, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Successfully deleted empty string")
      }
   })
  } else {
    deletedItem.save()
  }

  ItemModel.deleteOne({name: req.body.deletedItem}, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Successfully deleted the document")
    }
    ItemModel.find({}, function(err, fruits) {
      if (fruits.length === 0) {
        res.redirect("/completed")
      } else {
        res.redirect("/")
      }
    })
  })
})

app.get("/completed", function(req, res) {
  deletedModel.find({}, function(err, fruits) {  // fruits can be any word and it refers to the collections
    res.render("completed", {listTitle: "Congratulations!", deletedItems: fruits})
  })
})
  // ItemModel.findByIdAndRemove(checkedItemId, function(err) {
  //   if(!err) {
  //     console.log("Successfully deleted the document")
  //   }
  // })
  // res.redirect("/")


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
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on Heroku and port 3000")
})

// this is original which only have one page list.ejs, and we give a value to the sumbmit button, and the value of teh button is only the first word.

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
