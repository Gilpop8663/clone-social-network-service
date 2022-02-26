import React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
  min-height: 50px;
  background-color: white;
  z-index: 1;
`;

const Link = styled.a`
  font-size: 1.6em;
  margin-left: 10px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    border: none;
  }
`;

const List = styled.span`
  font-size: 1.6em;
  margin-left: 10px;
`;

export default function Footer() {
  return (
    <Container>
      <Link target="_blank" href="https://hell-of-company-builder.tistory.com/">
        블로그
      </Link>
      <Link target="_blank" href="https://github.com/Gilpop8663">
        깃허브
      </Link>
      <List>&copy; {new Date().getFullYear()} 5Lines</List>
    </Container>
  );
}
