import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

export default class BackgroundButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let style;
    let labelColor;
    if (this.props.active) {
      style = styles.meepEditorActiveColorButton;
    } else {
      style = styles.styleButton;
    }
    return (
      <span
        style={merge(styles.meepEditorDefaultColorButton, style, {backgroundColor: this.props.style.split('-')[1]})}
        onMouseDown={this.props.onToggle}
      >
      </span>
    );
  }
}
