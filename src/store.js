import { makeAutoObservable } from "mobx"

class DarkMode {
	dark = true

	constructor() {
		makeAutoObservable(this)
	}

	toggle() {
		this.dark = !this.dark
	}
}
const mode = new DarkMode()

class Dropdown {
	header = false
	modal = false
	input = false

	constructor() {
		makeAutoObservable(this)
	}

	toggleHeader() {
		this.header = !this.header
	}

	toggleModal() {
		this.modal = !this.modal
	}

	toggleInput() {
		this.input = !this.input
	}

	close() {
		this.header = false
		this.modal = false
		this.input = false
	}
}
const dropdown = new Dropdown()

class CurrentBoard {
	boardId = ''
	columnName = ''
	columnId = ''
	taskId = ''

	constructor() {
		makeAutoObservable(this)
	}

	setBoardId(newBoardId) {
		this.boardId = newBoardId
	}

	setColumnName(newColumn) {
		this.columnName = newColumn
	}

	setColumnId(newColumnId) {
		this.columnId = newColumnId
	}

	setTaskId(newTaskId) {
		this.taskId = newTaskId
	}
}
const current = new CurrentBoard()

class Modal {
	boardSelect = false
	createBoard = false
	createColumn = false
	createTask = false
	editBoard = false
	editTask = false
	viewTask = false

	constructor() {
		makeAutoObservable(this)
	}

	openBoardSelect() {
		this.boardSelect = true
	}

	openCreateBoard() {
		this.boardSelect = false
		this.createBoard = true
	}

	openCreateColumn() {
		this.createColumn = true
	}

	openCreateTask() {
		this.createTask = true
	}

	openEditBoard() {
		this.editBoard = true
	}

	openEditTask() {
		this.editTask = true
	}

	openViewTask() {
		this.viewTask = true
	}

	close() {
		this.boardSelect = false
		this.createBoard = false
		this.createColumn = false
		this.createTask = false
		this.editBoard = false
		this.editTask = false
		this.viewTask = false
	}
}
const modal = new Modal()


export default mode
export { current, modal, dropdown }