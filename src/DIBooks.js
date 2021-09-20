let self_dibooks;
let img_digits = 3;
let img_dir = "png/GeometriaVisual-";

class DIBooks {
  /**
   * 
   */
  constructor() {
    this.ProGeo3D_small = document.getElementById("ProGeo3D_small");
    this.ProGeo3D_fullscreen = document.getElementById("ProGeo3d_fullscreen");

    window.addEventListener("message", this.onMessage);
    self_dibooks = this;


    let body_style = getComputedStyle(document.body);
    this.page_width = parseInt(body_style.getPropertyValue("--page-width"));
    this.page_height = parseInt(body_style.getPropertyValue("--page-height"));

    this.scale = this.page_width/1050;

    this.container = document.getElementById("container");
    
    this.page = document.getElementById("page");
    this.page_viewer = document.getElementById("page_viewer");

    this.toc_btn = document.getElementById("toc_btn");



    // pages scroll
    let pages_scroll = document.getElementById("pages_scroll");
    pages_scroll.innerHTML = "";
    let page_img;

    // read all images
    for (let i=0; i<pages.length; i++) {
      page_img = document.createElement("img");
      page_img.setAttribute("src", img_dir + (i+1).toString().padStart(img_digits, "0") + ".png");
      pages_scroll.appendChild(page_img);
    }


    // canvas
    let canvas = document.getElementById("text_cover");
    canvas.width = this.page_width;
    canvas.height = this.page_height;
    this.ctx = canvas.getContext("2d");
    this.ctx.fillStyle = "rgba(0,0,0,0.2)";
    this.ctx.fillStyle = "rgba(255,255,255,0.4)";


    this.page_index = 0;
    // this.page_index = 61;

    this.setPageImage();

    this.drawTextCover();

    this.getPG3position();

    this.makeTOC();
    

    /**
     * 
     */
    document.getElementById("prev_png").addEventListener("click", (evt) => {
      this.prev_page();
    });

    /**
     * 
     */
    document.getElementById("page_zone_back").addEventListener("click", (evt) => {
      this.prev_page();
    });
     

    /**
     * 
     */
    document.getElementById("next_png").addEventListener("click", evt => {
      this.next_page();
    });
    
    /**
     * 
     */
     document.getElementById("page_zone_next").addEventListener("click", evt => {
      this.next_page();
    });


    let scroll_w = 700 + 40;
    this.page_range = document.getElementById("page_range");
    this.page_range.setAttribute("max", pages.length);

    /**
     * add functionality to the bottom region to show the navigation of pages
     */
    document.getElementById("show_page_viewer").addEventListener("click", (evt) => {
      this.page.style.display = "none";
      this.page_viewer.style.display = "block";

      this.toc_btn.style.display = "none";

      pages_container.scrollLeft = this.page_index*scroll_w -10;
      this.page_range.value = this.page_index;
    });

    // add functionality to the page scroll
    this.page_range.addEventListener("input", (evt) => {
      pages_container.scrollLeft = parseInt(this.page_range.value)*scroll_w -10;
    });

    document.getElementById("prev_page").addEventListener("click", (evt) => {
      this.page_range.value--;
      pages_container.scrollLeft = this.page_range.value*scroll_w -10;
    });
    document.getElementById("next_page").addEventListener("click", (evt) => {
      this.page_range.value++;
      pages_container.scrollLeft = this.page_range.value*scroll_w -10;
    });

    document.getElementById("pages_scroll").addEventListener("click", (evt) => {
      if (evt.target.hasAttribute("src")) {
        let match = evt.target.getAttribute("src").match(/.*?-(\d+?).png/);
        if (match) {
          this.page_index = parseInt(match[1])-1;
          this.step = 1;

          // show tha image in page
          this.setPageImage();
          // show the pg3
          this.showPG3()
          // draw rectangles
          this.drawTextCover();

          this.page.style.display = "block";
          this.page_viewer.style.display = "none";

          this.toc_btn.style.display = "block";
        }
      }
    });
  }

