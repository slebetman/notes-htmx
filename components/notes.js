const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const noteList = require('./lib/notelist');
const login = require('./lib/login');

const main = component.get('/', async ({ session }, hx) => {
	const user = session.user;
	let logout = '';
	
	hx.set('HX-Refresh', 'true');

	if (user) {
		logout = html`<a href="/logout" class="logout-btn">
			<style>${logoutStyle}</style>
			<span class="material-icons-outlined">
				logout
			</span>
			logout
		</a>`;
	}

	return html`
	<style>${style}</style>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />

	<div id="header">
		<h1 id="title">
			<a href="/" style="text-decoration:none; color:black">
				<span class="material-icons-outlined" style=font-size: 1.4em; vertical-align:bottom">
					sticky_note_2
				</span>
				NOTES
			</a>
		</h1>
		<span id="username">${user ? user.name : ''}</span>
		<div id="logout">$${logout}</div>
	</div>

	<div id="content">
		$${user ? await noteList.notelist.html({ session }) : login.get.html({ session })}
	</div>
	`;
});



const logout = component.get('/logout', async ({ session }, { redirect }) => {
	delete session.user;
	await redirect('/');
});

const style = css`
	#header h1#title {
		font-size: 36px;
		margin-bottom: 0;
	}

	#username {
		padding: 0;
		margin: 0;
		margin-left: 32px;
		font-size: 14px;
	}
`

const logoutStyle = css`
	#logout {
		position: absolute;
		right: 10px;
		top: 10px;
	}

	.logout-btn {
		text-decoration: underline;
		color: black;
	}

	.logout-btn .material-icons-outlined {
		vertical-align: middle;
		font-size: 18px;
	}
`;

module.exports = {
	main,
	logout,
};
