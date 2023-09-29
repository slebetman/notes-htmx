/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
	const end = res.end;

	res.end = function (...args) {
		if (!res.logged) {
			res.logged = true;
			console.log(`${res.statusCode} ${req.method} ${req.path}`, { ...req.query, ...req.body });
		}
		end.apply(res,args);
	}
	next();
};
