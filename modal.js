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
