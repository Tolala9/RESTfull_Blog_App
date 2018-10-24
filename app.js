var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer");

// App config
mongoose.connect("mongodb://localhost:27017/restfull_blog_app", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");  
app.use(express.static("public"));
app.use(methodOverride("_method"));


// Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://pixabay.com/get/e833b80b20f2093ed1584d05fb1d4e97e07ee3d21cac104491f0c371a4e8b6b0_340.jpg",
//     body: "This is a first blog post"
// });



// RESTfull Routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// Index route
app.get("/blogs", function(req, res) {
    Blog.find({}, function (err, blogs) {
        if(err) {
            console.log("Error");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});



// New route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// Create route
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show route
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function (err, foundBlog) {
       if(err){
           res.redirect("/blogs");
       }else {
           res.render("show", {blog: foundBlog});
       }
   });
});

// Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// Update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err) {
            res.render("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Destroy route
    app.delete("/blogs/:id", function (req, res) {
        Blog.findByIdAndRemove(req.params.id, function (err) {
            if(err){
                res.redirect("/blogs");
            } else {
                res.redirect("/blogs");
            }
        });
    // res.send("delete route"); //testing route
});




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The RESTfull_Blog_App server has been started!");
});