import { observer } from 'mobx-react-lite';
import { current, modal } from '../../store';
import mode from "../../store";
import sun from '../../assets/icon-light-theme.svg';
import moon from '../../assets/icon-dark-theme.svg';
import boardIcon from "../../assets/icon-board.svg";
import boardIconPurple from "../../assets/icon-board-purple.svg";
import boardIconWhite from "../../assets/icon-board-white.svg";
import logoDark from "../../assets/logo-dark.svg";
import logoLight from "../../assets/logo-light.svg";

const BoardMenu = ({ boards, rootWidth }) => {
	return (
		<div
			className='board-menu'
			onClick={e => e.stopPropagation()}
		>
			{rootWidth > 800 && (

				mode.dark ? (
					<img
						className='board-menu__logo'
						src={logoLight}
						alt="dark mode logo"
					/>
				) : (
					<img
						className='board-menu__logo'
						src={logoDark}
						alt="dark mode logo"
					/>
				)

			)}
			<h1 className="board-menu__title">ALL BOARDS ({boards?.size})</h1>
			<div className='board-menu__collection'>
				{boards?.docs.map(elem => (
					<div
						key={elem.id}
						className={current.boardId === elem.id ?
							"board-item board-item--active" :
							"board-item"
						}
						onClick={() => {
							current.setBoardId(elem.id)
							modal.close()
						}}
					>
						<img
							className='board-menu__image'
							src={current.boardId === elem.id
								? boardIconWhite :
								boardIcon
							}
							alt="board icon"
						/>
						<p className="board-item__name">{elem.get('name')}</p>
					</div>
				))}
				<div
					className="board-item board-item--purple"
					onClick={() => modal.openCreateBoard()}
				>
					<img src={boardIconPurple} alt="board icon" />
					<p className="board-item__name">+ Create New Board</p>
				</div>
			</div>

			<div className='theme'>
				<img className="theme__icon"
					src={moon}
					alt="moon icon"
				/>
				<div
					className={mode.dark ?
						'theme__toggle' :
						'theme__toggle theme__toggle--light'
					}
					onClick={() => mode.toggle()}>
					<span className="theme__toggle__dot" />
				</div>
				<img
					className="theme__icon"
					src={sun}
					alt="sun icon"
				/>
			</div>
		</div>
	)
}

export default observer(BoardMenu)