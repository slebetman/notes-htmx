#! /usr/bin/env node

const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const compress = require('express-compress').compress;
const components = require('express-htmx-components');
const conf = require('./lib/config');
const requestLogger = require('./lib/request-logger');

const app = express();

const COMPONENTS_DIR = path.join(path.resolve(__dirname), 'components');

app.disable('x-powered-by');
app.enable('trust proxy');

app.use(
	session({
		secret: 'xxx',
		resave: true,
		saveUninitialized: true,
		store: new FileStore({
			path: './sessions',
		}),
		cookie: {
			secure: false,
			httpOnly: true,
		},
	})
);

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(compress({ contentType: /html|js|css/ }));

app.use(requestLogger);

app.use(loginMiddleware);

components.init(app, COMPONENTS_DIR, {
	css : [
		"https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
		"/static/notes.css",
	],
	js : [
		"https://unpkg.com/sortablejs@1.15.0/Sortable.min.js",
		"https://unpkg.com/htmx.org/dist/ext/remove-me.js",
		"https://unpkg.com/htmx.org/dist/ext/morphdom-swap.js",
		"/static/color-picker.js",
		"/static/sort.js",
	],
	favicon : '/static/logo24.png'
}).then(() => {
	app.use((req, res) => {
		console.log('404: Not Found');
		res.status(404);
		res.send('404: Not Found.');
	})

	app.listen(conf.port, () => console.log(`Server started, listening on ${conf.port} ..`));
});
