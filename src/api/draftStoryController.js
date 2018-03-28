const draftModel = require('../db/draftStoryModel')
const publishingModel = require('../db/publishingModel')
const { internalError, errorMessage, theEnd } = require('./errors')

const verifyStoryAuthorization = async (playerId, storyId, res) => {
  const authorId = await draftModel.getStoryOwner(storyId)
  if (!authorId) {
    res.status(404).json(errorMessage('Story not found.'))
    return false
  }
  if (authorId !== playerId) {
    res.status(401).json(errorMessage('You do not have permission to edit that story.'))
    return false
  }
  return true
}

/**
 * StoryTime API method for retrieving draft story summaries for the current player.
 *
 * @param {*} req - the HTTP request
 * @param {*} res - the HTTP response
 */
exports.getDraftSummaries = async (req, res) => {
  console.log('draftStoryController.getStories')
  const authorId = req.user.playerId
  try {
    const stories = await draftModel.getStories(authorId)
    res.json(stories)
  } catch (e) {
    console.error('Problem getting draft stories', e)
    res.status(500).json(internalError)
  }
}

exports.beginNewStory = async (req, res) => {
  const { playerId } = req.user
  const { title, tagLine, about } = req.body
  console.log('draftStoryController.beginNewStory', playerId, title)
  try {
    const storyId = await draftModel.createStory(playerId, title, tagLine, about)
    const sceneId = await draftModel.createScene(storyId, 'First Scene')
    await draftModel.updateStory(storyId, null, null, null, sceneId)
    const summary = await draftModel.getStory(storyId)
    res.status(201).json(summary)
  } catch (e) {
    console.error('Problem creating draft story', e)
    res.status(500).json(internalError)
  }
}

exports.getStorySummary = async (req, res) => {
  console.log('draftStoryController.getStorySummary')
  const { playerId } = req.user
  const { storyId } = req.params
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return;
    }
    const summary = await draftModel.getStory(storyId)
    res.json(summary)
  } catch (e) {
    console.error('Problem getting draft summary', e)
    res.status(500).json(internalError)
  }
}

exports.updateStorySummary = async (req, res) => {
  console.log('draftStoryController.updateStorySummary')
  const { playerId } = req.user
  const { storyId } = req.params
  const { title, tagLine, about, firstSceneId } = req.body
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    await draftModel.updateStory(storyId, title, tagLine, about, firstSceneId)
    const summary = await draftModel.getStory(storyId)
    res.status(202).json(summary)
  } catch (e) {
    console.error('Problem updating draft summary', e)
    res.status(500).json(internalError)
  }
}

exports.getFullStory = async (req, res) => {
  console.log('draftStoryController.getFullStory')
  const { playerId } = req.user
  const { storyId } = req.params
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    const summary = await draftModel.getStory(storyId)
    const scenes = await draftModel.getScenes(storyId)
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      const signpost = await draftModel.getSignpost(scene.sceneId)
      if (signpost) {
        scene['signpost'] = signpost
      }
    }
    const fullStory = {
      summary: summary,
      scenes: scenes
    }
    res.json(fullStory)
  } catch (e) {
    console.error('Problem getting full draft', e)
    res.status(500).json(internalError)
  }
}

exports.beginNewScene = async (req, res) => {
  const { playerId } = req.user
  const { storyId } = req.params
  const { title, prose, endPrompt } = req.body
  console.log('draftStoryController.beginNewScene', storyId, title)
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    const sceneId = await draftModel.createScene(storyId, title, prose, endPrompt)
    const scene = await draftModel.getScene(storyId, sceneId)
    res.status(201).json(scene)
  } catch (e) {
    console.error('Problem creating new scene', e)
    res.status(500).json(internalError)
  }
}

exports.getScene = async (req, res) => {
  const { playerId } = req.user
  const { storyId, sceneId } = req.params
  console.log('draftStoryController.getScene', storyId, sceneId)
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    const scene = await draftModel.getScene(storyId, sceneId)
    if (!scene) {
      res.status(404).json(errorMessage('The scene was not found.'))
      return
    }
    res.json(scene)
  } catch (e) {
    console.error('Problem getting draft scene', e)
    res.status(500).json(internalError)
  }
}

exports.updateScene = async (req, res) => {
  console.log('draftStoryController.updateScene')
  const { playerId } = req.user
  const { storyId, sceneId } = req.params
  const { title, prose, endPrompt } = req.body
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    await draftModel.updateScene(storyId, sceneId, title, prose, endPrompt)
    const scene = await draftModel.getScene(storyId, sceneId)
    res.status(202).json(scene)
  } catch (e) {
    console.error('Problem updating draft scene', e)
    res.status(500).json(internalError)
  }
}

