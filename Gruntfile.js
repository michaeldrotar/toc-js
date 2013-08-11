module.exports = function(grunt) {
	
	function watch(config, tasks) {
		var files = [],
			i, l, i2, l2, data, path;
		if ( config.files ) {
			for ( i = 0, l = config.files.length; i < l; i++ ) {
				data = config.files[i];
				if ( data.expand ) {
					path = "";
					if ( data.cwd ) {
						path += data.cwd;
						if ( path.lastIndexOf("/") != path.length - 1 ) {
							path += "/";
						}
					}
					if ( data.src ) {
						if ( typeof data.src === "string" ) {
							files.push(path + data.src);
						} else {
							for ( i2 = 0, l2 = data.src.length; i2 < l2; i2++ ) {
								files.push(path + data.src[i2]);
							}
						}
					}
				} else {
					for ( i2 in data ) {
						files.push(data[i2]);
					}
				}
			}
		}
		return {
			"files": files,
			"tasks": tasks
		};
	}
	
	var config = {};
	config.uglify = {
		"dist": {
			"options": {
				"sourceMap": "src/toc.js.map",
				"sourceMapPrefix": 1,
				"sourceMappingURL": "toc.js.map"
			},
			"files": [{
				"src/toc.min.js": "src/toc.js"
			}]
		}
	};
	config.watch = {
		"uglify": watch(config.uglify.dist, ["uglify"])
	};
	
	grunt.initConfig(config);
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask("default", ["uglify"]);
};