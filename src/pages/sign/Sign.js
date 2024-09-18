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
  const [formSuccessed, setFormSuccessed] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url =
      process.env.REACT_APP_ENV === "production"
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
    if (formSuccessed === true) {
      navigate("/login");
    }
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
      if (response.data.code === 200) {
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
    if (!isValidId || !isValidPassword || !isValidPasswordCheck) {
      openModal("입력 정보를 확인해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/sign-up`, userData);
      if (response.status === 200) {
        setFormSuccessed(true);
        console.log("회원가입 성공:", response.data);
        openModal("회원가입이 완료되었습니다.");
      } else {
        throw new Error("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      openModal("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    //
    <>
      {isOpen && <Modal message={modalMessage} onClose={closeModal} />}
      <div className={styles.pagebox}>
        <div className={styles.signbox}>
          <h1 className={styles.formtitle}>회원가입</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="uid">아이디</label>
              <div className={styles.formGroupValid}>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  onChange={changeHandler}
                  className={
                    !isValidId ? styles.vaildInput : styles.formGroupinput
                  }
                  required
                />
                {!isValidId && (
                  <div className={styles.vaildError}>
                    아이디는 8자 이상의 영문, 숫자로 조합
                  </div>
                )}
              </div>
              <div className={styles.formGroupButton}>
                <button
                  type="button"
                  className={styles.checkButton}
                  onClick={() => handleCheck("uid")}
                >
                  중복확인
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={changeHandler}
                className={styles.formGroupinput}
                required
              />
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="birthday">생년월일</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                onChange={changeHandler}
                className={styles.formGroupinput}
                placeholder="YYYY-MM-DD"
                required
              />
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={changeHandler}
                className={styles.formGroupinput}
                required
              />
              <div className={styles.formGroupButton}>
                <button
                  type="button"
                  className={styles.checkButton}
                  onClick={() => handleCheck("email")}
                >
                  중복확인
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">비밀번호</label>
              <div className={styles.formGroupValid}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={changeHandler}
                  className={
                    !isValidPassword ? styles.vaildInput : styles.formGroupinput
                  }
                  required
                />
                {!isValidPassword && (
                  <div className={styles.vaildError}>
                    비밀번호는 10자 이상의 영문, 숫자로 조합
                  </div>
                )}
              </div>
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password_check">비밀번호 확인</label>
              <div className={styles.formGroupValid}>
                <input
                  type="password"
                  id="password_check"
                  name="password_check"
                  onChange={changeHandler}
                  className={
                    !isValidPassword ? styles.vaildInput : styles.formGroupinput
                  }
                  required
                />
                {!isValidPasswordCheck && (
                  <div className={styles.vaildError}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone_number">연락처</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                placeholder="010-1234-5678"
                onChange={changeHandler}
                className={styles.formGroupinput}
                required
              />
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="area">거주 지역</label>
              <input
                type="text"
                id="area"
                name="area"
                onChange={changeHandler}
                className={styles.formGroupinput}
                required
              />
              <div className={styles.formGroupButton}></div>
            </div>
            <div className={styles.submit}>
              <button type="submit" className={styles.submitButton}>
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Sign;
