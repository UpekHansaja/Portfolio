var preLoader = document.getElementById("preLoader");

function checkImage(imageSrc, good, bad) {
  var img = new Image();
  img.onload = good;
  img.onerror = bad;
  img.src = imageSrc;
}

checkImage(
  "models/halo/textures/MKV_Helmet_normal.png",
  function () {
    console.log("model image loaded");
    window.addEventListener("load", function () {
      preLoader.classList.remove = "loaderImg";
      preLoader.classList.add = "fade-out";
      // if ((preLoader.classList.contains = "fade-out")) {
      preLoader.style.display = "none";
      // }
    });
  },
  function () {
    console.log("wating for 3D model to load...");
  }
);

