/*
  component: block
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import StyleButton from './style-button.react';

import camelcase from 'camelcase';

import BLOCK_TYPES from '../../draft-type-core/block'

const BlockControls = (props) => {
  let {
    editorState,
    groupControls
  } = props
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent()
                               .getBlockForKey(selection.getStartKey())
                               .getType();
  let button = (BLOCK_TYPES.map((type, index) => {
    if (!groupControls[camelcase(type.style)]) return
    return (
      <StyleButton
        key={`block_button_${index}`}
        active={type.style === blockType}
        label={<i className={type.label}></i>}
        style={type.style}
        onToggle={props.onToggle}
      /> )
  }))
  return (
    <div
      style={styles.meepEditorInline}
    >
      {button}
    </div>
  )
}

export default BlockControls;
