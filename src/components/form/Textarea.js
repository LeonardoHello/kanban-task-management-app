const Textarea = ({ data, setData }) => {
	return (
		<textarea
			className="modal__textarea"
			onInput={e => setData(e.currentTarget.value)}
			onBlur={e => setData(e.target.value.trim())}
			value={data}
		/>
	)
}

export default Textarea