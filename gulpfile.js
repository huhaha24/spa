var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var less = require('gulp-less');
var concat = require('gulp-concat');
var _  = require('lodash');
const BASE = './';
 
 
 
const StaticFiles = [
  { from: './node_modules/react/umd/react.production.min.js',to:'js',name:'react.min.js'},
  { from: './node_modules/react-dom/umd/react-dom.production.min.js',to:'js',name:'react-dom.min.js'},
  { from: './node_modules/three/build/three.min.js', to: 'js',name:'three.min.js' },
  { from: './node_modules/jquery/dist/jquery.min.js', to: 'js',name:'jquery.min.js' },
  { from: './node_modules/lodash/lodash.min.js', to: 'js',name:'lodash.min.js'  },
  { from: './node_modules/d3/build/d3.min.js', to: 'js',name:'d3.min.js'  },
  { from: './node_modules/nprogress/nprogress.js', to: 'js',name:'nprogress.js'  },
  { from: './node_modules/redux/dist/redux.min.js', to: 'js',name:'redux.min.js'  },
  { from: './node_modules/moment/min/moment.min.js', to: 'js',name:'moment.min.js'  },
  { from: './node_modules/moment/locale/zh-cn.js', to: 'js',name:'moment-zh-cn.js'  },
  { from: './node_modules/antd/dist/antd-with-locales.min.js', to: 'js',name:'antd.min.js'  },
  { from: './node_modules/echarts/dist/echarts.min.js', to: 'js',name:'echarts.min.js'  },
];
 

const DISPLAY= [
    'react.min.js',
    'react-dom.min.js',
    'nprogress.js',
    'lodash.min.js',
    'moment.min.js',
    'moment-zh-cn.js',
    'antd.min.js',
    'd3.min.js',
    'echarts.min.js',
];
const SCREEN= [
    'react.min.js',
    'react-dom.min.js',
    'nprogress.js',
    'lodash.min.js',
    'moment.min.js',
    'moment-zh-cn.js',
    'antd.min.js',
    'jquery.min.js',
    'echarts.min.js',
    'd3.min.js',
    'three.min.js',
]
 

// 库文件
gulp.task('statics', function () {
  return new Promise(resolve => {
    StaticFiles.map(item => {
        gulp.src(item.from).pipe(rename(item.name)).pipe(gulp.dest(BASE + item.to))
    });
    setTimeout(() => {
      resolve();
    }, 1500);
  });
});
 
 
gulp.task('merge',[ 'statics'],function(){
  console.log('merge start');
  let [display,screens] = [[],[]];
  DISPLAY.map(js=>display.push(BASE + 'js/'+js));
  SCREEN.map(js=>screens.push(BASE + 'js/'+js));
  gulp.src(display).pipe(concat('references.display.js')).pipe(gulp.dest(BASE +'js'));
  gulp.src(screens).pipe(concat('references.screen.js')).pipe(gulp.dest(BASE +'js'));
});
 

 
gulp.task('less-watch', function () {
  gulp.watch(['./less/theme-default.less', './less/theme-blue.less', './less/theme-screen.less'])
    .on('change', function (evt) {
      gulp.src(evt.path).pipe(less()).pipe(gulp.dest('./css'));
    });
});
 

 

gulp.task('default',['merge']);