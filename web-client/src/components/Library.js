import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { getStorySummaries } from '../services/storyTimeService';
import StoryCard from './StoryCard';

export default class Library extends Component {

  // TODO turn this into the top-level container that redux is plugged into.
  // TODO extract CardCatalog component for searching stories.

  constructor(props) {
    super(props);
    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    getStorySummaries(this.loadSummaries);
  }

  loadSummaries = (summaries) => {
    this.setState({ stories: summaries });
  }

  render() {
    const { stories } = this.state;
    const cards = stories.map(story => <StoryCard key={story.storyKey} summary={story} />);

    return (
      <Container id="library" fluid={true} className="storytime-page">
        <h1 className="text-center">Welcome to the StoryTime Library.</h1>
        <h3 className="text-center font-weight-light font-italic">Find something to read.</h3>
        {cards}
        <div id="message">
          <p>Gentle reader,<img className="float-right" src="/img/DaveMount.png" width="150" alt="The Happy Spirit" /></p>
          <p>Thanks for trying StoryTime. This is a choose-your-destiny game, where you read a scene and
            decide what to do next. Some choices lead to success, others not so much. Regardless of how it
            turns out, be sure to start over and make different choices to explore alternative paths
            through the story world. It's fun!</p>
          <p>As you can see, there is only one story in the library at the moment, <em>The Mission</em>. Over
            the coming months, I will double or triple the number of stories. Wow! And before long, you
            will be able to create your own windy, twisty tales of adventure and daring. Double wow!</p>
          <p>I have a favor to ask. You are one of the first people to play my game, and I would love
            your feedback. Anytime you reach "The End" of the story, one of the links will take you
            to a survey. Click on the survey link, and answer the questions as candidly as you like.
            I will use your opinions to prioritize the hundreds of improvements I already have in mind.</p>
          <p>Above all, have fun, and <a href="http://eepurl.com/c9mZIr">register for my
            Insider Newsletter</a> to stay in the loop. You can
            also <a href="https://happyspiritgames.blog/">follow the Happy Spirit Games
            blog</a>.</p>
          <p>Yours in fun,<br/><em>Dave Mount, a.k.a. The Happy Spirit</em></p>
          <p></p>
        </div>
      </Container>
    );
  }
}