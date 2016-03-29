/*
  component: content
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import ContentButton from './content-button.react';

import {
  BACKGROUNDCOLORSTYLE
} from '../../draft-type-core/inline'

const ContentControls = (props) => {
  const {
    groupControls
  } = props

  const content = [];

  groupControls.redo ? (
    content.push(
      <ContentButton
        key={`content-1`}
        label={<i className="fa fa-repeat"></i>}
        doAction="redo"
        editorState={props.editorState}
        onDoHandle={props.onDoHandle}
      />
    )
  ) : null

  groupControls.undo ? (
    content.push(
      <ContentButton
        key={`content-2`}
        label={<i className="fa fa-undo"></i>}
        doAction="undo"
        editorState={props.editorState}
        onDoHandle={props.onDoHandle}
      />
    )
  ) : null

  return (
    <div
      style={styles.meepEditorInline}
    >
      {content}
    </div>
  );
}

export default ContentControls;
