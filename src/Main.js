var pages;
var visible = [];

window.addEventListener("load", function(evt) {
  pages = readAux();
  let dbook = new DIBooks();

  window.addEventListener("resize", dbook.resize);
  dbook.resize();
})