  /**
   * 
   */
  prev_page() {
    let current = pages[this.page_index];
    let prev = pages[this.page_index-1];

    if (current) {
      if (this.step > current.paso_ini) {
        this.step--;
      }
      else {
        this.step = (prev) ? prev.paso_fin : 1;
        this.page_index = Math.max(0, this.page_index-1);
        this.setPageImage();
      }
    }
    else if ((!current) && (prev)) {
      this.step = prev.paso_fin;
      this.page_index = Math.max(0, this.page_index-1);
      this.setPageImage();        
    }
    else {
      this.page_index = Math.max(0, this.page_index-1);
      this.setPageImage();
    }

    // show the pg3
    this.showPG3()

    // draw rectangles
    this.drawTextCover();
  }

  /**
   * 
   */
  next_page() {
    let current = pages[this.page_index];
    let next = pages[this.page_index+1];

    if (current) {
      if (this.step < current.paso_fin) {
        this.step++;
      }
      else {
        this.step = (next) ? next.paso_ini : 1;

        this.page_index = Math.min(pages.length-1, this.page_index+1);
        this.setPageImage();      
      }
    }
    else if ((!current) && (next)) {
      this.step = next.paso_ini;
      this.page_index = Math.min(pages.length-1, this.page_index+1);
      this.setPageImage();
    }
    else {
      this.page_index = Math.min(pages.length-1, this.page_index+1);
      this.setPageImage();
    }

    // show the pg3
    this.showPG3()

    // draw rectangles
    this.drawTextCover();
  }

  /**
   * 
   */
  showPG3() {
    let current = pages[this.page_index];

    // hide the interactive if is not visible
    if ( (current) && (visible[this.page_index+1]) ) {
      let next = pages[this.page_index+1];

      this.setVisibility(this.ProGeo3D_small, true);
      this.setVisibility(this.ProGeo3D_fullscreen, false);

      if (current.escena != this.current_pg3) {
        this.djs_small.evaluator.variables["_pg3_url_"] = current.escena + ".pg3";
        this.djs_small.evaluator.functions["leer_pg3"]();
        this.djs_small.update();

        this.djs_full.evaluator.variables["_pg3_url_"] = current.escena + ".pg3";
        this.djs_full.evaluator.functions["leer_pg3"]();
        this.djs_full.update();
      }

      this.ProGeo3D_small.className = this.pg3Pos[current.escena];

      this.djs_small.evaluator.functions["goToStep"](this.step-1);
      this.djs_small.update();
      
      this.djs_full.evaluator.functions["goToStep"](this.step-1);
      this.djs_full.update();

      this.current_pg3 = current.escena;
    }
    else {
      this.current_pg3 = null;
      this.setVisibility(this.ProGeo3D_small, false);
      this.setVisibility(this.ProGeo3D_fullscreen, false);
    }
  }

  /**
   * 
   */
  setPageImage() {
    this.page.setAttribute("style", `background-image:url('${img_dir + (this.page_index+1).toString().padStart(img_digits, "0")}.png');`);
  }

  /**
   * 
   */
  drawTextCover() {
    this.ctx.clearRect(0, 0, this.page_width, this.page_height);
    
    let current_rect;
    let page = pages[this.page_index];

    // the page has data
    if (page) {
      // the page has the variable "pasos"
      if (page.pasos) {
        // iterate over all values of "pasos"
        for (let i_paso = page.paso_ini; i_paso<=page.paso_fin; i_paso++) {
          // if the step has to be show
          if ((page.pasos[i_paso]) && (this.step < i_paso)) {
            // draw the rectangles to cover the text
            for (let i_rect = 0; i_rect<page.pasos[i_paso].length; i_rect++){
              current_rect = page.pasos[i_paso][i_rect];

              if (current_rect.h > 0) {
                this.ctx.fillRect( 
                  current_rect.x*this.scale,
                  this.page_height - current_rect.y*this.scale,
                  current_rect.w*this.scale, 
                  current_rect.h*this.scale 
                );
              }
            }
          }
        }
      }
    }
  }

