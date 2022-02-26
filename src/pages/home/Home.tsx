import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService } from '../../firebase';
import { IMessageListProps, IUserObjProps } from 'utils/interface';
import { CREATED_AT, MESSAGES } from 'constants/constant';
import MessageForm from './components/MessageForm';
import Message from './components/Message';

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageWrapper = styled.div``;

export default function Home({ userObj }: IUserObjProps) {
  const [messageList, setMessageList] = useState<any>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, MESSAGES),
      orderBy(CREATED_AT, 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const messageArr = snapshot.docs.map((item: any) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      setMessageList(messageArr);
    });
  }, []);

  return (
    <Container>
      <MessageForm userObj={userObj} />
      <MessageWrapper>
        {messageList.map((item: IMessageListProps) => (
          <Message
            key={item.id}
            id={item.id}
            text={item.text}
            photoURL={item.photoURL}
            isOwner={userObj.uid === item.creatorId}
          />
        ))}
      </MessageWrapper>
    </Container>
  );
}
