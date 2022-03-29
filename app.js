const express = require("express");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

list = [];

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://Mack-Mohan:Mack@cluster0.kphcr.mongodb.net/todolistDB");

const listSchema={
  name: String
};
const customlistSchema={
  listname: String,
  list: [listSchema]
};

const item = new mongoose.model("item",listSchema);
const item1 = new item({
  name: "Take a bath"
});
const item2 = new item({
  name: "Breakfast"
});
const item3 = new item({
  name: "Lunch"
});

const startingList= [item1, item2, item3];

app.get("/", function(req, res) {

  item.find({},function(err,listitem){
    if(err){
      console.log(err);
    }
    else if (listitem.length==0) {
      item.insertMany(startingList,function(err){
        if(err){
          console.log(err);
        }
      });
      res.redirect("/");
    }
    else{
      res.render('list.ejs', {
        today: "Today",
        items: listitem
      });
    }
  });
});

const customlist = new mongoose.model("customlist",customlistSchema);
app.get("/:listType",function(req,res){

const listName = _.capitalize(req.params.listType);
  customlist.findOne({listname: req.params.listType},function(err,foundlist){
    if(err){
      console.log(err);
    }
    else if(foundlist) {

      res.render("list.ejs",{today:req.params.listType, items:foundlist.list });
    }
    else{
      const new_list = new customlist({
        listname: listName,
        list:startingList
      });
      new_list.save();
      res.redirect("/"+listName);
    }
  });

});


app.post("/",function(req,res){
  const new_item = new item({name: req.body.new_task });

  if(req.body.list == "Today"){
      new_item.save( function(err){
        if(err){
          console.log(err);
        }
    });
      res.redirect("/");
  }
else{
  customlist.findOne({listname: req.body.list},function(err,foundList){
    if(err){
      console.log(err);
    }
    else{
      foundList.list.push(new_item);
      foundList.save();
      res.redirect("/"+req.body.list);

    }
  });
}

});

app.post("/delete",function(req,res){
if(req.body.listname == "Today"){
  item.deleteOne({_id: req.body.checkbox},function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
}
else{
  customlist.findOneAndUpdate({listname: req.body.listname},{$pull: {list: {_id: req.body.checkbox} }},function(err,foundlist){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/"+req.body.listname);
    }
  });



}
});



app.listen(3000, function() {
  console.log("I am on!");
});
