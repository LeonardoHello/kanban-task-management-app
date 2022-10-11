import { observer } from "mobx-react-lite"
import { dropdown, modal } from "../../store"
import cross from "../../assets/icon-cross.svg"
import ellipsis from "../../assets/icon-vertical-ellipsis.svg"
import Dropdown from "../Dropdown"

const Modal = ({ children, title, edit, create, btn }) => {
	return (
		<div id="modal-container" onClick={() => modal.close()}>
			<div
				className="modal"
				onClick={e => {
					e.stopPropagation()
					dropdown.close()
				}}
			>
				<div className="modal__header">
					<h1 className="modal__title">{title}</h1>
					<div className="modal__header__buttons">
						<img
							className="modal__cross"
							src={cross}
							alt="cross icon"
							onClick={() => modal.close()}
						/>
						{edit && (
							<img
								className="modal__ellipsis"
								src={ellipsis}
								alt="ellipsis"
								onClick={e => {
									e.stopPropagation()
									dropdown.toggleModal()
								}}
							/>
						)}
						{edit && dropdown.modal && <Dropdown name={'Task'} />}
					</div>
				</div>
				{children}

				{btn && (
					<button
						className='modal__button modal__button--purple'
						onClick={() => create()}
					>
						{btn}
					</button>
				)}
			</div>
		</div>
	)
}

export default observer(Modal)