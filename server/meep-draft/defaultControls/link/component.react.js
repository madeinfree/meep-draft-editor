/*
  component: link
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

const LinkControls = (props) => {
  const {
    onHandlLink,
    groupControls
  } = props
  const links = [];

  const _onHandlLink = (e, action) => {
    const {
      editorState,
      onChange
    } = props;
    const selection = editorState.getSelection();
    let entityKey;
    let content;
    let oldUrl;
    switch(action) {
      case 'addLink':
        if (selection.isCollapsed()) {
          return
        }
        let selectedBlockEntityNumber = editorState
                                .getCurrentContent()
                                .getBlockForKey(editorState.getSelection().getStartKey())
                                .getEntityAt(editorState.getSelection().getStartOffset());
        if(selectedBlockEntityNumber !== null) {
          oldUrl = Entity.get(selectedBlockEntityNumber).get('data').href;
        }
        const href = window.prompt('請輸入網址', oldUrl);
        content = editorState.getCurrentContent();
        if(href === null) return
        entityKey = Entity.create('link', 'MUTABLE', {href});
      break;
      case 'removeLink':
        entityKey = null;
        content = editorState.getCurrentContent();
      break;
    }
    const nextEditorState = RichUtils.toggleLink(editorState, selection, entityKey)
    onChange(nextEditorState);
  }

  groupControls.set ? links.push(
    <span
      key={`link-2`}
      style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
      onClick={(e) => {
        _onHandlLink(e, 'addLink')
      }}
    >
      <i className="fa fa-link"></i>
    </span>
  ) : null

  groupControls.unset ? links.push(
    <span
      key={`link-1`}
      style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
      onClick={(e) => {
        _onHandlLink(e, 'removeLink')
      }}
    >
      <i className="fa fa-unlink"></i>
    </span>
  ) : null

  return (
    <span>
      {links}
    </span>
  )
}

export default LinkControls;
