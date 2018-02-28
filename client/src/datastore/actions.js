export const FETCH_SUMMARY = 'FETCH_SUMMARY'
const fetchSummary = (storyId) => ({
  type: FETCH_SUMMARY,
  payload: {
    storyId
  }
})

export const LOAD_SUMMARY = 'LOAD_SUMMARY'
const loadSummary = (summary) => ({
  type: LOAD_SUMMARY,
  payload: {
    summary
  }
})

const findCachedSummary = (state, storyId) => {
  if (!state.summaries) {
    return
  }
  return state.summaries[storyId]
}

export const stageSummary = storyId => {
  return (dispatch, getState) => {
    const cachedSummary = findCachedSummary(getState(), storyId)
    if (cachedSummary) {
      console.log('found summary in cache')
      dispatch(loadSummary(cachedSummary))
    } else {
      dispatch(fetchSummary(storyId))
      return fetch(`/api/stories/${storyId}`)
        .then(
          res => res.json(),
          error => console.error('Something bad happened', error)
        )
        .then(summary => dispatch(loadSummary(summary)))
    }
  }
}

export const FETCH_SCENE = 'FETCH_SCENE'
const fetchScene = (sceneId) => ({
  type: FETCH_SCENE,
  payload: {
    sceneId
  }
})

export const LOAD_SCENE = 'LOAD_SCENE'
const loadScene = (scene) => ({
  type: LOAD_SCENE,
  payload: {
    scene
  }
})

const findCachedScene = (state, sceneId) => {
  if (!(state.reader && state.reader.scenes)) {
    return
  }
  return state.reader.scenes[sceneId]
}

export const stageScene = (storyId, sceneId) => {
  return (dispatch, getState) => {
    const cachedScene = findCachedScene(getState(), sceneId)
    if (cachedScene) {
      return Promise.resolve
    } else {
      dispatch(fetchScene(sceneId))
      return fetch(`/api/stories/${storyId}/scenes/${sceneId}`)
        .then(
          res => res.json(),
          error => console.error('Something bad happened', error)
        )
        .then(scene => dispatch(loadScene(scene)))
    }
  }
}

export const BEGIN_STORY = 'BEGIN_STORY'
export const beginStory = () => ({
  type: BEGIN_STORY
})

export const begin = (storyId) => {
  return (dispatch, getState) => {
    dispatch(stageSummary(storyId))
    .then(() => {
      const { storyId, firstSceneId } = getState().reader.summary
      dispatch(stageScene(storyId, firstSceneId))
      .then(() => {
        dispatch(beginStory())
        console.log(getState())
      })
    })
  }
}

// export const begin = (storyId) => {
//   return (dispatch, getState) => {
//     dispatch(stageSummary(storyId))

//       .then(() => {
//         const { storyId, firstSceneId } = getState().reader.summary
//         dispatch(stageScene(storyId, firstSceneId))
//           .then(() => dispatch(beginStory()))
//       })
//   }
// }

export const VISIT_SCENE = 'VISIT_SCENE'
export const visitScene = (sceneId) => ({
  type: VISIT_SCENE,
  payload: {
    sceneId
  }
})
