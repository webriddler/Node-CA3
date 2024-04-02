const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const dataFile = require("./data.js");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../template/views");
const partilasPath = path.join(__dirname, "../template/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partilasPath);

app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const message = req.query.message;
  res.render("index", {
    title: "Password Saver",
    description:
      "Provide the credentials, associated with your account to save your password.",
    name: "Dev Anand",
    message: message,
  });
});

app.get("/saved-passwords", (req, res) => {
  const data = dataFile.getData();
  const message = req.query.message;
  res.render("saved", {
    title: "Saved Passwords",
    description:
      "Here are the credentials, associated with your saved your password accounts.",
    name: "Dev Anand",
    data: data,
    message: message,
  });
});

app.get("/search", (req, res) => {
  const websiteName = req.query.websiteName;
  const message = req.query.message;
  if (websiteName) {
    var response = dataFile.findPassword(websiteName);
    if (response) {
      res.redirect("/search?message=" + websiteName + " Password: " + response);
    } else {
      res.redirect("/search?message=Website not found!");
    }
  }
  res.render("search", {
    title: "Search Passwords",
    description:
      "Provide webiste name, associated with your saved password accounts.",
    name: "Dev Anand",
    message: message,
  });
});

app.get("/expiring", (req, res) => {
  const days = req.query.days;
  const message = req.query.message;
  var data = false;
  if (days) {
    data = dataFile.expiring(days);
    if(data == false){
      res.redirect("/expiring?message=No record found!");
    }
  }
  res.render("expiring", {
    title: "Expiring Passwords",
    description:
      "Provide number of days to check the password about to expire.",
    name: "Dev Anand",
    data: data,
    message: message
  });
});

app.get("/delete", (req, res) => {
  const site_name = req.query.site_name;
  if (dataFile.deleteData(site_name)) {
    res.redirect("/saved-passwords?message=Password deleted successfully");
  } else {
    res.redirect("/saved-passwords?message=Password not found");
  }
});

//POST Data

app.post("/savePassword", (req, res) => {
  if (
    dataFile.addData(
      req.body.emailUsername,
      req.body.websiteName,
      req.body.password,
      req.body.expiry
    )
  ) {
    res.redirect("/?message=Password saved successfully&type=success");
  } else {
    res.redirect("/?message=Password already exist&type=danger");
  }
});

// LISTENING
app.listen(3000, () => {
  console.log("Server is up on Port 3000");
});

// 404 Handling
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Dev Anand",
    errorMessage: "Page Not found.",
  });
});


module.exports = app;