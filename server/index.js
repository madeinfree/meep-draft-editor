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

const defaultValue = {"entityMap":{"0":{"type":"link","mutability":"MUTABLE","data":{"href":"http://www.google.com.tw"}}},"blocks":[{"key":"demmk","text":"Hello, Default Value !","type":"align-left","depth":0,"inlineStyleRanges":[{"offset":0,"length":22,"style":"BOLD"},{"offset":0,"length":22,"style":"ITALIC"},{"offset":0,"length":22,"style":"STRIKETHROUGH"},{"offset":0,"length":22,"style":"red"},{"offset":0,"length":22,"style":"background-orange"},{"offset":0,"length":22,"style":"FONTSIZE-24"},{"offset":0,"length":22,"style":"Comic Sans MS"}],"entityRanges":[]},{"key":"algul","text":"","type":"align-left","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"2ruo2","text":"Hello Link","type":"align-right","depth":0,"inlineStyleRanges":[{"offset":0,"length":10,"style":"BOLD"},{"offset":0,"length":10,"style":"ITALIC"},{"offset":0,"length":10,"style":"background-green"},{"offset":0,"length":10,"style":"yellow"},{"offset":0,"length":10,"style":"FONTSIZE-24"},{"offset":0,"length":10,"style":"Comic Sans MS"}],"entityRanges":[{"offset":0,"length":10,"key":0}]},{"key":"adk10","text":"","type":"align-center","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"dk1j2","text":"Meep draft editor 1.2.0 v","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":25,"style":"BOLD"},{"offset":0,"length":25,"style":"ITALIC"},{"offset":0,"length":25,"style":"UNDERLINE"},{"offset":0,"length":25,"style":"Courier New"},{"offset":0,"length":14,"style":"background-black"},{"offset":0,"length":25,"style":"orange"},{"offset":14,"length":11,"style":"background-blue"},{"offset":0,"length":25,"style":"FONTSIZE-16"}],"entityRanges":[]},{"key":"tn8i","text":"","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"8ef6g","text":"test default value","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":18,"style":"BOLD"},{"offset":0,"length":18,"style":"ITALIC"},{"offset":0,"length":18,"style":"UNDERLINE"},{"offset":0,"length":18,"style":"background-yellow"},{"offset":0,"length":18,"style":"Courier New"},{"offset":0,"length":18,"style":"orange"},{"offset":0,"length":18,"style":"FONTSIZE-16"}],"entityRanges":[]}]}
ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      // console.log(JSON.stringify(state.getResult))
      console.log(state.getEditorState.toJS())
    }}
    placeholder="現在可以自訂輸入提示內容,編輯器樣式,控制項目樣式"
    editorStyle={editorStyle}
    readOnly={false}
  />,
  document.getElementById('app')
);
