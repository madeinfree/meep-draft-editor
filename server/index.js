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
    const reader = new FileReader();
    function doProgress(percent) {
      progress(percent || 1);
      if (percent >= 100) {
        // Start reading the file
        reader.readAsDataURL(data.files[0]);
      } else {
        setTimeout(doProgress, 250, (percent || 0) + 10);
      }
    }
    doProgress(0);
  }
})

const plugins = [uploadPlugin];
render(
  <MeepDraftEditor
    onEditorChange={(content) => {
      // console.log(JSON.stringify(content));
    }}
    editorStyle={editorStyle}
    readOnly={false}
    setting={editorSetting}
    plugins={plugins}
  />,
  document.getElementById('app')
);
