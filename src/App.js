// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Header from "./components/Header";
// import Main from "./pages/main/Main";
// import Community from "./pages/community/Community";
// import BulletinBoard from "./pages/community/BulletinBoard";
// import FAQ from "./pages/community/FAQ";
// import CreatePost from "./pages/community/CreatePost";
// import Post from "./pages/community/Post";
// import Sign from "./pages/sign/Sign";
// import Login from "./pages/login/Login";
// import HeaderLayout from "./pages/main/HeaderLayout";
// import Detail from "./pages/detail/Detail";
// import NewsList from "./pages/newsList/NewsList";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HeaderLayout />,
//     children: [
//       { path: "/", element: <Main /> },
//       {
//         path: "community/*",
//         element: <Community />,
//         children: [
//           {
//             path: "board",
//             element: <BulletinBoard />,
//           },
//           {
//             path: "faq",
//             element: <FAQ />,
//           },
//           {
//             path: "board/create",
//             element: <CreatePost />,
//           },
//           {
//             path: "board/post",
//             element: <Post />,
//           },
//           {
//             path: "*",
//             element: <BulletinBoard />,
//           },
//         ],
//       },
//       {
//         path: "/sign",
//         element: <Sign />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//     ],
//   },
//   { path: "/detail", element: <Detail /> },
//   { path: "/newslist", element: <NewsList /> },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { HashRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<Main />} />
          <Route path="community" element={<Community />}>
            <Route path="board" element={<BulletinBoard />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="board/create" element={<CreatePost />} />
            <Route path="board/post" element={<Post />} />
          </Route>
          <Route path="sign" element={<Sign />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="detail" element={<Detail />} />
        <Route path="newslist" element={<NewsList />} />
      </Routes>
    </Router>
  );
}

export default App;
