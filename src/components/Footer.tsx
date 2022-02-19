import React from 'react';
import styled from 'styled-components';

const Container = styled.footer``;

export default function Footer() {
  return <Container>&copy; {new Date().getFullYear()} 5Lines</Container>;
}
