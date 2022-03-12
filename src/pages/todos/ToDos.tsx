import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { dbService } from '../../firebase';
import styled from 'styled-components';
import ToDo from './components/ToDo';
import {
  CREATED_AT,
  CREATOR_ID,
  GUEST_ICON,
  GUEST_NAME,
  TODO,
} from 'constants/constant';
import { Helmet } from 'react-helmet';
import { onEnterPress } from 'utils/utilFn';
import { EDIT, FLAG, PLUS, TO_DO_LEE, TRASH } from 'assets';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 15px 20px;
`;

const GridContainer = styled.div`
  width: 100%;
  display: grid;
  gap: 15px;
  grid-template-columns: 1.2fr 1fr 1.2fr;
  grid-template-rows: 1fr 2fr;
`;

const Calendar = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MonthList = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const Month = styled.div`
  width: 100%;
  height: 38px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Do Hyeon';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  color: #644040;
  &:first-child {
    background: #ffd74a;
  }
  &:nth-child(2) {
    background: #ffef9d;
  }
  &:nth-child(3) {
    background: #ffef9d;
  }
  &:nth-child(4) {
    background: #ffef9d;
  }
  &:nth-child(5) {
    background: #ffef9d;
  }
  &:nth-child(6) {
    background: #ffaa29;
  }
  &:nth-child(7) {
    background: #ffef9d;
  }
  &:nth-child(8) {
    background: #b77874;
  }
  &:nth-child(9) {
    background: #fff1db;
  }
  &:nth-child(10) {
    background: #ffef9d;
  }
  &:nth-child(11) {
    background: #ffef9d;
  }
  &:nth-child(12) {
    background: #b77874;
  }
`;

const CalendarBackground = styled.div`
  background: #ffd9a0;
  z-index: -1;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 95%;
  border-radius: 10px;
`;

const CalenderWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 25px;
`;

const CalenderContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffeed3;
  border-radius: 2px;
  padding: 5px 4px;
`;

const CalendarDayGrid = styled.div`
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarDay = styled.h3`
  height: 40px;

  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 2px;

  margin-bottom: 9px;

  background: #ffd9a0;
  color: #000000;
`;

const CalenderMonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const Day = styled.h5`
  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;

  border-radius: 2px;
  background: #ffffff;
  color: #000000;
`;

const ToDoTitle = styled.h1`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Achievement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffd9a0;
  border-radius: 10px;
`;

const AchievementText = styled.h2`
  font-family: 'Sacramento';
  font-style: normal;
  font-weight: 400;
  font-size: 80px;
  line-height: 117px;
  /* identical to box height */

  display: flex;
  align-items: center;
  text-align: center;

  color: #ffffff;
`;

const AchievementRate = styled.h3`
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  font-size: 120px;
  line-height: 144px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #ff6c6c;
`;

const ListDoToday = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ListTitleGrid = styled.div`
  height: 67px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const ListTitle = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Amatic SC';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 38px;
  /* identical to box height */

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  letter-spacing: -0.045em;

  color: #ffffff;
  &:first-child {
    background: #e4e1ce;
  }
  &:nth-child(2) {
    background: #c6b8d8;
  }
  &:nth-child(3) {
    background: #c6b8d8;
  }
  &:nth-child(4) {
    background: #b8d8d0;
  }
  &:nth-child(5) {
    background: #d8c7b8;
  }
`;

const CreateList = styled.div`
  border: 3px dashed #858585;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DoList = styled.div`
  display: grid;
  grid-template-rows: repeat(8, minmax(60px, 1fr));
  padding: 35px;
  z-index: 2;
`;

const ListItem = styled.div`
  background: #ffffff;
  border-radius: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 23px;

  color: #000000;
`;

const ItemText = styled.span`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const IconWrapper = styled.div`
  width: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: #d0cfc9;
  border-radius: 6px;
`;

const TodayBackground = styled.div`
  background: #e4e1ce;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 90.25%;
  z-index: 1;
  border-radius: 10px;
`;

const WhatDoToday = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const TodayForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #000000;
  box-sizing: border-box;
  border-radius: 10px;
  height: 118px;
`;

const TodayInput = styled.textarea`
  width: 422px;
  height: 75px;

  flex-direction: ;
  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
  resize: none;
  &::placeholder {
    display: flex;
    height: 75px;

    align-items: center;
  }
`;

const ListCompletedToday = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterInfo = styled.div`
  display: flex;
  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  /* identical to box height */

  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 5px;
`;

const MyLink = styled.a`
  margin-right: 10px;
