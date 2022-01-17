import { useEffect, useState } from "react";

export default function HomePage() {
  const [name, setName] = useState();
  const [password, setPassword] = useState();

  const [user, setuser] = useState();
  const [allusers, setAllusers] = useState();
  const [logindetails, setLoginDetails] = useState({});

  const token = localStorage.getItem("jwt");

  //Auto login.....................................

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setuser(user.user.username);
        });
      }
    });
  }, [token]);
  //Login........................................

  function login(e) {
    e.preventDefault();
    console.log(logindetails);
    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logindetails),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setuser(user);
          localStorage.setItem("jwt", user.jwt);
        });
      } else {
        alert("please log in");
      }
    });
  }
  //Logout ...................................

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("jwt");
    setuser(false);
  }
  // Create new user............................

  function createUser(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: {
          username: name,
          password: password,
          bio: "Sylvia Woods was an American restaurateur who founded the sould food restaurant Sylvia's in Harlem on Lenox Avenue, New York City in 1962. She published two cookbooks and was an important figure in the community.",
          avatar:
            "https://upload.wikimedia.org/wikipedia/commons/4/49/Syvia_of_Sylvia%27s_reaturant_N.Y.C_%28cropped%29.jpg",
        },
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        localStorage.setItem("jwt", res.jwt);
        setuser(res.user.username);
      });
  }
  //GET all users......................................

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/show", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        setAllusers(res);
      });
  }, [token]);

  //Create New user Object..................

  function loginguser(e) {
    e.preventDefault();
    let newObj = { ...logindetails, [e.target.name]: e.target.value };
    setLoginDetails(newObj);
  }

  return (
    <div>
      <button onClick={logout} style={{ backgroundColor: "red" }}>
        Log Out
      </button>
      <h1>{user ? `logged in as ${user}` : "not logged in"}</h1>
      <hr />
      <h3>Login</h3>
      <form onSubmit={login}>
        <label>
          Name
          <input name="username" onChange={loginguser} />
        </label>
        <label>
          password
          <input name="password" onChange={loginguser} />
        </label>
        <button type="submit">Submuit</button>
      </form>
      <br />
      <hr></hr>
      <h3>Create user</h3>
      <form onSubmit={createUser}>
        <label>
          Name
          <input onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          password
          <input onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Submuit</button>
      </form>
      <hr />
      <h3>List of Users</h3>
      <ul>{allusers ? allusers.map((e) => <li>{e.username}</li>) : ""}</ul>
    </div>
  );
}
