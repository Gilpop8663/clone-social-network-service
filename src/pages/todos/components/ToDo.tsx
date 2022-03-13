import { EDIT, FLAG, TRASH } from 'assets';
import { TODO } from 'constants/constant';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { dbService } from '../../../firebase';

interface IToDoProps {
  id: string;
  text: string;
  isFinish: boolean;
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

const Img = styled.img``;

export default function ToDo({ id, text, isFinish }: IToDoProps) {
  const toDoRef = doc(dbService, TODO, `${id}`);
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const onToggleEdit = () => {
    setIsEdit((prev) => !prev);
    setTimeout(() => {
      if (editRef.current !== null) {
        editRef.current.focus();
      }
    }, 100);
  };

  const onEditSubmit = async (e: any) => {
    e.preventDefault();
    await updateDoc(toDoRef, {
      text: editMessage,
    });
    setIsEdit(false);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditMessage(e.target.value);
  };
  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(toDoRef);
    }
  };

  const onFinishClick = async () => {
    await updateDoc(toDoRef, {
      isFinish: !isFinish,
    });
  };

  return (
    <ListItem key={id}>
      <ItemText>{text}</ItemText>
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
      </IconWrapper>
    </ListItem>
  );
}
