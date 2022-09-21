import { makeAutoObservable } from "mobx"

class BoardCollection {
	collection = []

	constructor() {
			makeAutoObservable(this)
	}

	setCollection(boards) {
			this.collection = boards
	}
}

const Boards = new BoardCollection()

export default Boards