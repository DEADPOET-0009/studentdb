const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let students;
let users;

async function connectToMongoDB() {
  try {
    await client.connect();
    const database = client.db("studentdatabase");
    students = database.collection("students");
    users = database.collection("users");
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

async function addUser(username, password) {
  return users.insertOne({ username: username, password: password });
}

async function getUser(username) {
  return users.findOne({ username: username });
}

async function addStudent(name, cls, address, idno) {
  return students.insertOne({
    id: idno,
    name: name,
    class: Number(cls),
    address: address,
  });
}

async function getStudents() {
  return students.find().toArray();
}

async function getStudent(id) {
  return students.findOne({ id: id });
}

async function getStudentsByClass(cls) {
  return students.find({ class: Number(cls) }).toArray();
}

async function counttotalStudents() {
  return students.countDocuments();
}

module.exports = { connectToMongoDB, addStudent, getStudents, getStudent, getStudentsByClass, counttotalStudents, getUser, addUser };