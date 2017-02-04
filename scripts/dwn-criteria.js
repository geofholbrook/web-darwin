

var criterion_kinds = ['pitch', 'pitch-class', 'melodic-signed', 'melodic-abs', 'harmonic'];
var comparison_kinds = ['is equal to', 'is not equal to', 'is greater than', 'is less than', 'is one of'];

function offby_range (num, min, max) {
	return Math.max( min-num, num-max, 0);
}

function offby (num, value) {
	
	/// this doesn't work!
	
	if (Array.isArray(value)) {
		return value.indexOf(num) == -1 ? 1 : 0;
	}
	else if (value === Object(value)) {
		return offby_range (num, value.min, value.max)
	}
	else if ($.isNumeric(value)) {
		return Math.abs( num - value )
	}
	else console.log ("offby: bad value argument.");
}

function Criterion (kind, classed, signed, val, freq)
{
	this.kind = kind;
	this.classed = classed;
	this.signed = signed;
	this.val = val;
	this.freq = freq;

	/// for now the criterion acts on an array of numbers.
}

function blank_crit() {
	var dc = new Criterion("melodic", false, true, null, 1);
	return dc;
}

function default_crit() {
	var dc = new Criterion("pitch-class", true, true, [1,3,6,8,10], 1);
	return dc;
}

function eval_crit (ph, crit) {
	// hack version
	if (crit.val == null || typeof crit.val === "undefined") { return 0 } else
	{
		keys = [];

		for (i=0;i<ph.length;i++) {

			// console.log("eval_crit( [" + ph + "], crit)");

			switch (crit.kind) {
				case "pitch": 
					keys.push(ph[i]);
					break;
				case "pitch-class": 
					keys.push(ph[i] % 12);
					break;
				case "melodic-abs":
					if (i<ph.length-1) { keys.push( Math.abs( ph[i+1] - ph[i]) )}
					break;
				case "melodic-signed":
					if (i<ph.length-1) { keys.push( ph[i+1] - ph[i]) }
					break;
			}
		}

	    // console.log(keys);

		var result = keys.map( function(k) { return offby(k, crit.val);
											 } )
		.reduce( Gf.add ) / keys.length;

		return result;
	}	
}

// now some web-specific stuff :

function parse_value_str (str) {
	// either a single number, a range "a..b" or a set {3, 5, 8, 10}
	var result;

    // range
	if (str.indexOf('..') > -1) {    
		var arr = str.split('..').map(Number);
		if (arr.length == 2 && !arr.some(isNaN)) {
			result = {min:arr[0], max:arr[1]}
		}
	}

	// set
	else if (str.indexOf(',') > -1) {
		var arr = str.replace(/[^0-9-,]/gi, '').split(',').map(Number);
		if (!arr.some(isNaN)) { result = arr }
	}

    // single value
	else result = Number(str);

	// error check
	if (result == NaN) { return null } else { return result }
}

function format_value_str (value) {
	// console.log(value);

	if (value == null || typeof value === "undefined") { return null }
	
	else if (Array.isArray(value)) {
			return value.toString();
		} 
	else if (value === Object(value)) {
			return value.max.toString() + ".." + value.min.toString();
		}
			else return value.toString();
}

function update_from_data (elt) {
	var ref = elt.data("crit");

	elt.find(".kind").val(ref.kind);
	elt.find(".classed").prop("checked", ref.classed);
	elt.find(".signed").prop("checked", ref.signed);
	elt.find(".val").val(format_value_str(ref.val));
	elt.find(".freq").val(ref.freq * 100);
}

function update_to_data (elt) {
	var ref = elt.data("crit");

	ref.kind = elt.find(".kind").val();
	ref.classed = elt.find(".classed").prop("checked");
	ref.signed = elt.find(".signed").prop("checked");
	ref.val = parse_value_str( elt.find(".val").val() );
	ref.freq = elt.find(".freq").val() / 100;
}











