// js-darwin.js

// uses geof.js

//! like % but the output range doesn't necessarily start at 0
function range_modulo (num, range) {
	var min = range[0];
	var max = range[1];

	return (num - min) % (max-min+1) + min;
}

function choose_other (num, range) {
	var min = range[0];
	var max = range[1];

	return range_modulo (num + Gf.rrnd(1, (max-min)), range);	
}

// a specimen is always represented by a list of integers
// for this Object it's in .nucl
function Specimen (len, range) {

	this.range = range;
	this.len = len;

	this.nucl = [];
	this.randomize();

	this.fitness = -1;
	// -1 is a placeholder (not evaluated yet)
	// lower fitness value means better specimen
	// 0 means perfect

	// links to containers
	this.population = null;
	this.engine = null;
}

Specimen.prototype.mutate = function() {
	var spot = Gf.rrnd(0, this.len - 1);
	// var delta = Gf.rrnd(0,1) * 2 - 1;

	this.nucl[spot] = choose_other(this.nucl[spot], this.range);

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

	//console.log( "evaluate()" );

	var spec = this; // because jQuery (?!)

	if (spec.engine) {
		spec.fitness = 
		//console.log(
		spec.engine.criteria
		.map( function (c) { return eval_crit (spec.nucl, c) } )
		.reduce( Gf.add ) 
		// )
	}
	
	else
		{ spec.fitness = -1; }
	
	return spec;
}


function Population (capacity, litter_size, model) {
	this.capacity = capacity;  // initial size
	this.litter_size = litter_size;   // offspring per specimen
	this.model = model; // example specimen

	this.specimens = [];
	this.randomize();

	this.engine = null;  // link to container
}

Population.prototype.randomize = function() {
	this.specimens = [];

	for (k=0;k<this.capacity;k++) {
		this.specimens.push( 
			new Specimen( this.model.len, this.model.range ) )
	}

	// the following doesn't work, because 'this' returns the window object.
	// this.specimens.map( function(spec) { spec.population = this } );
}

Population.prototype.best = function() {
	// assumes population is always kept sorted
	return this.specimens[0];
}



function Engine (population) {
	this.population = population;

	this.criteria = [];

	this.generation = 0;
}

// execute one generation
Engine.prototype.iterate = function() {

    // console.log("iterate()");

	var new_copies = [];

	for (i in this.population.specimens) {
		var spec = this.population.specimens[i];

		spec.evaluate();  // could be unnecessary

		for (k=0;k<this.population.litter_size;k++) {
		
			// copy, mutate, evaluate and add new specimen
			new_copies.push( Gf.copy(spec).mutate().evaluate() );
		}
	}

	this.population.specimens = this.population.specimens.concat(new_copies);
	this.population.specimens = this.population.specimens.sort(function(a,b) { return a.fitness - b.fitness } );
	this.population.specimens.splice( this.population.capacity );

	this.generation++;

	return this.population.best(); // most fit specimen
}


function link_GA_objects (eng) {

// so that individuals can reference the containing engine and population.
// not done from inside constructors because jQuery causes "this" to
// represent the window object.

	eng.population.engine = eng;

	for (i in eng.population.specimens) {
		eng.population.specimens[i].population = eng.population;
		eng.population.specimens[i].engine = eng;
	}

}






