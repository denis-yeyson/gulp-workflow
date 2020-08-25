import {
   src,
   dest,
   task,
   watch,
   series,
   parallel
} from 'gulp';
/* MODULOS PARA JAVASCRIPT -> */
import babel from 'gulp-babel' //Convertir JS moderno a versiones anteriores.
import terser from 'gulp-terser' //Ofuscar codigo JS.
import concat from 'gulp-concat' //Unir archivos CSS o JS.

/* MODULOS PARA CSS -> */
import scss from 'gulp-sass' //Convierte archivos SCSS a CSS.
import postcss from 'gulp-postcss' //Junta modulos para trabajar CSS.
import purgecss from 'gulp-purgecss' //Elimina selectores y clases sin usar.
import autoprefixer from 'autoprefixer' //Genera CSS para versiones anteriores.
import cssnano from 'cssnano' //Comprime y mejora el CSS.

/* MODULOS PARA GENERAR MAPS -> */
import sourcemaps from 'gulp-sourcemaps'

/* MODULOS PARA TRATAR IMAGENES Y SVG -> */
import imagemin from 'imagemin'

import rename from 'gulp-rename'
import pug from 'gulp-pug'
import plumber from 'gulp-plumber'
import cacheBust from 'gulp-cache-bust'
import html2pug from 'gulp-html2pug'
import replace from 'gulp-replace'
import clean from 'gulp-clean'

//<- MODULO PARA CREAR SERVIDOR LOCAL ->
import {
   init as server,
   stream,
   reload
} from 'browser-sync'

/***************************************/
/*** VARIABLES GLOBALES DE PRODUCCIÓN **/
/***************************************/
const PRODUCTION = true
const STATE_SOURCEMAPS = false;

//<- Ruta de entrada ->//
const __inputs = {
   img: 'src/assets/img/**/*',
   js: 'src/assets/js/**/*.js',
   scss: 'src/assets/scss/**/*.scss',
   svg: 'src/assets/svg/**/*.svg',
   pug: 'src/pug/**/*.pug',
   vendors: 'src/assets/vendors/**/*',
   clean_css: 'dist/assets/css/**/*.css',
   html_verify: 'dist/**/*.html',
   html2pug: './src/pug/tools/html2pug/_input.html'
};

//<- Ruta de salida ->//
const __outputs = {
   css: 'dist/assets/css/',
   scss: 'src/assets/scss/',
   js: 'dist/assets/js/',
   img: 'dist/assets/img/',
   webp: 'dist/img/assets/webp/',
   svg: 'dist/assets/svg/',
   html: 'dist/',
   vendors: 'dist/assets/vendors/',
   html2pug: './src/pug/tools/html2pug/'
};

task('js', () => {
   return src(__inputs.js, {
         sourcemaps: STATE_SOURCEMAPS
      })
      .pipe(plumber())
      .pipe(concat(PRODUCTION ? 'scripts.min.js' : 'scripts.js'))
      .pipe(babel())
      .pipe(terser({
         format: {
            comments: PRODUCTION ? '/^!/' : true,
            beautify: !PRODUCTION
         },
         compress: {
            drop_console: PRODUCTION
         }
      }))
      .pipe(dest(__outputs.js, {
         sourcemaps: '.'
      }))
})

task('pug', () => {
   //? https://github.com/isaacs/node-glob#glob-primer
   //return src('src/pug/**/?(*.pug|!.*)')
   return src(__inputs.pug)
      .pipe(plumber())
      .pipe(pug({
         pretty: PRODUCTION ? false : true,
      }))
      .pipe(cacheBust({
         type: 'timestamp'
      }))
      .pipe(dest(__outputs.html))
})

task('clean_pug', () => {
   return src('dist/tools', {
         read: false
      })
      .pipe(clean())
})

task('scss', () => {
   return src(__inputs.scss, {
         sourcemaps: STATE_SOURCEMAPS
      })
      .pipe(plumber())
      .pipe(scss({
         outputStyle: PRODUCTION ? 'compressed' : 'expanded' //expanded,nested,compact,compressed,
      }))
      .pipe(postcss([autoprefixer(), (PRODUCTION ? cssnano() : () => {})]))
      .pipe(rename(PRODUCTION ? 'styles.min.css' : 'styles.css'))
      .pipe(dest(__outputs.css, {
         sourcemaps: '.'
      }))
      .pipe(stream())
})

task('bootstrap', () => {
   return src('node_modules/bootstrap/scss/**/*.scss')
      .pipe(dest(__outputs.scss))
})

task('clean_css', () => {
   return src(__inputs.clean_css)
      .pipe(plumber())
      .pipe(purgecss({
         content: [__inputs.html_verify]
      }))
      .pipe(rename('modificado.min.css'))
      .pipe(dest(__outputs.css))
})

task('copy_vendors', () => {
   return src(__inputs.vendors)
      .pipe(dest(__outputs.vendors))
})

task('htmlToPug', () => {
   return src(__inputs.html2pug)
      .pipe(html2pug({
         tabs: true,
         doubleQuotes: true,
         fragment: true
      }))
      .pipe(rename('_output.pug'))
      .pipe(dest(__outputs.html2pug))
})

task('default', () => {
   server({
      server: './dist'
   })
   watch(__inputs.pug, series('pug', 'clean_pug')).on('change', reload)
   watch(__inputs.scss, series('scss'))
   watch(__inputs.js, series('js')).on('change', reload)
   watch(__inputs.vendors, series('copy_vendors')).on('change', reload)
   watch(__inputs.html2pug, series('htmlToPug'))
})
