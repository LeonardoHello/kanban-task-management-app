import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { current, modal } from "../../store";
import Modal from "./Modal";
import Label from "../form/Label";
import Input from "../form/Input";
import Textarea from "../form/Textarea";
import RemovableInput from "../form/RemovableInput";
import Select from "../form/Select";
import { v4 as uuidv4 } from 'uuid';
import { db, collection, query, orderBy, getDocs, addDoc, Timestamp } from "../../firebase";

const AddTask = ({ inputError }) => {
	const [taskTitles, setTaskTitles] = useState([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [subTasks, setSubTasks] = useState([{
		name: '',
		id: uuidv4()
	}]);
	const [columns, setColumns] = useState();

	useEffect(() => {
		const setup = async () => {
			const columnCollection = await getDocs(query(collection(db, "boards", current.boardId, "columns"), orderBy('order', 'asc')));

			setColumns(columnCollection.docs);
			current.setColumnName(columnCollection.docs[0].get('name'));
			current.setColumnId(columnCollection.docs[0].id);

			const tasks = await getDocs(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks"));
			setTaskTitles(tasks.docs)
		}
		setup()
	}, [])

	const createBoard = async () => {
		const isEmpty = [title, ...subTasks.map(elem => elem['name'])].some(elem => elem.length < 1);
		const usedTitle = taskTitles.some(elem => elem.get('name').toLowerCase() === title);
		const usedColumn = subTasks
			.map(elem => elem['name'].toLowerCase())
			.some((elem, index, arr) => {
				const newArr = arr;
				delete newArr[index];
				return newArr.flat().includes(elem.toLowerCase());
			});

		if (isEmpty || usedTitle || usedColumn) return inputError()

		modal.close()

		const newTask = await addDoc(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks"), {
			name: title,
			description: description || 'No description',
			date: Timestamp.now()
		});

		subTasks.map(async (elem, index) => {
			await addDoc(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", newTask.id, "subtasks"), {
				name: elem['name'],
				completed: false,
				order: index
			});
		})

	}
	return (
		<Modal title={'Add New Task'} create={createBoard} btn="Create Task">
			<Label name='Title'>
				<Input
					data={title}
					setData={setTitle}
					toCompare={taskTitles}
				/>
			</Label>
			<Label name='Description'>
				<Textarea
					data={description}
					setData={setDescription}
				/>
			</Label>
			<Label name={'Subtasks'} >
				{subTasks?.map((elem, index) => (
					<RemovableInput
						key={elem['id']}
						id={elem['id']}
						index={index}
						name={elem['name']}
						data={subTasks}
						setData={setSubTasks}
						subtask={true}
						limit={255}
					/>
				))}
				{subTasks?.length <= 5 && (
					<button
						className='modal__button modal__button--white'
						onClick={() => setSubTasks(prev => (
							[...prev, { id: uuidv4(), name: '' }]
						))}
					>
						+ Add New Subtask
					</button>
				)}
			</Label>
			<Label name={'Status'}>
				<Select
					data={columns}
					setToCompare={setTaskTitles}
				/>
			</Label>
		</Modal>
	)
}

export default observer(AddTask)