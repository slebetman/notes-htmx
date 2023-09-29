const markdownit = require('markdown-it');

const md = markdownit({
	linkify: true
});

module.exports = (x) => md.render(x);
