import React from 'react';
import styled from 'styled-components';

const LoginSelect = styled.button``;

interface IAuthSocialLoginProps {
  name: string;
  onSocialClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  title: string;
}

export default function AuthSocialLogin({
  name,
  onSocialClick,
  title,
}: IAuthSocialLoginProps) {
  return (
    <LoginSelect name={name} onClick={onSocialClick}>
      Continue with {title}
    </LoginSelect>
  );
}
