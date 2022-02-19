import { EMAIL_NAME, GITHUB, GOOGLE, PASSWORD_NAME } from 'constants/constant';
import { authService } from '../firebase';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

const LoginSelectBox = styled.div``;

const LoginSelect = styled.button``;

const Toggle = styled.div``;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

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
    } catch (error: any) {
      setError(error.message.toString().split(':')[1]);
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

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;
    let provider;
    if (name === GOOGLE) {
      provider = new GoogleAuthProvider();
    } else if (name === GITHUB) {
      provider = new GithubAuthProvider();
    }
    provider && (await signInWithPopup(authService, provider));
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          value={email}
          onChange={onChange}
          name={EMAIL_NAME}
          type="email"
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
        {error}
      </Form>
      <Toggle onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </Toggle>
      <LoginSelectBox>
        <LoginSelect name={GOOGLE} onClick={onSocialClick}>
          Continue with Google
        </LoginSelect>
        <LoginSelect name={GITHUB} onClick={onSocialClick}>
          Continue with Github
        </LoginSelect>
      </LoginSelectBox>
    </Container>
  );
}
