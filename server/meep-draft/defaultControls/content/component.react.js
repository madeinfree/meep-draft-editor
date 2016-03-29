/*
  component: content
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

import ContentButton from './content-button.react';

import {
  BACKGROUNDCOLORSTYLE
} from '../../draft-type-core/inline'

const ContentControls = (props) => {
  const {
    groupControls,
    editorState,
    onChange
  } = props

  const _setEditorState = (editorState) => {
    console.log(editorState.toJS());
    onChange(editorState);
  }

  const onDoHandle = (editorState, action) => {
    let newEditorState
    switch(action) {
      case 'undo':
        newEditorState = EditorState.undo(editorState);
      break;
      case 'redo':
        newEditorState = EditorState.redo(editorState);
      break;
    }
    if(newEditorState) {
      _setEditorState(newEditorState);
    }
  };

  const content = [];

  groupControls.undo ? (
    content.push(
      <ContentButton
        key={`content-2`}
        label={<i className="fa fa-undo"></i>}
        doAction="undo"
        editorState={props.editorState}
        onDoHandle={onDoHandle}
      />
    )
  ) : null

  groupControls.redo ? (
    content.push(
      <ContentButton
        key={`content-1`}
        label={<i className="fa fa-repeat"></i>}
        doAction="redo"
        editorState={props.editorState}
        onDoHandle={onDoHandle}
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
