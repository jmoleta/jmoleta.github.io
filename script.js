document
  .getElementById("cameraFileInput")
  .addEventListener("change", function () {
    document
      .getElementById("pictureFromCamera")
      .setAttribute("src", window.URL.createObjectURL(this.files[0]));
  });

document
  .getElementById("imageFileInput")
  .addEventListener("change", function () {
    document
      .getElementById("pictureFromCamera")
      .setAttribute("src", window.URL.createObjectURL(this.files[0]));
  });