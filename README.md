# Meep-Draft-Editor draft.js rich text basic editor
[![npm](https://img.shields.io/npm/v/meep-draft-editor.svg)](https://www.npmjs.com/package/meep-draft-editor)
##### Github: https://github.com/madeinfree/meep-draft-editor
##### Npm: https://www.npmjs.com/package/meep-draft-editor

# Installation
```
npm install meep-draft-editor font-awesome --save
```

# Webpack
### .bablerc
```javascript
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": ["typecheck", "syntax-flow", "transform-flow-strip-types"]
}
```
### webpack.config.js
```javascript
module: {
    loaders: [
      { test: /\.js$/, loader: "jsx-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }
```

# Editor component custom style config
```javascript
const editorStyle = {
  "root": {
    padding: '20px',
    border: '1px solid #ccc',
    width: '670px'
  },
  "root-control": {
    color: '#000',
    fontSize: '40px'
  },
  "root-input": {
    minHeight: '150px',
    color: '#ccc',
    border: '3px solid #ccc',
    width: '620px'
  }
}
```

# Editor default controls config
```javascript
/* you can choose the default meep-draft-editor controls,
   it can helpful expansion the controls in the future.
*/
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
```

# Props API
#### defaultValue
#### placeholder
#### editorStyle
#### plugins

# EVENT
#### onEditorChange(content)

# dependencies
```javascript
import React from 'react';
import ReactDom, { render } from 'react-dom';
import 'font-awesome/css/font-awesome.css';
```

# Examples
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor />,
  document.getElementById('app')
);
```
## default editor block value
```javascript
//defaultValue must be Draft ConvertToRaw JSON(Object)
const defaultValue = {"entityMap":{},"blocks":[{"key":"demmk","text":"Hello, Default Value !","type":"align-left","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]}
<MeepDraftEditor
  defaultValue={defaultValue}
/>
```
## get the content when you want to saving an editor state to storage
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(content) => {
      console.log(content) //get convertToRaw it could useful when saving an editor state for storage
    }}
  />,
  document.getElementById('app')
);
```
## custom editor css style
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    editorStyle={editorStyle}
  />,
  document.getElementById('app')
);
```
## Editor Default Controls Settings
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    setting={editorSetting}
  />,
  document.getElementById('app')
);
```
## custom placeholder
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    placeholder="Write something ..."
  />,
  document.getElementById('app')
);
```
## use plugins
#### Congratulations !! Now 1.3.0 you can use the draft-js-plugins whithin meep-draft-editor and thanks for draft-js-plugins, or you can just use your custom plugins.
```
npm install draft-js-hashtag-plugin --save
```
```javascript
import MeepDraftEditor from 'meep-draft-editor';
//plugin
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import 'draft-js-hashtag-plugin/lib/plugin.css';
const hashtagPlugin = createHashtagPlugin();
const plugins = [hashtagPlugin.pluginProps, ..YourCustomPlugin];

ReactDom.render(
  <MeepDraftEditor
    plugins={plugins}
  />,
  document.getElementById('app')
);
```
[HOW TO MAKE CUSTOM EDITOR PLUGS ?](http://#)

# CHANGE-LOG
<2016 - 02 - ..>

- [x] 將 Quill 文字編輯器改為 Draft 文字編輯器

<2016 - 03 - 02>

- [x] 完成元件雛型並上傳至 github repo

    - [x] 命名 meep-draft-editor

- [x] 完成玩間雛型並上傳至 node npm

    - [x] 打包成 package

<2016 - 03 - 03>

- 物件資訊取得方法
    - onEditorChange( function(state :Object) :function )

- [x] 使用者能取得預設給予的 EditorState 物件資訊

    - [x] 使用者能取得 CurrentContent

    - [x] 使用者能取得 Text

- [x] 使用者能取得自訂的 EditorState 物件資訊

<2016 - 03 - 04>

- 增加
  - 使用者能自訂尚未輸入任何字時的顯示提示

      - [x] 使用者能取得預設輸入框顯示提示

      - [x] 使用者能自訂輸入框顯示提示

      - [x] 使用者能改變編輯器外觀長、寬高

          - [x] 編輯器分為三部份拆解樣式外觀(root, root-control, root-input)

              - [x] root 樣式更改

              - [x] root-control 樣式更改

              - [x] root-input 樣式更改
- 去除

  - [x] 點選時瀏覽器預設的選擇提醒外框

  - [x] 去除多餘元件(ButtomSelect)

<2016 - 03 - 05>

- 重構拆除元件

    - [ ] 將元件拆除

        - [ ] 讓使用者可以自訂需要使用的元件

<2016 - 03 - 07>

- [x] 修正元件 editor input 點選時重複 focus 閃爍問題

<2016 - 03 - 09>

- [x] 修正未加入輸入自訂樣式表會錯誤問題

<2016 - 03 - 014>

- 增加

    - [x] 修正 convertToRaw 無法取得正確自訂樣式資訊

    - [x] 新增 getConvertToRaw 取得元件 storage 物件

    - [x] 使用者可設定預設文字

<2016 - 03 - 15>

- 修正

    - [x] assign {…this.props}

    - [x] event 事件 onChange 改為 onBlur

    - [x] 修正沒有 onEditorChange,defaultValue 傳入錯誤資訊

  <2016 - 03 - 21>

    - [x] remove the draft-js@fix what was used to improvement `InlineBlockStyle` bug

    - [x] fixed some little but

  <2016 - 03 - 22>

    - [x] add the example page

    - [x] fixed the static font 404 error

  <2016 - 03 - 23>

    - [x] upgrade the draft-js to 0.3.0 version release

  <2016 - 03 - 27>

    - [x] fixed the readOnly placeholder bug

  <2016 - 03 - 28>

    - [x] version 1.2.3  release

  <2016 - 03 - 29>

    - [x] refactor all

    - [x] added settings config

    - [x] version 1.3.0rc-1  release

  <2016 - 04 - 3>

    - [x] refactor a little

    - [x] compatibility with draft-js-plugins

    - [x] allow to added custom plugins

    - [x] version 1.3.0 release

    - [x] Changed README, throw out the extra state

# ISSUE

# WANTFIX
- [ ] 重構物件分離

# License
Published by [Whien_Liou](https://www.facebook.com/haowei.liou) under a permissive MIT License
