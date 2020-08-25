//.....................................................................................//
//                       CREAR DIRECTORIO DE FICHEROS Y ARCHIVOS                       //
//.....................................................................................//

let fs = require("fs");
let shell = require("shelljs");

const FILES = "files";
const FOLDERS = "folders";

/**
 *
 * @param {*} tipo Colocar el tipo de elemento a crear "folders" o "files"
 * @param {*} cadena Parametro ejemplo elemento_1/elemento_2{subelemento_1.txt,subelemento_2.txt}
 */
function crear(tipo, cadena) {
  let elemento = "";
  if (cadena.indexOf("{") > 0) {
    elemento = cadena.match(/(.*){/)[1];
    let subelemento = cadena.match(/{(.*)}/)[1].split(",");
    for (cp in subelemento) subelemento[cp] = elemento + "/" + subelemento[cp];
    cadena = subelemento;
  }
  if (tipo === FILES) {
    shell.mkdir("-p", elemento);
    shell.touch(cadena);
  } else {
    shell.mkdir("-p", cadena);
  }
}

function crearFolders(cadena) {
  crear(FOLDERS, cadena);
}

function crearArchivos(cadena) {
  crear(FILES, cadena);
}

var plantilla_main_scss = `@charset "UTF-8";\n\n/*! denis-yeyson ;*/\n\n// Settings\n@import "settings/colors";\n@import "settings/global";\n\n// Tools\n@import "tools/mixins";\n\n// Generic\n@import "generic/normalize";\n@import "generic/box-sizing";\n@import "generic/reset";\n@import "generic/shared";\n\n// Elements\n@import "elements/page";\n@import "elements/headings";\n@import "elements/links";\n@import "elements/lists";\n@import "elements/images";\n@import "elements/quotes";\n\n// Objects\n@import "objects/wrappers";\n@import "objects/layout";\n@import "objects/media";\n\n// Components\n@import "components/page-title";\n@import "components/buttons";\n@import "components/testimonials";\n@import "components/avatars";\n\n// Trumps\n@import "trumps/links";\n@import "trumps/widths";`;

function crearDirectorio() {
  let path = "./src/assets/";

  //CARPETAS DE IMAGENES
  console.log("CREANDO CARPETAS DE IMAGENES...");
  crearFolders(path + "img{jpg,png,svg}");

  //CARPETAS DE SCSS CON ARQUITECTURA ITCSS Y BEM (BEMIT)
  console.log("CREANDO CARPETA Y ARCHIVOS DE SCSS CON NOMENCLATURA 'ITCSS'...");
  crearFolders(
    path + "scss{settings,tools,generic,elements,objects,components,trumps}"
  );
  crearArchivos(path + "scss/settings{_colors.scss,_global.scss}");
  crearArchivos(path + "scss/tools{_mixins.scss}");
  crearArchivos(
    path +
      "scss/generic{_normalize.scss,_box-sizing.scss,_reset.scss,_shared.scss}"
  );
  crearArchivos(
    path +
      "scss/elements{_page.scss,_headings.scss,_links.scss,_lists.scss,_images.scss,_quotes.scss}"
  );
  crearArchivos(path + "scss/objects{_wrappers.scss,_layout.scss,_media.scss}");
  crearArchivos(
    path +
      "scss/components{_page-title.scss,_buttons.scss,_testimonials.scss,_avatars.scss}"
  );
  crearArchivos(path + "scss/trumps{_links.scss,_widths.scss}");
  crearArchivos(path + "scss/main.scss");
  fs.writeFile(path + "scss/main.scss", plantilla_main_scss, () => {});

  //CARPETAS DE JAVASCRIPT
  console.log("CREANDO CARPETA Y ARCHIVOS DE JAVASCRIPT...");
  crearFolders(path + "js");
  crearArchivos(path + "js/script.js");

  //CARPETAS DE PUG
  console.log("CREANDO CARPETA Y ARCHIVOS DE PUG...");
  crearFolders("./src/pug{pages,tools}");
  crearArchivos(
    "./src/pug/tools{config_variables.pug,include_head.pug,include_footer.pug,mixin_funciones.pug,template_index.pug}"
  );
  crearArchivos("./src/pug/index.pug");
}

crearDirectorio();
