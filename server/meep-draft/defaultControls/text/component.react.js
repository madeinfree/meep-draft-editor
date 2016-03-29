/*
  component: font-family
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import StyleButton from './style-button.react';

import {
  TEXTSTYLE
} from '../../draft-type-core/inline'

const TextControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  const {
    groupControls
  } = props
  const button = (TEXTSTYLE.map((type, index) => {
    if (!groupControls[type.style]) return
    return (
      <StyleButton
        key={`text_button_${index}`}
        active={currentStyle.has(type.style)}
        label={<i className={type.label}></i>}
        style={type.style}
        onToggle={props.onToggle}
      /> )
  }))
  return (
    <div
      style={
        merge(styles.controls,
              styles.meepEditorInline,
             )
      }
    >
      {button}
    </div>
  )
}

export default TextControls;
