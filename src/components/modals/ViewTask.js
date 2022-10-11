import { useEffect, useState } from 'react';
import Modal from './Modal'
import Label from '../form/Label'
import Subtask from '../Subtask';
import { current } from '../../store';
import { observer } from 'mobx-react-lite';
import Select from '../form/Select';
import { db, collection, onSnapshot, doc, query, orderBy, getDoc } from "../../firebase";

const ViewTask = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [subtasks, setSubtasks] = useState([])
	const [completed, setCompleted] = useState(0);

	useEffect(() => {
		const unsub = onSnapshot(query(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks"), orderBy('order', 'asc')), querySnapshot => {
			setSubtasks(querySnapshot.docs.map(elem => ({
				name: elem.get('name'),
				completed: elem.get('completed'),
				id: elem.id
			})))
			setCompleted(querySnapshot.docs.filter(elem => elem.get('completed')).length)
		});

		const setup = async () => {
			const task = await getDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId));
			setName(task.get('name'));
			setDescription(task.get('description'));
		}
		setup()

		return () => unsub()
	}, [])

	return (
		<Modal title={name} edit={true}>
			<Label name={'Description'}>
				<p className='modal__description'>{description}</p>
			</Label>
			<Label name={`Subtasks (${completed} of ${subtasks.length})`}>
				{(subtasks.length && subtasks.map(elem => (
					<Subtask
						key={elem['id']}
						subtaskId={elem['id']}
						name={elem['name']}
						completed={elem['completed']}
					/>
				))) || <p className='modal__description'>No subtasks</p>}
			</Label>
			<Label name='Current Status'>
				<Select />
			</Label>
		</Modal>
	)
}

export default observer(ViewTask)