import { current } from '../store';
import check from '../assets/icon-check.svg'
import { db, doc, updateDoc } from "../firebase";

const Subtask = ({ subtaskId, name, completed }) => {
	return (
		<div className='subtask' onClick={async () => {
			await updateDoc(doc(db, "boards", current.boardId, "columns", current.columnId, "tasks", current.taskId, "subtasks", subtaskId), {
				completed: !completed
			})
		}}>
			<div className={completed ? 'subtask__check-box subtask__check-box--completed' : 'subtask__check-box'}>
				{completed && (
					<img
						className='subtask__check'
						src={check} alt="check"
					/>
				)}
			</div>
			<p className={completed ? 'subtask__name subtask__name--completed' : 'subtask__name'}>{name}</p>
		</div>
	)
}

export default Subtask