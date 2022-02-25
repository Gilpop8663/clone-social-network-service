import React from 'react';
import { GITHUB, GOOGLE } from 'constants/constant';
import { authService } from '../../firebase';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import styled from 'styled-components';
import AuthForm from './components/AuthForm';
import AuthSocialLogin from './components/AuthSocialLogin';

const Container = styled.div``;

const LoginSelectBox = styled.div``;

export default function Auth() {
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
      <AuthForm />
      <LoginSelectBox>
        <AuthSocialLogin
          name={GOOGLE}
          onSocialClick={onSocialClick}
          title="Google"
        />
        <AuthSocialLogin
          name={GITHUB}
          onSocialClick={onSocialClick}
          title="Github"
        />
      </LoginSelectBox>
    </Container>
  );
}
