import React, { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService, storageService } from '../../../firebase';
import { IMessageListProps } from 'utils/interface';
import { deleteObject, ref } from 'firebase/storage';
import { MESSAGES } from 'constants/constant';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const MessageText = styled.span``;

const ButtonWrapper = styled.div``;

const Button = styled.button``;

const EditForm = styled.form``;

const EditInput = styled.input``;

const Image = styled.img``;

export default function Message({
  id,
  text,
  isOwner,
  photoURL,
}: IMessageListProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);

  const messageRef = doc(dbService, MESSAGES, `${id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(messageRef);
      if (photoURL !== '') {
        await deleteObject(ref(storageService, photoURL));
      }
    }
  };

  const onToggleEdit = () => setIsEdit((prev) => !prev);

  const onEditSubmit = async (e: any) => {
    e.preventDefault();
    await await updateDoc(messageRef, {
      text: editMessage,
    });
    setIsEdit(false);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMessage(e.target.value);
  };
  return (
    <Container key={id}>
      <MessageText>{text}</MessageText>
      {photoURL && <Image src={photoURL} />}
      {isOwner && (
        <ButtonWrapper>
          <Button onClick={onDeleteClick} value="Delete">
            딜리트
          </Button>
          <Button onClick={onToggleEdit} value="Edit">
            수정
          </Button>
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
      )}
    </Container>
  );
}