  /**
   * 
   */
  getPG3position() {
    let pos;
    this.pg3Pos = {};
    for (let i=0; i<pages.length; i++) {
      if ( (pages[i]) && (pages[i].escena) ) {
        pos = this.loadText(pages[i].escena + ".pg3").match(/<SPACE>(\w+)<\/SPACE>/);

        this.pg3Pos[ pages[i].escena ] = (pos) ? pos[1] : null;
      }
    }
  }

  /**
   * 
   */
  makeTOC() {
    let toc_container = document.getElementById("toc_container");
    let toc_div = document.getElementById("toc");
    
    for (let i=0; i<toc_info.length; i++) {
      let toc_entry = document.createElement("div");
      toc_entry.setAttribute("class", "toc_" + toc_info[i].type);
      toc_entry.innerHTML = `${toc_info[i].num}&nbsp;&nbsp;&nbsp;&nbsp;${toc_info[i].name.replace(/\\\\/g, " ").replace(/``/g, "“").replace(/''/g, "”")}<span class="toc_num">${toc_info[i].page}</span>`;
      
      toc_entry.addEventListener("click", (evt) => {
        this.step = 1;
        this.page_index = initial_page + toc_info[i].page -1;

        // show tha image in page
        this.setPageImage();
        // show the pg3
        this.showPG3()
        // draw rectangles
        this.drawTextCover();

        toc_container.style.display = "none";
      });

      toc_div.appendChild(toc_entry);
    }

    this.toc_btn.addEventListener("click", (evt) => {
      if (getComputedStyle(toc_container).display == "none") {
        toc_container.style.display = "block";
      }
      else {
        toc_container.style.display = "none";
      }
    });
  }










  /**
   * 
   */
  loadText(filename) {
    if (filename) {
//      console.log("leyendo: ", filename);

      let response = null;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", filename, false);
      try {
        xhr.send(null);
        response = (xhr.status === 200 || xhr.status === 304) ? xhr.responseText : (xhr.responseText || "");
        response = (xhr.status === 404) ? "" : response;

        return response;
      }
      catch(e) {
        console.warn("error al cargar el archivo ", e);
        return null;
      }
    }
    else {
      return null;
    }
  }

  /**
   * 
   */
  resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let c_w = this.container.offsetWidth;
    let c_h = this.container.offsetHeight;

    let scaleToFitX = w/c_w;
    let scaleToFitY = h/c_h;

