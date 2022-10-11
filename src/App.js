import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import mode, { current, dropdown, modal } from './store';
import AddBoard from './components/modals/AddBoard';
import EditBoard from './components/modals/EditBoard';
import AddColumn from './components/modals/AddColumn';
import AddTask from './components/modals/AddTask';
import EditTask from './components/modals/EditTask';
import ViewTask from './components/modals/ViewTask';
import BoardMenu from './components/modals/BoardMenu';
import Board from './components/Board';
import Header from './components/Header';
import { db, onSnapshot, doc, getDoc, query, orderBy, collection } from "./firebase";

const App = () => {
	const [boards, setBoards] = useState();
	const [rootWidth, setRootWidth] = useState();

	useEffect(() => {
		const observer = new ResizeObserver(entries => setRootWidth(entries[0].contentRect.width));
		observer.observe(document.getElementById('app'));
		return () => observer.disconnect();
	}, [rootWidth]);

	const inputError = () => {
		[...document.getElementsByClassName('incorrect')].map(elem => elem.classList.add('modal__input--incorrect'));
		[...document.getElementsByClassName('modal__input__error')].map(elem => elem.classList.add('modal__input__error--visible'));
	}

	useEffect(() => {
		const unsub = onSnapshot(query(collection(db, "boards"), orderBy('date', 'asc')), async querySnapshot => {
			setBoards(querySnapshot)

			const currentId = current.boardId && await getDoc(doc(db, "boards", current.boardId))

			if ((!current.boardId && !querySnapshot.empty) || (!currentId?.exists() && !querySnapshot.empty)) return current.setBoardId(querySnapshot.docs[0].id)

			if (querySnapshot.empty) return current.setBoardId('')
		});

		return () => unsub()
	}, []);

	return (
		<div
			id='app'
			className={mode.dark ? 'dark' : 'light'}
			onClick={() => dropdown.close()}
		>
			{modal.createBoard && <AddBoard inputError={inputError} />}
			{modal.editBoard && <EditBoard inputError={inputError} />}
			{modal.createColumn && <AddColumn inputError={inputError} />}
			{modal.createTask && <AddTask inputError={inputError} />}
			{modal.editTask && <EditTask inputError={inputError} />}
			{modal.viewTask && <ViewTask />}

			{rootWidth < 800 ? (
				<>
					{modal.boardSelect && (
						<div id="modal-container" onClick={() => modal.close()}>
							<BoardMenu boards={boards} />
						</div>
					)}
					<Header
						text={"+ New Column"}
						rootWidth={rootWidth}
					/>
					{current.boardId && <Board />}
				</>
			) : (
				<>
					<BoardMenu
						boards={boards}
						rootWidth={rootWidth}
					/>
					<Header
						text={"+ New Column"}
						rootWidth={rootWidth}
					/>
					{current.boardId && <Board />}
				</>
			)}

		</div>
	);
}

export default observer(App);