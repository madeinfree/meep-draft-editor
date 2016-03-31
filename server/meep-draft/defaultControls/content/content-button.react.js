import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

export default class ContentButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span
        style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
        onMouseDown={() => {
          this.props.onDoHandle(this.props.editorState, this.props.doAction)
        }}
      >
        {this.props.label}
      </span>
    );
  }
}
