const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const { sticky } = require('./sticky');
const db = require('../../lib/db');

const notelist = component.use('/notelist', async ({ session, q }) => {
	const user = session.user;
	let query = db('notes')
		.where({ user: user.id })
		.orderByRaw('`index` nulls last , `id`');

	if (q) {
		query = query.andWhere(function () {
			this.where('content', 'like', `%${q}%`)
				.orWhere('title', 'like', `%${q}%`)
		});
	}

	const list = await query;

	return html`
	<div id="note-list" hx-ext="morphdom-swap">
		<style>${style}</style>
		<button id="create" hx-get="/note/edit/new" hx-target="#content">
			<span class="material-icons-outlined">
				note_add
			</span>
			New Note
		</button>
		<div id="search">
			<input type="text" name="q" id="q"
				placeholder="Search"
				hx-get="/notelist"
				hx-trigger="keyup changed delay:200ms, search" 
       			hx-target="closest #note-list"
				hx-swap="morphdom"
				value="${q}"
			>
		</div>
		<form class="sortable" hx-post="/sort"
			hx-trigger="end"
			hx-target="#note-list"
			hx-swap="outerHTML"
		>
			$${list.map((note) => sticky.html(note)).join('')}
		</form>
	</div>
	`;
});

const sort = component.post('/sort', async ({ session, notes }, hx) => {
	const user = session.user;
	const queries = notes.map((id, index) => db('notes').where({
		id,
		user: user.id
	}).update({
		index
	}))

	await Promise.all(queries);

	return notelist.html({ session });
})

const style = css`
	#note-list .stickies {
		width: 190px;
		height: 220px;
		float: left;
		border: 1px solid #aaaaaa;
		overflow: hidden;
		margin: 10px;
		box-shadow: 3px 6px 8px #aaa;
		background: linear-gradient(
			170deg,
			#00000040 0%,
			#00000000 21%,
			#00000000 80%,
			#FFFFFF50 95%,
			#FFFFFF80 100%
		);
	}

	#note-list .stickies .body {
		padding: 10px;
		cursor: default;
		height: calc(100% - 20px);
	}

	#note-list .stickies .body .content {
		width: 170px;
		font-size: 10pt;
	}

	#note-list .stickies .body .content img {
		max-width: 100%;
		max-height: 200px;
		height: auto;
	}

	#note-list .stickies h3 {
		margin: 0;
		padding: 0;
		cursor: default;
	}

	#note-list button#create {
		margin-bottom: 20px;
		padding: 5px;
	}

	#note-list .delete-btn {
		float: right;
		margin: 1px 5px;
		font-size: 20px;
		cursor: pointer;
	}

	.stickies pre code {
		font-size: 12px;
		overflow: hidden;
	}

	.stickies ul {
		padding-left: 20px;
	}

	#search {
		position: absolute;
		top: 16px;
		left: 200px;
	}

	#search input {
		padding: 8px 16px;
		border-radius: 12px;
		border: 1px solid #ccc;
		width: calc( 100vw - 320px );
	}

	@media (max-device-width: 1024px) {
		#note-list .stickies {
			width: calc(50% - 12px);
			max-width: 190px;
			height: 220px;
			margin: 5px;
		}
	}
`;

module.exports = {
	notelist,
	sort,
}