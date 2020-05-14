// localStorage добавление SVG 
function addSvgLocalStorage(window, document) {
  
  'use strict';

  var file     = "images/SVG/svg-sprite.svg",
    revision = 1; // При изменение файла необходимо поменять версию
 
  if(!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect )
    return true;
 
  var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
    request,
    data,
    insertIT = function()
    {
      document.body.insertAdjacentHTML('afterbegin', data);
    },
    insert = function()
    {
      if(document.body) insertIT();
      else document.addEventListener('DOMContentLoaded', insertIT);
    };
 
    if( isLocalStorage && localStorage.getItem('inlineSVGrev') == revision)
    {
      data = localStorage.getItem('inlineSVGdata');
      if(data)
      {
        insert();
        return true;
      }
    }
 
    try
    {
      request = new XMLHttpRequest();
      request.open( 'GET', file, true);
      request.onload = function() {
        if(request.status >= 200 && request.status < 400) {
          data = request.responseText;
          insert();
          if (isLocalStorage)
            {
              localStorage.setItem('inlineSVGdata',  data);
              localStorage.setItem('inlineSVGrev',   revision);
            }
          }
      }
         request.send();
    }
    catch(e){}
};

function addDisplayNoneSvg() {
  let arrBodyChildren = [...document.body.children];
  arrBodyChildren.forEach(function(item) {
    if (item.tagName === 'svg' && item.classList.length === 0 && item.attributes.length === 2) {
      item.style.display = 'none';
    }
  })
}

addSvgLocalStorage(window, document);
addDisplayNoneSvg();

export {addSvgLocalStorage, addDisplayNoneSvg};



