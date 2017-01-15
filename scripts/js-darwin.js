// js-darwin.js

function rrnd (min, max) {
	return Math.floor (Math.random() * (max - min + 1)) + min;
}

function range_modulo (num, range) {
	var min = range[0];
	var max = range[1];

	return (num - min) % (max-min+1) + min;
}

function Specimen (len, range) {

	this.range = range;
	this.len = len;

	this.nucl = [];
}

Specimen.prototype.mutate = function() {
	var spot = rrnd(0, this.len - 1);
	var delta = rrnd(0,1) * 2 - 1;

	this.nucl[spot] = range_modulo(this.nucl[spot] + delta, this.range);
}

Specimen.prototype.randomize = function() {

	this.nucl=[];

	for (i=0; i<this.len; i++) {
		this.nucl.push( rrnd (this.range[0], this.range[1]));
	}

}
