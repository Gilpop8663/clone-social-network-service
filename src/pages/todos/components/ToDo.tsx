import { TODO } from 'constants/constant';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dateFormater } from 'utils/utilFn';
import { dbService } from '../../../firebase';

interface IToDoProps {
  id: string;
  text: string;
  photoURL: string;
  userId: string;
  createdAt: number | Date;
  userImage: string;
}

const Container = styled.li<{ isFinish: boolean }>`
  display: flex;
  width: 600px;
  height: 100%;
  border: ${({ theme }) => theme.baseBorderStyle};
  background-color: ${({ theme, isFinish }) =>
    isFinish ? theme.greenColor : 'white'};
  border-top: none;
  padding: 17px;
`;

const ToDoText = styled.span`
  font-size: 1.6em;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div``;

const ToDoBtn = styled.button`
  width: 60px;
  height: 30px;
  font-size: 1.2em;
  border-radius: 15px;
  border: ${({ theme }) => theme.baseBorderStyle};
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const DeleteButton = styled(ToDoBtn)`
  color: red;
  margin-right: 10px;
`;

const ToDoFinishBtn = styled(ToDoBtn)<{ isFinish: boolean }>`
  color: ${({ theme, isFinish }) => (isFinish ? 'red' : 'black')};
  margin-right: 10px;
`;

const EditForm = styled.form``;

const EditInput = styled.input``;

const UserInfoWrapper = styled.div`
  display: flex;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const CreateDate = styled.span`
  font-size: 1.6em;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 100;
  margin-left: 10px;
`;

const UserWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 500px;
`;

const UserInfo = styled.div`
  font-size: 1.6em;
  font-weight: bold;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

export default function ToDo({
  id,
  text,
  userId,
  photoURL,
  createdAt,
  userImage,
}: IToDoProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);
  const [isFinish, setIsFinish] = useState(false);
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

  const onFinishClick = () => {
    setIsFinish((prev) => !prev);
  };
  return (
    <Container isFinish={isFinish}>
      <UserImage src={userImage} />
      <MessageWrapper>
        <UserWrapper>
          <UserInfoWrapper>
            <UserInfo>{userId}</UserInfo>
            {createdAt && <CreateDate>{dateFormater(createdAt)}</CreateDate>}
          </UserInfoWrapper>
          <ButtonWrapper>
            <DeleteButton onClick={onDeleteClick}>삭제</DeleteButton>
            <ToDoFinishBtn isFinish={isFinish} onClick={onFinishClick}>
              {isFinish ? '미완료' : '완료'}
            </ToDoFinishBtn>
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
        </UserWrapper>
        <ToDoText>{text}</ToDoText>
      </MessageWrapper>
    </Container>
  );
}
