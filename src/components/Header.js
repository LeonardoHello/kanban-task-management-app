import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { current, modal, dropdown } from '../store';
import Dropdown from './Dropdown';
import logo from '../assets/logo-mobile.svg';
import arrow from '../assets/icon-chevron-down.svg';
import plus from '../assets/icon-add-task-mobile.svg';
import ellipsis from '../assets/icon-vertical-ellipsis.svg';
import { db, doc, onSnapshot } from "../firebase";

const Header = ({ rootWidth }) => {
	const [currentboard, setCurrentboard] = useState();

	useEffect(() => {
		current.boardId && onSnapshot(doc(db, "boards", current.boardId), doc => setCurrentboard(doc.get('name')))
	}, [current.boardId])

	return (
		<div className='header'>
			{rootWidth < 800 ? (
				<div className='header__left'>
					<img
						className='header__logo'
						src={logo}
						alt="logo"
					/>
					<div
						className='header__board-menu-toggle'
						onClick={() => modal.openBoardSelect()}
					>
						<h1 className='header__title'>{(current.boardId && currentboard) || 'Board Menu'}</h1>
						<img
							className={modal.boardSelect ? 'header__arrow header__arrow--active' : 'header__arrow'}
							src={arrow}
							alt="arrow down"
						/>
					</div>
				</div>
			) : (
				<h1 className='header__logo'>{currentboard}</h1>
			)}

			<div className='header__right'>

				{rootWidth < 800 ? (
					<img
						className='header__plus'
						src={plus}
						alt="add"
						onClick={() => current.boardId && modal.openCreateTask()}
					/>
				) : (
					<button
						className='header__plus'
						onClick={() => current.boardId && modal.openCreateTask()}
					>
						+ Add New Task
					</button>
				)}

				<img
					className='header__ellipsis'
					src={ellipsis}
					alt="add"
					onClick={e => {
						e.stopPropagation()
						dropdown.toggleHeader()
					}}
				/>
				{dropdown.header && <Dropdown name='Board' />}
			</div>
		</div>
	)
}

export default observer(Header)