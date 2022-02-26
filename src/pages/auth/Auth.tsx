import React, { useState } from 'react';
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
import MiniLogo from 'components/MiniLogo';

const Container = styled.div`
  height: 93vh;
  display: grid;
  grid-template-columns: 1.2fr minmax(700px, 1fr);
  @media only screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    padding-top: 200px;
  }
`;

const ImageContainer = styled.div<{ isClick: boolean }>`
  background: url('https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 1024px) {
    order: 2;
  }
  @media only screen and (max-width: 768px) {
    display: ${({ isClick }) => (isClick ? 'none' : 'flex')};
  }
`;

const LogoSvg = styled.svg`
  fill: white;
  max-height: 300px;
  width: 20vw;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 5%;
  padding-right: 8%;
  @media only screen and (max-width: 1024px) {
    padding-left: 5%;
    width: 90%;
    padding-right: 8%;
  }
`;

const LoginSelectBox = styled.div``;

const ProducutMessage = styled.span`
  font-size: 6em;
  font-weight: 600;
  margin-bottom: 50px;
  @media only screen and (max-width: 768px) {
    font-size: 4em;
  }
`;

const NowCreateText = styled.span`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 85px;
  @media only screen and (max-width: 768px) {
    font-size: 2em;
  }
`;

const OrLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  margin-bottom: 10px;
`;

const Line = styled.div`
  width: 130px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const BaseButton = styled.div`
  width: 300px;
  height: 40px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  background-color: ${({ theme }) => theme.mainBlueColor};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 600;
  &:hover {
    background-color: ${({ theme }) => theme.mainHoverBlueColor};
    transition: all 0.3s ease-in-out;
  }
`;

const CreateId = styled(BaseButton)`
  background-color: ${({ theme }) => theme.mainBlueColor};
  color: white;
  margin-bottom: 60px;
  &:hover {
    background-color: ${({ theme }) => theme.mainHoverBlueColor};
  }
`;

const LoginId = styled(BaseButton)`
  background-color: white;
  color: ${({ theme }) => theme.mainBlueColor};
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 45px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Already = styled.span`
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overlay = styled.div`
  @media only screen and (min-width: 768px) {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 2;
  }
`;

export default function Auth() {
  const [isCreate, setIsCreate] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
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
  const onCreateClick = () => {
    setIsCreate((prev) => !prev);
  };
  const onLoginClick = () => {
    setIsLogin((prev) => !prev);
  };
  return (
    <>
      {(isCreate || isLogin) && <Overlay />}
      <Container>
        <ImageContainer isClick={isCreate || isLogin}>
          <LogoSvg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </LogoSvg>
        </ImageContainer>
        <FormContainer>
          <MiniLogo />
          <ProducutMessage>지금 일어나고 있는 일</ProducutMessage>
          <NowCreateText>오늘 트위터에 가입하세요.</NowCreateText>
          <LoginSelectBox>
            <AuthSocialLogin
              name={GOOGLE}
              onSocialClick={onSocialClick}
              title="Google"
              imageSrc="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            />
            <AuthSocialLogin
              name={GITHUB}
              onSocialClick={onSocialClick}
              title="Github"
              imageSrc="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            />
          </LoginSelectBox>
          <OrLine>
            <Line />
            또는
            <Line />
          </OrLine>
          <CreateId onClick={onCreateClick}>이메일 주소로 가입하기</CreateId>
          <Already>이미 트위터에 가입하셨나요?</Already>
          <LoginId onClick={onLoginClick}>로그인</LoginId>
          {isCreate && <AuthForm close={setIsCreate} newCount={true} />}
          {isLogin && <AuthForm close={setIsLogin} newCount={false} />}
        </FormContainer>
      </Container>
    </>
  );
}
