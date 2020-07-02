const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash");

const date = require(__dirname + "/date.js")
const day = date.getDate(); //date refers to date.js that we have required, and getDate() is the function we defined.

const app = express()

// we need to write $npm install ejs, but we don't need to require ejs, we need to tell our app to use ejs
// the view engine by default will go to the directory "views" and look for the file with .ejs that we are going to render
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

// use the static method from express to access local file, because our css file is on our local
app.use(express.static("public"))

// create a database todolistDB
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://admin-lu:0629*Salu@cluster0-igwj0.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

// 1. create a collection called listItems in ListModel
const listSchema = new mongoose.Schema({name: String})
const ListModel = mongoose.model("ListItem", listSchema)

const list1 = new ListModel({name: "Eat well"})
const list2 = new ListModel({name: "Do some exercise"})
const list3 = new ListModel({name: "Sleep well"})
const defaultLists  = [list1, list2, list3]

// 2. create a collection called titleItems in TitleModel
// const titleSchema = {name: String,items: [listSchema]}
// const TitleModel = mongoose.model("TitleItem", titleSchema)

//  create a collection called dreamItems in DreamModel
const dreamSchema = new mongoose.Schema({name: String})
const DreamModel = mongoose.model("DreamItem", dreamSchema)

const dream1 = new DreamModel({name: "Travel around the world"})
const dream2 = new DreamModel({name: "Start my own business"})
const dream3 = new DreamModel({name: "Live in the moment and Enjoy everyday"})
const dreamLists = [dream1, dream2, dream3]

// 3. create a collection called deletedItems in DeletedModel
const deletedSchema = new mongoose.Schema({name: String})
const DeletedModel = mongoose.model("DeletedItem", deletedSchema)

// db.collection.ensureIndex( { name:1 }, { unique:true, dropDups:true } )

app.get("/", function(req, res) {
  ListModel.find({}, function(err, lists) {  //  can be any word and it refers to the collections
    if (lists.length === 0) {
      ListModel.insertMany(defaultLists, function(err) {
        if (!err) {
          console.log("Successfully saved default items to listItems collection")
        }
      })
    } else {     //<h1><%=listTitle %></h1> //newListItems.forEach(function(item) {<p><%=item.name%></p>}
      res.render("list", {title: day, newListItems: lists})//each list in the ListModel or listItems collection
    }
  })
})

app.post("/", function(req, res) {
  //e.g.finish todo list, <input type="text" name="newItem" placeholder="New Item" autocomplete="off">
  const newItem = req.body.newItem //
  //e.g. WORK, <<button type="submit" name="button" value=<%=title%>> + </button>
  const button_title = req.body.button //e.g. at homepage, button_title is Saturday,
  //e.g.finish todo list
  const newList = new ListModel({name: newItem})

  if (newItem.length !== 0) {
    // if (button_title === day.substr(0,day.indexOf(' '))) { //e.g. at homepage, button_title is Saturday,
      newList.save()
      res.redirect("/")
    // } else {                    //WORK                _id, name, items
    //   TitleModel.findOne({name: button_title}, function(err, foundList){
    //     foundList.items.push(newList) //{newListItems: foundList.items}
    //     foundList.save()
    //     res.redirect("/" + button_title)
    //   })
    // }
  } else {
    console.log("Posted item is empty string, please re-enter a list item")
  }
})

