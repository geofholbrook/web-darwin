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
	this.fitness = -1;
	// -1 is a placeholder (not evaluated yet)
	// lower fitness value means better specimen
	// 0 means perfect
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

Specimen.prototype.evaluate = function() {
	fit = 0;
	nucl = this.nucl;

	for (i in nucl) {
		if ([1,3,6,8,10].indexOf(this.nucl[i] % 12) == -1)
			{ fit += 0.1; }
	}

	this.fitness = fit;
	return fit;
	}

function Population (capacity, fecundity, model) {
	this.capacity = capacity;
	this.fecundity = fecundity;
	this.model = model;

	this.specimens = [];

	for (k=0;k<capacity;k++) {
		this.specimens.push( 
			new Specimen( model.len, model.range ) )
	}
}

Population.prototype.iterate = function() {

}






