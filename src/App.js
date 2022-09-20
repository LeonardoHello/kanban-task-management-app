import { useState, useEffect } from 'react';
import logo from './assets/logo-mobile.svg';
import arrowDown from './assets/icon-chevron-down.svg';
import plus from './assets/icon-add-task-mobile.svg';
import ellipsis from './assets/icon-vertical-ellipsis.svg';
import { db, onSnapshot, collection } from "./firebase";

function App() {
	const [rootWidth, setRootWidth] = useState();
	const [darkMode, setDarkMode] = useState(true);
	const [boards, setBoards] = useState([]);

	useEffect(() => {
		console.log(boards);
	}, [boards])

	useEffect(() => onSnapshot(collection(db, "boards"), querySnapshot => setBoards(querySnapshot.docs.map(elem => elem.data()))), [darkMode])

	useEffect(() => {
		const observer = new ResizeObserver(entries => setRootWidth(entries[0].contentRect.width));
		observer.observe(document.getElementById('root'));
		return () => observer.disconnect();
	}, [rootWidth]);

	return (
		<div id='app' className={darkMode ? 'dark' : 'light'}>
			<header>
				<div id='header-left-side'>
					<img src={logo} alt="logo" onClick={() => setDarkMode(prev => !prev)} />
					<div>
						<h1>Roadmap</h1>
						<img id="arrow-down" src={arrowDown} alt="arrow down" />
					</div>
				</div>
				<div id='header-right-side'>
					<img id='plus' src={plus} alt="add" />
					<img id='ellipsis' src={ellipsis} alt="add" />
				</div>
			</header>
			<main>
				<div className='todo-column'>
					<div className='todo-collection-name'>
						<span />
						<p>TODO(1)</p>
					</div>
					<div className='todo-collection'>
						<div className='todo'>
						</div>
					</div>
				</div>
				<div className='todo-column'>
					<div className='todo-collection-name'>
						<span />
						<p>TODO(1)</p>
					</div>
					<div className='todo-collection'></div>
				</div>
				<div className='todo-column'>
					<div className='todo-collection-name'>
						<span />
						<p>TODO(1)</p>
					</div>
					<div className='todo-collection'></div>
				</div>
				<div className='todo-column'>
					<div className='todo-collection-name'>
						<span />
						<p>TODO(1)</p>
					</div>
					<div className='todo-collection'>+ New Column</div>
				</div>
			</main>
		</div>
	);
}

export default App;
