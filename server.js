const express = require('express');
const mongoose = require('mongoose');
const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//Connect to mongodb
mongoose
  .connect(db,{useNewUrlParser: true})
  .then(()=> console.log("MongoDB connected"))
  .catch(err => console.log(err));

//Route for /
app.get('/', (req, res)=> res.send('Hello'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));