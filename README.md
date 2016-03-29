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

# EVENT
#### onEditorChange(state)
- state.getEditorState
- state.getCurrentContent
- state.CustomState
- state.getConvertToRaw

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
## 設定預設內容 (default-value)
```javascript
//defaultValue 必須要是 Draft ConvertToRaw JSON 物件
const defaultValue = {"entityMap":{},"blocks":[{"key":"demmk","text":"Hello, Default Value !","type":"align-left","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]}
<MeepDraftEditor
  defaultValue={defaultValue}
/>
```
## 取得 storage 物件
```javascript
<MeepDraftEditor
  onEditorChange={(state) => {
    console.log(state.getConvertToRaw)
  }}
/>,
```
## 取得基本訊息事件方法
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      console.log(state) //取得 EditorState 物件
    }}
  />,
  document.getElementById('app')
);
```

```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      console.log(state.getEditorState) //取得 EditorState 物件資訊
    }}
  />,
  document.getElementById('app')
);
```

```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      console.log(state.getCurrentContent) //取得 CurrentContent 物件資訊
    }}
  />,
  document.getElementById('app')
);
```

```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      //此方法必須要參考 Draft.js api 文件使用 http://facebook.github.io/draft-js/docs/overview.html#content
      //state.getCustomState 會返回一個 editorState 的方法提供使用
      console.log(state.getCustomState('getSelection').getStartKey()) //取得自訂 getCustomState 物件資訊
    }}
  />,
  document.getElementById('app')
);
```
## 自訂樣式方法
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      //此方法必須要參考 Draft.js api 文件使用 http://facebook.github.io/draft-js/docs/overview.html#content
      //state.getCustomState 會返回一個 editorState 的方法提供使用
      console.log(state.getCustomState('getSelection').getStartKey()) //取得自訂 getCustomState 物件資訊
    }}
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
## 自訂輸入欄位提示方法
```javascript
import MeepDraftEditor from 'meep-draft-editor';

ReactDom.render(
  <MeepDraftEditor
    onEditorChange={(state) => {
      //此方法必須要參考 Draft.js api 文件使用 http://facebook.github.io/draft-js/docs/overview.html#content
      //state.getCustomState 會返回一個 editorState 的方法提供使用
      console.log(state.getCustomState('getSelection').getStartKey()) //取得自訂 getCustomState 物件資訊
    }}
    placeholder="現在可以自訂輸入提示內容,編輯器樣式,控制項目樣式"
  />,
  document.getElementById('app')
);
```

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

# ISSUE

# WANTFIX
- [ ] 重構物件分離

# License
Published by [Whien_Liou](https://www.facebook.com/haowei.liou) under a permissive MIT License
