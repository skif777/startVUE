// JS general
import LazyLoad from '../../../node_modules/vanilla-lazyload/dist/lazyload.js';
import * as $ from 'jquery';

// JS Modules general
//import {addSvgLocalStorage} from '../_module/_add-SVG-localStorage.js';
import module from '../_module/_module.js';
import checkWebp from '../_module/_webp-check.js';

// Style general

// SVG Sprite
//requireAll(require.context('../../images/SVG/', true, /\.svg$/i));

function requireAll(r) {
  r.keys().forEach(r);
}

window.addEventListener('DOMContentLoaded', function() {

  //addSvgLocalStorage(window, document);
  checkWebp('lossy', function (feature, result) {
    if (result) {
      document.querySelector('html').classList.add('webp');
    }
  })

  // Lazy load settings
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
    // ... more custom settings?
  });
})
