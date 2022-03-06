const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const morgan = require('morgan');
const cors = require('cors');

//Necessary imports
const controller = require('./controller.js');
const Urlmodel = require('./urlModel.js');
const router = require('./routes.js');

const app = express();

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

mongoose
    .connect(DB, {})
    .then((con) => {
        console.log('DB connected successfully....');
    })
    .catch((e) => {
        console.log('DB Connection failed....');
    });

app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(router);

app.get('/:shortUrl', controller.reDirectToOriginal);

app.all('*', (req, res) => {
    const url = req.body.url;

    res.status(404).json({
        message: 'Route not yet defined...in app.js',
        status: 'fail',
    });
});

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server is runing at ${port}....`);
});
