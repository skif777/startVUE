const imagemin = require('imagemin');
const webp = require('imagemin-webp');


(function () {

  imagemin(['./src/images/*.{jpg,png}'], {
    destination: './src/images',
    plugins: [
      webp({
        quality: 100,
        lossless: true
      })
    ]
  }).then(console.log('Конвертация в Webp завершенна!'));

})();