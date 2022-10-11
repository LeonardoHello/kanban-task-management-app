import React from 'react';
import { current, dropdown, modal } from '../store';
import { db, collection, doc, getDocs, deleteDoc } from "../firebase";

const Dropdown = ({ name }) => {
	return (
		<div
			className='dropdown'
			onClick={e => e.stopPropagation()}
		>
			<p
				className='dropdown__item dropdown__item--edit'
				onClick={() => {
					dropdown.close()
					modal.close()
					current.boardId && name === 'Board' ?
						modal.openEditBoard() :
						modal.openEditTask()
				}}
			>
				Edit {name}
			</p>
			<p
				className="dropdown__item dropdown__item--delete"
				onClick={async () => {
					dropdown.close()
					modal.close()
					if (current.boardId && name === 'Board') {
						const columns = await getDocs(collection(db, "boards", current.boardId, "columns"));

						columns.docs.map(async column => {
							const tasks = await getDocs(collection(db, "boards", current.boardId, "columns", column.id, "tasks"));

							if (!tasks.empty) {
								tasks.docs.map(async task => {
									const subtasks = await getDocs(collection(db, "boards", current.boardId, "columns", column.id, "tasks", task.id, "subtasks"));

									subtasks.docs.map(async subtask => {
										await deleteDoc(doc(db, "boards", current.boardId, "columns", column.id, "tasks", task.id, "subtasks", subtask.id))
									})

									await deleteDoc(doc(db, "boards", current.boardId, "columns", column.id, "tasks", task.id))
								})
							}
							await deleteDoc(doc(db, "boards", current.boardId, "columns", column.id))
						})
					} else {
						const subtasks = await getDocs(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks"));

						subtasks.docs.map(async elem => {
							await deleteDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks", elem.id))
						})

						await deleteDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId));
					}
				}}
			>
				Delete {name}
			</p>
		</div>
	)
}

export default Dropdown