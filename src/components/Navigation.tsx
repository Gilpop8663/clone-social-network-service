import {
  GUEST_NAME,
  HOME_URL,
  PROFILE_URL,
  TODOS_URL,
} from 'constants/constant';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IUserObjProps } from 'utils/interface';

const Nav = styled.nav``;

const ListWrapper = styled.ul``;

const List = styled.li``;

export default function Navigation({ userObj }: IUserObjProps) {
  const userName = userObj.displayName ? userObj.displayName : GUEST_NAME;
  return (
    <Nav>
      <ListWrapper>
        <List>
          <Link to={HOME_URL}>Home</Link>
        </List>
        <List>
          <Link to={PROFILE_URL}>{userName}의 Profile</Link>
        </List>
        <List>
          <Link to={TODOS_URL}>{userName}의 ToDo List</Link>
        </List>
      </ListWrapper>
    </Nav>
  );
}
