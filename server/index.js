import React from 'react';
import ReactDom, { render } from 'react-dom';
import { fromJS } from 'immutable';

import MeepDraftEditor from './meep-draft/draft-text.react';
import 'font-awesome/css/font-awesome.css';

//plugin

const mentions = fromJS([
  {
    name: 'Max Stoiber',
    link: 'https://twitter.com/mxstbr',
    avatar: 'https://pbs.twimg.com/profile_images/681114454029942784/PwhopfmU_400x400.jpg',
  },
  {
    name: 'Nik Graf',
    link: 'https://twitter.com/nikgraf',
    avatar: 'https://pbs.twimg.com/profile_images/535634005769457664/Ppl32NaN_400x400.jpeg',
  },
]);

import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createMentionPlugin from './meep-draft/default-plugin-entites/draft-js-mention-plugin/lib';

const hashtagPlugin = createHashtagPlugin();
const mentionPlugin = createMentionPlugin({ mentions });

import 'draft-js-hashtag-plugin/lib/plugin.css';
import './meep-draft/default-plugin-entites/draft-js-mention-plugin/lib/plugin.css';
//
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

const plugin = [hashtagPlugin.pluginProps, mentionPlugin];

render(
  <MeepDraftEditor
    onEditorChange={(content) => {
      console.log(content);
    }}
    editorStyle={editorStyle}
    readOnly={false}
    setting={editorSetting}
    plugins={plugin}
  />,
  document.getElementById('app')
);
