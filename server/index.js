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

const defaultValue = {"entityMap":{},"blocks":[{"key":"demmk","text":"asdsaasd","type":"align-center","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"26glg","text":"asd","type":"align-center","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"a7vm7","text":"asd","type":"align-center","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"61n15","text":"asd","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"BOLD"}],"entityRanges":[]},{"key":"90rp3","text":"asdasdasdasd","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":12,"style":"BOLD"}],"entityRanges":[]},{"key":"95f2j","text":"asd","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"BOLD"}, {"offset":0,"length":3,"style":"FONTSIZE-13"}],"entityRanges":[]},{"key":"alq7j","text":"asd","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"BOLD"}],"entityRanges":[]},{"key":"64tu1","text":"asdasdasdfda","type":"align-center","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]}
ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      // console.log(JSON.stringify(state.getResult))
      console.log(state.getResult)
    }}
    placeholder="現在可以自訂輸入提示內容,編輯器樣式,控制項目樣式"
    editorStyle={editorStyle}
    defaultValue={defaultValue}
  />,
  document.getElementById('app')
);
