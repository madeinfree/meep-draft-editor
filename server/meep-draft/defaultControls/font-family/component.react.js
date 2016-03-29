/*
  component: font-family
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import SelectFamilyItem from './select-family-item.react';

import {
  FONTFAMILYSTYLE
} from '../../draft-type-core/inline'

export default class FontFamilyControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      onOpen: false
    }

    this._onOpen = () => {
      this.setState({
        onOpen: !this.state.onOpen
      })
    }
  }

  render() {
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
        style={merge(
          styles.meepEditorInline,
          styles.meepEditorInlineFontFamily
        )}
      >
        <div
          style={merge(styles.meepEditorSelectMainBox,
                       customControlStyle,
                       this.state.onOpen?styles.meepEditorSelectMainBoxOpen:null)}
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
