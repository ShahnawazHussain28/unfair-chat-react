import React from 'react'
import { Button, Container, Form } from 'react-bootstrap'

export default function SignupPage() {
  return (
    <Container className='d-flex flex-column align-items-center' style={{height: '100vh'}}>
      <h2 className='m-5 display-2'>Sign Up</h2>
      <Form className='w-100'>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control type='text' required/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type='tel' maxLength={10} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' required />
          </Form.Group>
          <Button className='my-3' type='submit'>Sign Up</Button>
          <a href='/login' style={{textDecoration: 'none', cursor: 'pointer'}} className='m-3'>Already Have an account?</a>
      </Form>
    </Container>
  )
}
