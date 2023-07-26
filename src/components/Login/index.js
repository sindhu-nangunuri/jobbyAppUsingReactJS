import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  updatePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div className="input-field-container">
        <label htmlFor="username" className="login-input-label">
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          id="password"
          className="login-input-field"
          placeholder="Password"
          onChange={this.updatePassword}
        />
      </div>
    )
  }

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="input-field-container">
        <label htmlFor="username" className="login-input-label">
          USERNAME
        </label>
        <input
          type="text"
          value={username}
          id="username"
          className="login-input-field"
          placeholder="Username"
          onChange={this.updateUsername}
        />
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {errorMsg, showErrorMsg} = this.state
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-login-form"
          />
          {this.renderUsernameField()}
          {this.renderPasswordField()}
          <div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
