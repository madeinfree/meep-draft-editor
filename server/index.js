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

render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      // console.log(JSON.stringify(state.getResult))
      console.log(state.getEditorState.toJS())
    }}
    editorStyle={editorStyle}
    readOnly={false}
  />,
  document.getElementById('app')
);
