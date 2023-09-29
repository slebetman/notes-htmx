const component = require('express-htmx-components');
const { html } = require('express-htmx-components/tags');
const db = require('../../lib/db');
const markdown = require('../../lib/markdown');

const sticky = component.get('/notes/sticky',({ id, color, title, content }) => {
	return html`
	<div id="note-${id}" class="stickies"
		style="background-color:${color}"
		hx-get="/note/view/${id}"
		hx-target="#content"
		hx-trigger="dblclick"
		hx-swap="innerHtml"
		title="Double click to view"
	>
		<input type="hidden" name="notes" value="${id}">
		<div class="delete-btn"
			hx-delete="/notes/sticky/${id}"
			hx-target="#note-${id}"
			hx-swap="none"
			hx-confirm="Delete this note?"
		>
			×
		</div>
		<div class="body">
			<h3>${title}</h3>
			<div class="content">
				$${markdown(content)}
			</div>
		</div>
	</div>
	`
})

const del = component.delete('/notes/sticky/:id',async ({ session, id }, hx) => {
	const user = session.user;
	await db('notes').where({ user: user.id, id }).delete();

	hx.set('HX-Reswap', 'delete');

	return '';
})

module.exports = {
	sticky,
	del,
}