import { EDIT, FLAG, TRASH } from 'assets';
import { TODO, TO_DO_LIST } from 'constants/constant';
import { deleteDoc, doc, setDoc, updateDoc, where } from 'firebase/firestore';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { onEnterPress } from 'utils/utilFn';
import { dbService } from '../../../firebase';
import { ICategory } from '../ToDos';

interface IToDoProps {
  id: string;
  text: string;
  isFinish: boolean;
  userObj: any;
  createdDate: string;
  categoryId: string;
  todayDate: string;
  categoryList: ICategory[];
  userDate: string;
}

const ListItem = styled.div`
  background: #ffffff;
  border-radius: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 23px;

  color: #000000;
`;

const ItemText = styled.span`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const IconWrapper = styled.div`
  width: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: #d0cfc9;
  border-radius: 6px;
  cursor: pointer;
`;

const EditForm = styled.form`
  position: absolute;
  left: 50px;
`;

const EditInput = styled.input`
  height: 20px;
`;

const Img = styled.img``;

export default function ToDo({
  id,
  text,
  isFinish,
  createdDate,
  categoryId,
  userObj,
  categoryList,
  todayDate,
  userDate,
}: IToDoProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);
  const editRef = useRef<HTMLInputElement>(null);

  const findIndex = categoryList?.findIndex((item) => item.id === categoryId);
  const commentIndex = categoryList[findIndex]?.list?.findIndex(
    (item) => item.id === id
  );

  const onToggleEdit = () => {
    setIsEdit((prev) => !prev);
    setTimeout(() => {
      if (editRef.current !== null) {
        editRef.current.focus();
      }
    }, 100);
  };

  const onEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newArr = [
      ...categoryList.slice(0, findIndex),
      {
        ...categoryList[findIndex],
        list: [
          ...categoryList[findIndex].list.slice(0, commentIndex),
          {
            ...categoryList[findIndex].list[commentIndex],
            text: editMessage,
          },
          ...categoryList[findIndex].list.slice(commentIndex + 1),
        ],
      },
      ...categoryList.slice(findIndex + 1),
    ];

    await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
      user: userObj.uid,
      createdDate: userDate,
      toDoList: {
        createdDate: userDate,
        categoryList: newArr,
      },
    });
    setIsEdit(false);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMessage(e.target.value);
  };
  const onDeleteClick = async () => {
    const newArr = [
      ...categoryList.slice(0, findIndex),
      {
        ...categoryList[findIndex],
        list: [
          ...categoryList[findIndex].list.slice(0, commentIndex),
          ...categoryList[findIndex].list.slice(commentIndex + 1),
        ],
      },
      ...categoryList.slice(findIndex + 1),
    ];
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
        user: userObj.uid,
        createdDate: userDate,
        toDoList: {
          createdDate: userDate,
          categoryList: newArr,
        },
      });
    }
  };

  const onFinishClick = async () => {
    const newArr = [
      ...categoryList.slice(0, findIndex),
      {
        ...categoryList[findIndex],
        list: [
          ...categoryList[findIndex].list.slice(0, commentIndex),
          {
            ...categoryList[findIndex].list[commentIndex],
            isFinish: !categoryList[findIndex].list[commentIndex].isFinish,
          },
          ...categoryList[findIndex].list.slice(commentIndex + 1),
        ],
      },
      ...categoryList.slice(findIndex + 1),
    ];

    await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
      user: userObj.uid,
      createdDate: userDate,
      toDoList: {
        createdDate: userDate,
        categoryList: newArr,
      },
    });
  };

  return (
    <ListItem key={id}>
      <ItemText>{text}</ItemText>
      {userDate === todayDate && (
        <IconWrapper>
          <Icon onClick={onDeleteClick}>
            <Img src={TRASH} alt="delete" />
          </Icon>
          <Icon onClick={onFinishClick}>
            <Img src={FLAG} alt="finish" />
          </Icon>
          <Icon onClick={onToggleEdit}>
            <Img src={EDIT} alt="edit" />
          </Icon>

          {isEdit && (
            <EditForm
              onSubmit={onEditSubmit}
              onKeyDown={(e) => onEnterPress(e, onEditSubmit)}
            >
              <EditInput
                ref={editRef}
                value={editMessage}
                onChange={onEditChange}
              />
            </EditForm>
          )}
        </IconWrapper>
      )}
    </ListItem>
  );
}
