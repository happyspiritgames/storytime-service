import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { draftShape } from '../../datastore/dataShapes'
import StoryEditTabs from './StoryEditTabs'

export default class EditScene extends Component {
  static propTypes = {
    draft: draftShape,
    loadDraft: PropTypes.func,
    saveScene: PropTypes.func
  }

  state = {
    draftSummary: {},
    activeScene: {
      title: '',
      prose: '',
      endPrompt: '',
      signpost: []
    },
    isLoading: false
  }

  establishInitialDraftState = (draft, sceneId) => {
    const draftSummary = draft.summary
    const activeScene = draft.scenes[sceneId]
    this.setState({
      draftSummary,
      activeScene,
      isLoading: false
    })
  }

  handleChangeScene = (event) => {
    const target = event.target
    let updateValue = target.value
    let activeScene = {
      ...this.state.activeScene,
      [target.id]: updateValue
    }
    this.setState({ activeScene })
  }

  handleSaveScene = () => {
    this.props.saveScene(this.state.draftSummary.storyId, this.state.activeScene)
  }

  handleGoToEditSignpost = () => {
    const { draftSummary, activeScene } = this.state
    const signpostPage = `/writingdesk/${draftSummary.storyId}/scenes/${activeScene.sceneId}/signpost`
    this.props.history.push(signpostPage)
  }

  componentDidMount() {
    const { draftId, sceneId } = this.props.match.params
    if (!draftId || !sceneId) {
      throw new Error('Routing issue: got to EditScene without a draft ID or scene ID')
    }

    const { draft } = this.props

    if (!draft) {
      this.setState({
        isLoading: true,
        activeScene: undefined
      })
      this.props.loadDraft(draftId)
      return
    }

    if (draft.scenes[sceneId]) {
      this.establishInitialDraftState(draft, sceneId)
      return
    } else {
      console.error('No scene?!?')
      throw new Error('No scene; should already be part of draft in store')
    }
}

  componentWillReceiveProps(nextProps) {
    const nextSceneId = nextProps.match.params.sceneId
    const { draft } = nextProps

    // end loading once draft has been located
    if (this.state.isLoading
        && draft
        && this.state.activeScene !== draft.scenes[nextSceneId]) {
      this.establishInitialDraftState(draft, nextSceneId)
      return
    }

    if (draft 
        && draft.scenes[nextSceneId]
        && this.state.activeScene
        && this.state.activeScene.signpost !== draft.scenes[nextSceneId].signpost) {
      this.establishInitialDraftState(draft, nextSceneId)
    }
  }

  renderLoading() {
    return (
      <div id="edit-story">
        <h3 className="text-center">StoryTime Writing Desk</h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/writingdesk">Projects</Link></li>
          <li className="breadcrumb-item">Loading...</li>
        </ol>
        <h3>Loading...</h3>
      </div>
    )
  }

  renderSigns(signpost) {
    let signsOut = null
    if (signpost && signpost.length) {
      signsOut = signpost.map((sign, index) => (
        <li key={`${sign.destinationId}|${index}`} className="list-group-item">
          {`${sign.teaser} ---> ${this.props.draft.scenes[sign.destinationId].title} [${sign.destinationId}]`}
        </li>
      ))
    }
    return signsOut
  }

  render() {
    const { isLoading, draftSummary, activeScene } = this.state

    if (isLoading) {
      return this.renderLoading()
    }

    const signs = this.renderSigns(activeScene.signpost)

    return (
      <div id="edit-scene">
        <h3 className="text-center">StoryTime Writing Desk</h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/writingdesk">Projects</Link></li>
          <li className="breadcrumb-item"><Link to={`/writingdesk/${draftSummary.storyId}`}>{draftSummary.title}</Link></li>
          <li className="breadcrumb-item">{activeScene.title}</li>
        </ol>
        <StoryEditTabs summary={draftSummary} activeTab="scenes" />
        <div className="row section">
          <div className="col">
            <h5>Scene: {activeScene.title}</h5>
            <form>
              <fieldset>
                <div className="form-group">
                  <label>Scene Title</label>
                  <input
                    className="form-control"
                    type="text"
                    id="title"
                    value={activeScene.title}
                    onChange={this.handleChangeScene}
                  />
                </div>
                <div className="form-group">
                  <label>Prose</label>
                  <small className="form-text text-muted">This is what people will read when they visit the scene.</small>
                  <textarea
                    className="form-control"
                    id="prose"
                    rows="10"
                    value={activeScene.prose}
                    onChange={this.handleChangeScene}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Next Scene Prompt</label>
                  <input
                    className="form-control"
                    type="text"
                    id="endPrompt"
                    value={activeScene.endPrompt}
                    onChange={this.handleChangeScene}
                  />
                  <small className="form-text text-muted">Optional text to display before the signpost of next scene options.</small>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.handleSaveScene}>Save Scene</button>
              </fieldset>
            </form>
          </div>
          <div className="col">
            <h5>Signpost</h5>
            <ul className="list-group">
              {signs}
              <li className="list-group-item">
                <button className="btn btn-primary" type="button" onClick={this.handleGoToEditSignpost}>Change Signs</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
