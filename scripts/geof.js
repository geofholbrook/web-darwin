// geof.js
// uses jquery

Gf = {

	// deep copy
	copy: function (obj) {
		var newobj = {};
		jQuery.extend( true, newobj, obj );
		return newobj;
	},

	rrnd: function (min, max) {
		return Math.floor (Math.random() * (max - min + 1)) + min;
	},

	// addition function that can be used by reduce, map, etc.
	add: function (a,b) { return a+b }
}