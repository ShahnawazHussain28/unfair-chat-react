import React, { useRef, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { POST, URL } from './config';

export default function LoginSignupPage({ setId }) {
  const [loginPage, setLoginPage] = useState(true)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(true);

  const nameRef = useRef();
  const numberRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  function displayError(text) {
    setError(text);
    setShowError(true);
  }

  function ChangeLoginSignup() {
    setLoginPage(prev => !prev);
  }
  async function requestLogin(e) {
    e.preventDefault();
    if (!(/^\d{10}$/.test(numberRef.current.value))) {
      displayError("Enter a valid Phone number");
      return;
    }
    let jsonData = await POST("login", {
      id: numberRef.current.value,
      password: passwordRef.current.value,
    });
    if (jsonData.granted) {
      setId(numberRef.current.value);
    } else {
      displayError(jsonData.message);
    }
  }
  async function requestSignup(e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const number = numberRef.current.value;
    const password = passwordRef.current.value;
    if(/^ *$/.test(name) || !(/^[a-zA-Z ]+$/.test(name))){
      displayError("Name must not contain number or only spaces or empty");
      return;
    } else if (!(/^\d{10}$/.test(number))) {
      displayError("Enter a valid Phone number");
      return;
    } else if (/^ *$/.test(password) || password.length < 8){
      displayError("Password must be 8 characters long.");
      return;
    } else if (passwordRef.current.value !== confirmPasswordRef.current.value){
      displayError("Passwords do not match. Password and confirm password must be same.");
      return;
    }
    let jsonData = await POST("register", {
      id: number,
      name: name,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value
    });
    if (jsonData.granted) {
      setId(numberRef.current.value);
    } else {
      displayError(jsonData.message);
    }
  }

  return (
    <Container className='d-flex flex-column align-items-center' style={{ height: '100vh' }}>
      <h2 className='m-5 display-2'>{loginPage ? "Login" : "Sign Up"}</h2>
      {error !== "" &&
        <Alert variant="danger" className='w-100' onClose={() => setShowError(false)} dismissible>
          {error}
        </Alert>
      }
      <Form className='w-100'>
        {!loginPage &&
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control ref={nameRef} type='text' required />
          </Form.Group>
        }
        <Form.Group>
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control ref={numberRef} type='tel' maxLength={10} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control ref={passwordRef} type='password' required />
        </Form.Group>
        {!loginPage &&
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control ref={confirmPasswordRef} type='password' required />
          </Form.Group>
        }
        <Button className='my-3' type='submit' onClick={loginPage ? requestLogin : requestSignup}>{loginPage ? "Login" : "Sign up"}</Button>
        <span onClick={ChangeLoginSignup} style={{ cursor: 'pointer' }} className='m-3 bg-white text-primary'>Don't Have an account?</span>
      </Form>
    </Container>
  )
}
