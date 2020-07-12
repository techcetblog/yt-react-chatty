import React, { Component } from 'react';
import { auth, db } from '../services/firebase';
import Moment from 'react-moment';
import './Chat.css';

import defaultAvatarUrl from '../assets/avatar.png';

// Icons
import { MdMoreVert } from 'react-icons/md';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      showMenu: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  async componentDidMount() {
    this.setState({ readError: null });
    try {
      db.ref('chats').on('value', (snapshot) => {
        let chats = [];

        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });

        this.setState({ chats });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  handleChange(event) {
    this.setState({ content: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ writeError: null });

    try {
      await db.ref('chats').push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user.uid,
      });

      this.setState({ content: '' });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  logout() {
    auth().signOut();
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  render() {
    const { user, chats, content, showMenu } = this.state;
    // console.log(user);
    const displayName = user.displayName ? user.displayName : user.email;
    const avatarUrl = user.photoURL ? user.photoURL : defaultAvatarUrl;
    return (
      <div className="chat-window">
        {/* User Info header */}
        <header className="user-info">
          <div className="user-avatar">
            <div
              className="d1"
              style={{
                height: '40px',
                width: '40px',
              }}
            >
              <img
                src={avatarUrl}
                alt=""
                draggable="false"
                className="user-avatar-img"
              />
            </div>
          </div>
          <div className="display-name" role="button">
            <div className="d1">
              <div className="d2">
                <span title={displayName} className="s3">
                  {displayName}
                </span>
              </div>
            </div>
          </div>
          <div className="user-actions">
            <div className="d1">
              <div className="d2">
                <div role="button" title="Menu" onClick={this.toggleMenu}>
                  <span>
                    <MdMoreVert />
                  </span>
                </div>
                <span>
                  {showMenu && (
                    <div
                      className="d3"
                      tabIndex="-1"
                      style={{
                        transformOrigin: 'right top',
                        transform: 'scale(1)',
                        opacity: 1,
                      }}
                    >
                      <ul className="u1">
                        <li className="l1" tabIndex="-1">
                          <div
                            className="d4"
                            role="button"
                            onClick={this.logout}
                          >
                            Logout
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
        </header>
        {/* Chat messages */}
        <div className="chat-messages">
          <div className="da1" tabIndex="0">
            <div className="da2"></div>
            <div className="dc3" tabIndex="-1" rol="region">
              {chats.map((chat) => {
                return (
                  <div
                    className={`chat-message focusable-list-item ${
                      chat.uid === user.uid ? 'message-out' : 'message-in'
                    }`}
                    key={chat.timestamp}
                  >
                    <div className="message-container">
                      <div className="chat-wrap">
                        <div className="chat-container">
                          <div className="copyable-text">
                            <div className="dab1">
                              <span className="message-text selectable-text invisible-space">
                                <span>{chat.content}</span>
                              </span>
                              <span className="extra-space"></span>
                            </div>
                          </div>
                          <div className="message-time">
                            <div className="db1">
                              <span dir="auto" className="sb1">
                                <Moment fromNow>{chat.timestamp}</Moment>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Error Messages */}
        <div className="write-error">
          {this.state.writeError ? (
            <div className="error">{this.state.writeError}</div>
          ) : null}
        </div>

        {/* Chat form */}
        <footer className="chat-form">
          <form onSubmit={this.handleSubmit}>
            <div className="input-wrap">
              <input
                type="text"
                onChange={this.handleChange}
                value={content}
                className="chat-input"
              />
            </div>
          </form>
        </footer>
      </div>
    );
  }
}

export default Chat;