app.post("/deleted", function(req, res) {
  //e.g. finish todo list, <input type="checkbox" name="deletedItem" value="<%=item.name%>" onchange="this.form.submit()">
  const deletedItem = req.body.deletedItem
  //e.g. WORK, <input type="hidden" name="hidden" value="<%=title%>"></input>
  const hidden_title = req.body.hidden
  console.log("hidden_title is " + hidden_title)
  // at the same time, we save the deletedItem into deletedModel
  const deletedItem_save = new DeletedModel({name: deletedItem})
  deletedItem_save.save()
  if (hidden_title === "Dream List") {
    DreamModel.deleteOne({name: deletedItem}, function(err) {
      if (!err) {
        console.log("Successfully deleted the document and redirect to home page if not last item")
      }
      DreamModel.find({}, function(err, lists) {
        if (lists.length === 0) {
          res.redirect("/deleted") //when the last item is deleted, it redirect to deleted page
          } else {
            res.redirect("/dream") //otherwise redirect to home page, where it will list all remaining items
          }
      })
    })
  } else {
    ListModel.deleteOne({name: deletedItem}, function(err) {
      if (!err) {
        console.log("Successfully deleted the document and redirect to home page if not last item")
      }
      ListModel.find({}, function(err, lists) {
        if (lists.length === 0) {
          res.redirect("/deleted") //when the last item is deleted, it redirect to deleted page
          } else {
            res.redirect("/") //otherwise redirect to home page, where it will list all remaining items
          }
      })
    })
  }
})
  // } else {
  //   TitleModel.findOneAndUpdate({name: hidden_title}, {$pull: {items: {name: deletedItem}}}, function(err, foundList){
  //     if (!err){
  //       res.redirect("/" + hidden_title);
  //     }
  // })
    // TitleModel.deleteOne({name: deletedItem}, function(err) {
    //   if (!err) {
    //     console.log("Successfully deleted the document and redirect to custom page if not last item")
    //   }
    //   TitleModel.find({}, function(err, lists) {
    //     if (lists.length === 0) {
    //       res.redirect("/deleted") //when the last item is deleted, it redirect to deleted page
    //     } else {
    //       res.redirect("/" + hidden_title) //otherwise redirect to home page, where it will list all remaining items
    //     }
    //   })
    // })


app.get("/deleted", function(req, res) {
  DeletedModel.find({}, function(err, x) {  // x can be any word and it refers to the collections
    res.render("deleted", {title: "Congratulations!", deletedItems: x})
  })
})

app.get("/dream", function(req, res) {
  DreamModel.find({}, function(err, dreams) {  //  can be any word and it refers to the collections
    if (dreams.length === 0) {
      DreamModel.insertMany(dreamLists, function(err) {
        if (!err) {
          console.log("Successfully saved default items to listItems collection")
        }
      })
    }
    else {
      res.render("dream", {title: "Dream List", newListItems: dreams})
    }
  })
})


app.post("/dream", function(req, res) {
  //e.g.finish todo list, <input type="text" name="newItem" placeholder="New Item" autocomplete="off">
  const newDream = req.body.newDream //
  //e.g. WORK, <<button type="submit" name="button" value=<%=title%>> + </button>
  // const button_title = req.body.button //e.g. at homepage, button_title is Saturday,
  //e.g.finish todo list
  const newDreamlist = new DreamModel({name: newDream})

  if (newDream.length !== 0) {
    // if (button_title === day.substr(0,day.indexOf(' '))) { //e.g. at homepage, button_title is Saturday,
      newDreamlist.save()
      res.redirect("/dream")
    } else {                    //WORK                _id, name, items
  //     TitleModel.findOne({name: button_title}, function(err, foundList){
  //     foundList.items.push(newList) //{newListItems: foundList.items}
  //     foundList.save()
  //     res.redirect("/" + button_title)
  //     })
  //   }
  // } else {
    console.log("Posted item is empty string, please re-enter a list item")
  }
})

// //e.g.    /work
// app.get("/:customListName", function(req, res) {
//   const customListName = _.capitalize(req.params.customListName)
//   TitleModel.findOne({name: customListName}, function(err, foundList) { //foundList is a document with two keys
//     if (!err) {
//       if (!foundList) {// create a new list, name is WORK
//         const list = new TitleModel({name: customListName, items: defaultLists}) //a list with 3 items
//         list.save()//here we create the list and saved. in the future when we have new list, we use foundList.items.push()
//       } else {// show an existing list, title is WORK            defaultItems
//         res.render("list", {title: foundList.name, newListItems: foundList.items})
//       }
//     }
//   })
// })

let port = process.env.port
if (port = null || port == "") {
  port = 3000
}
app.listen(port, function() {
  console.log("server is running on Heroku or port 3000")
})


//in home.ejs, <a href="/post/<%= post.title %>">Read More</a>
// app.get("/list/:title", function(req, res) {
//   const url_title = _.lowerCase(req.params.title)  //we installed and required const _ = require("lodash")
//   console.log("url_title is "+ url_title)
//
//   res.render("dream", {listTitle: "Dream List", newListItems: dreamLists})
//     }
//   })
// })

// if (req.body.button === "Dream") {
//   const newDream = new DreamModel({name: newItem})
//   newDream.save()
//   res.redirect("/dream")
// } else {
//   const newList = new ListModel({name: newItem})
//   newList.save()
//   res.redirect("/")
// }

//

// ItemModel.findByIdAndRemove(checkedItemId, function(err) {
//   if(!err) {
//     console.log("Successfully deleted the document")
//   }
// })
// res.redirect("/")


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
