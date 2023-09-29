(()=>{
	const pallete = [
		['#FFFFFF', '#FFFF66', '#FFCC66', '#FF6666', '#FF66FF', '#CC66FF'],
		['#CCCCCC', '#FFFF00', '#FFAA00', '#FF3333', '#FF00FF', '#AA00FF'],
		['#66CCFF', '#99FFFF', '#66FFCC', '#66FF66', '#8888FF', '#8888CC'],
		['#00AAFF', '#33FFFF', '#00FFAA', '#00FF33', '#6666FF', '#7777AA'],
	];

	function css (el, styles) {
		for (let s in styles) {
			el.style[s] = styles[s];
		}
	}

	function make (x) {
		return document.createElement(x);
	}

	function on (el, event, fn) {
		el.addEventListener(event,fn);
	}

	function colorPicker (el, selector) {
		const elements = Array.from(el.querySelectorAll(selector));
		
		elements.forEach(x => {
			css(x,{
				backgroundColor: x.value,
				color: 'transparent',
				fontSize: '0',
				cursor: 'pointer',
			});
			
			const dropDown = make('div');
			
			css(dropDown,{
				position: 'absolute',
				backgroundColor: 'white',
				border: '1px solid #666',
				top: x.offsetTop + x.offsetHeight + 'px',
				left: x.offsetLeft + x.offsetWidth - (24 * 6) + 'px',
				boxShadow: '#00000066 5px 5px 10px',
				display: 'none',
			});
			
			pallete.forEach(y => {
				const row = make('div');
			
				y.forEach(col => {
					const cell = make('div');
					
					css(cell,{
						width: '20px',
						height: '20px',
						backgroundColor: col,
						display: 'inline-block',
						margin: '2px',
					});
					
					cell.onclick = (e) => {
						x.value = col;
						css(x,{backgroundColor:col});
						
						console.log(x.dataset);
						
						if (x.dataset.target) {
							css(document.querySelector(x.dataset.target),{
								backgroundColor:col
							});
						}
					}
					
					row.appendChild(cell);
				});
				
				dropDown.appendChild(row);
			});
			
			document.body.appendChild(dropDown);
			
			on(x,'click',(e) => {
				e.stopPropagation();
				e.preventDefault();
				css(dropDown,{display:'block'});
			});
			
			on(dropDown,'click', (e) => {
				css(dropDown,{display:'none'});
			});
			
			on(document.body,'click', (e) => {
				css(dropDown,{display:'none'});
			});
		});
	}

	htmx.onLoad(content => colorPicker(content, '.color-picker'));
})()
