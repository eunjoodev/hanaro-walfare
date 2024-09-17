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
    const env = process.env.REACT_APP_ENV || "development";
    const url = env === "production"
      ? `${process.env.REACT_APP_PROXY_URL}/auth`
      : `${process.env.REACT_APP_BACKEND_URL}/auth`;
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

  // 유효성 검사를 위한 함수
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

  // 중복 확인
  const handleCheck = async (title) => {
    const value = userData[title];
    if (!value) {
      openModal("값을 입력해 주세요.");
      return;
    }

    const pathName = title === "uid" ? "id" : "email";
    try {
      const response = await axios.post(`${apiUrl}/${pathName}`, {
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
      const response = await axios.post(`${apiUrl}/sign-up`, {
        uid: userData.uid,
        name: userData.name,
        password: userData.password,
        password_check: userData.password_check,
        email: userData.email,
        birthday: userData.birthday,
        phone_number: userData.phone_number,
        area: userData.area,
      });
      if (response.status === 200) {
        console.log("회원가입 성공:", response.data);
        openModal("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        openModal("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      openModal("회원가입에 실패했습니다.");
    }
  };

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} closeModal={closeModal} message={modalMessage} />
      )}
      {/* 나머지 JSX 코드는 그대로 유지 */}
    </>
  );
};

export default Sign;
