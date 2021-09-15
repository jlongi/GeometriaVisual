var initial_page = 0;

/**
 * 
 */
function readAux() {
  let geoaux = loadText("GeometriaVisual.aux");
  let output = [];

  parseFile(geoaux);

  return output;

  // funcion que parsea el archivo de origen y genera un arreglo de paginas con sus pasos y coordenadas de rectangulos
  function parseFile(content) {
    content = content.split("\n");

    let scenes = [];
    let num_pages = 0;
    let scene_name = 0;
    let interactive_num = 0;
    let interactives = [];

    for(let i=0; i<content.length; i++) {
      if (content[i].match(/^\\newlabel{esc:/)) {
        scene_name = content[i].match(/newlabel{esc:(.*?)}/)[1];
      }

      // paso inicial
      else if (content[i].match(/^\\zref@newlabel{Esc:/)) {
        let step = parseStep(content[i].substring(1));

        if (interactives[interactive_num] == undefined) {
          interactives[interactive_num] = {
            name : scene_name,
            steps : []
          };  
        }

        interactives[interactive_num].initial_page = step.page;
      }

      else if (content[i].match(/^\\zref@newlabel{Paso:/)) {
        let step = parseStep(content[i].substring(1));
        if (scenes[step.page] == undefined) {
          scenes[step.page] = [];
        }
        step.name = scene_name;
        step.interactive_num = interactive_num;
        scenes[step.page].push(step);

        //
        if (interactives[interactive_num] == undefined) {
          interactives[interactive_num] = {
            name : scene_name,
            steps : []
          };  
        }
        interactives[interactive_num].steps.push(step);
        //
      }

      else if (content[i].match(/^\\zref@newlabel{FinEsc:/)) {
        let step = parseStep(content[i].substring(1));
        if (scenes[step.page] == undefined) {
          scenes[step.page] = [];
        }
        step.name = scene_name;
        step.interactive_num = interactive_num;
        step.fin = true;
        scenes[step.page].push(step);

        //
        if (interactives[interactive_num] == undefined) {
          interactives[interactive_num] = {
            name : scene_name,
            steps : []
          };  
        }
        interactives[interactive_num].steps.push(step);
        //

        scene_name = 0;
        // se incrementa el numero de interactivos
        interactive_num++;
      }

      // se obtiene una referencia para determinar si la pagina tiene o no un interactivo
      else if (content[i].match(/\\newlabel{Escena_/)) {
        let idx = content[i].match(/.*?}{ on input line \d+}}{(\d+)/);
        if (idx && idx[1]) {
          visible[parseInt(idx[1])+initial_page] = true;
        }
      }

      // se obtiene el numero de paginas del pdf y el offset
      else if (content[i].match(/^\\zref@newlabel{thepage/)) {
        num_pages = content[i].match(/^\\zref@newlabel{thepage(.+?)}/)[1];

        if (!initial_page) {
          if (!content[i].match(/scroman/)) {
            initial_page = parseInt(num_pages) -1;
          }
        }
      }
    }

    num_pages = parseInt(num_pages) +2;

    marksToSteps(interactives, num_pages);
  }

  // funcion que extrae el nombre de la escena de una etiqueta de tipo: zref@newlabel{esc
  function parseScene(scene_str) {
    return {
      name : scene_str.match(/newlabel{esc:(.*?)}/)[1],
      steps : []
    };
  }

  // funcion que extrae las coordendas y numero de pagina de una etiqueta de tipo: zref@newlabel{Paso y zref@newlabel{FinEsc
  function parseStep(step_str) {
    let match = step_str.match(/.+?posx{(.+?)}\\posy{(.+?)}\\abspage{(.+?)}/);

    return {
      x: ((parseInt(match[1])*0.0000282) < 480) ? 74 : 540,
      // x: parseInt(Math.min(540, Math.max(74, parseInt(parseInt(match[1])*0.0000282)))),
      y: parseInt(parseInt(parseInt(match[2])*0.0000282)-14),
      page: parseInt(match[3])
    }
  }

  function marksToSteps(inter, num_pages) {
// console.log(inter)
    let pages = [];
    let page_left = 74;
    let page_right = 540;
    let page_h = 788;
    let page_top = 705;
    let page_botom = 85;
    let scene;
    let step_idx;
    let current;
    let next;

    for (let inter_i=0; inter_i<inter.length; inter_i++) {
    //for (let inter_i=0; inter_i<4; inter_i++) {
    //for (let inter_i=8; inter_i<10; inter_i++) {
      scene = inter[inter_i];

      if (scene) {
        // let name = "'" + scene.name + "'";
        let name = scene.name;
        step_idx = 1;

// console.log(name, scene.steps.length)

        //
        for (let i=0; i<scene.steps.length; i++) {
          current = scene.steps[i];
          next = scene.steps[i+1];

          if (pages[current.page] == undefined) {
            pages[current.page] = {
              name : name,
              ini : step_idx,
              fin : step_idx,
              steps : {}
            };
          }
          
          // console.log("current", current)
          // console.log("next", next)

          // no es la ultima marca
          if (next) {
            // las marcas estan en la misma pagina
            if (current.page == next.page) {
              step_idx++;
              pages[current.page].fin = step_idx;

              // estan en la misma columna
              if (Math.abs(current.x - next.x) < 30) {
//                console.log("en la misma columna");

                if (!pages[current.page].steps[i+2]) {
                  pages[current.page].steps[i+2] = [];
                }
                pages[current.page].steps[i+2].push({
                  x: current.x,
                  y: current.y,
                  w: 440,
                  h: current.y - next.y
                });
              }
              // estan en columnas diferentes
              else {
                // console.log("en columnas diferentes", current.page, i+2);

                if (!pages[current.page].steps[i+2]) {
                  pages[current.page].steps[i+2] = [];
                }
                pages[current.page].steps[i+2].push({
                  x: current.x,
                  y: current.y,
                  w: 440,
                  h: current.y - page_botom
                });
                pages[current.page].steps[i+2].push({
                  x: next.x,
                  y: page_top,
                  w: 440,
                  h: page_top - next.y
                });
              }
            }
            // las marcas estan en paginas diferentes
            else {
              // console.log("en paginas diferentes");

              let diff = next.page - current.page;
              if (diff == 1) {
                step_idx++;

                // console.log("terminacion de pagina consecutiva", current.page, i+2);

                // condicion para eliminar rectangulos pequeños
                if (current.x < 400) {
                  pages[current.page].fin = step_idx;

                  // rectangulo del lado izquierdo
                  if (!pages[current.page].steps[i+2]) {
                    pages[current.page].steps[i+2] = [];
                  }
                  pages[current.page].steps[i+2].push({
                    x: current.x,
                    y: current.y,
                    w: 440,
                    h: current.y - page_botom
                  });

                  // rectangulo del lado derecho
                  if (!pages[current.page].steps[i+2]) {
                    pages[current.page].steps[i+2] = [];
                  }
                  pages[current.page].steps[i+2].push({
                    x: page_right,
                    y: page_top,
                    w: 440,
                    h: page_top - page_botom
                  });
                }
                else {
                  if (Math.abs(current.y - page_botom) > 15) {
                    pages[current.page].fin = step_idx;
                    
                    if (!pages[current.page].steps[i+2]) {
                      pages[current.page].steps[i+2] = [];
                    }
                    pages[current.page].steps[i+2].push({
                      x: current.x,
                      y: current.y,
                      w: 440,
                      h: current.y - page_botom
                    });
                  }
                }
              }
              else {
                // console.log("terminacion de pagina con espacios");
                step_idx++;
                pages[current.page].fin = step_idx;

                for (let j=0; j<diff; j++) {
                  // console.log("pagina ", current.page+j);
                  if (j==0) {
                    if (!pages[current.page].steps[i+2]) {
                      pages[current.page].steps[i+2] = [];
                    }
                    pages[current.page].steps[i+2].push({
                      x: current.x,
                      y: current.y,
                      w: 440,
                      h: current.y - page_botom
                    });
                    if (Math.abs(current.x-page_left)<30) {
                      pages[current.page].steps[i+2].push({
                        x: page_right,
                        y: page_top,
                        w: 440,
                        h: page_top - page_botom
                      });
                    }
                  }
                  else {
                    pages[current.page+j] = {
                      name : name,
                      ini : step_idx,
                      fin : step_idx,
                      steps : {}
                    };
                  }
                }
              }
            }
          }
          // es la ultima marca
          else {
            // console.log("la ultima marca", current.page);

            if (!pages[current.page].steps[i+2]) {
              pages[current.page].steps[i+2] = [];
            }
            pages[current.page].steps[i+2].push({
              x: current.x,
              y: current.y,
              w: 440,
              h: current.y - page_botom
            });
          }
        }
        // end for steps

        // add initial step
        if (pages[scene.initial_page] === undefined) {
          pages[scene.initial_page] = {
            name : name,
            ini : 1,
            fin : 1,
            steps : {}
          };
        }

      }// end if
    }// end for interactives
// console.log("+++")
// console.log(pages)

    for (let i=1; i<num_pages; i++) {
      if (pages[i]) {
        let o = {
          escena   : pages[i].name,
          paso_ini : pages[i].ini,
          paso_fin : pages[i].fin,
        };

        if (pages[i].fin-pages[i].ini >= 1) {
          o.pasos = {};

          for (let index in pages[i].steps) {
            if (pages[i].steps.hasOwnProperty(index)) {
              o.pasos[index] = [];

              for (let idx=0; idx<pages[i].steps[index].length; idx++) {
                o.pasos[index].push(pages[i].steps[index][idx]);
              }
            }
          }
        }

        output.push(o);
      }
      else {
        output.push(0);
      }
    }

    console.log(output)
  }
}

/**
 * 
 */
function loadText(filename) {
  if (filename) {
    console.log("leyendo: ", filename);

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