`;

const FooterText = styled.h6``;

const FooterbyDesigner = styled.h6`
  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const Img = styled.img``;
export default function ToDos({ userObj }: any) {
  const [toDos, setToDos] = useState('');
  const [toDoList, setToDoList] = useState<any>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, TODO),
      where(CREATOR_ID, '==', `${userObj.uid}`),
      orderBy(CREATED_AT, 'desc')
    );
    onSnapshot(q, async (snapshot) => {
      const toDosArr = snapshot.docs.map((item: any) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      setToDoList(toDosArr);
    });
  }, [userObj.uid]);

  const PLACEHOLDER = "\nToday's to-do.";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(dbService, TODO), {
      text: toDos,
      isFinish: false,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      userId: userObj.displayName ? userObj.displayName : GUEST_NAME,
      userImage: userObj.photoURL !== null ? userObj.photoURL : GUEST_ICON,
    });
    setToDos('');
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setToDos(value);
  };
  return (
    <Container>
      <Helmet>
        <title>Twitter To Do List</title>
      </Helmet>
      <GridContainer>
        <Calendar>
          <MonthList>
            <Month>1</Month>
            <Month>2</Month>
            <Month>3</Month>
            <Month>4</Month>
            <Month>5</Month>
            <Month>6</Month>
            <Month>7</Month>
            <Month>8</Month>
            <Month>9</Month>
            <Month>10</Month>
            <Month>11</Month>
            <Month>12</Month>
          </MonthList>
          <CalenderWrapper>
            <CalenderContent>
              <CalendarDayGrid>
                <CalendarDay>mon</CalendarDay>
                <CalendarDay>tue</CalendarDay>
                <CalendarDay>wed</CalendarDay>
                <CalendarDay>thu</CalendarDay>
                <CalendarDay>fri</CalendarDay>
                <CalendarDay>sat</CalendarDay>
                <CalendarDay>sun</CalendarDay>
              </CalendarDayGrid>
              <CalenderMonthGrid>
                {Array.from({ length: 35 }, (_, i) => i + 1).map((item) => (
                  <Day key={item}>{item}</Day>
                ))}
              </CalenderMonthGrid>
            </CalenderContent>
          </CalenderWrapper>
          <CalendarBackground />
        </Calendar>
        <ToDoTitle>
          <Img src={TO_DO_LEE} alt="todoList_title" />
        </ToDoTitle>
        <Achievement>
          <AchievementText>Achievement rate</AchievementText>
          <AchievementRate>100%</AchievementRate>
        </Achievement>
        <ListDoToday>
          <ListTitleGrid>
            <ListTitle>여행</ListTitle>
            <ListTitle>음식</ListTitle>
            <ListTitle>공부</ListTitle>
            <ListTitle>재테크</ListTitle>
            <ListTitle>취미</ListTitle>
          </ListTitleGrid>
          <DoList>
            <ListItem>
              <ItemText>돼지 갈비 양념하기</ItemText>
              <IconWrapper>
                <Icon>
                  <Img src={TRASH} alt="delete" />
                </Icon>
                <Icon>
                  <Img src={FLAG} alt="finish" />
                </Icon>
                <Icon>
                  <Img src={EDIT} alt="edit" />
                </Icon>
              </IconWrapper>
            </ListItem>
          </DoList>
          <TodayBackground />
        </ListDoToday>
        <WhatDoToday>
          <TodayForm>
            <TodayInput placeholder={PLACEHOLDER} />
          </TodayForm>
          <Footer>
            <FooterInfo>
              <MyLink>Blog</MyLink>
              <MyLink>Github</MyLink>
              <FooterText>{new Date(Date.now()).getFullYear()}</FooterText>
            </FooterInfo>
            <FooterbyDesigner>design by dayaya</FooterbyDesigner>
          </Footer>
        </WhatDoToday>
        <ListCompletedToday>
          <ListTitleGrid>
            <ListTitle>여행</ListTitle>
            <CreateList>
              <Img src={PLUS} alt="add_List" />
            </CreateList>
          </ListTitleGrid>
          <DoList>
            <ListItem>
              <ItemText>돼지 갈비 양념하기</ItemText>
              <IconWrapper>
                <Icon>
                  <Img src={TRASH} alt="delete" />
                </Icon>
                <Icon>
                  <Img src={FLAG} alt="finish" />
                </Icon>
                <Icon>
                  <Img src={EDIT} alt="edit" />
                </Icon>
              </IconWrapper>
            </ListItem>
          </DoList>
          <TodayBackground />
        </ListCompletedToday>
      </GridContainer>
    </Container>
  );
}
