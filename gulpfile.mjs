import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const sass = gulpSass(dartSass);

export function compileSass() {
  return gulp.src('./scss/style.scss') 
    .pipe(sass().on('error', sass.logError)) 
    .pipe(gulp.dest('./dist/css')); 
}

export function optimizeImages() {
  return gulp.src('./avatar/**/*.{jpg,png}', { encoding: false }) 
    .pipe(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }), 
      imageminOptipng({ optimizationLevel: 5 }) 
    ]))
    .pipe(gulp.dest('./dist/images')); 
}

export function copyFiles() {
  return gulp.src([
      './index.html',          
      './dist/css/style.css'   
    ], { allowEmpty: true }) 
    .pipe(gulp.dest('./dist')); 
}

export async function zipFiles() {
  const zip = (await import('gulp-zip')).default; 
  return gulp.src('./dist/**/*') 
    .pipe(zip('site_archive.zip')) 
    .pipe(gulp.dest('./')); 
}

export function watchFiles() {
  gulp.watch('./scss/**/*.scss', gulp.series(compileSass, copyFiles, zipFiles)); 
  gulp.watch('./index.html', gulp.series(copyFiles, zipFiles)); 
  gulp.watch('./avatar/**/*', gulp.series(optimizeImages, zipFiles)); 
}

export default gulp.series(
  compileSass,      
  optimizeImages,  
  copyFiles,        
  zipFiles,         
  watchFiles        
);
