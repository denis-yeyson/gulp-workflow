const {
    src,
    dest,
    series,
    parallel,
    watch,
    task
} = require('gulp');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const image = require('gulp-image');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const clean = require('gulp-clean');
const html2pug = require('gulp-html2pug');

/* INPUTS */
const input_paths = {
    img: 'src/assets/img/**/*',
    js: 'src/assets/js/**/*.js',
    scss: 'src/assets/scss/**/*.scss',
    svg: 'src/assets/svg/**/*.svg',
    pug: 'src/pug/**/*.pug'
};

/* OUTPUTS */
const output_paths = {
    css: 'dist/assets/css',
    js: 'dist/assets/js',
    img: 'dist/assets/img',
    webp: 'dist/img/assets/webp',
    svg: 'dist/assets/svg',
    html: 'dist/'
};

function dev_javascript() {
    return src(input_paths.js)
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))
        .pipe(dest(output_paths.js))
}

function prod_javascript() {
    return src(input_paths.js)
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins: ['transform-minify-booleans', 'minify-builtins', 'transform-inline-consecutive-adds',
                'minify-dead-code-elimination', 'minify-constant-folding', 'minify-flip-comparisons',
                'minify-guarded-expressions', 'minify-infinity', 'minify-mangle-names',
                'transform-member-expression-literals', 'transform-merge-sibling-variables',
                'minify-numeric-literals', 'transform-property-literals', 'transform-regexp-constructors',
                'transform-remove-console', 'transform-remove-debugger', 'transform-remove-undefined',
                'minify-replace', 'minify-simplify', 'transform-simplify-comparison-operators',
                'minify-type-constructors', 'transform-undefined-to-void'
            ]
        }))
        .pipe(minify({
            mangle: {
                keepClassName: true,
            }
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(output_paths.js))
}

function dev_css() {
    return src(input_paths.scss)
        .pipe(scss({
            outputStyle: 'expanded' //expanded,nested,compact,compressed,
        }).on('error', scss.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename('styles.css'))
        .pipe(dest(output_paths.css))
}

function prod_css() {
    return src(input_paths.scss)
        .pipe(scss({
            outputStyle: 'compressed' //expanded,nested,compact,compressed,
        }).on('error', scss.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename('styles.min.css'))
        .pipe(dest(output_paths.css))
}

function dev_pug() {
    return src(input_paths.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest(output_paths.html))
}

function prod_pug() {
    return src(input_paths.pug)
        .pipe(pug({
            pretty: false
        }))
        .pipe(dest(output_paths.html))
}

function cleaner_pug() {
    return src('dist/tools', {
            read: false
        })
        .pipe(clean());
}

function normalize() {
    return src('./node_modules/normalize.css/normalize.css')
        .pipe(rename('_normalize.scss'))
        .pipe(dest('./src/assets/scss/generic'))
}

function bootstrap() {
    //ELEMENTOS BOOTSTRAP
    var bootstrap = 'node_modules/bootstrap/dist/css/bootstrap.min.css';
    var bootstrap_grid = 'node_modules/bootstrap/dist/css/bootstrap-grid.min.css';
    var bootstrap_reboot = 'node_modules/bootstrap/dist/css/bootstrap-reboot.min.css';
    var bootstrap_js = 'node_modules/bootstrap/dist/js/bootstrap.min.js';
    var bootstrap_bundle_js = 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
    //ELEMENTOS JQUERY
    var jquery = 'node_modules/jquery/dist/jquery.min.js';
    var jquery_slim = 'node_modules/jquery/dist/jquery.slim.min.js';
    //ELEMENTOS POPPER.JS
    var popper = 'node_modules/popper.js/dist/popper.min.js';
    var popper_utils = 'node_modules/popper.js/dist/popper-utils.min.js';
    //ELEMENTOS SASS DE BOOTSTRAP
    var bootstrap_scss = 'node_modules/bootstrap/scss/'

    var copyFilesArray = [bootstrap, jquery, popper];
    copyFilesArray.forEach(copy);

    var rutaSalida = 'dist/assets/';

    function copy(elemento, indice) {
        var extension = elemento.split(".").pop();
        if (extension == 'css') {
            src(elemento).pipe(dest(rutaSalida + 'css'));
        } else if (extension == 'js') {
            src(elemento).pipe(dest(rutaSalida + 'js'));
        }
    }
}

function convertImageWebp() {
    return src(output_paths.img)
        .pipe(webp())
        .pipe(dest(output_paths.webp))
}

function convertHtmlPug() {
    watch('carpeta_prueba/index.html', function convert() {
        return src('carpeta_prueba/index.html')
            .pipe(html2pug())
            .pipe(dest('./carpeta_prueba'))
    })
}

/**********************************************************************************************************************************/
function dev_watch_all() {
    watch([input_paths.scss, input_paths.js, input_paths.pug], parallel(dev_css, dev_javascript, series(dev_pug, cleaner_pug)));
}

function prod_watch_all() {
    watch([input_paths.scss, input_paths.js, input_paths.pug], parallel(prod_css, prod_javascript, series(prod_pug, cleaner_pug)));
}
/**********************************************************************************************************************************/

//Convertir HTML a PUG
exports.convertHtmlPug = series(convertHtmlPug);

//Copia el archivo normalize de node_modules
exports.normalize = normalize;

//Compila los archivos para debugear
exports.dev = series(dev_watch_all);

//Compila los archivos para produccion
exports.prod = series(prod_watch_all);

//Copia los archivo bootstrap de node_modules
exports.bootstrap = series(bootstrap);