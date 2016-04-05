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

const plugins = [hashtagPlugin.pluginProps, mentionPlugin];
// const value = {"entityMap":{"0":{"type":"mention","mutability":"SEGMENTED","data":{"mention":fromJS({"name":"Nik Graf","link":"https://twitter.com/nikgraf","avatar":"https://pbs.twimg.com/profile_images/535634005769457664/Ppl32NaN_400x400.jpeg"})}}},"blocks":[{"key":"3p2i8","text":"Nik Graf #qwqwe qweqwe","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":16,"length":6,"style":"BOLD"}],"entityRanges":[{"offset":0,"length":8,"key":0}]}]}

render(
  <MeepDraftEditor
    onEditorChange={(content) => {
      console.log('%cconvertToRaw: ' + '%c' + JSON.stringify(content), 'background: #222; color: #bada55', 'background: #222; color: #fff');
    }}
    editorStyle={editorStyle}
    readOnly={false}
    setting={editorSetting}
    plugins={plugins}
  />,
  document.getElementById('app')
);
