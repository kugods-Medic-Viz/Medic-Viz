import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [errorMsg, setErrorMsg] = useState();

  const handleOnChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSignUplick = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("가입 성공!");
        navigate("/");
      } else {
        alert("이미 가입된 계정입니다!");
      }
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case "auth/weak-password":
          setErrorMsg("비밀번호는 6자리 이상이어야 합니다.");
          break;
        case "auth/invalid-email":
          setErrorMsg("잘못된 이메일 주소입니다.");
          break;
        case "auth/email-already-in-use":
          setErrorMsg("이미 가입되어 있는 계정입니다.");
          break;
      }
    }
  };

  return (
    <>
      <h1> 회원가입 페이지 </h1>
      <form>
        <div>
          Email :
          <input
            name="email"
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={handleOnChange}
          />
        </div>
        <div>
          Password :
          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <button type="submit" onClick={onSignUplick}>
            Create Acoount
          </button>
        </div>
      </form>
      <div>{errorMsg}</div>
      <hr></hr>
      <p>
        Already Have Account?
        <Link to="/signin">
          <button>Back To Login</button>
        </Link>
      </p>
    </>
  );
}
export default SignUp;