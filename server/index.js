import React from 'react';
import ReactDom, { render } from 'react-dom';
import MeepDraftEditor from './meep-draft/draft-text.react';
import 'font-awesome/css/font-awesome.css';

const editorStyle = {
  "root": {
    padding: '20px',
    border: '1px solid #ccc',
    width: '670px'
  },
  "root-control": {
    position: 'relative'
  },
  "root-input": {
    minHeight: '150px',
    width: '620px',
  }
}

const editorSetting = {
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

render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      console.log(state.getEditorState.toJS())
    }}
    editorStyle={editorStyle}
    readOnly={false}
    setting={editorSetting}
  />,
  document.getElementById('app')
);
