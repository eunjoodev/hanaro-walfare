  import React, { useState } from "react";
import styles from "./Login.module.css";
import OAuth from "../../components/sociallogin/OAuth";
import { useRecoilState } from "recoil";
import { authState } from "../../states/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
    findId: "",
    newPassword: "",
    passwordCheck: "",
  });

  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = async () => {
    if (loginData.newPassword !== loginData.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/auth/password`, {
        uid: loginData.findId,
        new_password: loginData.newPassword,
        new_password_check: loginData.passwordCheck,
      });
      if (response.status === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        closeModal();
      } else {
        throw new Error("비밀번호 변경 실패");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sendLoginData = {
      uid: loginData.id,
      password: loginData.password,
    };

    console.log(API_URL);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, sendLoginData);
      if (response.status === 200) {
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          setAuth({
            id: loginData.id,
            isLoggedIn: true,
            token: accessToken,
          });

          console.log("로그인 성공");
          navigate("/");
        } else {
          console.log("토큰이 없습니다.");
        }
      } else {
        throw new Error("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 실패", error);
    }
  };

  const passwordModal = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div>비밀번호 찾기</div>
        <div className={styles.modalInput}>
          <input
            type="text"
            id="findId"
            name="findId"
            placeholder="아이디를 입력하세요"
            onChange={changeHandler}
          />
        </div>
        <div className={styles.modalInput}>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="새 비밀번호"
            onChange={changeHandler}
          />
        </div>
        <div className={styles.modalInput}>
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            onChange={changeHandler}
          />
        </div>
        <div className={styles.modalButtons}>
          <button
            className={styles.submitButton}
            onClick={handlePasswordChange}
          >
            제출
          </button>
          <button className={styles.closeButton} onClick={closeModal}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.styleBox}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>로그인</h1>
        <div className={styles.loginForm}>
          <div className={styles.inputBox}>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="아이디"
              onChange={changeHandler}
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호"
              onChange={changeHandler}
            />
          </div>
          <button className={styles.loginButton} onClick={handleSubmit}>
            로그인
          </button>
          <button className={styles.findPassword} onClick={openModal}>
            비밀번호 찾기
          </button>
        </div>
        <OAuth />
      </div>
      {isOpen && passwordModal}
    </div>
  );
};

export default Login;
