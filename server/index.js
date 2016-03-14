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
    border: '3px solid #ccc',
    width: '620px'
  }
}

const defaultValue = {"entityMap":{},"blocks":[{"key":"demmk","text":"Hello, Default Value !","type":"align-left","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]}
ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      // console.log(JSON.stringify(state.getResult))
      console.log(JSON.stringify(state.getConvertToRaw))
    }}
    placeholder="現在可以自訂輸入提示內容,編輯器樣式,控制項目樣式"
    defaultValue={defaultValue}
    readOnly={true}
  />,
  document.getElementById('app')
);
