const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/wikidb", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//-----------------Requests Targeting All Articles-----------------//

app
  .route("/articles")

  //get all articles
  .get((req, res) => {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //post an article
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  //delete all articles
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//-----------------Requests Targeting A Specific Article-----------------//

app
  .route("/articles/:articleTitle")

  //get a specific article
  .get((req, res) => {
    Article.findOne(
      {
        title: req.params.articleTitle,
      },
      (err, foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found.");
        }
      }
    );
  })

  //update a specific article completely
  .put((req, res) => {
    Article.replaceOne(
      {
        title: req.params.articleTitle,
      },
      {
        title: req.body.title,
        content: req.body.content,
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  //updating a specific article partially
  .patch((req, res) => {
    Article.updateOne(
      {
        title: req.params.articleTitle,
      },
      req.body,
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  //delete a specific article
  .delete((req, res) => {
    Article.deleteOne(
      {
        title: req.params.articleTitle,
      },
      (err) => {
        if (!err) {
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send("The article could not be deleted.");
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
