/*
  component: font-family
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

import SelectFamilyItem from './select-family-item.react';

import {
  FONTFAMILYSTYLE
} from '../../draft-type-core/inline';

//custom-core
import {
  FONTFAMILY
} from '../../draft-custom-core/custom'

export default class FontFamilyControls extends Component {
  constructor(props, context) {
    super(props, context);

    const {
      toggleOpenState
    } = this.props;

    this._onOpen = () => {
      toggleOpenState('fontFamily');
    }
  }

  _toggleFontFamily = (family) => {
    const {
      editorState,
      onChange
    } = this.props
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(FONTFAMILY)
                             .reduce((contentState, family) => {
                               return Modifier.removeInlineStyle(contentState, selection, family)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, family) => {
        return RichUtils.toggleInlineStyle(state, family);
      }, nextEditorState);
    }
    if(!currentStyle.has(family)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        family
      )
    }
    onChange(nextEditorState)
  }

  render() {
    console.log(this.props.openState.toJS().fontFamily);
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    let fontFamily = 'Arial';
    let itemMap = (
      ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier', 'Courier New', '標楷體', 'Helvetica','Impace','Lucida Grande','Lucida Sans','微軟正黑體', 'Monospace','新細明體','Sans Serif','Serif','Tahoma','Times','Times New Roman','Verdana'].map((family, idx) => {
          if(currentStyle.has(FONTFAMILYSTYLE[idx].style)) {
            fontFamily = (FONTFAMILYSTYLE[idx].style)
          }
          return (
            <SelectFamilyItem
              active={currentStyle.has(FONTFAMILYSTYLE[idx].style)}
              key={`font_family_button_${idx}`}
              size={family}
              style={FONTFAMILYSTYLE[idx].style}
              onToggle={this._toggleFontFamily}
              onOpen={this._onOpen}
            />
          )
      })
    )
    let items = this.props.openState.toJS().fontFamily ? (
      <div
        style={styles.meepEditorSelectItemBox}
      >
        {itemMap}
      </div>
    ) : ( null )
    let customControlStyle = this.props.customStyle
    return (
      <div
        style={merge(
          styles.meepEditorInline,
          styles.meepEditorInlineFontFamily
        )}
      >
        <div
          style={merge(styles.meepEditorSelectMainBox,
                       customControlStyle,
                       this.props.openState.toJS().fontFamily?styles.meepEditorSelectMainBoxOpen:null)}
        >
          <div
            onClick={this._onOpen}
          >
            <span
              style={styles.meepEditorSelectBoxLabel}
            >{fontFamily}</span>
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
