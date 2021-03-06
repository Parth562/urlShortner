const mongoose = require('mongoose');
const Urlmodel = require('./urlModel.js');

exports.createShortUrl = async (req, res) => {
    try {
        const url = req.body.url;
        const ID = getRandomNumber(url);
        const shortUrl = idToShortUrl(ID);
        let urlObj = await Urlmodel.findOne({ url: req.body.url });

        if (urlObj == null) {
            urlObj = await Urlmodel.create({
                url,
                shortUrl,
                urlIdentifier: ID,
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Scuccessfully shorted a Url!',
            shortUrl: `${req.protocol}://${req.hostname}/${urlObj.shortUrl}`,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
            err,
        });
    }
};
exports.getShortUrl = async (req, res) => {
    try {
        const urlObj = await Urlmodel.findOne(req.body);
        if (urlObj) {
            res.status(200).json({
                status: 'success',
                shortUrl: `${req.protocol}://${req.hostname}/${urlObj.shortUrl}`,
                urlObj,
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'no object found...',
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.reDirectToOriginal = async (request, response) => {
    try {
        const shortUrl = request.params.shortUrl;
        const urlObj = await Urlmodel.findOne({ shortUrl });

        if (urlObj) {
            console.log(urlObj.url);
            response.redirect(urlObj.url);
        } else {
            response.status(401).json({
                status: 'fail',
                message: 'Invalid url',
            });
        }
    } catch (err) {
        response.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const getRandomNumber = (str) => {
    let sum = 0;
    const map =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
            sum = sum + map.indexOf(str[i]) + 1;
        } else if (str[i] >= 'A' && str[i] <= 'Z') {
            sum = sum + map.indexOf(str[i]) + 27;
        } else if (str[i] >= '0' && str[i] <= '9') {
            sum = sum + map.indexOf(str[i]) + 53;
        }
    }
    const randomId =
        Math.floor(Math.random() * 100000) +
        Math.floor(Math.random() * 1000) * sum;
    return randomId;
};

const shortUrlToId = (shortUrl) => {
    const map =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var id = 0;
    for (let i = 0; i < shortUrl.length; i++) {
        if (shortUrl[i] >= 'a' && shortUrl[i] <= 'z') {
            id = id * 62 + map.indexOf(shortUrl[i]);
        } else if (shortUrl[i] >= 'A' && shortUrl[i] <= 'Z') {
            id = id * 62 + map.indexOf(shortUrl[i]);
        } else if (shortUrl[i] >= '0' && shortUrl[i] <= '9') {
            id = id * 62 + map.indexOf(shortUrl[i]);
        }
    }
    return id;
};

const idToShortUrl = (id) => {
    const map =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shorturl = '';
    var n = id;
    while (n > 0) {
        shorturl = shorturl + map[n % 62];
        n = Math.floor(n / 62);
    }
    return shorturl;
};
