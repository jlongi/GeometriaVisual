var pages;
var visible = [];
var initial_page = 0;
var toc_info = [];

window.addEventListener("load", function(evt) {
  pages = readAux();
  let dbook = new DIBooks();

  window.addEventListener("resize", dbook.resize);
  dbook.resize();
})