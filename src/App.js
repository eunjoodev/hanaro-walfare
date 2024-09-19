import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderLayout from "./pages/main/HeaderLayout";
import Main from "./pages/main/Main";
import Community from "./pages/community/Community";
import BulletinBoard from "./pages/community/BulletinBoard";
import FAQ from "./pages/community/FAQ";
import CreatePost from "./pages/community/CreatePost";
import Post from "./pages/community/Post";
import Sign from "./pages/sign/Sign";
import Login from "./pages/login/Login";
import Detail from "./pages/detail/Detail";
import NewsList from "./pages/newsList/NewsList";
import WelfareList from "./pages/main/WelfareList";
import KeyBenefits from "./pages/main/KeyBenefits";
import Search from "./pages/search/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderLayout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "search", element: <Search /> }, 
      { 
        path: "welfare",
        children: [
          { index: true, element: <WelfareList /> },
          { path: "detail/:serviceName", element: <Detail /> }
        ]
      },
      {
        path: "keybenefits",
        children: [
          { index: true, element: <KeyBenefits /> },
          { path: "detail/:serviceName", element: <Detail /> }
        ]
      },
      {
        path: "community/*",
        element: <Community />,
        children: [
          { path: "board", element: <BulletinBoard /> },
          { path: "faq", element: <FAQ /> },
          { path: "board/create", element: <CreatePost /> },
          { path: "board/post", element: <Post /> },
          { path: "*", element: <BulletinBoard /> }
        ]
      },
      { path: "sign", element: <Sign /> },
      { path: "login", element: <Login /> }
    ]
  },
  { path: "/newslist", element: <NewsList /> }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
