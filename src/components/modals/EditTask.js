import { useEffect, useState } from "react";
import { current, modal } from "../../store";
import Modal from "./Modal";
import Label from "../form/Label";
import RemovableInput from "../form/RemovableInput";
import Select from "../form/Select";
import Input from "../form/Input";
import Textarea from "../form/Textarea";
import { v4 as uuidv4 } from "uuid";
import { db, collection, doc, getDocs, query, orderBy, getDoc, updateDoc, addDoc, deleteDoc, Timestamp } from "../../firebase";

const EditTask = ({ inputError }) => {
	const [taskNames, setTaskNames] = useState([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [subtasks, setSubtasks] = useState([])
	const [initialStatus, setInitialStatus] = useState('');
	const [columns, setColumns] = useState([]);

	useEffect(() => {
		const setup = async () => {
			setInitialStatus(current.columnId);

			const task = await getDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId));
			setTitle(task.get('name'));
			setDescription(task.get('description'));

			const gettingSubtasks = await getDocs(query(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks"), orderBy('order', 'asc')));
			setSubtasks(gettingSubtasks.docs.map(elem => ({
				name: elem.get('name'),
				completed: elem.get('completed'),
				id: elem.id
			})))

			const gettingColumns = await getDocs(query(collection(db, "boards", current.boardId, "columns"), orderBy('order', 'asc')));
			setColumns(gettingColumns.docs);

			const gettingTasks = await getDocs(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks"));
			setTaskNames(gettingTasks.docs);
		}
		setup()
	}, [])

	const create = async () => {
		const emptyInput = [title, ...subtasks.map(elem => elem['name'])].some(elem => elem.length < 1);
		const usedTask = taskNames.some(elem => elem.get('name').toLowerCase() === title.toLowerCase() && elem.id !== current.taskId);
		const usedSubtaks = subtasks
			.map(elem => elem['name'].toLowerCase())
			.some((elem, index, arr) => {
				const newArr = arr;
				delete newArr[index];
				return newArr.flat().includes(elem.toLowerCase())
			})

		if (emptyInput || usedTask || usedSubtaks) return inputError()

		modal.close()

		const currentSubtaskIds = (await getDocs(collection(db, "boards", current.boardId, "columns", initialStatus, "tasks", current.taskId, "subtasks"))).docs.map(elem => elem.id);

		if (initialStatus === current.columnId) {
			const newSubtaskIds = subtasks.map(elem => elem.id)

			await updateDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId), {
				name: title,
				description: description || 'No description'
			})

			subtasks.map(async (elem, index) => {
				if (currentSubtaskIds.includes(elem.id)) {
					await updateDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks", elem.id), {
						name: elem['name'],
						order: index
					})
				} else {
					await addDoc(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks"), {
						name: elem['name'],
						order: index,
						completed: false
					})
				}
			})

			currentSubtaskIds.map(async elem => {
				if (!newSubtaskIds.includes(elem)) await deleteDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks", elem))
			})

		} else {
			currentSubtaskIds.map(async elem => {
				await deleteDoc(doc(db, "boards", current.boardId, "columns", initialStatus, "tasks", current.taskId, "subtasks", elem))
			});

			await deleteDoc(doc(db, "boards", current.boardId, "columns", initialStatus, "tasks", current.taskId));

			const newTask = await addDoc(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks"), {
				name: title,
				description: description || 'No description',
				date: Timestamp.now()
			})

			subtasks.map(async (elem, index) => {
				await addDoc(collection(db, "boards", current.boardId, "columns", current.columnId, "tasks", newTask.id, "subtasks"), {
					name: elem['name'],
					completed: elem['completed'],
					order: index
				})
			})
		}


	}
	return (
		<Modal
			title={'Edit Task'}
			btn="Save Changes"
			create={create}
		>
			<Label name={'Title'}>
				<Input
					data={title}
					setData={setTitle}
					toCompare={taskNames}
				/>
			</Label>
			<Label name={'Description'}>
				<Textarea data={description} setData={setDescription} />
			</Label>
			<Label name="Subtasks">
				{subtasks.map((elem, index) => (
					<RemovableInput
						key={elem['id']}
						id={elem['id']}
						index={index}
						name={elem['name']}
						data={subtasks}
						setData={setSubtasks}
						subtask={true}
						limit={255}
					/>
				))}
				{subtasks?.length <= 5 && (
					<button
						className='modal__button modal__button--white'
						onClick={() => setSubtasks(prev => (
							[...prev, {
								id: uuidv4(),
								name: '',
								completed: false
							}]
						))}
					>
						+ Add New Column
					</button>
				)}
			</Label>
			<Label name='Status'>
				<Select data={columns} setToCompare={setTaskNames} />
			</Label>
		</Modal>
	)
}

export default EditTask