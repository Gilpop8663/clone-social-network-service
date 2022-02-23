import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IUserObjProps } from 'utils/interface';

const Nav = styled.nav``;

const ListWrapper = styled.ul``;

const List = styled.li``;

export default function Navigation({ userObj }: IUserObjProps) {
  const userName = userObj.displayName ? userObj.displayName : 'Anonymous';
  return (
    <Nav>
      <ListWrapper>
        <List>
          <Link to="/">Home</Link>
        </List>
        <List>
          <Link to="/profile">{userName}의 Profile</Link>
        </List>
      </ListWrapper>
    </Nav>
  );
}
