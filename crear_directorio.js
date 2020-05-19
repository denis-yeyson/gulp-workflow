//.....................................................................................//
//                       CREAR DIRECTORIO DE FICHEROS Y ARCHIVOS                       //
//.....................................................................................//

const shell = require('shelljs');
const fs = require('fs');

function crearFolders(cadena) {
    if (cadena.indexOf('{') > 0) {
        let inicio = cadena.indexOf('{') + 1;
        let fin = cadena.indexOf('}');
        let carpetas = cadena.substring(0, inicio - 1);
        let subcarpetas = cadena.substring(inicio, fin).split(',');
        for (cp in subcarpetas) {
            subcarpetas[cp] = carpetas + '/' + subcarpetas[cp];
        }
        shell.mkdir('-p', carpetas, subcarpetas);
    } else {
        shell.mkdir('-p', cadena);
    }
}

function crearArchivo(name) {
    if (name.indexOf('{') > 0) {
        let inicio = name.indexOf('{') + 1;
        let fin = name.indexOf('}');
        let carpetas = name.substring(0, inicio - 1);
        let archivos = name.substring(inicio, fin).split(',');
        for (cp in archivos) {
            shell.touch(carpetas + '/' + archivos[cp]);
        }
    } else {
        shell.touch(name);
    }
}

var plantilla_main_scss = `@charset "UTF-8";\n\n/*! denis-yeyson ;*/\n\n// Settings\n@import "settings/colors";\n@import "settings/global";\n\n// Tools\n@import "tools/mixins";\n\n// Generic\n@import "generic/normalize";\n@import "generic/box-sizing";\n@import "generic/reset";\n@import "generic/shared";\n\n// Elements\n@import "elements/page";\n@import "elements/headings";\n@import "elements/links";\n@import "elements/lists";\n@import "elements/images";\n@import "elements/quotes";\n\n// Objects\n@import "objects/wrappers";\n@import "objects/layout";\n@import "objects/media";\n\n// Components\n@import "components/page-title";\n@import "components/buttons";\n@import "components/testimonials";\n@import "components/avatars";\n\n// Trumps\n@import "trumps/links";\n@import "trumps/widths";`;


function crearDirectorio() {
    let path = './src/assets/';

    //CARPETAS DE IMAGENES
    console.log('CREANDO CARPETAS DE IMAGENES...');
    crearFolders(path + 'img{jpg,png,svg}');

    //CARPETAS DE SCSS
    console.log('CREANDO CARPETA Y ARCHIVOS DE SCSS CON NOMENCLATURA \'ITCSS\'...');
    crearFolders(path + 'scss{settings,tools,generic,elements,objects,components,trumps}');
    crearArchivo(path + 'scss/settings{_colors.scss,_global.scss}');
    crearArchivo(path + 'scss/tools{_mixins.scss}');
    crearArchivo(path + 'scss/generic{_normalize.scss,_box-sizing.scss,_reset.scss,_shared.scss}');
    crearArchivo(path + 'scss/elements{_page.scss,_headings.scss,_links.scss,_lists.scss,_images.scss,_quotes.scss}');
    crearArchivo(path + 'scss/objects{_wrappers.scss,_layout.scss,_media.scss}');
    crearArchivo(path + 'scss/components{_page-title.scss,_buttons.scss,_testimonials.scss,_avatars.scss}');
    crearArchivo(path + 'scss/trumps{_links.scss,_widths.scss}');
    crearArchivo(path + 'scss/main.scss');
    fs.writeFile(path + 'scss/main.scss', plantilla_main_scss, () => {});

    //CARPETAS DE JAVASCRIPT
    console.log('CREANDO CARPETA Y ARCHIVOS DE JAVASCRIPT...');
    crearFolders(path + 'js');
    crearArchivo(path + 'js/script.js');

    //CARPETAS DE PUG
    console.log('CREANDO CARPETA Y ARCHIVOS DE PUG...');
    crearFolders('./src/pug{pages,tools}');
    crearArchivo('./src/pug/tools{config_variables.pug,include_head.pug,include_footer.pug,mixin_funciones.pug,template_index.pug}');
    crearArchivo('./src/pug/index.pug');
}

crearDirectorio();