var fs = require('fs')
//  , msg = require('./validation_lang');


function a () {
	var alpha = /^[a-zA-Z]+$/
	  , numeric = /^[0-9]+$/
	  , alphaNumeric = /^[0-9a-zA-Z]+$/
	  , hexaDecimal = /^[0-9a-fA-F]+$/
	  , hexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/
	  , email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
	  , ipv4 = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/
	  , ipv6 = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/
	  , intReg = /^(?:-?(?:0|[1-9][0-9]*))$/
	  , floatReg = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
	  , url = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
	  , base64Regex = /[^a-zA-Z0-9\/\+=]/i
	  , ruleRegex = /^(.+?)\[(.+)\]$/;
	
	var Validator = function () {
		this.custom = [];
		this.rules = {};
	}

	Validator.prototype._hooks = {
		email: function (val) {
			return email.test(val);
		},
		trim: function (val, chars) {

		}
	}

	Validator.prototype.v = function (rules) {
		if (typeof rules === 'undefined' || rules === '') {
			return this.rules;
		}

		var rules = rules.split('|');

		for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
			var method = rules[i]
			  , param = null
			  , failed = false
			  , parts = ruleRegex.exec(method)

			if (parts) {
				method = parts[1];
				param = parts[2];
			}

			if (typeof this._hooks[method] === 'function') {
				this.custom.push({ 
					validator: this._hooks[method], 
					msg: 'msg'
				})
			} 
		}
		return this.custom;
		
	}

	return new Validator();

}

module.exports = a();