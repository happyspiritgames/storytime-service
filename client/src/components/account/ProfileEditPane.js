import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { profileChangeShape } from '../../datastore/dataShapes'

export default class ProfileEditPane extends Component {
  static propTypes = {
    profileChanges: profileChangeShape,
    change: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func
  }

  handleChange = (event) => {
    console.log('profile change', event.target)
    this.props.change(event.target.id, event.target.value)
  }

  handleSave = () => {
    this.props.save()
  }

  handleCancel = () => {
    this.props.cancel()
  }

  // TODO use local state for changes -- update locally, then call actions??
  
  render() {
    const { profileChanges } = this.props
    if (!profileChanges) {
      // must not be editing; bail out
      return null
    }

    const { nickname, penName, emailOptIn } = profileChanges;
    const penNameValue = penName || ''
    const emailOptInLabel = (emailOptIn)
      ? `You have agreed to receive email.`
      : 'Check to agree to receive email from Happy Spirit Games.'

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-center">Player Profile</h4>
          <h6 className="text-muted card-subtitle mb-2 text-center">Let us know about you as a player.</h6>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              className="form-control"
              type="text"
              id="nickname"
              value={nickname}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted">What would you like to be called?</small>
          </div>
          <div className="form-group">
            <label htmlFor="penName">Pen name</label>
            <input
              className="form-control"
              type="text"
              id="penName"
              value={penNameValue}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted">The name that shows up on published stories as the author. (only appears when t&amp;c for authors is agreed.)</small>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailOptIn"
              checked={emailOptIn}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor="emailOptIn">{emailOptInLabel}</label>
          </div>
          <button
            className="btn btn-primary action-button"
            onClick={this.handleSave}
          >
            Save Change
          </button>
          <button
            className="btn btn-primary action-button"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    )
  }
}