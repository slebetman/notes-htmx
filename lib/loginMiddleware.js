const express = require('express');

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function loginMiddleware (req, res, next) {
	if (!req.session.user && req.path !== '/login') {
		console.log('Redirect to login!');
		res.redirect('/login');
		return;
	}
	next();
}

module.exports = loginMiddleware;