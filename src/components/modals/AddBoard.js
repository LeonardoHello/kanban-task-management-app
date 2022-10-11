import { useEffect, useState } from "react"
import { current, modal } from "../../store"
import Modal from "./Modal"
import Label from "../form/Label";
import Input from "../form/Input"
import RemovableInput from "../form/RemovableInput";
import { v4 as uuidv4 } from 'uuid';
import { db, collection, getDocs, addDoc, Timestamp } from "../../firebase"

const AddBoard = ({ inputError }) => {
	const [boards, setBoards] = useState([]);
	const [boardName, setBoardName] = useState('');
	const [columns, setColumns] = useState([{
		id: uuidv4(),
		name: ''
	}]);

	useEffect(() => {
		const setup = async () => {
			const gettingBoards = await getDocs(collection(db, "boards"));
			setBoards(gettingBoards.docs)
		}
		setup()
	}, [])

	const createBoard = async () => {
		const isEmpty = [boardName, ...columns.map(elem => elem['name'])].some(elem => elem.length < 1);
		const duplicateBoards = boards.some(elem => elem.get('name').toLowerCase() === boardName.toLowerCase());
		const duplicatesColumns = columns
			.map(elem => elem['name'].toLowerCase())
			.some((elem, index, arr) => {
				const newArr = arr;
				delete newArr[index];
				return newArr.flat().includes(elem.toLowerCase());
			});

		if (isEmpty || duplicateBoards || duplicatesColumns) return inputError()

		const newBoard = await addDoc(collection(db, "boards"), {
			name: boardName,
			date: Timestamp.now()
		});

		columns.map(async (elem, index) => {
			await addDoc(collection(db, "boards", newBoard.id, "columns"), {
				name: elem.name,
				order: index
			});
		})

		current.setBoardId(newBoard.id)
		modal.close()
	}

	return (
		<Modal
			title={'Add New Board'}
			create={createBoard}
			btn="Create New Board"
		>
			<Label name={'Name'}>
				<Input
					data={boardName}
					setData={setBoardName}
					toCompare={boards}
				/>
			</Label>

			<Label name={"Columns"}>
				{columns?.map((elem, index) => (
					<RemovableInput
						key={elem.id}
						id={elem.id}
						name={elem.name}
						index={index}
						data={columns}
						setData={setColumns}
					/>
				))}
				{columns?.length <= 5 && (
					<button
						className='modal__button modal__button--white'
						onClick={() => setColumns(prev => (
							[...prev, { id: uuidv4(), name: '' }]
						))}
					>
						+ Add New Column
					</button>
				)}
			</Label>
		</Modal>
	)
}

export default AddBoard