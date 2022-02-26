import React from 'react';
import styled from 'styled-components';

const LoginSelect = styled.button`
  width: 300px;
  height: 40px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }
`;

interface IAuthSocialLoginProps {
  name: string;
  onSocialClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  title: string;
  imageSrc: string;
}

export default function AuthSocialLogin({
  name,
  onSocialClick,
  title,
  imageSrc,
}: IAuthSocialLoginProps) {
  return (
    <LoginSelect name={name} onClick={onSocialClick}>
      <img
        src={imageSrc}
        height={18}
        width={18}
        style={{
          borderRadius: '50%',
          marginRight: '10px',
          backgroundColor: 'white',
        }}
        alt=""
      />
      {title} 계정으로 가입하기
    </LoginSelect>
  );
}
