import { useEffect, useState, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { observer } from "mobx-react-lite";
import { current, modal } from "../store";
import Column from "./Column";
import { db, collection, doc, onSnapshot, query, orderBy, deleteDoc } from "../firebase";

const Board = () => {
	const board = useRef();
	const [columns, setColumns] = useState();
	const { events } = useDraggable(board, {
		applyRubberBandEffect: true,
	})

	useEffect(() => onSnapshot(query(collection(db, "boards", current.boardId, "columns"), orderBy('order', 'asc')), async querySnapshot => {
		setColumns(querySnapshot);
		if (querySnapshot.empty) {
			await deleteDoc(doc(db, "boards", current.boardId));
		}
	}), [current.boardId]);

	return (
		<div className='board' {...events} ref={board}>
			{columns?.docs.map((elem, index) => (
				<Column
					key={elem.id}
					order={index + 1}
					columnId={elem.id}
					name={elem.get('name')}
				/>
			))}
			<div className='column' >
				{!columns?.empty && (
					<div className='column__header column__header--last'>
						<span className='column__color' />
					</div>
				)}
				<div
					className='column__body column__body--last'
					onClick={() => modal.openCreateColumn()}
				>
					+ New Column
				</div>
			</div>
		</div>
	)
}

export default observer(Board)