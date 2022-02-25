import { TODO } from 'constants/constant';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dbService } from '../../../firebase';

interface IToDoProps {
  id: string;
  text: string;
}

const Container = styled.li``;
const ToDoText = styled.span``;
const ButtonWrapper = styled.div``;
const ToDoBtn = styled.button``;
const EditForm = styled.form``;

const EditInput = styled.input``;

export default function ToDo({ id, text }: IToDoProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);
  const toDoRef = doc(dbService, TODO, `${id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(toDoRef);
    }
  };
  const onToggleEdit = () => setIsEdit((prev) => !prev);

  const onEditSubmit = async (e: any) => {
    e.preventDefault();
    await updateDoc(toDoRef, {
      text: editMessage,
    });
    setIsEdit(false);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMessage(e.target.value);
  };
  return (
    <Container>
      <ToDoText>{text}</ToDoText>
      <ButtonWrapper>
        <ToDoBtn onClick={onDeleteClick}>삭제</ToDoBtn>
        <ToDoBtn onClick={onToggleEdit}>수정</ToDoBtn>
        {isEdit && (
          <EditForm onSubmit={onEditSubmit}>
            <EditInput
              type="text"
              onChange={onEditChange}
              required
              placeholder="수정할 텍스트를 입력해주세요"
              value={editMessage}
            />
            <EditInput type="submit" value="수정하기" />
          </EditForm>
        )}
      </ButtonWrapper>
    </Container>
  );
}
