// js-darwin.js

// uses geof.js

function range_modulo (num, range) {
	var min = range[0];
	var max = range[1];

	return (num - min) % (max-min+1) + min;
}

function Specimen (len, range) {

	this.range = range;
	this.len = len;

	this.nucl = [];
	this.randomize();

	this.fitness = -1;
	// -1 is a placeholder (not evaluated yet)
	// lower fitness value means better specimen
	// 0 means perfect

	this.population = null;
	this.engine = null;
}

Specimen.prototype.mutate = function() {
	var spot = Gf.rrnd(0, this.len - 1);
	var delta = Gf.rrnd(0,1) * 2 - 1;

	this.nucl[spot] = range_modulo(this.nucl[spot] + delta, this.range);

	return this;
}

Specimen.prototype.randomize = function() {

	this.nucl=[];

	for (i=0; i<this.len; i++) {
		this.nucl.push( Gf.rrnd (this.range[0], this.range[1]));
	}

	this.evaluate();
}

Specimen.prototype.evaluate = function() {

	var x = this.nucl; 
	if (this.engine) {
		this.fitness = this.engine.eval_func(x);
	}
	else
		{ this.fitness = -1; }
	
	return this;
}

function Population (capacity, litter_size, model) {
	this.capacity = capacity;
	this.litter_size = litter_size;
	this.model = model;

	this.specimens = [];
	this.randomize();
	this.engine = null;
}

Population.prototype.randomize = function() {
	this.specimens = [];

	for (k=0;k<this.capacity;k++) {
		this.specimens.push( 
			new Specimen( this.model.len, this.model.range ) )
	}

	// doesn't work, because 'this' returns the window object.
	// this.specimens.map( function(spec) { spec.population = this } );
}

Population.prototype.best = function() {
	// assumes population is always kept sorted
	return this.specimens[0];
}



function Engine (population) {
	this.population = population;

	this.eval_func = function (x) {

			fit = 0;

			for (i in x) {
				if ([1,3,6,8,10].indexOf(x[i] % 12) == -1)
					{ fit += 0.1; }
			}
			return fit;
	}

	this.generation = 0;
}

Engine.prototype.iterate = function() {

	console.log("iterating.");

	var new_copies = [];

	for (i in this.population.specimens) {
		var spec = this.population.specimens[i];

		for (k=0;k<this.population.litter_size;k++) {
		
			// copy, mutate, evaluate and add new specimen
			new_copies.push( Gf.copy(spec).mutate().evaluate() );
		}
	}

	this.population.specimens = this.population.specimens.concat(new_copies);
	this.population.specimens = this.population.specimens.sort(function(a,b) { return a.fitness - b.fitness } );
	this.population.specimens.splice( this.population.capacity );


	return this.population.best(); // most fit specimen
}

function link_GA_objects (eng) {

	eng.population.engine = eng;

	for (i in eng.population.specimens) {
		eng.population.specimens[i].population = eng.population;
		eng.population.specimens[i].engine = eng;
	}

}






