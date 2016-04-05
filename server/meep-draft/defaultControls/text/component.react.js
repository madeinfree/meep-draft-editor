/*
  component: font-family
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

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

import StyleButton from './style-button.react';

import {
  TEXTSTYLE
} from '../../draft-type-core/inline'

const TextControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  const {
    groupControls,
    style
  } = props

  const _toggleInlineStyle = (inlineStyle) => {
    const {
      editorState,
      onChange
    } = props

    const newEditorState = RichUtils.toggleInlineStyle(editorState, inlineStyle)

    onChange(newEditorState);
  }

  const button = (TEXTSTYLE.map((type, index) => {
    if (!groupControls[type.style]) return
    return (
      <StyleButton
        key={`text_button_${index}`}
        active={currentStyle.has(type.style)}
        label={<i className={type.label}></i>}
        editorStyle={type.style}
        style={style}
        onToggle={_toggleInlineStyle}
      /> )
  }))

  return (
    <div
      style={
        merge(styles.controls,
              styles.meepEditorInline,
              style
             )
      }
    >
      {button}
    </div>
  )
}

export default TextControls;
