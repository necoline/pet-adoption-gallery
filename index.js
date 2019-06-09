let snippets = (function includeHTML() {
  let snippetElements = [];
  let elements = document.getElementsByTagName("*");

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    let file = element.getAttribute("include-snippet");
    if (file) {
      snippetElements.push({ element: element, file: file });
    }
  }

  const loadSnippets = Promise.all(
    snippetElements.map(({ element, file }) => {
      return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              element.innerHTML = this.responseText;
            }
            if (this.status == 404) {
              element.innerHTML = "Page not found.";
            }

            element.removeAttribute("include-snippet");
            resolve(element);
          }
        };
        xhttp.open("GET", file, true);
        xhttp.send();
      });
    })
  );

  return {
    onLoad: function(fn) {
      return loadSnippets.then(fn);
    }
  };
})();
