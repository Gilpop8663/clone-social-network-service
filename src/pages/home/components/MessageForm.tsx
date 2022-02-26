import React, { FormEvent, useRef, useState } from 'react';
import { dbService, storageService } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import styled from 'styled-components';
import { MESSAGES } from 'constants/constant';
import { addDoc, collection } from 'firebase/firestore';
import { IUserObjProps } from 'utils/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faImage, faX } from '@fortawesome/free-solid-svg-icons';

library.add(faImage, faX);

const Form = styled.form`
  padding-top: 17px;
  padding-left: 17px;
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  padding-bottom: 25px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding-right: 20px;
  margin-bottom: 20px;
`;

const Home = styled.div`
  font-size: 1.6em;
  font-weight: 600;
  margin-bottom: 30px;
`;

const SubmitInput = styled.input<{ isMessage: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  background: none;
  color: white;
  font-weight: 600;
  font-size: 1.6em;
  background-color: ${({ theme, isMessage }) =>
    isMessage ? theme.mainBlueColor : theme.mainWhiteBlueColor};
`;

const PhotoInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;
const TextInput = styled.input`
  height: 55px;
  border: none;
  font-size: 2em;
  margin-bottom: 10px;
  &::placeholder {
    font-size: 2em;
    border: none;
    width: 100%;
  }
  &:placeholder-shown {
    font-size: 1em;
    width: 100%;
  }
  &:focus {
    outline-width: 0;
  }
  &:-webkit-input-placeholder {
    font-size: 1.6em;
    width: 100%;
  }
  &:focus::placeholder {
    border: none;
    width: 100%;
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.mainBlueColor};
  &:hover {
    border-radius: 50%;
    background-color: #e8f5fd;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  height: 50px;
  margin-bottom: 20px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 20px;
  margin-bottom: 20px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Button = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  top: 15px;
  left: 15px;
  transition: all 0.1s ease-in-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const BottomNav = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 50px;
`;

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
      <Home>Home</Home>
      <TextWrapper>
        <ProfileImg src={userObj.photoURL} />
        <TextInput
          value={message}
          onChange={onChange}
          type="text"
          maxLength={120}
          placeholder="네 생각은 뭔데?"
        />
      </TextWrapper>
      {photoSource && (
        <PhotoWrapper>
          <Photo src={photoSource} />
          <Button onClick={onClearPhoto}>
            <FontAwesomeIcon color="white" icon={faX} />
          </Button>
        </PhotoWrapper>
      )}
      <BottomNav>
        <Label htmlFor="photo_id">
          <FontAwesomeIcon size="2x" icon={faImage} />
          <PhotoInput
            ref={photoRef}
            type="file"
            accept="images/*"
            onChange={onFileChange}
            id="photo_id"
          />
        </Label>
        <SubmitInput
          isMessage={message.length > 0 || photoSource !== ''}
          type="submit"
          value="보내기"
        />
      </BottomNav>
    </Form>
  );
}
