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

function offby_range (num, min, max) {
	return Math.max( min-num, num-max, 0);
}

function offby (num, value) {
	
	/// this doesn't work!
	
	if (Array.isArray(value)) {
		value.indexOf(num) == -1 ? 1 : 0;
	}
	else if (value === Object(value)) {
		offby_range (num, value.min, value.max)
	}
	else if (isNumber(value)) {
		Math.abs( num - value )
	}
	else error ("offby: bad value argument.");
}

function Criterion (kind, classed, use_signed, val, freq)
{
	this.kind = kind;
	this.classed = classed;
	this.signed = signed;
	this.val = val;
	this.freq = freq;

	/// for now the criterion acts on an array of numbers.
}

function default_crit() {
	var dc = new Criterion("melodic", false, true, null, 1);
	return dc;
}

function eval_crit (pheno, crit) {
}

// i'm going to start putting the web-specific stuff in here

function update_from_data (elt) {
	var ref = elt.data("crit");

	elt.find("#kind").val(ref.kind);
	elt.find("#classed").prop("checked", ref.classed);
	elt.find("#signed").prop("checked", ref.signed);
	elt.find("#val").val(ref.val);
	elt.find("#freq").val(ref.freq * 100);

}












