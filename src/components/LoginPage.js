import React from 'react'
import { Button, Container, Form } from 'react-bootstrap'

export default function LoginPage() {
  return (
    <Container className='d-flex flex-column align-items-center' style={{height: '100vh'}}>
      <h2 className='m-5 display-2'>Login</h2>
      <Form className='w-100'>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type='tel' maxLength={10} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' required />
          </Form.Group>
          <Button className='my-3' type='submit'>Login</Button>
          <a href='/Signup' style={{textDecoration: 'none', cursor: 'pointer'}} className='m-3'>Don't Have an account?</a>
      </Form>
    </Container>
  )
}
