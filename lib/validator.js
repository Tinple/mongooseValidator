/**
 * Validators for Mongoose.js
 */
var fs = require('fs')
  , msg = require('./validation_lang');

module.exports = function () {
	var alpha = /^[a-zA-Z]+$/
	  , numeric = /^[0-9]+$/
	  , alphaNumeric = /^[0-9a-zA-Z]+$/
	  , hexadecimal = /^[0-9a-fA-F]+$/
	  , hexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/
	  , email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
	  , ipv4 = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/
	  , ipv6 = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/
	  , int = /^(?:-?(?:0|[1-9][0-9]*))$/
	  , float = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
	  , url = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
	  , base64 = /[^a-zA-Z0-9\/\+=]/i
	  , ruleRegex = /^(.+?)\[(.+)\]$/;
	
	var Validator = function () {
		this.custom = [];
		this.errorMsg = msg;
	}

	/**
	 * _hooks contain some functions for Mongoose's validate and set.
	 * @type {Object}
	 */
	Validator.prototype._hooks = {
		alpha: function (val) {
			return alpha.test(val);
		},
		numeric: function (val) {
			return numeric.test(val);
		},
		alphaNumeric: function (val) {
			return alphaNumeric.test(val);
		},
		hexadecimal: function (val) {
			return hexadecimal.test(val);
		},
		hexColor: function (val) {
			return hexColor.test(val);
		},
		int: function (val) {
			return int.test(val);
		},
		float: function (val) {
			return float.test(val);
		},
		base64: function (val) {
			return base64.test(val);
		},
		url: function (val) {
			return url.test(val)
		},
		ipv4: function (val) {
			return ipv4.test(Val);
		},
		ipv6: function (val) {
			return ipv6.test(val);
		},
		email: function (val) {
			return email.test(val);
		}, 
		JSON: function (val) {
			try {
				JSON.parse(val);
			} catch (e) {
				if (e instanceof SyntaxError) {
					return false;
				}
			}
			return false;
		},
		escape: function (val) {
			return (val.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'));
		},
		trim: function (val) {
        	return val.replace(/^\s+|\s+$/g, '');
		},
		rtrim: function (val) {
			return val.replace(/\s+$/g, '');
		},
		ltrim: function (val) {
			return val.replace(/^\s+/g, '');
		}
	}

	/**
	 * v returns some useful validate function
	 * @param  {String} rules rules for validate
	 * @return Function or Array
	 */
	Validator.prototype.v = function (rules) {
	
		if (typeof rules === 'undefined' || rules === '') {
			return function () {};
		}

		var rules = rules.split('|');
		this.custom = [];
		for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
			var method = rules[i];

			if (typeof this._hooks[method] === 'function') {
				this.custom.push({ 
					validator: this._hooks[method], 
					msg: this.errorMsg[method] || null
				});
			} 
		}
		return this.custom;
		
	}

	/**
	 * s adds some useful function to setters
	 * @param  {String} rules 
	 * @return {Function}       
	 */
	Validator.prototype.s = function (rules) {
		if (typeof rules === 'undefined' || rules === '') {
			return function () {};
		}

		var rules = rules.split('|');
		for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
			var method = rules[i]
			  , param = null
			  , parts = ruleRegex.exec(method)
			
			if (parts) {
				method = parts[1];
				param = parts[2];
			}

			if (typeof this._hooks[method] === 'function') {
				return this._hooks[method];
			} 
		}
	}

	return new Validator();

}