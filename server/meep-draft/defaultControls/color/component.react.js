/*
  component: color
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

import ColorButton from './color-button.react';

import {
  COLORSTYLE
} from '../../draft-type-core/inline';

import {
  COLORS
} from '../../draft-custom-core/custom';

export default class ColorControls extends Component {
  constructor(props, context) {
    super(props, context);

    const {
      toggleOpenState
    } = this.props;

    this._onOpen = () => {
      toggleOpenState('fontColor');
    }
  }

  _toggleColor = (color) => {
    const {
      editorState,
      onChange
    } = this.props
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(COLORS)
                             .reduce((contentState, color) => {
                               return Modifier.removeInlineStyle(contentState, selection, color)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    if(!currentStyle.has(color)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        color
      )
    }
    onChange(nextEditorState)
  }

  render() {
    let {
      editorState
    } = this.props
    let currentStyle = editorState.getCurrentInlineStyle();
    let button = this.props.openState.toJS().fontColor ? (COLORSTYLE.map((type, idx) => {
      return (
        <ColorButton
          key={`color_button_${idx}`}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onToggle={() => {
            this._toggleColor(type.style)
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
          <i className="fa fa-font"></i>
        </div>
        <div
          style={styles.meepEditorActiveColorBox}
        >
          {button}
        </div>
      </div>
    )
  }
}
