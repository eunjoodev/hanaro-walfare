import React, { useState, useEffect } from "react";
import styles from "./Sign.module.css";
import Modal from "../../components/common/modal/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sign = () => {
  const [userData, setUserData] = useState({
    uid: "",
    name: "",
    password: "",
    password_check: "",
    email: "",
    birthday: "",
    phone_number: "",
    area: "",
  });
  const [isValidId, setIsValidId] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidPasswordCheck, setIsValidPasswordCheck] = useState(true);
  const [isCheckedData, setIsCheckedData] = useState({
    uid: false,
    email: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [apiUrl, setApiUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const url = process.env.REACT_APP_ENV === "production"
      ? `${process.env.REACT_APP_PROXY_URL}`
      : `${process.env.REACT_APP_BACKEND_URL}`;
    setApiUrl(url);
  }, []);

  const openModal = (message) => {
    setModalMessage(message);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalMessage("");
  };

  const validInput = (name, value) => {
    let isChecked;
    switch (name) {
      case "uid":
        const idCheck = /^[a-zA-Z0-9]{8,}$/;
        isChecked = idCheck.test(value);
        setIsValidId(isChecked);
        break;
      case "password":
        const passwordCheck = /^[a-zA-Z0-9]{10,}$/;
        isChecked = passwordCheck.test(value);
        setIsValidPassword(isChecked);
        break;
      case "password_check":
        isChecked = value === userData.password;
        setIsValidPasswordCheck(isChecked);
        break;
      default:
        break;
    }
    return isChecked;
  };

  const handleCheck = async (title) => {
    const value = userData[title];
    if (!value) {
      openModal("값을 입력해 주세요.");
      return;
    }

    const pathName = title === "uid" ? "id" : "email";
    try {
      const response = await axios.post(`${apiUrl}/auth/${pathName}`, {
        [title]: value,
      });
      if (response.status === 200) {
        openModal("사용 가능합니다.");
        setIsCheckedData((prev) => ({
          ...prev,
          [title]: true,
        }));
      } else {
        openModal("이미 사용중입니다.");
      }
    } catch (error) {
      console.error("중복 확인 실패:", error.response?.data || error.message);
      openModal("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    let setValue = value;
    if (name === "phone_number") {
      setValue = value.replace(/[^0-9]/g, "");
    }
    validInput(name, setValue);
    setUserData((prevData) => ({
      ...prevData,
      [name]: setValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userData);
    if (!isValidId || !isValidPassword || !isValidPasswordCheck) {
      openModal("입력 정보를 확인해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/sign-up`, userData);
      if (response.status === 200) {
        console.log("회원가입 성공:", response.data);
        openModal("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        throw new Error("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      openModal("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} closeModal={closeModal} message={modalMessage} />
      )}
      <div className={styles.signBox}>
        <h1 className={styles.signTitle}>회원가입</h1>
        <form onSubmit={handleSubmit} className={styles.signForm}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="uid"
              placeholder="아이디 (8자 이상)"
              onChange={changeHandler}
              className={!isValidId ? styles.invalidInput : ""}
            />
            <button type="button" onClick={() => handleCheck("uid")}>
              중복 확인
            </button>
          </div>
          {!isValidId && (
            <p className={styles.errorMessage}>
              아이디는 8자 이상의 영문자와 숫자로만 구성되어야 합니다.
            </p>
          )}
          <div className={styles.inputBox}>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (10자 이상)"
              onChange={changeHandler}
              className={!isValidPassword ? styles.invalidInput : ""}
            />
          </div>
          {!isValidPassword && (
            <p className={styles.errorMessage}>
              비밀번호는 10자 이상의 영문자와 숫자로만 구성되어야 합니다.
            </p>
          )}
          <div className={styles.inputBox}>
            <input
              type="password"
              name="password_check"
              placeholder="비밀번호 확인"
              onChange={changeHandler}
              className={!isValidPasswordCheck ? styles.invalidInput : ""}
            />
          </div>
          {!isValidPasswordCheck && (
            <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>
          )}
          <div className={styles.inputBox}>
            <input type="text" name="name" placeholder="이름" onChange={changeHandler} />
          </div>
          <div className={styles.inputBox}>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              onChange={changeHandler}
            />
            <button type="button" onClick={() => handleCheck("email")}>
              중복 확인
            </button>
          </div>
          <div className={styles.inputBox}>
            <input
              type="date"
              name="birthday"
              placeholder="생년월일"
              onChange={changeHandler}
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="tel"
              name="phone_number"
              placeholder="전화번호"
              onChange={changeHandler}
            />
          </div>
          <div className={styles.inputBox}>
            <input type="text" name="area" placeholder="지역" onChange={changeHandler} />
          </div>
          <button type="submit" className={styles.signButton}>
            가입하기
          </button>
        </form>
      </div>
    </>
  );
};

export default Sign;
