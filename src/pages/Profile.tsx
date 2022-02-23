import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  collection,
  getDocs,
  orderBy,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { authService, dbService } from '../firebase';
import { IUserObjProps } from 'utils/interface';
import { updateProfile } from 'firebase/auth';

const Container = styled.div``;

const Logout = styled.button``;

const Form = styled.form``;

const Input = styled.input``;

export default function Profile({ userObj }: IUserObjProps) {
  const userName = userObj.displayName ? userObj.displayName : 'Anonymous';
  const [newDisplayName, setNewDisplayName] = useState(userName);
  const navigate = useNavigate();
  const onLogoutClick = () => {
    authService.signOut();
    navigate('/');
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.target.value);
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
        <Input type="submit" value="바꾸기" />
      </Form>
      <Logout onClick={onLogoutClick}>Log Out</Logout>
    </Container>
  );
}