exports.getSignpost = async (req, res) => {
  console.log('draftStoryController.getSignpost')
  const { playerId } = req.user
  const { storyId, sceneId } = req.params
  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    const signpost = await draftModel.getSignpost(sceneId)
    if (!signpost) {
      res.status(404).json(theEnd)
    }
    res.json(signpost)
  } catch (e) {
    console.error('Problem getting signpost for scene', e)
    res.status(500).json(internalError)
  }
}

const takeNap = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.updateSignpost = async (req, res) => {
  console.log('draftStoryController.updateSignpost')
  const { playerId } = req.user
  const { storyId, sceneId } = req.params
  const { toUpdate, toDelete } = req.body
  console.log(req.body)

  try {
    if (!verifyStoryAuthorization(playerId, storyId, res)) {
      return
    }
    if (toDelete) {
      console.log('deleting signs on signpost')
      toDelete.forEach(async destinationId => {
        await draftModel.deleteSignpostSign(sceneId, destinationId)
      })
    }
    if (toUpdate) {
      console.log('updating signpost', toUpdate, toUpdate.length)
      toUpdate.forEach(async update => {
        const sign = await draftModel.getSign(sceneId, update.destinationId)
        if (sign) {
          console.log('found sign', sign)
          if (sign.teaser !== update.teaser || sign.order !== update.order) {
            console.log('update sign', update)
            await draftModel.updateSignpostSign(sceneId, update.destinationId, update.teaser, update.order)
          } else {
            console.log('no update, same as existing', update)
          }
        } else {
          console.log('adding new sign')
          await draftModel.addSignpostSign(sceneId, update.destinationId, update.teaser, update.order)
        }
      })
    }

    // TODO might be horrible; just a work-around until I can troubleshoot async problems
    await takeNap(200)

    const signpost = await draftModel.getSignpost(sceneId)
    console.log('return updated signpost', signpost)
    res.status(202).send(signpost)
  } catch (e) {
    console.error('Problem updating signpost for scene', e)
    res.status(500).json(internalError)
  }
}

/**
  Initiates a new published version. There can only be one unresolved published version at a time.
  So if this is called a second time while a published version exists with a publishedAt timestamp, the existing
  record will be returned.
 */
exports.prepareToPublish = async (req, res) => {
  const { playerId } = req.user
  const { draftId } = req.params
  console.log('draftStoryController.prepareToPublish', draftId)

  try {
    if (!verifyStoryAuthorization(playerId, draftId, res)) {
      return;
    }
    const unpublishedMetadata = await publishingModel.findUnpublishedInCatalog(playerId, draftId)
    if (unpublishedMetadata) {
      res.status(201).json(unpublishedMetadata)
      return;
    }
    // TODO implement version numbering logic
    //  a) find the latest published and increment minor
    //  b) find the latest published and increment major, reset minor
    //  ?? how to decide which one ??
    const metadata = await publishingModel.createCatalogRecord(draftId, '0-1')
    res.status(201).json(metadata)
  } catch (e) {
    console.error('Problem creating metadata for publishing', e)
    res.status(500).json(internalError)
  }
}

exports.getMetadataForPublishing = async (req, res) => {
  const { playerId } = req.user
  const { draftId, version } = req.params
  console.log('draftStoryController.getMetadataForPublishing', draftId, version)

  try {
    if (!verifyStoryAuthorization(playerId, draftId, res)) {
      return
    }
    const metadata = await publishingModel.getStoryFromCatalog(draftId, version)
    if (!metadata) {
      res.status(404).send()
      return
    }

    // use rating code instead of internal ID
    // TODO get this to come out of query result instead of patching
    if (metadata.rating) {
      const ratingCode = await publishingModel.getRatingCode(metadata.rating)
      metadata['rating'] = ratingCode
    }

    // merge in associated genres
    const genres = await publishingModel.getStoryGenres(draftId, version)
    metadata['genres'] = genres
    res.status(200).json(metadata)
  } catch (e) {
    console.error('Problem creating metadata for publishing', e)
    res.status(500).json(internalError)
  }
}

exports.updateMetadataForPublishing = async (req, res) => {
  res.status(501).send()
}

exports.publish = async (req, res) => {

  // build story JSON and store in S3
  // set published_at timestamp
  // this might be better as batch job since there could be some lag

  res.status(501).send()
}
