import React from "react";
import { Button, Form, Header, Divider, Segment } from "semantic-ui-react";

import Error from "../Error";
import RailsApi from "../RailsApi";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      newUser: true,
      loginError: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      RailsApi.getUser(localStorage.getItem("token"))
        .then(res => res.json())
        .then(json => this.props.setUser(json));
    }
  }

  changeUserState = () => {
    this.setState({
      newUser: !this.state.newUser
    });
  };

  handleEmail = e => {
    e.preventDefault();
    this.setState({
      email: e.target.value
    });
  };

  handlePassword = e => {
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      this.setState(
        {
          loginError: false
        },
        () => {
          this.state.newUser ? this.createUser() : this.loginUser();
        }
      );
    }
  };

  loginUser = () => {
    localStorage.removeItem("token");
    RailsApi.login({
      auth: { email: this.state.email, password: this.state.password }
    })
      .then(res => res.json())
      .then(token => {
        localStorage.setItem("token", token.jwt);
        RailsApi.getUser(token.jwt)
          .then(res => res.json())
          .then(json => this.props.setUser(json));
      });
  };

  createUser = () => {
    RailsApi.addUser({
      user: {
        email: this.state.email,
        password: this.state.password
      }
    }).then(res => {
      if (res.status === 202) {
        this.loginUser();
      } else {
        this.setState({
          loginError: true
        });
      }
    });
  };

  render() {
    return (
      <div>
        <Divider horizontal />
        <Segment>
          <Header as="h2">
            {this.state.newUser ? "Create New Account" : "Sign In"}
          </Header>
          <Form onSubmit={this.handleSubmit}>
            {this.state.error ? (
              <Error
                message={"Email is taken, please try again"}
                color={"red"}
              />
            ) : null}
            <Form.Field>
              <label>Email</label>
              <input
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleEmail}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                placeholder="Password"
                type="password"
                value={this.state.password}
                onChange={this.handlePassword}
              />
            </Form.Field>
            <Button primary fluid type="submit">
              {this.state.newUser ? "Register" : "Login"}
            </Button>
          </Form>
          <Divider horizontal />
          <Divider horizontal>
            {this.state.newUser ? "Current User?" : "New User?"}
          </Divider>
          <Button secondary fluid onClick={this.changeUserState}>
            {this.state.newUser ? "Sign In" : "Sign Up"}
          </Button>
        </Segment>
      </div>
    );
  }
}

export default Login;
