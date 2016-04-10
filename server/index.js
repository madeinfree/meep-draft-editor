import React from 'react';
import ReactDom, { render } from 'react-dom';
import { fromJS } from 'immutable';

import MeepDraftEditor from './meep-draft/draft-text.react';
import 'font-awesome/css/font-awesome.css';

//TODO: be experimental features.
import createDragDropPlugin from './meep-draft/default-plugin-entites/draft-js-dnd-plugin/src';

const editorStyle = {
  "root": {
    padding: '20px',
    width: '500px'
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
  toolBar: 'float',
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

const uploadPlugin = createDragDropPlugin({
  upload: (data, success, failed, progress) => {
    console.log(1, data, 2, success, 3, progress);
  }
})

const plugins = [uploadPlugin];
render(
  <MeepDraftEditor
    onEditorChange={(content) => {
      console.log(JSON.stringify(content));
    }}
    editorStyle={editorStyle}
    readOnly={false}
    setting={editorSetting}
    plugins={plugins}
  />,
  document.getElementById('app')
);
