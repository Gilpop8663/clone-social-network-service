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
import { useForm } from 'react-hook-form';

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
    background: #ffc01d;
  }
  &:nth-child(4) {
    background: #fff4cf;
  }
  &:nth-child(5) {
    background: #ffd9a0;
  }
  &:nth-child(6) {
    background: #ffaa29;
  }
  &:nth-child(7) {
    background: #8c5955;
  }
  &:nth-child(8) {
    background: #b77874;
  }
  &:nth-child(9) {
    background: #fff1db;
  }
  &:nth-child(10) {
    background: #ffb8b4;
  }
  &:nth-child(11) {
    background: #ffffff;
  }
  &:nth-child(12) {
    background: #b77874;
  }
`;

const CalendarBackground = styled.div<{ monthColor: string }>`
  background: ${({ monthColor }) => monthColor};
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

const Day = styled.h5<{ isMinus: boolean; isToday: boolean }>`
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
  background: ${({ isMinus }) => (isMinus ? 'inherit' : '#ffffff')};
  color: ${({ isToday }) => (isToday ? 'red' : 'black')};
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

const ListTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
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

const ListTitle = styled.h2`
  font-family: 'Amatic SC';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 38px;
  /* identical to box height */

  letter-spacing: -0.045em;
`;

const CreateList = styled.div`
  border: 3px dashed #858585;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const DoList = styled.div`
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  gap: 8px;
  padding: 35px;
  z-index: 2;
`;

const TodayBackground = styled.div`
  background: #e4e1ce;
  position: absolute;
  top: 60px;
  width: 100%;
  height: 92%;
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

const TodayInput = styled.input`
  width: 422px;
  height: 75px;

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

const ListCompletedToday = styled(ListDoToday)`
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

const EditForm = styled.form`
  background-color: white;
  width: 80px;
  height: 60px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const EditInput = styled.input`
  width: 100px;
  height: 20px;
  background-color: inherit;
  border: none;
`;

interface IEdit {
  edit: string;
}

const monthColor = [
  '#ffd74a',
  '#ffef9d',
  '#ffc01d',
  '#fff4cf',
  '#ffd9a0',
  '#ffaa29',
  '#8c5955',
  '#b77874',
  '#fff1db',
  '#ffb8b4',
  '#ffffff',
  '#b77874',
];

export default function ToDos({ userObj }: any) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEdit>();
  const [toDos, setToDos] = useState('');
  const [toDoList, setToDoList] = useState<any>([]);
  const [category, setCategory] = useState('');
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [userMonth, setUserMonth] = useState(
    new Date(Date.now()).getMonth() + 1
  );
  const [userYear, setUserYear] = useState(new Date(Date.now()).getFullYear());
  const [dateList, setDateList] = useState<number[]>([]);
  const todayDate = `${userYear}${
    userMonth < 10 ? `0${userMonth}` : userMonth
  }${
    new Date(Date.now()).getDate() < 10
      ? `0${new Date(Date.now()).getDate()}`
      : new Date(Date.now()).getDate()
  }`;
  const [userDate, setUserDate] = useState(todayDate);

  useEffect(() => {
    const q = query(
      collection(dbService, TODO),
      where(CREATOR_ID, '==', `${userObj.uid}`),
      where('createdDate', '==', `${userDate}`),
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
      createdDate: todayDate,
      creatorId: userObj.uid,
    });
    setToDos('');
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setToDos(value);
  };

  const onCategoryClick = (e: any) => {
    const { target: value } = e;
    setCategory(value.innerText);
    setIsEditCategory((prev) => !prev);
  };

  const onEditSubmit = handleSubmit((data) => {
    console.log(data.edit);
    // setCategory(data.edit);
    setIsEditCategory(false);
  });

  const onClickMonth = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: { innerText },
    } = e;
    if (!innerText) return;
    setUserMonth(+innerText);
    setUserDate('');
    getCalenderMonth(+innerText);
  };

  const getCalenderMonth = (month: number) => {
    const date = Date.now();
    const year = new Date(date).getFullYear();

    const nowDate = new Date(year, month, 0).getDate();
    const nowDay = new Date(year, month, -nowDate + 1).getDay();

    const nowCallender = Array.from({ length: nowDate }, (_, i) => i + 1);
    const setDayCallender = Array.from(
      { length: nowDay === 0 ? 6 : nowDay - 1 },
      (_, i) => i - 51
    );
    const callenderArr = [...setDayCallender, ...nowCallender];
    setDateList(callenderArr);
    return callenderArr;
  };

  const getClickDate = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: { innerText },
    } = e;
    if (!innerText) return;
    const date = `${userYear}${userMonth < 10 ? `0${userMonth}` : userMonth}${
      +innerText < 10 ? `0${innerText}` : innerText
    }`;
    setUserDate(date);
  };
  useEffect(() => {
    getCalenderMonth(userMonth);
  }, []);

  return (
    <Container>
      <Helmet>
        <title>Twitter To Do List</title>
      </Helmet>
      <GridContainer>
        <Calendar>
          <MonthList>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((item) => (
              <Month key={item} onClick={onClickMonth}>
                {item}
              </Month>
            ))}
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
                {dateList.map((item) => (
                  <Day
                    isMinus={item < 0}
                    key={item}
                    onClick={getClickDate}
                    isToday={+userDate.slice(-2) === item}
                  >
                    {item > 0 && item}
                  </Day>
                ))}
              </CalenderMonthGrid>
            </CalenderContent>
          </CalenderWrapper>
          <CalendarBackground monthColor={monthColor[userMonth - 1]} />
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
            <ListTitleWrapper>
              <ListTitle onClick={onCategoryClick}>To Do List</ListTitle>
              {isEditCategory && (
                <EditForm onSubmit={onEditSubmit}>
                  <EditInput
                    {...register('edit')}
                    defaultValue={category}
                    type="text"
                  />
                </EditForm>
              )}
            </ListTitleWrapper>
            <CreateList>
              <Img src={PLUS} />
            </CreateList>
          </ListTitleGrid>
          <DoList>
            {toDoList
              .filter((item: any) => item.isFinish === false)
              .map((item: any) => (
                <ToDo
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  isFinish={item.isFinish}
                />
              ))}
          </DoList>
          <TodayBackground />
        </ListDoToday>
        <WhatDoToday>
          <TodayForm
            onSubmit={onSubmit}
            onKeyPress={(e) => onEnterPress(e, onSubmit)}
          >
            <TodayInput
              disabled={toDoList.length > 7}
              type="text"
              maxLength={15}
              onChange={onChange}
              value={toDos}
              placeholder={PLACEHOLDER}
            />
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
          </ListTitleGrid>
          <DoList>
            {toDoList
              .filter((item: any) => item.isFinish === true)
              .map((item: any) => (
                <ToDo
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  isFinish={item.isFinish}
                />
              ))}
          </DoList>
          <TodayBackground />
        </ListCompletedToday>
      </GridContainer>
    </Container>
  );
}
