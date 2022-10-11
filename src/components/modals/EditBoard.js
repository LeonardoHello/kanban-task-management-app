import { useState, useEffect } from "react";
import { current, modal } from "../../store"
import Modal from "./Modal";
import Label from "../form/Label";
import Input from "../form/Input";
import RemovableInput from "../form/RemovableInput";
import { db, collection, query, orderBy, updateDoc, doc, getDocs, getDoc, addDoc, deleteDoc } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

const EditBoard = ({ inputError }) => {
  const [boards, setBoards] = useState();
  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState();

  useEffect(() => {
    const setup = async () => {
      const boardCollection = await getDocs(collection(db, "boards"));
      const currentBoard = await getDoc(doc(db, "boards", current.boardId));
      const currentColumns = await getDocs(query(collection(db, "boards", current.boardId, "columns"), orderBy('order', 'asc')));

      setBoards(boardCollection.docs.filter(elem => currentBoard.get('name').toLowerCase() !== elem.get('name').toLowerCase())
      );
      setBoardName(currentBoard.get('name'));
      setColumns(currentColumns.docs.map(elem => ({
        id: elem.id,
        name: elem.get('name')
      })));
    }
    setup()
  }, []);

  const createColumn = async () => {
    const duplicateBoards = boards.some(elem => elem.get('name').toLowerCase() === boardName.toLowerCase())
    const isEmpty = [...columns.map(elem => elem['name'])].some(elem => elem.length < 1);
    const duplicatesColumns = columns
      .map(elem => elem['name'].toLowerCase())
      .some((elem, index, arr) => {
        const newArr = arr;
        delete newArr[index];
        return newArr.flat().includes(elem.toLowerCase());
      });

    if (isEmpty || duplicateBoards || duplicatesColumns) return inputError()

    modal.close()

    const columnIds = columns.map(elem => elem['id']);
    const initialColumnIds = (await getDocs(collection(db, "boards", current.boardId, "columns"))).docs.map(elem => elem.id);

    await updateDoc(doc(db, "boards", current.boardId), {
      name: boardName,
    });

    columns.map(async (elem, index) => {
      if (initialColumnIds.includes(elem['id'])) {
        await updateDoc(doc(db, "boards", current.boardId, "columns", elem.id), {
          name: elem['name'],
          order: index
        });
      } else {
        await addDoc(collection(db, "boards", current.boardId, "columns"), {
          name: elem['name'],
          order: index
        });
      }
    })

    initialColumnIds.map(async elem => {
      if (!columnIds.includes(elem)) {
        await deleteDoc(doc(db, "boards", current.boardId, "columns", elem));
      }
    })
  }

  return (
    <Modal
      title='Edit Board'
      create={createColumn}
      btn="Save Changes"
    >
      <Label name="Name">
        <Input
          data={boardName}
          setData={setBoardName}
          toCompare={boards}
        />
      </Label>

      <Label name="Columns">
        {columns?.map((elem, index) => (
          <RemovableInput
            key={elem.id}
            id={elem.id}
            name={elem.name}
            index={index}
            data={columns}
            setData={setColumns}
          />
        ))}
        {columns?.length <= 5 && (
          <button
            className='modal__button modal__button--white'
            onClick={() => setColumns(prev => (
              [...prev, { id: uuidv4(), name: '' }]
            ))}
          >
            + Add New Column
          </button>
        )}
      </Label>
    </Modal>
  )
}

export default EditBoard