import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav``;

const ListWrapper = styled.ul``;

const List = styled.li``;

export default function Navigation() {
  return (
    <Nav>
      <ListWrapper>
        <List>
          <Link to="/">Home</Link>
        </List>
        <List>
          <Link to="/profile">Profile</Link>
        </List>
      </ListWrapper>
    </Nav>
  );
}
