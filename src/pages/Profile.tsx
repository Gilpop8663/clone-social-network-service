import { authService } from '../firebase';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div``;

const Logout = styled.button``;

export default function Profile() {
  const navigate = useNavigate();
  const onLogoutClick = () => {
    authService.signOut();
    navigate('/');
  };
  return (
    <Container>
      <Logout onClick={onLogoutClick}>Log Out</Logout>
    </Container>
  );
}
