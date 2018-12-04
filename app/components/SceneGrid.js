// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Scene from './Scene';
import styles from './SceneGrid.css';
import {
  // getNextThumbs,
  // getPreviousThumbs,
  // mapRange,
  getObjectProperty,
  getWidthOfLongestRow,
  // formatBytes,
  // frameCountToTimeCode,
  // getLowestFrame,
  // getHighestFrame,
  // getAllFrameNumbers,
  // roundNumber,
} from './../utils/utils';
import {
  // MINIMUM_WIDTH_OF_CUTWIDTH_ON_TIMELINE,
} from './../utils/constants';

const SortableScene = SortableElement(Scene);

class SceneGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thumbsToDim: [],
      controllersVisible: undefined,
      addThumbBeforeController: undefined,
      addThumbAfterController: undefined,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    const minutesPerRow = this.props.minutesPerRow;
    const minSceneLength = this.props.minSceneLength;
    const sceneArray = this.props.scenes;
    const newMoviePrintTimelineWidth = this.props.scaleValueObject.newMoviePrintTimelineWidth;
    const thumbMargin = this.props.scaleValueObject.newThumbMargin;
    let rowCounter = 1;

    const rows = this.props.scaleValueObject.rowsTimeline;

    const rowHeight = this.props.scaleValueObject.rowHeightTimeline;
    const realWidth = (rowHeight / this.props.scaleValueObject.aspectRatioInv);
    const adjustedPixelPerFrameRatio = this.props.scaleValueObject.adjustedPixelPerFrameRatioTimeline;

    return (
      <div
        data-tid='sceneGridDiv'
        className={styles.grid}
        id="SceneGrid"
      >
        <div
          data-tid='sceneGridBodyDiv'
          style={{
            // width: newMaxWidth + realWidth, // enough width so when user selects thumb and it becomes wider, the row does not break into the next line
          }}
        >
          {sceneArray.map((scene, index) => {
            // minutes per row idea
            const selected = this.props.selectedSceneId ? (this.props.selectedSceneId === scene.sceneId) : false;
            const width = selected ? realWidth :
              Math.max(adjustedPixelPerFrameRatio * scene.length, adjustedPixelPerFrameRatio * minSceneLength);
            let doLineBreak = false;
            if ((scene.start + scene.length) > (minutesPerRow * 60 * 25 * rowCounter)) {
              doLineBreak = true;
              rowCounter += 1;
            }

            return (
            <SortableScene
              hidden={scene.hidden}
              controllersAreVisible={(this.props.showSettings || scene.sceneId === undefined) ? false : (scene.sceneId === this.state.controllersVisible)}
              selected={selected}
              doLineBreak={doLineBreak}
              defaultView={this.props.defaultView}
              keyObject={this.props.keyObject}
              indexForId={index}
              index={index}
              key={scene.sceneId}
              sceneId={scene.sceneId}
              margin={thumbMargin}

              // only allow expanding of scenes which are not already large enough and deselecting
              allowSceneToBeSelected={selected || width < (realWidth * 0.95)}
              thumbWidth={width}
              thumbHeight={rowHeight}
              hexColor={`#${((1 << 24) + (Math.round(scene.colorArray[0]) << 16) + (Math.round(scene.colorArray[1]) << 8) + Math.round(scene.colorArray[2])).toString(16).slice(1)}`}
              thumbImageObjectUrl={getObjectProperty(() => {
                const thumb = this.props.thumbs.find((foundThumb) => foundThumb.sceneId === scene.sceneId);
                return this.props.thumbImages[thumb.frameId].objectUrl
              })}
              onOver={this.props.showSettings ? null : () => {
                // only setState if controllersVisible has changed
                if (this.state.controllersVisible !== scene.sceneId) {
                  this.setState({
                    controllersVisible: scene.sceneId,
                  });
                }
              }}
              onOut={this.props.showSettings ? null : () => {
                this.setState({
                  thumbsToDim: [],
                  controllersVisible: undefined,
                  addThumbBeforeController: undefined,
                  addThumbAfterController: undefined,
                });
              }}
              onToggle={(this.props.showSettings || (scene.sceneId !== this.state.controllersVisible)) ?
                null : () => this.props.onToggleClick(this.props.file.id, scene.sceneId)}
              onSelect={(this.props.showSettings || (scene.sceneId !== this.state.controllersVisible)) ?
                null : () => {
                  this.props.onSelectClick(scene.sceneId);
                }}
              onEnter={(this.props.showSettings || (scene.sceneId !== this.state.controllersVisible)) ?
                null : () => {
                  this.props.onEnterClick(this.props.file, scene.sceneId);
                }}
            />)}
          )}
        </div>
      </div>
    );
  }
}

SceneGrid.defaultProps = {
};

SceneGrid.propTypes = {
};

const SortableSceneGrid = SortableContainer(SceneGrid);

export default SortableSceneGrid;
