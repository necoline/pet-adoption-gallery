snippets.onLoad(function() {
  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "./assets/data/dogs.json", true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  const internalFetch = (url, options = { method: "get" }) =>
    new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.onload = resolve;
      request.onerror = reject;
      request.overrideMimeType("application/json");
      request.open(options.method, url, true);
      request.send();
    });

  internalFetch("./assets/data/dogs.json")
    .then(function(response) {
      const dogData = JSON.parse(response.target.response);
      return dogData.dogs;
    })
    .then(function(jsonData) {
      createImages(jsonData);
    })
    .catch(err => {
      console.error(err);
    });

  function createImages(imgs) {
    // Creates and appends images
    for (let i of imgs) {
      const image = document.createElement("img");
      image.setAttribute("data-lazy", i.image);
      // image.setAttribute("onclick", openImage();currentImage(image));
      image.setAttribute("alt", "dog image");
      image.classList.add("lazy-loading");
      document.getElementById("site-content__container").appendChild(image);
    }
    // Sets an observer for each image
    lazyTargets = document.querySelectorAll(".lazy-loading");
    lazyTargets.forEach(lazyLoad);
  }

  // Sets and disconnects lazy load observer
  function lazyLoad(target) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-lazy");

          img.setAttribute("src", src);
          img.classList.add("site-content__fadeIn");

          observer.disconnect();
        }
      });
    });
    obs.observe(target);
  }
});

function openModal() {
  document.getElementById("site-content__modal").style.display = "block";
}

function closeModal() {
  document.getElementById("site-content__modal").style.display = "none";
}

// var btn = document.getElementById("site-content__modal-opener");
// var modal = document.querySelector(".site-content__modal");

// function attachModalListeners(modalElm) {
//   modalElm
//     .querySelector(".site-content__close-modal")
//     .addEventListener("click", toggleModal);
//   modalElm
//     .querySelector(".site-content__overlay")
//     .addEventListener("click", toggleModal);
// }

// function detachModalListeners(modalElm) {
//   modalElm
//     .querySelector(".site-content__close-modal")
//     .removeEventListener("click", toggleModal);
//   modalElm
//     .querySelector(".site-content__overlay")
//     .removeEventListener("click", toggleModal);
// }

// function toggleModal() {
//   var currentState = modal.style.display;

//   // If modal is visible, hide it. Else, display it.
//   if (currentState === "none") {
//     modal.style.display = "block";
//     attachModalListeners(modal);
//   } else {
//     modal.style.display = "none";
//     detachModalListeners(modal);
//   }
// }

// btn.addEventListener("click", toggleModal);
