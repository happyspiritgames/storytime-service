import React, { Component } from 'react'
import { playerProfileShape } from '../../datastore/dataShapes'
import { formatDate } from '../../util/formatter'

export default class PlayerProfile extends Component {
  static propTypes = {
    profile: playerProfileShape,
  }

  render() {
    const { profile } = this.props
    const { email, nickname, emailOptInAt, authorOptInAt, penName } = profile
    const emailOptInMessage = (emailOptInAt)
      ? `Yes.  On ${formatDate(emailOptInAt)}, you agreed to receive email from Happy Spirit Games.`
      : 'No, I do not want email from Happy Spirit Games.'
    const authorOptInMessage = (authorOptInAt)
      ? `Yes, on ${formatDate(authorOptInAt)} you agreed to terms for authors.`
      : 'No. To become an author, click the button below, and agree to terms and conditions for authors.'

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-center">Player Profile</h4>
          <h6 className="text-muted card-subtitle mb-2 text-center">Let us know about you as a player.</h6>
        </div>
        <div>
          <div className="row profile-row">
            <div className="col-3 text-right"><span><strong>Email Address:</strong></span></div>
            <div className="col"><span>{email}</span></div>
          </div>
          <div className="row profile-row">
            <div className="col-3 text-right"><span><strong>Nickname:</strong></span></div>
            <div className="col"><span>{nickname}</span></div>
          </div>
          <div className="row profile-row">
            <div className="col-3 text-right"><span><strong>Communication:</strong></span></div>
            <div className="col"><span>{emailOptInMessage}</span></div>
          </div>
          <div className="row profile-row">
            <div className="col-3 text-right"><span><strong>Publish Stories:</strong></span></div>
            <div className="col"><span>{authorOptInMessage}</span></div>
          </div>
          { authorOptInAt &&
          <div className="row profile-row">
            <div className="col-3 text-right"><span><strong>Pen Name:</strong></span></div>
            <div className="col"><span>{penName}</span></div>
          </div>
          }
        </div>
      </div>
    )
  }
}