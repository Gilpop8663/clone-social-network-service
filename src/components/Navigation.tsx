import { faHome, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  GUEST_NAME,
  HOME_URL,
  PROFILE_URL,
  TODOS_URL,
} from 'constants/constant';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IUserObjProps } from 'utils/interface';

const Nav = styled.nav`
  position: fixed;
  top: 10%;
  left: 5%;
  @media only screen and (max-width: 1300px) {
    left: 0%;
  }
`;

const ListWrapper = styled.ul``;

const Icon = styled.div`
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const List = styled.li<{ match: any }>`
  padding: 15px 30px;
  display: flex;
  align-items: center;
  font-size: 2em;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  font-weight: ${({ match }) => (match ? 'bold' : '400')};
  text-decoration: none;
  margin-bottom: 10px;
  cursor: pointer;
  a {
    color: ${({ match, theme }) =>
      match ? theme.blackGrayColor : theme.blackGrayHoverColor};
    text-decoration: none;
    @media only screen and (max-width: 1220px) {
      display: none;
    }
  }
  div {
    color: ${({ match, theme }) =>
      match ? theme.blackGrayColor : theme.blackGrayHoverColor};
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export default function Navigation({ userObj }: IUserObjProps) {
  const homeMatch = useMatch(HOME_URL);
  const profileMatch = useMatch(PROFILE_URL);
  const todoMatch = useMatch(TODOS_URL);
  const navigate = useNavigate();
  const userName = userObj.displayName ? userObj.displayName : GUEST_NAME;
  const onURLClick = (URL: string) => {
    navigate(URL);
  };

  return (
    <Nav>
      <ListWrapper>
        <List onClick={() => onURLClick(HOME_URL)} match={homeMatch}>
          <Icon>
            <FontAwesomeIcon size="1x" icon={faHome} />
          </Icon>
          <Link to={HOME_URL}>Home</Link>
        </List>
        <List onClick={() => onURLClick(PROFILE_URL)} match={profileMatch}>
          <Icon>
            <FontAwesomeIcon size="1x" icon={faUser} />
          </Icon>
          <Link to={PROFILE_URL}>{userName}의 Profile</Link>
        </List>
        <List onClick={() => onURLClick(TODOS_URL)} match={todoMatch}>
          <Icon>
            <FontAwesomeIcon size="1x" icon={faList} />
          </Icon>
          <Link to={TODOS_URL}>{userName}의 ToDo List</Link>
        </List>
      </ListWrapper>
    </Nav>
  );
}
