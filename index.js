'use strict';

const request = require('request');
const wallpaper = require('wallpaper');
const config = require('./config.json');
const path = require('path');
const fs = require('fs');

function setWallpaper(img) {
  wallpaper.set(img)
    .then(() => {
      console.log('set wallpaper success!');
    })
    .catch(error => {
      console.log('set wallpaer error', error);
    });
}

function fetchBingWallPaper() {
  request('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
    function(error, res, body){
      if (error || res.statusCode !== 200) {
        return new Error('fetch bing api error');
      }
      let result;
      try {
        result = JSON.parse(body);
      }
      catch (err) {
        return new Error(err);
      }

      if (typeof result.images === 'undefined' || result.images.length === 0) {
        return new Error('parse bing api error', result);
      }
      let pathName = path.resolve(__dirname, 'wallpaper');
      if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName);
      }
      let fileName = path.resolve(pathName, path.basename(result.images[0].url));
      request.get(result.images[0].url)
        .on('error', function(error) {
           console.error('download image error', error);
        })
        .pipe(fs.createWriteStream(fileName))
        .on('close', function() {
          setWallpaper(fileName);
        });
  })
}

fetchBingWallPaper();
