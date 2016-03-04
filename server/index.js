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
  },
  "root-input": {
    minHeight: '150px',
    color: '#ccc',
    border: '3px solid #ccc',
    width: '620px'
  }
}

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      console.log(state.getCustomState('getSelection').getStartKey())
    }}
    placeholder="現在可以自訂輸入提示內容,編輯器樣式,控制項目樣式"
    editorStyle={editorStyle}
  />,
  document.getElementById('app')
);
