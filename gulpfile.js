var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean-css'),
    server = require('gulp-webserver'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');

// sass 
gulp.task('sass', ()=>{
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

// minCss  
gulp.task('minCss', ()=>{
    return gulp.src('./src/css/**/*.css')
        .pipe(clean())
        .pipe(gulp.dest('./dist/css'))
})

//uglify 
gulp.task('uglify', function(){
    return gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/js'))
})

//buildjs  
gulp.task('buildjs', ()=>{
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./dist/js'))
})

//devserver 
gulp.task('devServer', ()=>{
    return servering('src')
})

gulp.task('buildServer', ()=>{
    return servering('dist')
})

function servering(serverPath){
    return gulp.src(serverPath)
        .pipe(server({
            port: 8000,
            livereload: true,
            middleware: function(req, res, next){
                var pathname = url.parse(req.url).pathname;

                if(pathname == '/favicon.ico'){
                    return res.end()
                }

                pathname = pathname == "/" ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, serverPath, pathname)))
            }
        }))
}

// watch  
gulp.task('watch', ()=>{
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/js/*.js', gulp.series('uglify'))
})

// 开发环境
gulp.task('default', gulp.series('sass', 'uglify', 'devServer', 'watch'))

// 线上环境
gulp.task('build', gulp.series('minCss', 'buildjs','buildServer'))


