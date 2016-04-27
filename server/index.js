import React, { Component } from 'react';
import ReactDom, { render } from 'react-dom';
import { fromJS } from 'immutable';

import MeepDraftEditor from './meep-draft/draft-text.react';
import 'font-awesome/css/font-awesome.css';

//TODO: be experimental features.
import createDragDropPlugin from './meep-draft/default-plugin-entites/draft-js-dnd-plugin/src';

const editorStyle = {
  "root": {
    padding: '20px',
    width: '800px'
  },
  "root-control": {
    position: 'relative',
    color: 'white'
  },
  "root-input": {
    borderRadius: '2px'
  }
}

const editorSetting = {
  toolBar: 'basic',
  customControls: [{
    fontFamily: true,
    fontSize: true,
    text: {
      BOLD: true,
      ITALIC: true,
      UNDERLINE: true,
      STRIKETHROUGH: true
    },
    link: {
      set: true,
      unset: true
    },
    block: {
      headerTwo: true,
      unorderedListItem: true,
      orderedListItem: true,
      alignLeft: true,
      alignCenter: true,
      alignRight: true
    },
    color: true,
    background: true,
    content: {
      undo: true,
      redo: true
    }
  }]
}

class Editor extends Component {
  constructor() {
    super();

    this.state = {
      readOnly: false
    }

    this.onClick = () => {
      this.setState({
        readOnly: !this.state.readOnly
      })
    }
  }

  render() {
    return (
      <div>
        <MeepDraftEditor
          onEditorChange={(content) => {
            // console.log(JSON.stringify(content));
          }}
          editorStyle={editorStyle}
          readOnly={this.state.readOnly}
          setting={editorSetting}
        />
        <button
          onClick={this.onClick}
        >toggle mode</button>
      </div>
    );
  }
}

render(
  <Editor />,
  document.getElementById('app')
);
