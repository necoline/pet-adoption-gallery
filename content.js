snippets.onLoad(function() {
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
      // Parses json data
      const dogData = JSON.parse(response.target.response);
      debugger;
      return dogData.dogs;
    })
    .then(function(jsonData) {
      // Calls function to create HTML code
      createImages(jsonData);
      document.getElementById("site-content__loader").remove();
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
  // Sets the image address
  document
    .getElementById("site-content__modal-img")
    .setAttribute("src", imgSrc);
}

function closeModal() {
  document.getElementById("site-content__modal").style.display = "none";
}
