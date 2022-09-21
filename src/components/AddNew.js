import { observer } from "mobx-react-lite";
import boards from "../store";
import sun from '../assets/icon-light-theme.svg';
import moon from '../assets/icon-dark-theme.svg';
import boardIcon from '../assets/icon-board.svg';

const AddNew = () => {
	return (
		<div id='all-boards'>
			<p>ALL BOARDS ({boards.collection.length})</p>
			<div id='board-select'>
				{boards.collection?.map(elem => (
					<div key={elem.id}>
						<img src={boardIcon} alt="board icon" />
						<p>{elem.id}</p>
					</div>
				))}
				<div>
					<img src={boardIcon} alt="board icon" />
					<p>+ Create New Board</p>
				</div>
			</div>
			<div id='theme-toggle'>
				<img src={moon} alt="moon icon" />
				<div>
					<span />
				</div>
				<img src={sun} alt="sun icon" />
			</div>
		</div>
	)
}

export default observer(AddNew)