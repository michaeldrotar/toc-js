(function(window, document, undefined) {
	var toc;
	
	toc = function(method) {
		if ( typeof method === "string" && typeof toc[method] === "function" ) {
			return toc[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return toc.create.apply(this, arguments);
		}
	};
	
	toc.error = function() {
		if ( window.console && console.error ) {
			console.error.apply(console, arguments);
		}
	};
	
	toc.defaults = {
		"selector": "h1,h2,h3,h4,h5,h6,a[name]:not(.toc-anchor)"
	};
	
	toc.extend = window.jQuery && jQuery.extend || function() {
		var i, l, k, arg,
			target = arguments[0] || {};
		for ( i = 1, l = arguments.length; i < l; i++ ) {
			if ( (arg = arguments[i]) && typeof arg === "object" ) {
				for ( k in arg ) {
					if ( arg[k] !== undefined ) {
						target[k] = arg[k];
					}
				}
			}
		}
		return target;
	};
	
	
	toc.query = window.jQuery ?
		function(selector) {
			return jQuery(selector);
		} : document.querySelectorAll ?
		function(selector) {
			var elems = document.querySelectorAll(selector);
			var ret = Array.prototype.slice.call(elems, 0);
			return ret;
		} :
		null;
	
	toc.text = window.jQuery ?
		function(elem, value) {
			if ( arguments.length > 1 ) {
				$(elem).text(value);
			} else {
				return $(elem).text();
			}
		} :
		// use getText function from jQuery 1.10.2
		function(elem, value) {
			var node,
				ret = "",
				i = 0,
				nodeType = elem.nodeType;
			if ( arguments.length > 1 ) {
				while ( elem.firstChild ) {
					elem.removeChild(elem.firstChild);
				}
				elem.appendChild((elem.ownerDocument || document).createTextNode(value));
			} else {
				if ( !nodeType ) {
					for ( ; (node = elem[i]); i++ ) {
						ret += toc.text(node);
					}
				} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					if ( typeof elem.textContent === "string" ) {
						return elem.textContent;
					} else {
						for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
							ret += toc.text(elem);
						}
					}
				} else if ( nodeType === 3 || nodeType === 4 ) {
					return elem.nodeValue;
				}
				
				return ret;
			}
		}
	
	toc.trim = function(str) {
		return str.replace(/^\s+|\s+$/, "");
	}
	
	var levels = {
		"h1": 1,
		"h2": 2,
		"h3": 3,
		"h4": 4,
		"h5": 5,
		"h6": 6,
	}
	
	function isNameAvailable(name, target) {
		var users = toc.query("a[name='"+name+"']"),
			parent = target.parentNode,
			i, l;
		if ( !users.length ) {
			return true;
		}
		for ( i = 0, l = users.length; i < l; i++ ) {
			if ( users[i] === parent ) {
				return true;
			}
		}
		return false;
	}
	
	function createNameFromText(text) {
		return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^\-|\-$/g, "");
	}
	
	function createUniqueNameFromText(text, target) {
		var base = createNameFromText(text),
			num  = 1,
			name = base;
		while ( !isNameAvailable(name, target) ) {
			name = base + num;
			num++;
		}
		return name;
	}
	
	function wrapTarget(target, name) {
		var parent = target.parentNode,
			anchor;
		if ( parent.tagName.toLowerCase() !== "a" || parent.name !== name ) {
			anchor = document.createElement("a");
			anchor.name = name;
			anchor.className = "toc-anchor";
			parent.insertBefore(anchor, target);
			anchor.appendChild(target);
		}
	}
	
	function lowestLevel(targets) {
		var tag, level, lowestLevel,
			i,l;
		for ( i = 0, l = targets.length; i < l; i++ ) {
			tag = targets[i].tagName.toLowerCase();
			level = levels[tag];
			lowestLevel = lowestLevel ? Math.min(level, lowestLevel) : level;
		}
		return lowestLevel || 1;
	}
	
	function create(root, targets) {
		var lastLevel = lowestLevel(targets),
			lastNotLeveled = false,
			parent = root,
			target, i, l,
			tag, child, anchor, text, name, base, num;
		level = lastLevel;
		
		for ( i = 0, l = targets.length; i < l; i++ ) {
			target = targets[i];
			tag = target.tagName.toLowerCase();
			text = toc.trim(toc.text(target));
			
			if ( tag === "a" && target.name ) {
				if ( /\btoc-anchor\b/.test(target.className) ) {
					continue;
				}
				name = target.name;
			} else {
				name = createUniqueNameFromText(text, target);
				wrapTarget(target, name);
			}
			
			level = levels[tag];
			if ( !level ) {
				level = lastLevel + ( lastNotLeveled ? 0 : 1 );
				lastNotLeveled = true;
			} else {
				lastNotLeveled = false;
			}
			
			while ( level > lastLevel ) {
				child = child || document.createElement("li")
				if ( !child.parentNode ) {
					child.className = "skipped";
					parent.appendChild(child);
				}
				parent = document.createElement("ol");
				child.appendChild(parent);
				child = null;
				lastLevel++;
			}
			while ( level < lastLevel ) {
				parent = parent.parentNode.parentNode;
				lastLevel--;
			}
			
			child = document.createElement("li");
			child.className = tag;
			
			anchor = document.createElement("a");
			anchor.href = "#"+name;
			toc.text(anchor, text);
			
			child.appendChild(anchor);
			parent.appendChild(child);
		}
		
		return root;
	}
	
	toc.create = function(options) {
		if ( !toc.query ) {
			toc.error("toc-js requires jQuery or document.querySelectorAll or a custom toc.query function");
			return;
		}
		
		options = toc.extend({}, toc.defaults, options);
		
		var targets = toc.query(options.selector),
			root = document.createElement("ol");
		root.className = "toc";
		return create(root, targets);
	};
	
	window.toc = toc;
	
})(window, document);