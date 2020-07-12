import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle, signInWithGithub } from '../helpers/auth';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: null });

    try {
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGithub();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  render() {
    return (
      <div className="signup mt-4 py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
              <form onSubmit={this.handleSubmit}>
                <h1>
                  Sign up to <Link to="/">Chatty</Link>
                </h1>
                <p>Fill in the form below to create your account</p>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="Email"
                    autoComplete="current-email"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-info btn-block">
                    Signup
                  </button>
                </div>
                <div className="form-group">
                  <p className="text-center">Or</p>
                  <button
                    type="button"
                    onClick={this.googleSignIn}
                    className="btn btn-danger btn-block"
                  >
                    Sign up with Google
                  </button>
                  <button
                    type="button"
                    onClick={this.githubSignIn}
                    className="btn btn-secondary btn-block"
                  >
                    Sign up with Github
                  </button>
                </div>
                <div>{this.state.error ? <p>{this.state.error}</p> : null}</div>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
