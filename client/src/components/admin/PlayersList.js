import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

export default class PlayersList extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    onSelect: PropTypes.func
  };

  handleSelect = (playerId) => {
    return () => {
      this.props.onSelect(playerId);
    }
  }

  renderPlayerRow(player) {
    const status = (player.status === 2) ? 'player-suspended' : '';
    return (
      <tr key={player.id} onClick={this.handleSelect(player.id)} className={status}>
        <td>{ player.email }</td>
        <td>{ player.nickname }</td>
        <td>{ player.createdAt }</td>
        <td>
          { player.emailOptInAt ? `Yes` : 'No' }
        </td>
      </tr>
    )
  }

  render() {
    const { players } = this.props;
    if (!players) {
      return '';
    }
    const rows = players.map(player => this.renderPlayerRow(player));

    // TODO include sorting with icons
    // <i class="fa fa-sort-alpha-asc"></i><i class="fa fa-sort-alpha-desc"></i>

    return (
      <Table responsive>
        <thead>
          <tr>
              <th>Email Address</th>
              <th>Nickname</th>
              <th>Joined</th>
              <th>Email Opt In</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </Table>
    );
  }
}