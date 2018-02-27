import reader from './reader';

describe('reader reducer', () => {
  it('should handle initial state', () => {
    expect(
      reader(undefined, {})
    ).toEqual({});
  });

  it('handles LOAD_SUMMARY', () => {
    const testSummary = {
      storyId: 'ABCDEFG',
      title: 'Winner',
      penName: 'Onthe Money',
      tagLine: 'A tale of winning beyond belief',
      about: 'You think winning is easy?  Well why not?!'
    };
    expect(
      reader({}, {
        type: 'LOAD_SUMMARY',
        payload: {
          summary: testSummary
        }
      })
    ).toEqual({
      summary: testSummary
    });
  });

  it('handles LOAD_SUMMARY without payload', () => {
    // TODO use a spy to check console error messages
    expect(
      reader({}, {
        type: 'LOAD_SUMMARY',
        blargy: {
          storyId: 'ABCDEFG',
          title: 'Loser'
        }
      })
    ).toEqual({});
  });

  it('handles LOAD_SCENE', () => {
    const testScene = {
      sceneId: '123',
      title: 'Start Here',
      prose: 'Blargy blargy blargy.',
      endPrompt: 'How do you want to get out of this mess?',
      signpost: [
        { sceneId: '124', teaser: 'The easy way.' },
        { sceneId: '125', teaser: 'The hard way.' }
      ]
    };
    expect (
      reader({}, {
        type: 'LOAD_SCENE',
        scene: testScene
      })
    ).toEqual({
      scenes: {
        '123': testScene
      }
    });
  });

  it('handles LOAD_SCENE without scene', () => {
    // TODO use a spy to check console error messages
    expect (
      reader({}, {
        type: 'LOAD_SCENE',
        wrongScene: {}
      })
    ).toEqual({});
  });

  it('handles LOAD_SCENE without proper payload', () => {
    const garbagePayload = {
      garbage: '123'
    };
    // TODO use a spy to check console error messages
    expect (
      reader({}, {
        type: 'LOAD_SCENE',
        scene: garbagePayload
      })
    ).toEqual({});
  });

  it('handles VISIT_SCENE', () => {
    expect (
      reader({}, {
        type: 'VISIT_SCENE',
        nextSceneId: '42'
      })
    ).toEqual({
      currentScene: '42'
    })
  });
  it('handles VISIT_SCENE without nextSceneId', () => {
    expect (
      reader({}, {
        type: 'VISIT_SCENE',
        sceneId: '42'
      })
    ).toEqual({})
  });
});
