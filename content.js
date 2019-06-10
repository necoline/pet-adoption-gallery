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

  // Retrieves data and begins creation of HTML cods
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
      image.setAttribute("src", dogSvg);
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

// Opens modal and assigns image src
function openModal(event) {
  const imgSrc = event.target.getAttribute("data-lazy");
  // Displays modal
  document.getElementById("site-content__modal").style.display = "block";
  // Sets the image address
  document
    .getElementById("site-content__modal-img")
    .setAttribute("src", imgSrc);
}

// Closes modal
function closeModal() {
  document.getElementById("site-content__modal").style.display = "none";
}

// Contains svg data to display as placeholder
const dogSvg =
  "data:image/svg+xml,%0A%3Csvg width='209px' height='209px' viewBox='0 0 209 209' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='product-page' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Artboard' transform='translate(-307.000000, -126.000000)' fill='%23E6E3E7'%3E%3Cpath d='M429.730536,126.325773 C439.428857,126.022926 449.672474,127.921745 460.461388,132.022231 C469.154027,128.835782 475.63507,127.495752 479.904517,128.002142 C486.308687,128.761727 499.262137,136.188059 506.669515,145.426888 C514.076893,154.665718 515.141072,168.69879 515.141072,176.079572 C515.141072,183.460355 507.757768,199.436649 506.669515,201.081863 C505.581262,202.727078 498.374215,213.657249 487.666061,212.072607 C476.957906,210.487965 473.389792,198.607793 473.389792,195.479066 C473.389792,192.350339 478.251554,179.576701 477.982814,168.69879 C477.803655,161.446848 475.883365,154.616431 472.221947,148.207537 C473.263677,155.788447 472.682702,163.714614 470.479023,171.98604 C468.275343,180.257466 464.936132,187.045566 460.461388,192.350339 C463.624234,196.510401 464.568003,201.153921 463.292695,206.280901 C462.017388,211.40788 458.741889,216.138356 453.466199,220.472329 C455.134401,224.392828 456.327405,227.568719 457.045211,230 C457.763017,232.431281 457.763017,242.681391 457.045211,260.750329 C454.990127,282.713508 453.797124,296.306772 453.466199,301.530122 C453.135275,306.753473 453.135275,311.990726 453.466199,317.241882 C460.017197,318.336854 463.292695,321.342625 463.292695,326.259196 C463.292695,331.175768 461.210201,333.756035 457.045211,334 L433.234982,332.567067 L435.501357,301.530122 L425.55689,312.760641 C430.675618,318.848327 433.234982,323.347846 433.234982,326.259196 C433.234982,330.626222 431.357095,332.567067 425.55689,334 C421.690086,334.955288 399.869859,334.955288 360.096208,334 C359.300958,334.385302 358.610392,333.907657 358.024509,332.567067 C357.438627,331.226477 357.438627,330.221687 358.024509,329.552696 C344.104095,330.509733 332.645377,328.284771 323.648358,322.87781 C314.651339,317.470849 309.137246,306.428992 307.10608,289.752239 C311.295592,300.488461 317.373607,307.638895 325.340127,311.203539 C333.306646,314.768184 341.607001,314.051399 350.241192,309.053184 C349.584135,296.010729 350.192838,286.457934 352.067301,280.3948 C354.878996,271.300098 361.487761,266.235262 364,264.548984 C366.512239,262.862706 381.086336,255.655275 390.273512,247.807997 C396.398296,242.576478 402.9089,232.76934 409.805326,218.386582 C403.824314,215.448215 400.259691,211.412988 399.111456,206.280901 C397.96322,201.148813 399.91998,195.577595 404.981736,189.567246 C401.34882,185.512012 398.222511,180.2771 395.602809,173.862511 C392.983107,167.447922 391.206675,160.678006 390.273512,153.552763 C387.188931,154.147252 385.646641,157.834905 385.646641,164.615724 C385.646641,174.786952 393.345244,189.676582 393.637606,195.479066 C393.929968,201.281549 389.29316,206.280901 380.095325,209.068901 C370.897489,211.856902 355.20497,203.060317 352.067301,192.350339 C348.929632,181.64036 348.192517,171.330505 351.145225,163.148285 C354.097934,154.966066 359.855142,149.541736 367.110376,140.825215 C374.36561,132.108694 379.831465,130.473134 388.05961,129.292918 C393.54504,128.506107 399.185748,129.993362 404.981736,133.754683 C411.782616,129.104924 420.032216,126.628621 429.730536,126.325773 Z' id='Path-6'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
