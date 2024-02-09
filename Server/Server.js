const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const transporter = require('./Models/nodeMailer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const {mongoUrlPassword} = require('../client/src/config');
const InterviwersModel = require('./Models/InterviwerModel');
const ApplicantModel = require('./Models/ApplicantModel');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://Heist_Hackers:${mongoUrlPassword}@interviewapp.bhi0hww.mongodb.net/InterviewApplication?retryWrites=true&w=majority`);


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



app.post('/interviewer/credentials', async (req, res) => {
    const field = Object.keys(req.body)[0];
    let value = req.body[field];
    try {
        const result = await InterviwersModel.find({ [field]: new RegExp(`\\b${value}\\b`, 'i') });
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


app.post('/interviewer/verify', (req, res) => {
    const { from, to, subject, text, html } = req.body;

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                console.log('Email sent successfully:', info.response);
                res.status(200).json({ type: 'success', message: 'Email sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/interviwer/signup', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = await InterviwersModel.create({
            name: name.toLowerCase().replace(" ", ""),
            password: hashedPassword,
            email: email.toLowerCase().replace(" ", ""),
        });
        const data = await res.json(userData);
        uid = data.name;
        req.session.userData = data;
        res.json(userData, uid);
    } catch (error) {
        console.error('Error creating user:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.message });
        }

        return res.status(500).json({ error: 'Internal server error' });
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
