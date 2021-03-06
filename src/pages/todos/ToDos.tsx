import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
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
  HOME_URL,
  TODO,
  TO_DO_LIST,
} from 'constants/constant';
import { onEnterPress } from 'utils/utilFn';
import { EDIT, FLAG, PLUS, TO_DO_LEE, TRASH } from 'assets';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 15px 20px;
`;

const GridContainer = styled.div`
  width: 100%;
  height: 97vh;
  display: grid;
  gap: 25px;
  place-content: flex-start center;
  grid-template-columns: 1.2fr 1fr 1.2fr;
  grid-template-rows: 1fr 2fr;
  @media only screen and (max-width: 1450px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
  }
  @media only screen and (max-width: 768px) {
    width: 350px;
    padding: 50px 0px;
    place-content: flex-start center;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
`;

const Calendar = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 500px;
  @media only screen and (max-width: 1450px) {
    order: 0;
  }
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

  cursor: pointer;
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
  @media only screen and (max-width: 768px) {
    font-size: 16px;
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
  cursor: pointer;
`;

const ToDoTitle = styled.h1`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  @media only screen and (max-width: 1450px) {
    display: none;
    visibility: none;
  }
`;

const Achievement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffd9a0;
  border-radius: 10px;
  @media only screen and (max-width: 1450px) {
    display: none;
    visibility: none;
  }
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
  @media only screen and (max-width: 1450px) {
    order: 2;
  }
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
  cursor: pointer;

  &:first-child {
    background: #e4e1ce;
  }
  &:nth-child(2) {
    background: #c6b8d8;
  }
  &:nth-child(3) {
    background: #b77874;
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
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
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

const TodayBackground = styled.div<{ listWrapperColor: string }>`
  background: ${({ listWrapperColor }) => listWrapperColor};
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
  @media only screen and (max-width: 1450px) {
    order: 1;
    justify-content: space-between;
  }
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

  font-family: 'Handlee', 'Roboto';
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
  outline: none;
  &::placeholder {
    display: flex;
    text-align: center;
    height: 75px;

    align-items: center;
  }
  &:focus::-webkit-input-placeholder {
    color: transparent;
  }
  &:focus:-moz-placeholder {
    color: transparent;
  }
  @media only screen and (max-width: 768px) {
    width: 350px;
  }
`;

const ListCompletedToday = styled(ListDoToday)`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  @media only screen and (max-width: 1450px) {
    order: 3;
  }
  @media only screen and (max-width: 768px) {
    padding-bottom: 200px;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media only screen and (max-width: 1450px) {
    display: none;
    visibility: none;
  }
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
  text-decoration: none;
  color: black;
`;

const FooterText = styled.h6``;

const FooterbyDesigner = styled.a`
  font-family: 'Handlee';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  text-decoration: none;

  color: #000000;
`;

const Img = styled.img``;

const EditForm = styled.form`
  background-color: inherit;
  width: 80px;
  height: 60px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const EditInput = styled.input`
  width: 80px;
  height: 20px;
  background-color: inherit;
  outline: none;
  border: none;
`;

const Icon = styled.div`
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const HomeLink = styled.div`
  justify-self: flex-start;
  a {
    color: black;
  }
  @media only screen and (max-width: 1450px) {
    display: none;
    visibility: none;
  }
`;

const MobileToDoLee = styled.div`
  @media only screen and (min-width: 1450px) {
    display: none;
  }
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

const listWrapperColor = [
  '#e4e1ce',
  '#c6b8d8',
  '#b77874',
  '#b8d8d0',
  '#d8c7b8',
];

interface IToDoProps {
  toDoList: [
    {
      createdDate: string;
      categoryList: ICategory[];
    }
  ];
}

export interface ICategory {
  id: string;
  title: string;
  list: IToDo[];
}

interface IToDo {
  id: string;
  text: string;
  isFinish: boolean;
  createdAt: Date | number;
}

export default function ToDos({ userObj }: any) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEdit>();
  const [toDos, setToDos] = useState('');
  const [toDoList, setToDoList] = useState<any>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [userMonth, setUserMonth] = useState(
    new Date(Date.now()).getMonth() + 1
  );
  const [userYear, setUserYear] = useState(new Date(Date.now()).getFullYear());
  const [dateList, setDateList] = useState<number[]>([]);
  const todayDate = `${new Date(Date.now()).getFullYear()}${
    new Date(Date.now()).getMonth() + 1 < 10
      ? `0${new Date(Date.now()).getMonth() + 1}`
      : new Date(Date.now()).getMonth() + 1
  }${
    new Date(Date.now()).getDate() < 10
      ? `0${new Date(Date.now()).getDate()}`
      : new Date(Date.now()).getDate()
  }`;
  const [userDate, setUserDate] = useState(todayDate);
  const [prevUserDate, setPrevUserDate] = useState(todayDate);
  const [allToDoList, setAllToDoList] = useState<any>([]);
  const [refetch, setRefetch] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);

  useEffect(() => {
    if (userDate !== prevUserDate) return;
    const q = query(
      collection(dbService, TO_DO_LIST),
      where('user', '==', `${userObj.uid}`)
    );
    onSnapshot(q, async (snapshot) => {
      const toDosArr = snapshot.docs.map((item: any) => {
        return item.data();
      });
      setTimeout(() => {
        if (
          toDosArr?.length === 0 ||
          toDosArr[0]?.toDoList[userDate] === undefined
        ) {
          return allNewCategory();
        }
      }, 500);
      if (toDosArr[0]?.toDoList[userDate][0]?.id === undefined) return;

      if (toDosArr?.length > 0) {
        setAllToDoList({ ...toDosArr[0].toDoList });
        setToDoList(toDosArr[0]?.toDoList[userDate]);
      }
      // console.log(toDosArr[0].toDoList[userDate], userDate);
    });
  }, [userDate]);

  const PLACEHOLDER = "\nToday's to-do.";

  const onListChangeClick = (id: string) => {
    if (category !== id) {
      setIsEditCategory(false);
    }
    setCategory(id);
    setLastCategory(id);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (toDos === '') return;

    const toDoCategory = toDoList;

    const findIndex = toDoCategory.findIndex(
      (item: any) => item.id === category
    );
    if (findIndex === -1) return;
    const newArr = [
      ...toDoCategory.slice(0, findIndex),
      {
        ...toDoCategory[findIndex],
        list: [
          ...toDoCategory[findIndex]?.list,
          {
            id: uuidv4(),
            text: toDos,
            isFinish: false,
            createdAt: Date.now(),
            categoryId: category,
          },
        ],
      },
      ...toDoCategory.slice(findIndex + 1),
    ];

    setLastCategory(category);
    await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
      user: userObj.uid,
      toDoList: {
        ...allToDoList,
        [userDate]: newArr,
      },
    });
    setToDos('');
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setToDos(value);
  };

  const onEditCategoryClick = (id: string) => {
    setIsEditCategory((prev) => !prev);
    setCategory(id);
  };

  const onCreateCategory = async () => {
    // if (userDate !== todayDate) return;
    const newCategory = [
      ...toDoList,
      { id: uuidv4(), title: 'To Do List', list: [] },
    ];

    await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
      user: userObj.uid,
      toDoList: {
        ...allToDoList,
        [userDate]: newCategory,
      },
    });
  };
  const allNewCategory = async () => {
    // if (userDate !== todayDate) return;
    const newCategory = [{ id: uuidv4(), title: 'To Do List', list: [] }];
    if (allToDoList) {
      await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
        user: userObj.uid,
        toDoList: {
          ...allToDoList,
          [userDate]: newCategory,
        },
      });
    } else {
      await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
        user: userObj.uid,
        toDoList: {
          ...allToDoList,
          [userDate]: newCategory,
        },
      });
    }
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

  useEffect(() => {
    getCalenderMonth(userMonth);
    setTimeout(() => {
      setCategory(() => {
        if (category === null && category !== undefined) {
          return toDoList[0]?.id;
        } else {
          return lastCategory;
        }
      });
    }, 300);
  }, [toDoList]);

  const onEditSubmit = handleSubmit(async (data) => {
    const toDoCategory = toDoList;
    const findIndex = toDoCategory.findIndex(
      (item: any) => item.id === category
    );
    const newArr = [
      ...toDoCategory.slice(0, findIndex),
      {
        id: category,
        title: data.edit,
        list: toDoCategory[findIndex].list,
      },
      ...toDoCategory.slice(findIndex + 1),
    ];
    await setDoc(doc(dbService, TO_DO_LIST, `${userObj.uid}`), {
      user: userObj.uid,
      toDoList: {
        ...allToDoList,
        [userDate]: newArr,
      },
    });

    setIsEditCategory(false);
  });

  const onClickMonth = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: { innerText },
    } = e;
    if (!innerText) return;
    setUserMonth(+innerText);
    setCategory(null);
    getCalenderMonth(+innerText);
  };

  const getClickDate = (e: React.MouseEvent<HTMLDivElement>) => {
    // setUserDate('null');
    // setAllToDoList(null);
    // setToDoList(null);
    const {
      currentTarget: { innerText },
    } = e;
    if (!innerText) return;
    const date = `${userYear}${userMonth < 10 ? `0${userMonth}` : userMonth}${
      +innerText < 10 ? `0${innerText}` : innerText
    }`;
    setRefetch((prev) => !prev);
    setCategory(null);
    setPrevUserDate(date);
    setUserDate(date);
  };

  // if (!toDoList) return null;

  const userToDoData = (isFinish: boolean) => {
    return toDoList
      ?.filter((item: any) => item.id === category)[0]
      ?.list?.filter((item: any) => item.isFinish === isFinish)
      ? toDoList
          ?.filter((item: any) => item.id === category)[0]
          ?.list?.filter((item: any) => item.isFinish === isFinish)
      : toDoList[0]?.list?.filter((item: any) => item.isFinish === isFinish);
  };
  // console.log(userToDoData(false));

  const totalList = toDoList?.reduce((sum: any, item: any) => {
    return sum + item?.list?.length;
  }, 0);
  const finishList = toDoList?.reduce((sum: any, item: any) => {
    const list = item.list.filter((item: any) => item.isFinish === true);
    return sum + list.length;
  }, 0);
  return (
    <Container>
      <Helmet>
        <title>To Do List</title>
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
          <AchievementRate>
            {totalList ? ((finishList / totalList) * 100).toFixed(0) : 0}%
          </AchievementRate>
        </Achievement>
        <ListDoToday>
          <ListTitleGrid>
            {toDoList.map((item: any) => (
              <ListTitleWrapper
                key={item.id}
                onClick={() => onListChangeClick(item.id)}
                onDoubleClick={() => onEditCategoryClick(item.id)}
              >
                <ListTitle id={item.id}>{item.title}</ListTitle>
                {isEditCategory && category === item.id && (
                  <EditForm onSubmit={onEditSubmit}>
                    <EditInput {...register('edit')} type="text" />
                  </EditForm>
                )}
              </ListTitleWrapper>
            ))}
            {+userDate >= +todayDate && toDoList.length < 5 && (
              <CreateList onClick={onCreateCategory}>
                <Img src={PLUS} />
              </CreateList>
            )}
          </ListTitleGrid>
          <DoList>
            {userToDoData(false)?.map((item: any) => (
              <ToDo
                key={item.id}
                id={item.id}
                text={item.text}
                categoryId={category}
                createdDate={todayDate}
                isFinish={item.isFinish}
                userObj={userObj}
                categoryList={toDoList}
                todayDate={todayDate}
                userDate={userDate}
                allToDoList={allToDoList}
                setLastCategory={setLastCategory}
              />
            ))}
          </DoList>
          <TodayBackground
            listWrapperColor={
              toDoList?.findIndex((item: any) => item.id === category) !== -1
                ? listWrapperColor[
                    toDoList.findIndex((item: any) => item.id === category)
                  ]
                : listWrapperColor[0]
            }
          />
        </ListDoToday>
        <WhatDoToday>
          <MobileToDoLee>
            <Img src={TO_DO_LEE} alt="todoList_title" />
          </MobileToDoLee>
          <TodayForm
            onSubmit={onSubmit}
            onKeyPress={(e) => onEnterPress(e, onSubmit)}
          >
            <TodayInput
              disabled={
                toDoList?.filter((item: any) => item.id === category)[0]?.list
                  .length > 7 || +userDate < +todayDate
              }
              type="text"
              maxLength={80}
              onChange={onChange}
              value={toDos}
              placeholder={
                toDoList?.filter((item: any) => item.id === category)[0]?.list
                  .length > 7
                  ? '?????? 8????????? ?????? ??? ????????????'
                  : +userDate < +todayDate
                  ? '????????? ????????? ????????? ??? ????????????'
                  : PLACEHOLDER
              }
            />
          </TodayForm>
          <HomeLink>
            <Link to={HOME_URL}>
              <Icon>
                <FontAwesomeIcon size="2x" icon={faHome} />
              </Icon>
            </Link>
          </HomeLink>
          <Footer>
            <FooterInfo>
              <MyLink
                href="https://hell-of-company-builder.tistory.com/"
                target="_blank"
              >
                Blog
              </MyLink>
              <MyLink href="https://github.com/Gilpop8663" target="_blank">
                Github
              </MyLink>
              <FooterText>{new Date(Date.now()).getFullYear()}</FooterText>
            </FooterInfo>
            <FooterbyDesigner
              href="https://www.behance.net/tv-1"
              target="_blank"
            >
              design by dayaya
            </FooterbyDesigner>
          </Footer>
        </WhatDoToday>
        <ListCompletedToday>
          <ListTitleGrid>
            {toDoList.map((item: any) => (
              <ListTitleWrapper
                key={item.id}
                onClick={() => onListChangeClick(item.id)}
              >
                <ListTitle id={item.id}>{item.title}</ListTitle>
              </ListTitleWrapper>
            ))}
          </ListTitleGrid>
          <DoList>
            {userToDoData(true)?.map((item: any) => (
              <ToDo
                key={item.id}
                id={item.id}
                categoryId={category}
                createdDate={todayDate}
                text={item.text}
                isFinish={item.isFinish}
                userObj={userObj}
                categoryList={toDoList}
                todayDate={todayDate}
                userDate={userDate}
                allToDoList={allToDoList}
                setLastCategory={setLastCategory}
              />
            ))}
          </DoList>
          <TodayBackground
            listWrapperColor={
              toDoList.findIndex((item: any) => item.id === category) !== -1
                ? listWrapperColor[
                    toDoList.findIndex((item: any) => item.id === category)
                  ]
                : listWrapperColor[0]
            }
          />
        </ListCompletedToday>
      </GridContainer>
    </Container>
  );
}
