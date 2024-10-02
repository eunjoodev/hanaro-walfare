# Hanaro-Walfare (React-2nd-Project)
리액트 프론트엔드 2nd 프로젝트 정부 복지서비스 제공 사이트
<br>
<br>
- 배포 URL : [https://ohmycode-readme.netlify.app](https://hanaro-walfare.vercel.app/)
- Test ID : test1234
- Test PW : test1234

## 🖥️ 프로젝트 소개
사용자들이 복지 서비스를 쉽고 편리하게 찾고 신청 할 수 있는 웹 플랫폼 입니다.
<br>
<br>

## 🕰️ 개발 기간
* 24.08.26일 - 24.09.13일 (3주)

### 🧑‍🤝‍🧑 맴버구성
 - 팀장  : 이은주 - 메인 페이지 UI 구현, 필터링 및 리스트 기능 구현, 공통 컴포넌트 UI 및 기술 지원, 디자인, 발표
 - 팀원1 : 정승환 - 로그인, 회원가입, PW찾기
 - 팀원2 : 김보혜 - 게시판(CRUD), 공통컴포넌트
 - 팀원3 : 조효준 - 상세페이지, 뉴스리스트, 배포

### ⚙️ 개발 환경
- **IDE** : visual studio code 1.93
- **Framework** : React
- **Database** : MySQL
<br>

## 📌 주요 기능
#### 메인 페이지
- 백엔드 API 연동
- 필터링 기능 - FilterComponent
- 아코디언 기능 - KeyBenefits
- 복지 리스트 데이터 연결 및 페이지네이션 - WelfareList
- 주요 혜택 스크롤 기능 - KeyBenefits

#### 상세페이지
- 외부 백엔드 API 데이터와 로컬 JSON 파일 데이터를 대조
- 메인페이지에 맞는 JSON 데이터를 묶어 렌더링

#### 뉴스리스트
- 실제 뉴스 웹페이지 데이터를 크롤링
- CSV 파싱후 뉴스 목록을 표시
- 검색 기능

#### 로그인
- DB값 검증
- ID찾기, PW찾기
- 로그인 시 세션(Session) 생성

#### 회원가입
- 주소 API 연동
- ID 중복 체크

#### 소통광장
- 사이드바와 버튼, 페이지네이션, 모달 등 공통 컴포넌트들을 먼저 구현하여 프로젝트 전반적으로 다른 파트에서도 재사용
- 라우트를 통한 페이지 이동으로 게시글 목록, 작성, 상세 등 여러 페이지간의 라우팅을 구현
- 게시글 작성 및 수정 시 텍스트 에디터(ReactQuill)를 사용하여 리치 텍스트 편집 기능을 제공
- 게시글과 댓글 모두 작성자에게만 수정 삭제 버튼이 노출되도록 하여 사용자 ui 편의성에 집중
