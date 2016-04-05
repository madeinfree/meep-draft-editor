import React, { Component } from 'react';
import {
  RichUtils,
  Entity
} from 'draft-js';
import {
  getSelection,
  getSelectionRect
} from '../../plugins-util/get-selection-rect';

import '../style.css';


export default class ToolBar extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.browserSelection = getSelection();
    this.editorSelection = nextProps.editorState.getSelection();
    return this.browserSelection.isCollapsed === this.editorSelection.isCollapsed();
  }

  render() {
    const {
      editorState
    } = this.props

    const rect = getSelectionRect(this.browserSelection);

    if (!rect || this.editorSelection.isCollapsed()) {
      return false;
    };

    const rectInfo = {
      left: rect.left,
      top: rect.top,
      width: rect.width
    };

    const currentStyle = editorState.getCurrentInlineStyle();
    const block = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey());

    return (
      <div
        className="tool-bar"
        style={{
          top: rectInfo.top - 40,
          left: rectInfo.left,
          width: '300px',
          backgroundColor: 'black',
          borderRadius: '10px',
          padding: '10px'
        }}
      >
        {this.props.children}
      </div>
    );
  }
};
