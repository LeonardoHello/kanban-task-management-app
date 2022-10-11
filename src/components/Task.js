import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { db, onSnapshot, query, orderBy, collection } from "../firebase";
import { current, modal } from "../store";

const Task = ({ columnId, taskId, columnName, name }) => {
	const [subtasks, setSubtasks] = useState();
	const [completed, setCompleted] = useState(0);

	useEffect(() => {
		const unsub = onSnapshot(collection(db, "boards", current.boardId, "columns", columnId, "tasks", taskId, "subtasks"), querySnapshot => {
			setSubtasks(querySnapshot)
			setCompleted(querySnapshot.docs.filter(elem => elem.get('completed')).length)
		});
		return () => unsub()
	}, []);

	return (
		<div className='task' onClick={() => {
			current.setColumnId(columnId)
			current.setColumnName(columnName)
			current.setTaskId(taskId)
			modal.openViewTask()
		}}>
			<h1 className="task__name">{name}</h1>
			<p className="task__count">{subtasks?.empty ? 'No subtasks' : `${completed} of ${subtasks?.size} subtasks`}</p>
		</div >
	)
}

export default observer(Task)