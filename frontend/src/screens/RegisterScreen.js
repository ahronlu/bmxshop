import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register as registerUser } from "../actions/userActions";

const RegisterScreen = ({ location, history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const password = useRef({});
  password.current = watch("password", "");

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = ({ name, email, password }) => {
    dispatch(registerUser(name, email, password));
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Enter name"
            isInvalid={!!errors.name}
            isValid={!errors.name && dirtyFields.name}
            {...register("name", {
              required: "Name is required",
            })}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            placeholder="Enter email"
            isInvalid={!!errors.email}
            isValid={!errors.email && dirtyFields.email}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter a valid email",
              },
            })}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            isInvalid={!!errors.password}
            isValid={!errors.password && dirtyFields.password}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
              pattern: {
                message: "Please enter a valid password with at least 6 chars",
              },
            })}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            isInvalid={!!errors.confirmPassword}
            isValid={!errors.confirmPassword && dirtyFields.confirmPassword}
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: {
                value: (value) =>
                  value === password.current || "The passwords do not match",
              },
            })}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
        >
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            style={{ color: "#fff" }}
          >
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
