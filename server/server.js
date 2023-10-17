var dotenv = require ('dotenv').config({path: __dirname + '/../.env'});

const express = require('express');
const morgan = require('morgan');
const path = require('path');
var cookieParser = require('cookie-parser');

//Initialize Express.
const app = express();

// Initialize variables.
const port = process.env.PORT || 3000;

// Configure the morgan module to log all request
app.use(morgan('dev'));

// Make environment values available on the client side
// NOTE: Do not pass any secret or sensitive values to the client!
app.get('/modules/env.js', (req, res) => {
    res.contentType("application/javascript");
    res.send(`
    export const env = {
    };
    `);
});

// Set the front-end folder to serve public assets.
// And serve static pages from /client
app.use(express.static('client'));
app.use(cookieParser());
app.use(express.json()) //Notice express.json middleware
/// APIs

const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
    signed: false // if you use the secret with cookieParser
};

app.post('/api/setcookies', (req, res) => {
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);
    
    let body = JSON.parse(JSON.stringify(req.body));
    res.cookie('username', body.username, cookieConfig);
    res.cookie('password', body.password, cookieConfig);
    res.status(200).send('Cookies set');
});

app.get('/api/sendcookiesTwo', (req, res) => {
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);

    res.status(200).send('Cookies set');
});

app.get('/api/getcookies', (req, res) => {
    console.log('Cookies: ', req.cookies);
    console.log('Signed Cookies: ', req.signedCookies);
    const cookies = req.cookies;
    
    if (cookies != null) {
        res.send("Cookies found: " + JSON.stringify(cookies));
    }else {
        res.status(200).send("cookies not found");
    }
});

//start listening to server side calls
const PORT = process.env.PORT || 3798;
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});