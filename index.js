require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const { v4: uuidv4 } = require('uuid');
const helpers = require('./src/helpers.js')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static(__dirname + '/public'));

// Test server
app.get('/api/test', (req, res) => { 
  console.log(helpers.minNumber(5, 4, 2, 7, 4)); 
  console.log(helpers.ObjIsEmpty({1:2})); 
  console.log(req.query, typeof(req.query), helpers.ObjIsEmpty(req.query)); 
  res.send('test'); 
});

// Landing 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html') 
});

// Temporary database
let users = []; 
let DB = {}; 

// Create new user
app.post('/api/users', (req, res) => {
  let user_id = uuidv4(); 
  let user = {
    username: req.body.username, 
    _id: user_id 
  }
  DB[user_id] = helpers.copy(user); 
  DB[user_id].log = []; 
  users.push(helpers.copy(user)); 
  res.json(user); 
}); 

// GET all users
app.get('/api/users', (req, res) => {
  res.send(users); 
}); 

// Insert a new exercise 
app.post('/api/users/:_id/exercises', (req, res) => {
  let _id = req.params._id; 
  let date = new Date(req.body.date); 
  if (isNaN(date))
    date = new Date(); 
  let exercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: date.toDateString() 
  }; 
  DB[_id].log.push(helpers.copy(exercise)); 
  res.json({
    username: DB[_id].username, 
    _id: _id, 
    ...exercise
  }); 
}); 

// Return the log containing all exercises/filtered between dates of an user with a given id
app.get('/api/users/:_id/logs', (req, res) => {
  console.log('hmm query', req.query); 
  let _id = req.params._id;
  if (helpers.ObjIsEmpty(req.query)) {
    console.log('baka empty'); 
    res.json({
      ...DB[_id], 
      count: DB[_id].log.length
    });
  }
  else {
    let from = new Date(req.query.from); 
    let to = new Date(req.query.to); 
    let arr = DB[_id].log.filter((exercise) => {
      let date = new Date(exercise.date); 
      let res = true; 
      if (!isNaN(from) && date < from) res = false; 
      if (!isNaN(to) && date > to) res = false; 
      return res; 
    }); 
    let limit = helpers.minNumber(req.query.limit, arr.length); 
    res.json({
      ...DB[_id], 
      count: limit, 
      log: helpers.copy(arr).slice(0, limit) 
    })
  }
}); 

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
