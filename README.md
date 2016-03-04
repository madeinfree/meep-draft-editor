# Meep-Draft 文字編輯器模組

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


# TODO
- [ ] 使用者能取得 Editor 元件的相關資訊

    - [ ] 使用者能取得預設給予的 EditorState 物件資訊

- [ ] 使用者能決定元件樣式

    - [ ] 使用者能取得元件預設樣式

    - [ ] 使用者能傳入元件自訂樣式

- [ ] 使用者能自訂編輯器內文字樣式表

    - [ ] 使用者能取得預設文字樣式表

    - [ ] 使用者能自訂文字樣式表

        - [ ] 使用者能自訂 inline 樣式表

        - [ ] 使用者能自訂 block 樣式表

- [ ] 使用者可選擇控制元件

    - [ ] 使用者能使用預設元件並選擇

    - [ ] 使用者可傳入自訂元件並選擇

# ISSUE

# WANTFIX
- [ ] 重構物件分離

# License
Published by [Whien_Liou](https://www.facebook.com/haowei.liou) under a permissive MIT License
