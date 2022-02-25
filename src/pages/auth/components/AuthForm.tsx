import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { authService } from '../../../firebase';
import { EMAIL_NAME, PASSWORD_NAME } from 'constants/constant';

const Form = styled.form``;

const Input = styled.input``;
const Toggle = styled.div``;

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(authService, email, password);
      } else {
        await signInWithEmailAndPassword(authService, email, password);
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

  return (
    <>
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
    </>
  );
}
