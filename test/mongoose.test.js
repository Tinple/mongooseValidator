var mongoose = require('mongoose')
  , should = require('should')
  , v = require('../lib/validator')()
  , Schema = mongoose.Schema;

describe('Mongoose validator', function () {
	var doc
	  , Email
	  , passEmail
	  , failEmail
	  , schema;

	before(function (done) {
		var url = 'mongodb://localhost/mongoose_validator_test'
		  , date = Date.now();

		mongoose.connect(url);

		schema = new Schema({
			email: { type: String, set: v.s('rtrim'), validate: v.v('email') }
		});

		Email = mongoose.model('Email', schema);

		done();
	});

	after(function (done) {
		mongoose.connection.db.dropDatabase();
		done();
	});  

	it('Should pass a validator', function (done) {
		passEmail = new Email({ email: 'htinple@gmail.com    ' });
		passEmail.save(function (err, doc) {
			should.not.exist(err);
			should.exist(doc);
			doc.should.have.property('email', 'htinple@gmail.com');
			return done();
		});
	});

	it('Should fail a validator', function (done) {
		failEmail = new Email({ email: '<qqq@@qqq.com>' });
		failEmail.save(function (err, doc) {
			should.exist(err);
			should.not.exist(doc);
			err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
			err.errors.email.should.have.property('path', 'email');
			err.errors.email.type.should.equal('user defined');
			return done();
		});
	});

});

