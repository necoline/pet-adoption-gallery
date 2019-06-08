function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-snippet");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("include-snippet");
          includeHTML();
        }
      } 
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

// function loadJSON(callback) {   

//     var xobj = new XMLHttpRequest();
//         xobj.overrideMimeType("application/json");
//     xobj.open('GET', './assets/data/dogs.json', true); 
//     xobj.onreadystatechange = function () {
//           if (xobj.readyState == 4 && xobj.status == "200") {
//             callback(xobj.responseText);
//           }
//     };
//     xobj.send(null);  
//  }

// window.onload = () => {
//     loadJSON(function(response) {
//         const imgJson = JSON.parse(response).dogs;
//         createImages(imgJson);
//         // document.getElementById('lds-roller').remove();
//       })

//   };
  

//   function createImages(imgs) {
//     const container = document.createElement('div')
    
//     for (let i of imgs) {
//       const image = document.createElement('img');
//       image.setAttribute('data-lazy', i.image);
//       image.classList.add('lazy-loading');

//       container.appendChild(image);
//     }
//     // Sets an observer for each image
//     const lazyTargets = document.querySelectorAll('.lazy-loading');
//     return lazyTargets.forEach(lazyLoad);
//   }

window.onload = () => {
    // Get 100 random images
    fetch('https://picsum.photos/v2/list?limit=30')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        // Call the createImages function to generate the HTML code
        createImages(myJson);
        // Remove the loading spinner
        document.getElementById('lds-roller').remove();
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  function createImages(imgs) {
    for (let i of imgs) {
      // Create an image HTML tag
      const image = document.createElement('img');
      image.setAttribute('data-lazy', i.download_url);
      image.classList.add('lazy-loading');
      document.getElementById('imagesContainer').appendChild(image);
    }
    // Sets an observer for each image
    lazyTargets = document.querySelectorAll('.lazy-loading');
    lazyTargets.forEach(lazyLoad);
  }
  
  // The lazy loading observer
  function lazyLoad(target) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-lazy');
  
          img.setAttribute('src', src);
          img.classList.add('fadeIn');
  
          observer.disconnect();
        }
      });
    });
    obs.observe(target);
  }