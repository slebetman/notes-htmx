#! /usr/bin/env node

const bcrypt = require('bcryptjs');

const input = process.argv[2];

bcrypt.hash(input, 8, function(err, hash) {
	if (err) {
		console.error(err);
	}
	else {
		console.log(hash);
	}
});
