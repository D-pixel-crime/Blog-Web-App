import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { log } from "console";

const app = express();
const port = 1014;
const __dirname = dirname(fileURLToPath(import.meta.url));
var userNumber = 0;
var totalBlogs = 0;
var title = {};
var author = {};
var content = {};
var passwords = {};

app.use(express.static("public"));
app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        route: "/",
        blogTitle: title,
        blogAuthor: author,
        total: totalBlogs
    });
});

app.get("/create-post", (req, res) => {
    res.render("create-post.ejs", { route: "/create-post" });
});

app.post("/create-post", (req, res) => {
    title[userNumber] = req.body.createTitle;
    author[userNumber] = req.body.authorName;
    content[userNumber] = req.body.createContent.replace(/\r?\n/g, '<br>');
    passwords[userNumber] = req.body.createPassword;
    userNumber++;
    totalBlogs++;
    res.render("success.ejs", { route: "/creation-success" });
});

app.get("/:id", (req, res) => {
    var blogId = req.params.id;
    var postTitle = title[blogId];
    var postContent = content[blogId];
    res.render("see-blog.ejs", {
        route: "/see-blog",
        id: blogId,
        blogTitle: postTitle,
        blogAuthor: author[blogId],
        blogContent: postContent
    });
});

app.post("/edit-:id", (req, res) => {
    var blogId = req.params.id;
    var userEntry = req.body.validatePassword;
    if (passwords[blogId] === userEntry) {
        res.render("edit-post.ejs", {
            route: "/edit-post",
            id: blogId,
            blogTitle: title[blogId],
            blogAuthor: author[blogId],
            blogContent: content[blogId]
        });
    }
    else {
        res.render("success.ejs", { message: "Incorrect password. Please try again.", route: "/password-error" });
    }
});

app.post("/update-post-:id", (req, res) => {
    var blogId = req.params.id;
    title[blogId] = req.body.updateTitle;
    author[blogId] = req.body.authorName;
    content[blogId] = req.body.updateContent.replace(/\r?\n/g, '<br>');
    res.render("success.ejs", { route: "/updation-success" });
});

app.post("/delete-:id", (req, res) => {
    var blogId = req.params.id;
    if (passwords[blogId] === req.body.validatePassword) {
        delete title[blogId];
        delete author[blogId];
        delete content[blogId];
        delete passwords[blogId];
        res.render("success.ejs", { route: "/deletion-success" });
        totalBlogs--;
    }
    else {
        res.render("success.ejs", { message: "Incorrect password. Please try again.", route: "/password-error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});