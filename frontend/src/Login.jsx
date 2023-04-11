import { useState } from "react";

let myToken;

function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [money, setMoney] = useState("");

  function handleLogin() {
    const user = {
      userName,
      password,
    };

    console.log(user);

    const userString = JSON.stringify(user);

    console.log(userString);

    fetch("http://localhost:7005/sessions", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userString,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        myToken = data.token;
      });
  }

  function handleGetAccount() {
    fetch("http://localhost:7005/me/accounts", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
    })
      .then((res) => {
        console.log("ACCOUNTS GOT", res);
        return res.json();
      })
      .then((data) => {
        setMoney(data.money);
      });
  }

  return (
    <div>
      <div>
        <h2>Log in</h2>
        <label htmlFor=""> User Name: </label>
        <input
          value={userName}
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor=""> Password: </label>
        <input
          value={password}
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleGetAccount}> Visa Saldo</button>
        <h2>Saldo: {money}</h2>
      </div>
    </div>
  );
}

export default Login;
