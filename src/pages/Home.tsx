import React, { FormEvent, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import styled from 'styled-components';
import { dbService } from '../firebase';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

const MessageWrapper = styled.div``;

const Message = styled.div``;

const MessageText = styled.span``;

interface IMessageListProps {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string;
}

interface IHomeProps {
  userObj?: any;
}

export default function Home({ userObj }: IHomeProps) {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<any>([]);
  //   const getMessageList = async () => {
  //     const docRef = query(collection(dbService, 'messages'));
  //     const querySnapshot = await getDocs(docRef);
  //     querySnapshot.forEach((doc: any) => {
  //       const messageObj = {
  //         ...doc.data(),
  //         id: doc.id,
  //       };
  //       setMessageList((prev) => [...prev, messageObj]);
  //     });
  //   };

  useEffect(() => {
    const q = query(
      collection(dbService, 'messages'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, async (snapshot) => {
      const messageArr = snapshot.docs.map((item: any) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      //   console.log(messageArr);
      setMessageList(messageArr);
    });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    await addDoc(collection(dbService, 'messages'), {
      text: message,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setMessage('');
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          value={message}
          onChange={onChange}
          type="text"
          maxLength={120}
          placeholder="네 생각은 뭔데?"
        />
        <Input type="submit" value="보내기" />
      </Form>
      <MessageWrapper>
        {messageList.map((item: IMessageListProps) => (
          <Message key={item.id}>
            <MessageText>{item.text}</MessageText>
          </Message>
        ))}
      </MessageWrapper>
    </Container>
  );
}
