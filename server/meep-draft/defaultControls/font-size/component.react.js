/*
  component: font-size
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import SelectItem from './select-item.react';

import {
  FONTSIZESTYLE
} from '../../draft-type-core/inline'

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
            onToggle={this.props.onToggle}
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
