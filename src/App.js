import { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import boards from "./store";
import TodoColumn from './components/TodoColumn';
import AddNew from './components/AddNew';
import logo from './assets/logo-mobile.svg';
import arrowDown from './assets/icon-chevron-down.svg';
import plus from './assets/icon-add-task-mobile.svg';
import ellipsis from './assets/icon-vertical-ellipsis.svg';
import { db, onSnapshot, collection, doc, getDoc, setDoc } from "./firebase";

const App = () => {
	const [rootWidth, setRootWidth] = useState();
	const [darkMode, setDarkMode] = useState(true);
	const [currentBoard, setCurrentBoard] = useState();

	useEffect(() => {
		const observer = new ResizeObserver(entries => setRootWidth(entries[0].contentRect.width));
		observer.observe(document.getElementById('root'));
		return () => observer.disconnect();
	}, [rootWidth]);

	useEffect(() => {
		const unsub = onSnapshot(collection(db, "boards"), querySnapshot => {
			boards.setCollection(querySnapshot.docs.map(elem => ({
				id: elem.id,
				data: elem.data()
			})))
		});
		return () => unsub()
	}, [darkMode]);

	const add = async name => {
		if (boards.collection.some(elem => elem.id === name)) return
		await setDoc(doc(db, "boards", name), {});
	}

	return (
		<div id='app' className={darkMode ? 'dark' : 'light'}>
			<AddNew />
			<div className='header'>
				<div className='header__left'>
					<img src={logo} alt="logo" onClick={() => setDarkMode(prev => !prev)} />
					<div id='current-board'>
						<h1 onClick={e => add(e.currentTarget.innerText)}>Roadmap</h1>
						<img id="arrow-down" src={arrowDown} alt="arrow down" />
					</div>
				</div>
				<div className='header__right'>
					<img id='plus' src={plus} alt="add" />
					<img id='ellipsis' src={ellipsis} alt="add" />
				</div>
			</div>
			<main>
				<TodoColumn />
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

export default observer(App);
