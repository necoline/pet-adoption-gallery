snippets.onLoad(function() {
  // Creates a promise to get json data
  const fetchData = (url, options = { method: "get" }) =>
    new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.onload = resolve;
      request.onerror = reject;
      request.overrideMimeType("application/json");
      request.open(options.method, url, true);
      request.send();
    });

  // Retrieves data and begins creation of HTML
  fetchData("./assets/data/dogs.json")
    .then(function(response) {
      // Parses json data
      const dogData = JSON.parse(response.target.response);
      return dogData.dogs;
    })
    .then(function(jsonData) {
      // Calls function to create HTML code
      createImages(jsonData);
      // Removes loading animation
      document.getElementById("site-content__loader").remove();
    })
    .catch(err => {
      console.error(err);
    });

  // Creates and appends images to image container
  function createImages(imgs) {
    for (let i of imgs) {
      const image = document.createElement("img");
      // Adds placeholder image
      image.setAttribute("src", "./assets/images/dog.svg");
      // Adds image for the lazy loader to use
      image.setAttribute("data-lazy", i.image);
      // Adds click event for the modal
      image.addEventListener("click", openModal);
      // Adds generic description
      image.setAttribute("alt", "dog image");
      // Creates class selector for the lazy loader
      image.classList.add("lazy-loading");
      document.getElementById("site-content__container").appendChild(image);
    }
    // Sets an observer for each image
    lazyTargets = document.querySelectorAll(".lazy-loading");
    lazyTargets.forEach(lazyLoad);
  }

  // Sets and disconnects lazy load observer
  function lazyLoad(target) {
    // Creates an observer for each element
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Assigns image src from target when the element comes into view
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-lazy");
          img.setAttribute("src", src);
          // Adds animation on image load
          img.classList.add("site-content__fadeIn");
          observer.disconnect();
        }
      });
    });
    obs.observe(target);
  }
});
