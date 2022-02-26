import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { authService } from '../../../firebase';
import { EMAIL_NAME, PASSWORD_NAME } from 'constants/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCoffee,
  faCheckSquare,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import MiniLogo from 'components/MiniLogo';

library.add(faCheckSquare, faCoffee, faX);

const Container = styled.div`
  position: absolute;
  left: 0;
  width: 600px;
  height: 700px;
  background-color: white;
  right: 0;
  top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 25px;
  z-index: 3;
  margin: 0 auto;
  margin-bottom: 500px;
  @media only screen and (max-width: 768px) {
    background-color: white;
    border: none;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    z-index: 1;
  }
`;

const Form = styled.form`
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: space-between; ;
`;

const CloseButton = styled.span``;

const Input = styled.input`
  width: 300px;
  height: 40px;
  margin-bottom: 10px;
`;
const Toggle = styled.div``;

const NextButton = styled.input`
  width: 300px;
  height: 40px;
  font-size: 1.6em;
  border-radius: 20px;
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background-color: ${({ theme }) => theme.blackGrayColor};
  &:hover {
    background-color: ${({ theme }) => theme.blackGrayHoverColor};
    transition: all 0.3s ease-in-out;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  @media only screen and (max-width: 768px) {
    width: 90vw;
    margin-bottom: 200px;
  }
`;

const Welcome = styled.span`
  font-size: 2em;
  margin-bottom: 50px;
`;
interface IAuthFormProps {
  newCount: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthForm({ close, newCount }: IAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (newCount) {
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

  return (
    <Container>
      <TopNav>
        <FontAwesomeIcon
          size="2x"
          icon={faX}
          onClick={() => close((prev) => !prev)}
        />
        <MiniLogo />
        <div></div>
      </TopNav>
      <Welcome>
        {newCount ? '계정을 생성하세요' : '트위터에 로그인하기'}
      </Welcome>
      <Form onSubmit={onSubmit}>
        <InputWrapper>
          <Input
            value={email}
            onChange={onChange}
            name={EMAIL_NAME}
            type="email"
            required
            placeholder="이메일 주소를 입력해주세요."
          />
          <Input
            value={password}
            onChange={onChange}
            name={PASSWORD_NAME}
            type="password"
            required
            placeholder="패스워드를 입력해주세요."
          />
        </InputWrapper>
        <NextButton type="submit" value={newCount ? '계정 만들기' : '로그인'} />
        {error}
      </Form>
    </Container>
  );
}
