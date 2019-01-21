const sass = require('node-sass');


// --- Browserify setup

let bsfTransform = [
	['babelify', {
		presets: 'es2015'
	}],
	['vueify']
];



module.exports = function (grunt) {
	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
				sourcemap: true
			},
			dist: {
				files: {
					'css/files_mediaviewer.css': 'src/styles/default.scss'
				}
			}
		},

		browserify: {
			dev: {
				files: {
					'js/files_mediaviewer.js': 'src/scripts/default.js'
				},
				options: {
					transform: bsfTransform,
					alias : {
						'vue' : 'vue/dist/vue.js'
					},
					browserifyOptions: {
						debug: true
					}
				}
			},
			
			devInit: {
				files: {
					'js/files_mediaviewer_init.js': 'src/scripts/init.js',
				},
				options: {
					transform: bsfTransform
				}
			},

			build: {
				files: {
					'js/files_mediaviewer.js': 'src/scripts/default.js',
				},
				options: {
					transform: bsfTransform,
					alias : {
						'vue-router' : 'vue-router/dist/vue-router.min.js',
						'vue' : 'vue/dist/vue.min.js',
						'swiper' : 'swiper/dist/js/swiper.min.js'
					}
				}
			},

			buildInit: {
				files: {
					'js/files_mediaviewer_init.js': 'src/scripts/init.js',
				},
				options: {
					transform: bsfTransform,
				}
			}
		},

		watch: {
			default: {
				options: {
					spawn: false
				},
				files: [
					'src/**/*.js',
					'src/**/*.scss',
					'src/**/*.vue'
				],
				tasks: [
					'force:on',
					'sass',
					'browserify',
					'force:off'
				]
			}
		}
	}); //initConfig
	//
	grunt.loadNpmTasks('grunt-force');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', [
		'sass',
		'browserify:build',
		'browserify:buildInit'
	]);

	grunt.registerTask('watcher', [
		'sass',
		'browserify:dev',
		'browserify:devInit',
		'watch'
	]);
};