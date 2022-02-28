## 배포 주소

## <a href="https://gilpop8663.github.io/clone-social-network-service/">배포 사이트</a>

## 💻 설치 방법

    npm install
    npm start

## 📂 파일 구조

src  
 ┣ assets  
 ┃ ┗ images  
 ┣ components  
 ┃ ┣ Footer.tsx  
 ┃ ┣ MiniLogo.tsx  
 ┃ ┗ Navigation.tsx  
 ┣ constants  
 ┃ ┗ constant.ts  
 ┣ hooks  
 ┣ pages  
 ┃ ┣ auth  
 ┃ ┃ ┣ components  
 ┃ ┃ ┃ ┣ AuthForm.tsx  
 ┃ ┃ ┃ ┗ AuthSocialLogin.tsx  
 ┃ ┃ ┗ Auth.tsx  
 ┃ ┣ home  
 ┃ ┃ ┣ components  
 ┃ ┃ ┃ ┣ Message.tsx  
 ┃ ┃ ┃ ┗ MessageForm.tsx  
 ┃ ┃ ┗ Home.tsx  
 ┃ ┣ todos  
 ┃ ┃ ┣ components  
 ┃ ┃ ┃ ┗ ToDo.tsx  
 ┃ ┃ ┗ ToDos.tsx  
 ┃ ┣ Profile.tsx  
 ┃ ┗ index.ts  
 ┣ router  
 ┃ ┗ AppRouter.tsx  
 ┣ styles  
 ┃ ┣ globalStyle.ts  
 ┃ ┣ index.ts  
 ┃ ┣ styled.d.ts  
 ┃ ┗ theme.ts  
 ┣ utils  
 ┃ ┣ interface.ts  
 ┃ ┗ utilFn.ts  
 ┣ App.tsx  
 ┣ firebase.ts  
 ┗ index.tsx

---

## 📋프로젝트 사진

## 로그인 화면

<img src="https://user-images.githubusercontent.com/80146176/155887219-cf841269-49b7-4976-87ec-c6cd3788e370.png" alt="로그인창"/>

---

## 메신저 화면

<img src="https://user-images.githubusercontent.com/80146176/155887456-cc119147-2359-4402-bc5c-21a5718e0ced.png" alt="메세지 입력창"/>
<img src="https://user-images.githubusercontent.com/80146176/155887482-bda11154-a7c2-49b0-9922-765d2c8d2308.png" alt="메세지 출력창"/>

---

## 프로필 화면

<img src="https://user-images.githubusercontent.com/80146176/155887526-7edceedc-6416-4dfb-a6b7-773d79603b52.png" alt="프로필 창"/>

---

## 투 두 리스트 화면

<img src="https://user-images.githubusercontent.com/80146176/155887586-f2f64d11-d39f-4350-9b96-e2b1a6c7cdc4.png" alt="투두리스트 창"/>

---

## 📝 기능

### 회원가입 , 로그인 , 소셜 로그인 기능 구현

- firebase를 이용한 회원가입과 로그인을 구현하였고 구글과 깃허브를 통한 소셜 로그인을 구현했습니다.

### 메신저 기능 구현

- firebase 백앤드를 통해 다른 사람들의 글을 읽을 수 있고 자신의 글을 쓸 수 있습니다.
- javascript의 reader 기능을 이용해 이미지 파일의 URL을 백앤드로 보내 업로드하고 글을 불러올 때 URL을 불러와 사진을 보여지게 구현하였습니다.
- 자신이 작성한 글에만 삭제, 수정 버튼이 보이도록 구현하였습니다.

### 프로필 수정하는 기능 구현

- firebase 백앤드를 통해 자신의 보여지는 이름 ,프로필 이미지를 변경할 수 있습니다.

### 투두리스트 기능

- firebase의 필터 기능을 이용하여 작성자 자신이 작성한 글만 보여지게 하여 투두리스트 기능을 만들었습니다.

### 반응형 사이트

- 태블릿(1024px), 모바일(768px) 의 반응형 스크린을 제공하게 구현하였습니다.

### 현재 화면의 URL에 따라 달라지는 네비게이션 기능 구현

- React router dom 의 useMatch를 이용하여 현재 어떤 사이트에 있는 지에 따라 글 색과 폰트 굵기를 다르게 하여 사용자에게 현재 어느 페이지에 있는 지 정보를 제공하였습니다.

### 사용자의 닉네임,프로필 이미지가 없을 경우 손님으로 표시되도록 구현.

- 사용자의 닉네임과 프로필 이미지가 없을 경우 default 값으로 손님 닉네임, 손님 이미지가 나오도록 구현하였습니다.

### 사이트의 보안 설정

- api key 나 다른 필요한 값들을 .env 파일에 넣어 관리하였고 github 의 secrets 탭에 정보를 저장해놓았습니다.
- google에서 제공하는 기능을 활용하여 firebase의 사이트에서 사용되는 api 를 제가 배포한 사이트에서만 작동되도록 하였습니다.
- firebase에서 설정할 수 있는 규칙을 활용하여 프론트에서뿐만 아니라 백앤드에서도 유저가 로그인 상태가 아니면 읽고,쓰기,업로드를 하지 못하게 하였습니다.
