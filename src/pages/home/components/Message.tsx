import React, { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService, storageService } from '../../../firebase';
import { IMessageListProps } from 'utils/interface';
import { deleteObject, ref } from 'firebase/storage';
import { MESSAGES } from 'constants/constant';

const Container = styled.div`
  display: flex;
  width: 600px;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: none;
  padding: 17px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
`;

const UserInfo = styled.div`
  font-size: 1.6em;
  font-weight: bold;
`;

const MessageText = styled.span`
  font-size: 1.6em;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div``;

const Button = styled.button`
  width: 60px;
  height: 30px;
  font-size: 1.2em;
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const DeleteButton = styled(Button)`
  color: red;
  margin-right: 10px;
`;

const EditForm = styled.form``;

const EditInput = styled.input``;

const Image = styled.img`
  width: 500px;
  height: 340px;
  border-radius: 20px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const UserWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 500px;
`;

const CreateDate = styled.span`
  font-size: 1.6em;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 100;
  margin-left: 10px;
`;

export default function Message({
  id,
  text,
  creatorId,
  isOwner,
  photoURL,
  userId,
  createdAt,
  userImage,
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
    await updateDoc(messageRef, {
      text: editMessage,
    });
    setIsEdit(false);
  };

  const dateFormater = (time: number | Date) => {
    const oldYear = new Date(time).getFullYear();
    const nowYear = new Date(Date.now()).getFullYear();
    const oldMonth = new Date(time).toString().slice(3, 7);
    const oldDay = new Date(time).getDate();
    const second = (Date.now() - Number(time)) / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    const day = hour / 24;
    if (minute < 1) {
      return 'Now';
    } else if (minute > 1 && hour < 1) {
      return `${minute.toFixed(0)}m`;
    } else if (hour > 1 && day < 1) {
      return `${hour.toFixed(0)}h`;
    } else if (day > 1 && oldYear === nowYear) {
      return `${oldMonth} ${oldDay}`;
    } else if (day > 1 && oldYear !== nowYear) {
      return `${oldMonth} ${oldDay}, ${oldYear}`;
    }
  };

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMessage(e.target.value);
  };
  return (
    <Container key={id}>
      <UserImage src={userImage} />
      <MessageWrapper>
        <UserWrapper>
          <UserInfoWrapper>
            <UserInfo>{userId}</UserInfo>
            {createdAt && <CreateDate>{dateFormater(createdAt)}</CreateDate>}
          </UserInfoWrapper>
          {isOwner && (
            <ButtonWrapper>
              <DeleteButton onClick={onDeleteClick} value="Delete">
                삭제
              </DeleteButton>
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
        </UserWrapper>
        <MessageText>{text}</MessageText>
        {photoURL && <Image src={photoURL} />}
      </MessageWrapper>
    </Container>
  );
}
