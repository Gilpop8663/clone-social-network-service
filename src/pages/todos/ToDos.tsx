import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { dbService } from '../../firebase';
import styled from 'styled-components';
import ToDo from './components/ToDo';
import { CREATED_AT, CREATOR_ID, TODO } from 'constants/constant';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

const ToDosContainer = styled.ul``;

export default function ToDos({ userObj }: any) {
  const [toDos, setToDos] = useState('');
  const [toDoList, setToDoList] = useState<any>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, TODO),
      where(CREATOR_ID, '==', `${userObj.uid}`),
      orderBy(CREATED_AT, 'desc')
    );
    onSnapshot(q, async (snapshot) => {
      const toDosArr = snapshot.docs.map((item: any) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      setToDoList(toDosArr);
    });
  }, [userObj.uid]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(dbService, TODO), {
      text: toDos,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setToDos('');
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setToDos(value);
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          type="text"
          placeholder="할 일을 적어주세요"
        />
        <Input type="submit" value="보내기" />
      </Form>
      <ToDosContainer>
        {toDoList.map((item: any) => (
          <ToDo key={item.id} id={item.id} text={item.text} />
        ))}
      </ToDosContainer>
    </Container>
  );
}
