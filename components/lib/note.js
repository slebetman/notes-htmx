const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const db = require('../../lib/db');
const markdown = require('../../lib/markdown');

const view = component.get('/note/view/:id', async ({ session, id }) => {
	const user = session.user;

	const note = await db('notes').where({ user: user.id, id: id }).first();

	if (note) {
		return viewer.html(note);
	}
	else {
		return 'Not Found';
	}
})

function goto (...path) {
	return `
		hx-get="${path.join('/')}"
		hx-target="#content"
		hx-indicator="body"
	`
}

function gotoEditor (id) {
	return goto('/note/edit',id) + ' hx-trigger="dblclick"';
}

const viewer = component.get('/note/view', ({ id, title, color, content }) => {
	return html`
		<div id="note">
			<style>${style}</style>
			<div class="full-spinner"></div>
			<div class="input-group" $${gotoEditor(id)} title="Double click to edit">
				<h3>${title}</h3>
			</div>
			<div class="input-group" $${gotoEditor(id)} title="Double click to edit">
				<div id="body"
					style="background-color: ${color}"
				>$${markdown(content)}</div>
			</div>
			<div class="input-group">
				<button $${goto('/notelist')}>
					Back
				</button>
			</div>
		</div>
	`;
})

const edit = component.get('/note/edit/:id', async ({ session, id }) => {
	const user = session.user;

	const note = id === 'new' ?
		{ id } : await db('notes').where({ user: user.id, id: id }).first();

	if (note) {
		return editor.html(note);
	}
	else {
		return 'Not Found';
	}
})

const editor = component.get('/note/edit', ({ id, title, color, content }) => {
	return html`
		<div id="note">
			<style>${style}</style>
			<form hx-post="/note/edit/${id}">
				<div class="input-group">
					<input type="text" id="title"
						name="title"
						value="${title || ''}"
					/>
					<input type="text" id="color"
						name="color"
						value="${color || '#FFFFFF'}"
						class="color-picker"
						data-target="#body"
					/>
				</div>
				<div class="input-group">
					<textarea id="body" name="content"
						style="background-color: ${color || '#FFFFFF'}"
					>${content || ''}</textarea>
				</div>
				<div class="input-group">
					<button>
						Save
					</button>
					<button $${id === 'new' ?
						goto('/') : goto('/note/view',id)
					}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	`;
})

const save = component.post('/note/edit/:id', async ({ session, id, title, color, content }, hx) => {
	const user = session.user;

	if (id === 'new') {
		await db('notes').insert({
			user: user.id,
			title,
			color,
			content,
		})
	}
	else {
		await db('notes').where({ user: user.id, id }).update({
			title,
			color,
			content,
		})
	}

	await hx.redirect('/');
})

const style = css`
	#note .input-group {
		margin-bottom: 20px;
	}

	#note .input-group #title {
		width: calc(100% - 70px);
		display: inline;
	}

	#note .input-group #color {
		width: 50px;
		height: 28px;
		vertical-align: middle;
		border-radius: 3px;
	}

	#note .input-group h3 {
		padding: 0px 10px;
	}

	#note .input-group button {
		width: 150px;
		padding-left: 0;
		padding-right: 0;
		margin-left: 10px;
		float: right;
	}

	#note .input-group #body {
		width: calc(100% - 20px);
		height: calc(100vh - 260px);
		margin: 0;
		padding: 5px 10px;
		overflow: auto;
	}

	#note .input-group textarea#body {
		font-family: monospace;
		font-size: 10pt;
	}

	#note .input-group #body img {
		max-height: 60vh;
	}

	#note .input-group #body img[alt$="small"] {
		max-height: 25vh;
		max-width: 200px;
	}
	@media (max-device-width: 1024px) {
		#note .input-group #body {
			font-size: 16px;
			height: calc(100vh - 310px);
		}
	
		#note .input-group button {
			width: 120px;
		}
	}
`;

module.exports = {
	view,
	viewer,
	edit,
	editor,
	save,
}