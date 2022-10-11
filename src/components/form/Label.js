const Label = ({ children, name }) => {
	return (
		<div className="modal__fill-out">
			<label className="modal__label">{name}</label>
			{children}
		</div>
	)
}

export default Label