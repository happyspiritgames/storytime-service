import React, { Component } from 'react';
import StoryTimePage from '../StoryTimePage';

export default class Contact extends Component {
  render() {
    return (
      <StoryTimePage id="contact">
        <form method="post">
          <h2 className="text-center">Contact us</h2>
          <div className="alert alert-warning" role="alert">
            <span><strong>Sign in</strong>&nbsp;if you would like a response.</span>
          </div>
          <div className="form-group">
            <input className="form-control" type="text" name="name" placeholder="Your name" />
          </div>
          <div className="form-group">
            <textarea className="form-control" rows="14" name="message" placeholder="Your message"></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" type="submit">Send to Happy Spirit Games</button>
          </div>
        </form>
      </StoryTimePage>
    );
  }
}