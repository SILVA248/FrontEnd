import React, { useState } from "react";
import Link from "next/link";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { Api, loadToken } from "../utils/api.js";
import { useLoggedUser } from "../store/UserContext";

export default function Navbar() {
  const { logged, setLogged } = useLoggedUser();
  const [visible, setVisible] = React.useState(false);
  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  }

  function sendData() {
    const userLoginInfo = {
      email: loginData.email,
      password: loginData.password,
    };
    Api.post(`userLogin`, userLoginInfo)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        setLoginData({ email: "", password: "" });
        setLogged(true);
        localStorage.setItem("token", token);
        loadToken();
      })
      .catch((error) => {
        console.error(error);
        alert("Please insert a valid email/password");
      })
      .finally(() => {
        setIsCreating(false);
        closeModal();
      });
  }

  function logout() {
    setLogged(false);
    localStorage.clear();
  }

  return (
    <nav className="nav">
      <div>
        <Link href="/">
          <img src="/ExoBrain.png" className="logo" />
        </Link>
      </div>
      <ul className="menu">
        {logged && (
          <>
            <li>
              <Link href="/newJob" className="navLink">
                Create a Job
              </Link>
            </li>
            <li>
              <Link href="/jobs-list" className="navLink">
                Active Jobs
              </Link>
            </li>
            <li>
              <Link href="/applicationsList" className="navLink">
                Applications List
              </Link>
            </li>
          </>
        )}
        <li>
          {logged ? (
            <div>
              <Button color="gradient" auto ghost onPress={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button color="gradient" auto ghost onPress={openModal}>
              Login
            </Button>
          )}
        </li>
      </ul>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeModal}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Login to make a change!
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
          <Row justify="space-between">
            <Checkbox>
              <Text size={14}>Remember me</Text>
            </Checkbox>
            <Text size={14}>Forgot password?</Text>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" auto ghost onPress={closeModal}>
            Close
          </Button>
          <Button auto ghost onClick={sendData}>
            Sign in
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
}
