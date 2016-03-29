/*
  component: background
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

import BackgroundButton from './background-button.react';

import {
  BACKGROUNDCOLORSTYLE
} from '../../draft-type-core/inline'

export default class BackgroundControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false
    }

    this._onOpen = () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }
  render() {
    let {
      editorState
    } = this.props
    let currentStyle = editorState.getCurrentInlineStyle();
    let button = this.state.isOpen ? (BACKGROUNDCOLORSTYLE.map((type, idx) => {
      return (
        <BackgroundButton
          key={`background_button_${idx}`}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onToggle={this.props.onToggle}
        />)
    })) : ( null )
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorDefaultButton, styles.meepEditorActionSelect)}
          onClick={this._onOpen}
        >
          <i className="fa fa-cog"></i>
        </div>
        <div
          style={styles.meepEditorActiveBackgroundBox}
        >
          {button}
        </div>
      </div>
    );
  }
}
