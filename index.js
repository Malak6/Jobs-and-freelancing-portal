const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/application')
.then(()=>{console.log("Connecting successfuly")})
.catch(err => console.error("NOT Conected" , err));
const express = require('express');
const app = express();
app.use(express.json());
const authRouter= require('./routes/authRoute');

app.use('/api/user/auth' , authRouter.router);


app.listen(3000);