import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { dbService, storageService } from '../firebase';
import { IMessageListProps } from 'utils/interface';
import Message from 'components/Message';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

const MessageWrapper = styled.div``;

const PhotoWrapper = styled.div``;

const Photo = styled.img``;

const Button = styled.button``;

interface IHomeProps {
  userObj: any;
}

export default function Home({ userObj }: IHomeProps) {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<any>([]);
  const [photoSource, setPhotoSource] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);

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
    let photoURL = '';
    if (photoSource !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, photoSource, 'data_url');
      photoURL = await getDownloadURL(response.ref);
      console.log(photoURL);
    }
    await addDoc(collection(dbService, 'messages'), {
      text: message,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      photoURL,
    });
    setMessage('');
    onClearPhoto();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      const {
        currentTarget: { result },
      } = e;
      setPhotoSource(result);
    };
    reader.readAsDataURL(imageFile);
  };

  const onClearPhoto = () => {
    if (!photoRef.current?.value) return;
    photoRef.current.value = '';
    setPhotoSource('');
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
        <Input
          ref={photoRef}
          type="file"
          accept="images/*"
          onChange={onFileChange}
        />
        <Input type="submit" value="보내기" />
        {photoSource && (
          <PhotoWrapper>
            <Photo src={photoSource} width="50px" height="50px" />
            <Button onClick={onClearPhoto}>Clear</Button>
          </PhotoWrapper>
        )}
      </Form>
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
