import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [addUser, { error, data }] = useMutation(ADD_USER);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });

      Auth.login(data.addUser.token);
      handleModalClose(); // Close the modal on successful signup
    } catch (e) {
      console.error(e);
      setShowAlert(true); // Show alert on error
    }
  };

  return (
    <>
      {data ? (
        <p>
          Success! You may now head{' '}
          <a href="/" onClick={handleModalClose}>
            back to the homepage.
          </a>
        </p>
      ) : (
        <Form noValidate onSubmit={handleFormSubmit}>
          {/* Alert for signup errors */}
          {error && (
            <Alert
              dismissible
              onClose={() => setShowAlert(false)}
              show={showAlert}
              variant="danger"
            >
              {error.message || 'Something went wrong with your signup!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your username"
              name="username"
              value={formState.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            className="w-100"
            variant="primary"
            type="submit"
            disabled={
              !(formState.username && formState.email && formState.password)
            }
          >
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};

export default SignupForm;