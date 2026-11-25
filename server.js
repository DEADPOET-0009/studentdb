const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcryptjs");

const { connectToMongoDB, addStudent, getStudents, getStudent, getStudentsByClass, counttotalStudents, getUser, addUser } = require("./db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("sign-up");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const olduser = await getUser(username);
  if (olduser) return res.redirect("/login");

  const hashedPassword = await bcrypt.hash(password, 10);
  await addUser(username, hashedPassword);
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username);

  if (user && await bcrypt.compare(password, user.password)) {
    res.cookie("testcookie", username);
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard", async (req, res) => {
  const total = await counttotalStudents();
  res.render("index", { total: total });
});

app.get("/add-student", (req, res) => {
  res.render("add-student");
});

app.get("/view-all-students", async (req, res) => {
  const list = await getStudents();
  res.render("view-all-students", { students: list });
});

app.get("/profile", async (req, res) => {
  const id = req.query.id;
  let student = null;

  if (id) {
    student = await getStudent(id);
  }

  res.render("student-profile", { student: student, id: id });
});

app.get("/class-students", async (req, res) => {
  const cls = req.query.class;
  let list = [];

  if (cls) {
    list = await getStudentsByClass(cls);
  }

  res.render("class-students", { students: list, selected: cls });
});

app.post("/students", async (req, res) => {
  await addStudent(req.body.name, req.body.class, req.body.address, req.body.id);
  res.redirect("/add-student");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectToMongoDB();
});