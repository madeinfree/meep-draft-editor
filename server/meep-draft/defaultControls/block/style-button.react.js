import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

export default class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.editorStyle);
    };
  }
  render() {

    const {
      style
    } = this.props;

    let defaultStyle, labelColor;
    if (this.props.active) {
      defaultStyle = styles.meepEditorActiveButton;
      labelColor = '#437A82'
    } else {
      defaultStyle = styles;
      labelColor = '#59bcc9'
    }

    return (
      <span
        style={merge(style, styles.meepEditorDefaultButton)}
        labelColor={labelColor}
        onMouseDown={this.onToggle}
      >
        {this.props.label}
      </span>
    );
  }
}
