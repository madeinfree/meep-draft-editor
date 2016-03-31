/*
  component: font-size
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

import SelectItem from './select-item.react';

import {
  FONTSIZESTYLE
} from '../../draft-type-core/inline'

//custom-core
import {
  FONTSIZE
} from '../../draft-custom-core/custom'

export default class FontSizeControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      onOpen: false,
    }

    this._onOpen = () => {
      this.setState({
        onOpen: !this.state.onOpen
      })
    }
  }

  _toggleFontSize = (size) => {
    let {
      editorState,
      onChange
    } = this.props
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(FONTSIZE)
                             .reduce((contentState, size) => {
                               return Modifier.removeInlineStyle(contentState, selection, size)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, size) => {
        return RichUtils.toggleInlineStyle(state, size);
      }, nextEditorState);
    }
    if(!currentStyle.has(size)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        size
      )
    }
    onChange(nextEditorState)
  }

  render() {
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    let fontSize = 10;
    let itemMap = (
      [10, 13, 16, 20, 24, 28, 32].map((size, idx) => {
        if(currentStyle.has(FONTSIZESTYLE[idx].style)) {
          fontSize = (FONTSIZESTYLE[idx].style).split('-')[1]
        }
        return (
          <SelectItem
            active={currentStyle.has(FONTSIZESTYLE[idx].style)}
            key={`font_size_button_${idx}`}
            size={size}
            style={FONTSIZESTYLE[idx].style}
            onToggle={this._toggleFontSize}
            onOpen={this._onOpen}
          />
        )
      })
    )
    let items = this.state.onOpen ? (
      <div
        style={styles.meepEditorSelectItemBox}
      >
        {itemMap}
      </div>
    ) : ( null )
    let customControlStyle = this.props.customStyle
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorSelectMainBox,
                       customControlStyle,
                       this.state.onOpen?styles.meepEditorSelectMainBoxOpen:{})}
        >
          <div
            onClick={this._onOpen}
          >
            <span
              style={styles.meepEditorSelectBoxLabel}
            >{fontSize} px</span>
            <i
              style={styles.meepEditorSelectBoxIcon}
              className="fa fa-caret-down">
            </i>
          </div>
          {items}
        </div>
      </div>
    );
  }
}
