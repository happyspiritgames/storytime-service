import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Row, Col } from 'reactstrap';

export default class SettingsCard extends Component {
  render() {
    return (
      <Card id="scene" outline color="info">
        <CardHeader className="text-center">
          <h5 className="mb-0">About You</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              Login with Facebook, Google+, LinkedIn, Twitter, Okta, etc.
            </Col>
            <Col>
              <p><em>(only shown when logged in)</em></p>
              <div><strong>Member since:</strong> July 4, 2017</div>
              <div><strong>Pen Names:</strong> The Happy Spirit, Bubba</div>
              <div><strong>Status:</strong> Excellent</div>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          WIP
        </CardFooter>
      </Card>
    );
  }
}