import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { current } from "../store";
import Task from "./Task";
import { db, onSnapshot, collection, query, orderBy } from "../firebase";

const Column = ({ columnId, name, order }) => {
	const [tasks, setTasks] = useState();

	useEffect(() => columnId && onSnapshot(query(collection(db, "boards", current.boardId, "columns", columnId, "tasks"), orderBy('date', 'asc')), async querySnapshot => {
		setTasks(querySnapshot)
	}), []);

	return (
		<div className='column'>
			<div className='column__header'>
				<span className={`column__color column__color--${order}`} />
				<p className='column__name'>{name.toUpperCase()} ({tasks?.size})</p>
			</div>
			<div className={tasks?.empty ?
				'column__body column__body--empty' :
				'column__body'
			}>
				{tasks?.docs.map(elem => (
					<Task
						key={elem.id}
						columnId={columnId}
						taskId={elem.id}
						columnName={name}
						name={elem.get('name')}
					/>
				))}
			</div>
		</div>
	)
}

export default observer(Column)