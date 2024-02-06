const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const bcrypt = require('bcrypt');
const cors = require('cors');
const InterviwersModel = require('./Models/InterviwerModel'); 
const ApplicantModel = require('./Models/ApplicantModel'); 

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://Heist_Hackers:FCSWrSkU1EnspvAf@interviewapp.bhi0hww.mongodb.net/InterviewApplication?retryWrites=true&w=majority');


app.use(session({
    key: 'userLogined',
    secret: 'thisisSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        secure: false
    },
    Logined: false,
    unid: '',
}));



app.post('/interviwer/credentials', async (req, res) => {
    const field = Object.keys(req.body)[0];
    let value = req.body[field];
    try {
      const result = await InterviwersModel.find({ [field]: new RegExp(value) });
      if (result.length === 0) {
        res.send(true);
      } else if (result.length > 0) {
        res.send(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/interviwer', async (req, res) => {
    try {
        const response = await InterviwersModel.create({ name: 'Subhash' });
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error('Error inserting document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/applicant', async (req, res) => {
    try {
        const response = await ApplicantModel.create({ name: 'Subhash' });
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error('Error inserting document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Express Server Running on Port http://localhost:${PORT}`);
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });
});
