mongooseValidator
=================

  Useful validators for mongoose.

## Installation

```
$ npm install mongoose_validator
```

## mongooseValidator

  ```mongooseValidator``` simply returns Mongoose style validation and add a setter to
  schemaType.

## Usage

```
var mongoose = require('mongoose')
  , v = require('../lib/validator')()
  , Schema = mongoose.Schema;

var schema = new Schema({
	email: { type: String, set: v.s('rtrim'), validate: v.v('email') }
});
```

As you see, you can simply invoke ```v('email')``` to validate whether email is valid,
and invoke ```s('rtrim')``` to ```rtrim``` your data.

## Validate Support

* alpha
* numeric
* alphaNumeric
* hexadecimal
* hexColor
* int
* float
* base64
* url
* ipv4
* ipv6
* email
* JSON

## Setter Support

* trim
* rtrim
* ltrim
* escape

## TODO

* Add custom validators
* Support more useful validators and setters

## License