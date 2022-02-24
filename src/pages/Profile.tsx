import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService, storageService } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const Container = styled.div``;

const Logout = styled.button``;

const Form = styled.form``;

const Image = styled.img``;

const Input = styled.input``;

interface IProfileProps {
  userObj: any;
  refreshUser: () => void;
}

export default function Profile({ userObj, refreshUser }: IProfileProps) {
  const userName = userObj.displayName ? userObj.displayName : 'Anonymous';
  const [newDisplayName, setNewDisplayName] = useState(userName);
  const [profileImg, setProfileImg] = useState(userObj.photoURL);
  const navigate = useNavigate();
  const onLogoutClick = () => {
    authService.signOut();
    navigate('/');
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let profileURL = '';
    if (profileImg !== '') {
      const fileRef = ref(
        storageService,
        `${userObj.uid}/profileImg/${uuidv4()}`
      );
      const response = await uploadString(fileRef, profileImg, 'data_url');
      profileURL = await getDownloadURL(response.ref);
    }
    if (userName !== newDisplayName || userObj.photoURL !== profileImg) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: profileURL,
      });
    }
    refreshUser();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.target.value);
  };

  const onProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setProfileImg(result);
    };
    reader.readAsDataURL(imageFile);
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <Input type="file" accept="images/*" onChange={onProfileImage} />
        <Input type="submit" value="바꾸기" />
      </Form>
      <Image src={userObj.photoURL} />
      <Logout onClick={onLogoutClick}>Log Out</Logout>
    </Container>
  );
}
