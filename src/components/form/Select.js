import { observer } from 'mobx-react-lite';
import { current, dropdown } from '../../store';
import arrow from '../../assets/icon-chevron-down.svg';
import { db, collection, doc, getDocs, getDoc, addDoc } from "../../firebase";

const Select = ({ data, setToCompare }) => {
	return (
		<div
			className={!data ?
				"modal__input-container modal__input-container--readonly" :
				"modal__input-container"}
			onClick={e => {
				e.stopPropagation()
				dropdown.toggleInput()
			}}
		>
			<input
				className='modal__input modal__input--select'
				value={current.columnName}
				readOnly
			/>
			<img
				className={dropdown.input ?
					'modal__arrow modal__arrow--active' :
					'modal__arrow'
				}
				src={arrow}
				alt="arrow"
			/>
			{dropdown.input && data && (
				<div className='dropdown dropdown--select'>
					{data?.map((elem, index) => (
						<p
							key={index}
							className={'dropdown__item'}
							onClick={async () => {
								const tasks = await getDocs(collection(db, "boards", current.boardId, "columns", elem.id, "tasks"));

								setToCompare(tasks.docs);

								current.setColumnName(elem.get('name'));
								current.setColumnId(elem.id);
								dropdown.close();
							}}
						>
							{elem.get('name')}
						</p>
					))}
				</div>
			)}
		</div>
	)
}

export default observer(Select)