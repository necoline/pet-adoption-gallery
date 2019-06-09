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
      image.addEventListener("click", openModal);
      image.setAttribute("alt", "dog image");
      image.setAttribute("id", "site-content__image-thubmnail");
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

function openModal(event) {
  const imgSrc = event.target.getAttribute("data-lazy");
  // Displays modal
  document.getElementById("site-content__modal").style.display = "block";
  // Sets the image to the source
  document
    .getElementById("site-content__modal-img")
    .setAttribute("src", imgSrc);
}

function closeModal() {
  document.getElementById("site-content__modal").style.display = "none";
}
