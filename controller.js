const mongoose = require('mongoose');
const Urlmodel = require('./urlModel.js');

exports.createShortUrl = async (req, res) => {
    try {
        const url = req.body.url;
        const ID = await getRandomNumber();
        const shortUrl = idToShortUrl(ID);

        let urlObj = await Urlmodel.findOne({ url: url });

        if (!urlObj) {
            urlObj = await Urlmodel.create({
                url,
                shortUrl,
                urlIdentifier: ID,
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Scuccessfully shorted a Url!',
            shortUrl: `${req.protocol}://${req.hostname}/${shortUrl}`,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'error',
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

const getRandomNumber = async () => {
    let randomId = Math.floor(Math.random() * 100000);
    let urlObj = await Urlmodel.findOne({ urlIdentifier: randomId });

    if (urlObj) {
        randomId = Math.floor(Math.random() * 100000);
    }
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
