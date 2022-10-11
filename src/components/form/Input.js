import { current } from "../../store";

const Input = ({ data, setData, toCompare }) => {
	const usedTitle = toCompare?.some(elem => elem.get('name').toLowerCase() === data.toLowerCase() && elem.id !== current.taskId);

	return (
		toCompare ? (
			<div className="modal__input-container">
				<input
					className={usedTitle || data.length < 1 ?
						"modal__input incorrect" :
						"modal__input"
					}
					onInput={e => setData(e.currentTarget.value)}
					onFocus={e => {
						e.currentTarget.classList.remove('modal__input--incorrect');
						e.currentTarget.nextElementSibling?.classList.remove('modal__input__error--visible');
					}}
					onBlur={e => setData(e.target.value.trim())}
					value={data}
				/>
				{data.length < 1 && <p className='modal__input__error'>Required</p>}

				{usedTitle && <p className='modal__input__error'>Used</p>}
			</div>
		) : (
			<input
				className="modal__input modal__input--readonly"
				value={data}
				maxLength={15}
				readOnly
			/>
		)
	)
}

export default Input