    if (scaleToFitX < scaleToFitY) {
      this.container.style.left = "0px";
      this.container.style.top = "50%";
      this.container.style.transform = `scale(${scaleToFitX}) translate(0, -50%)`;
    }
    else {
      this.container.style.left = "50%";
      this.container.style.top = "0px";
      this.container.style.transform = `scale(${scaleToFitY}) translate(-50%, 0)`;
    }
  }


  /**
   * 
   */
   setVisibility(iframe, v) {
    iframe.style.visibility = (v) ? "visible" : "hidden";
    iframe.style.opacity = (v) ? "1" : "0";
    iframe.style.zIndex = (v) ? 0 : -10000;
//    iframe.style.display = (v) ? "block" : "none";
  }


  /**
   * 
   */
   onMessage(evt) {
    let data = evt.data;
    let self = self_dibooks;

    if (data.type === "exec") {
      // the ProGeo3D is ready
      if (data.name == "ready") {

        // get the ProGeo3D small descartes app
        if (evt.source == self.ProGeo3D_small.contentWindow) {
          self.djs_small = self.ProGeo3D_small.contentWindow.descartesJS.apps[0];
          // change the color of the background
          self.djs_small.evaluator.variables["aspect"] = 0;
          self.djs_small.evaluator.variables["texturized"] = 0;
          self.djs_small.evaluator.functions["updateColors"]();
          //self.djs_small.evaluator.functions["setEdit"](0);
          self.djs_small.update();

          // add the maximize button to the small version
          let ProGeo_doc = self.ProGeo3D_small.contentWindow.document;
          let button = ProGeo_doc.createElement("div");
          button.setAttribute("style", "position:absolute; right:3px; bottom:4px; width:32px; height:32px; background-image:url('icons_white/progeo-maximize.svg'); cursor:pointer; z-index:2000;");
          ProGeo_doc.querySelector(".DescartesAppContainer").appendChild(button);

          button.addEventListener("click", (evt) => {
            self.setVisibility(self.ProGeo3D_small, false);
            self.setVisibility(self.ProGeo3D_fullscreen, true);
            self.toc_btn.style.display = "none";
          });
        }

        // get the ProGeo3D fullscreen descartes app
        if ( (self.ProGeo3D_fullscreen) && (evt.source == self.ProGeo3D_fullscreen.contentWindow) ) {
          self.djs_full = self.ProGeo3D_fullscreen.contentWindow.descartesJS.apps[0];

          // change the color of the background
          self.djs_full.evaluator.variables["aspect"] = 0;
          self.djs_full.evaluator.variables["texturized"] = 0;
          self.djs_full.evaluator.functions["updateColors"]();
          //self.djs_full.evaluator.functions["setEdit"](1);
          self.djs_full.update();

          let ProGeo_doc = self.ProGeo3D_fullscreen.contentWindow.document;
          // let button = ProGeo_doc.createElement("div");
          // button.setAttribute("style", "position:absolute; left:18px; top:14px; width:32px; height:32px; background-image:url('icons_white/topic-edit-close.svg'); cursor:pointer; z-index:2000;");
          // ProGeo_doc.querySelector(".DescartesAppContainer").appendChild(button);

          // button.addEventListener("click", (evt) => {
          //   self.setVisibility(self.ProGeo3D_small, true);
          //   self.setVisibility(self.ProGeo3D_fullscreen, false);
          // });

          // close button
          ProGeo_doc.getElementById("roli_switchRead").querySelector("canvas").addEventListener("mousedown", function(evt) {
            console.log("Cerrando")
            evt.stopPropagation();
            evt.preventDefault();
            self.setVisibility(self.ProGeo3D_small, true);
            self.setVisibility(self.ProGeo3D_fullscreen, false);
            self.toc_btn.style.display = "block";
          }, true);
          ProGeo_doc.getElementById("roli_switchRead").querySelector("canvas").addEventListener("touchstart", function(evt) {
            console.log("Cerrando")
            evt.stopPropagation();
            evt.preventDefault();
            self.setVisibility(self.ProGeo3D_small, true);
            self.setVisibility(self.ProGeo3D_fullscreen, false);
            self.toc_btn.style.display = "block";
          }, true);
        }
        
        // hide the initial loader screen
        if ( (self.djs_small) && (self.djs_full)) {
          setTimeout(function() {
            self_dibooks.showPG3();

            document.getElementById("loader").style.display = "none";
          }, 1000);
        }

      }

      //
      else if (data.name == "updateStep") {
        let tmp_step = parseInt(data.value)+1;
        let full_visible = self_dibooks.ProGeo3D_fullscreen.style.visibility;

// console.log(self_dibooks.step, tmp_step, self_dibooks.step-tmp_step)
        
        // paso adelante
        if ((self_dibooks.step-tmp_step) < 0) {
          self_dibooks.next_page();
        }
        else if ((self_dibooks.step-tmp_step) > 0) {
          self_dibooks.prev_page();
        }
        else {
          if (tmp_step >= pages[self_dibooks.page_index].paso_fin) {
            self_dibooks.next_page();
          }
          else if (tmp_step <= pages[self_dibooks.page_index].paso_ini) {
            self_dibooks.prev_page();
          }
        }

        if (full_visible == "visible") {
          self_dibooks.setVisibility(self_dibooks.ProGeo3D_fullscreen, true);
        }
      }
    }
  }

}
 