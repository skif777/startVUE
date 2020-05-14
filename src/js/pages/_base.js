// JS general
import LazyLoad from '../../../node_modules/vanilla-lazyload/dist/lazyload.js';
import * as $ from 'jquery';

// JS Modules general
import {addSvgLocalStorage, addDisplayNoneSvg} from '../_module/_add-SVG-localStorage.js';
import module from '../_module/_module.js';

// Style general

// SVG Sprite
requireAll(require.context('../../images/SVG/', true, /\.svg$/i));

function requireAll(r) {
  r.keys().forEach(r);
}

// Lazy load settings
var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
  // ... more custom settings?
});