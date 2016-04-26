/*
  component: background
 */
import React, { Component } from 'react';

import Draft, {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Entity,
  CompositeDecorator,
  ContentState,
  SelectionState,
  CharacterMetadata } from 'draft-js';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import BackgroundButton from './background-button.react';

import {
  BACKGROUNDCOLORSTYLE
} from '../../draft-type-core/inline'

import {
  BACKGROUNDCOLORS
} from '../../draft-custom-core/custom'

export default class BackgroundControls extends Component {
  constructor(props, context) {
    super(props, context);

    const {
      toggleOpenState
    } = this.props;

    this._onOpen = () => {
      toggleOpenState('fontBackground');
    }
  }

  _toggleBackgroundColor = (backgroundcolor) => {
    const {
      editorState,
      onChange
    } = this.props
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(BACKGROUNDCOLORS)
                             .reduce((contentState, backgroundcolor) => {
                               return Modifier.removeInlineStyle(contentState, selection, backgroundcolor)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, backgroundcolor) => {
        return RichUtils.toggleInlineStyle(state, backgroundcolor);
      }, nextEditorState);
    }
    if(!currentStyle.has(backgroundcolor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        backgroundcolor
      )
    }
    onChange(nextEditorState)
  }

  render() {
    let {
      editorState
    } = this.props
    let currentStyle = editorState.getCurrentInlineStyle();
    let button = this.props.openState.toJS().fontBackground ? (BACKGROUNDCOLORSTYLE.map((type, idx) => {
      return (
        <BackgroundButton
          key={`background_button_${idx}`}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onToggle={() => {
            this._toggleBackgroundColor(type.style);
          }}
        />)
    })) : ( null )
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorDefaultButton, styles.meepEditorActionSelect)}
          onClick={this._onOpen}
        >
          <i className="fa fa-cog"></i>
        </div>
        <div
          style={styles.meepEditorActiveBackgroundBox}
        >
          {button}
        </div>
      </div>
    );
  }
}
