/*
  component: block
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

import StyleButton from './style-button.react';

import camelcase from 'camelcase';

import BLOCK_TYPES from '../../draft-type-core/block'

const BlockControls = (props) => {
  let {
    editorState,
    groupControls,
    onChange,
    style
  } = props

  const _toggleAlign = (align) => {
    const {
      onChange
    } = props
    const selection = editorState.getSelection();
    const nextContentState = Object.keys(ALIGN)
                             .reduce((contentState, align) => {
                               return Modifier.removeInlineStyle(contentState, selection, align)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, align) => {
        return RichUtils.toggleInlineStyle(state, align);
      }, nextEditorState);
    }
    if(!currentStyle.has(align)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        align
      )
    }
    onChange(nextEditorState);
  }

  const _toggleBlockType = (blockType) => {
    const newEditorState = RichUtils.toggleBlockType(editorState, blockType)
    onChange(newEditorState);
  }

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
        editorStyle={type.style}
        style={style}
        onToggle={_toggleBlockType}
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
