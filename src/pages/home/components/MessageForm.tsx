import React, { FormEvent, useRef, useState } from 'react';
import { dbService, storageService } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import styled from 'styled-components';
import { MESSAGES } from 'constants/constant';
import { addDoc, collection } from 'firebase/firestore';
import { IUserObjProps } from 'utils/interface';

const Form = styled.form``;

const Input = styled.input``;

const PhotoWrapper = styled.div``;

const Photo = styled.img``;

const Button = styled.button``;

export default function MessageForm({ userObj }: IUserObjProps) {
  const [message, setMessage] = useState('');
  const [photoSource, setPhotoSource] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    let photoURL = '';
    if (photoSource !== '') {
      const fileRef = ref(
        storageService,
        `${userObj.uid}/${MESSAGES}/${uuidv4()}`
      );
      const response = await uploadString(fileRef, photoSource, 'data_url');
      photoURL = await getDownloadURL(response.ref);
    }
    await addDoc(collection(dbService, MESSAGES), {
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
  );
}
