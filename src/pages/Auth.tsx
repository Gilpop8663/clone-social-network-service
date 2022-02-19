import { EMAIL_NAME, PASSWORD_NAME } from 'constants/constant';
import { authService } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

const LoginSelectBox = styled.div``;

const LoginSelect = styled.button``;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data;
    try {
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === EMAIL_NAME) {
      setEmail(value);
    } else if (name === PASSWORD_NAME) {
      setPassword(value);
    }
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          value={email}
          onChange={onChange}
          name={EMAIL_NAME}
          type="name"
          required
          placeholder="Name"
        />
        <Input
          value={password}
          onChange={onChange}
          name={PASSWORD_NAME}
          type="password"
          required
          placeholder="Password"
        />
        <Input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
      </Form>
      <LoginSelectBox>
        <LoginSelect>Continue with Google</LoginSelect>
        <LoginSelect>Continue with Github</LoginSelect>
      </LoginSelectBox>
    </Container>
  );
}
