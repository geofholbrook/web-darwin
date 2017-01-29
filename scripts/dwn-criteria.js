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
	
	if (isObject(value)) {
		offby_range (num, value.min, value.max)
	}
	else if (isArray(value)) {
		value.indexOf(num) == -1 ? 1 : 0;
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

function eval_crit (pheno, crit) {

}


