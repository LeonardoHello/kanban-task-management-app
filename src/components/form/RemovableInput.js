import { useEffect, useState } from "react"
import { db, collection, getDocs } from "../../firebase"
import { current } from "../../store";
import cross from "../../assets/icon-cross.svg"

const RemovableInput = ({ id, name, index, data, setData, subtask, limit }) => {
	const [isEmpty, setIsEmpty] = useState();

	const used = data
		.filter(elem => elem['name'].length > 0 && elem['name'].toLowerCase() === name.toLowerCase())
		.slice(1)
		.map(elem => elem['id'])
		.includes(id);

	useEffect(() => {
		current.boardId && getDocs(collection(db, "boards", current.boardId, "columns", id, "tasks"))
			.then(res => res.empty && setIsEmpty(true))
			.catch(err => console.error(err))
	}, [])

	return (
		<div key={id} className='modal__removable-input' >
			<div className="modal__input-container">
				<input
					className={used || name.length < 1 ?
						"modal__input incorrect" :
						"modal__input"
					}
					onInput={e => setData(prev => {
						const newArr = [...prev];
						newArr[index]['name'] = e.target.value;
						return newArr;
					})}
					onFocus={e => {
						e.currentTarget.classList.remove('modal__input--incorrect');
						e.currentTarget.nextElementSibling?.classList.remove('modal__input__error--visible');
					}}
					onBlur={e => setData(prev => {
						const newArr = [...prev];
						newArr[index]['name'] = e.target.value.trim();
						return newArr;
					})}
					value={name}
					maxLength={limit || 20}
				/>

				{name.length < 1 && <p className='modal__input__error'>Required</p>}
				{used && <p className='modal__input__error'>Used</p>}
			</div>
			{(subtask ? subtask : data.length > 1) && (
				<img
					className={isEmpty ?
						"modal__cross" :
						"modal__cross modal__cross--unclickable"
					}
					src={cross}
					alt="cross icon"
					onClick={() => setData(prev => {
						const newArr = [...prev];
						delete newArr[index]
						return newArr.flat();
					})}
				/>
			)}
		</div>
	)
}

export default RemovableInput