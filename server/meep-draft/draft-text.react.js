import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
// components load
import {
  FontFamilyControls,
  FontSizeControls,
  TextControls,
  LinkControls,
  BlockControls,
  ColorControls,
  BackgroundControls,
  ContentControls
} from './defaultControls/index.react';
//
import merge from './lib/merge.js'
import styles from './draft-text.style'
import Draft, {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Entity,
  CompositeDecorator,
  ContentState,
  SelectionState,
  CharacterMetadata } from 'draft-js';
//custom-core
import {
  FONTSIZE,
  COLORS,
  BACKGROUNDCOLORS,
  ALIGN,
  FONTFAMILY
} from './draft-custom-core/custom'

import './draft-vendor/draft-text.css'
import './draft-vendor/draft-editor.css'

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'align-left': return 'custon-align-left';
    case 'align-center': return 'custon-align-center';
    case 'align-right': return 'custon-align-right';
    default: return null;
  }
}

const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'link'
      );
    },
    callback
  );
}

const DraftTextHandlers = {
  hasPlaceholder() {
    if (this.props.placeholder === undefined) {
      return this.defaultSetting.placeholder;
    } else {
      return this.props.placeholder
    }
  }
}

const defaultControls = {
  fontFamily: false,
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
}

export default class DraftText extends Component {
  constructor(props) {
    super(props);
    //
    for(let fn in DraftTextHandlers) {
      if(typeof DraftTextHandlers[fn] === "function") {
        this[fn] = this::DraftTextHandlers[fn];
      }
    }
    //
    this.defaultSetting = {
      placeholder: '',
      controls: defaultControls
    }
    //setting defaultControls or customControls
    if(props.setting && props.setting.customControls) {
      this.defaultSetting.controls = props.setting.customControls[0]
    }
    console.log(this.defaultSetting.controls)
    //
    this.state = {
      editorState: EditorState.createEmpty(),
      placeholder: this.hasPlaceholder(),
      editMode: 0,
    };
    //
    this.focus = (editorState) => {
      if(editorState.getSelection().getHasFocus()) {
        this.refs.editor.focus();
      }
    }
    //
    this.onChange = (editorState) => {
      this.setState({editorState});
    }
    //
    this.onBlur = (e, editorState) => {
      if(this.props.onEditorChange) {
        this.stateCache(this.props.onEditorChange)
      }
    }
    //
    this.stateCache = (EditorChange) => {
      EditorChange({
        getEditorState: this.state.editorState,
        getCurrentContent: this.state.editorState.getCurrentContent(),
        getStateText: this.state.editorState.getCurrentContent().getBlockForKey(this.state.editorState.getSelection().getStartKey()).getText(),
        getCustomState: (editorStateKey) => {
          return this.state.editorState[editorStateKey]();
        },
        getConvertToRaw: convertToRaw(this.state.editorState.getCurrentContent()),
      })
    }
    //
    this.onDoHandle = (editorState, action) => {
      let newEditorState
      switch(action) {
        case 'undo':
          newEditorState = EditorState.undo(editorState);
        break;
        case 'redo':
          newEditorState = EditorState.redo(editorState);
        break;
      }
      if(newEditorState) {
        this._setEditorState(newEditorState);
      }
    };
    //
    this.toggleFontSize = (size) => this._toggleFontSize(size);
    this.toggleFontFamily = (family) => this._toggleFontFamily(family);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleColor = (color) => this._toggleColor(color);
    this.toggleBackgroundColor = (backgroundcolor) => this._toggleBackgroundColor(backgroundcolor);
    this.toggleAlign = (align) => this._toggleAlign(align);
    //
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content))
    }
    this.logClear = () => {
      console.clear()
    }
  }

  _onHandlLink = (e, action) => {
    const {
      editorState
    } = this.state;
    const selection = editorState.getSelection();
    let entityKey;
    let content;
    let oldUrl;
    switch(action) {
      case 'addLink':
        if (selection.isCollapsed()) {
          return
        }
        let selectedBlockEntityNumber = editorState
                                .getCurrentContent()
                                .getBlockForKey(editorState.getSelection().getStartKey())
                                .getEntityAt(editorState.getSelection().getStartOffset());
        if(selectedBlockEntityNumber !== null) {
          oldUrl = Entity.get(selectedBlockEntityNumber).get('data').href;
        }
        const href = window.prompt('請輸入網址', oldUrl);
        content = editorState.getCurrentContent();
        if(href === null) return
        entityKey = Entity.create('link', 'MUTABLE', {href});
      break;
      case 'removeLink':
        entityKey = null;
        content = editorState.getCurrentContent();
      break;
    }
    this.setState({
      editorState: RichUtils.toggleLink(editorState, selection, entityKey),
    });
  }

  _setEditorState = (editorState) => {
    this.onChange(editorState);
  }

  _toggleFontFamily = (family) => {
    const {
      editorState
    } = this.state
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(FONTFAMILY)
                             .reduce((contentState, family) => {
                               return Modifier.removeInlineStyle(contentState, selection, family)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, family) => {
        return RichUtils.toggleInlineStyle(state, family);
      }, nextEditorState);
    }
    if(!currentStyle.has(family)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        family
      )
    }
    this.onChange(nextEditorState)
  }

  _toggleFontSize = (size) => {
    let {
      editorState
    } = this.state
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(FONTSIZE)
                             .reduce((contentState, size) => {
                               return Modifier.removeInlineStyle(contentState, selection, size)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, size) => {
        return RichUtils.toggleInlineStyle(state, size);
      }, nextEditorState);
    }
    if(!currentStyle.has(size)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        size
      )
    }
    this.onChange(nextEditorState)
  }

  _toggleInlineStyle = (inlineStyle) => {
    const {
      editorState
    } = this.state
    this.onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }

  _toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleColor = (color) => {
    const {
      editorState
    } = this.state
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(COLORS)
                             .reduce((contentState, color) => {
                               return Modifier.removeInlineStyle(contentState, selection, color)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    if(!currentStyle.has(color)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        color
      )
    }
    this.onChange(nextEditorState)
  }

  _toggleBackgroundColor = (backgroundcolor) => {
    const {
      editorState
    } = this.state
    const selection = editorState.getSelection();
    //最多只能一次有一個顏色
    const nextContentState = Object.keys(BACKGROUNDCOLORS)
                             .reduce((contentState, backgroundcolor) => {
                               return Modifier.removeInlineStyle(contentState, selection, backgroundcolor)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, backgroundcolor) => {
        return RichUtils.toggleInlineStyle(state, backgroundcolor);
      }, nextEditorState);
    }
    if(!currentStyle.has(backgroundcolor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        backgroundcolor
      )
    }
    this.onChange(nextEditorState)
  }

  _toggleAlign = (align) => {
    const {
      editorState
    } = this.state
    const selection = editorState.getSelection();
    const nextContentState = Object.keys(ALIGN)
                             .reduce((contentState, align) => {
                               return Modifier.removeInlineStyle(contentState, selection, align)
                             }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )
    const currentStyle = editorState.getCurrentInlineStyle();
    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, align) => {
        return RichUtils.toggleInlineStyle(state, align);
      }, nextEditorState);
    }
    if(!currentStyle.has(align)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        align
      )
    }
    this.onChange(nextEditorState)
    this.onChange(
      RichUtils.toggleBlockType (
        this.state.editorState,
        align
      )
    );
  }

  componentWillMount() {
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);
    //Default state setting
    let defaultEditorState;
    let {
      defaultValue
    } = this.props
    if(defaultValue) {
      //Set the default value
      //if the defaultValue is null or ' '
      if( (typeof defaultValue === 'string') && (defaultValue == null || defaultValue.trim() === '')  ) {
        return
      }
      let contentState = Draft.ContentState.createFromBlockArray(Draft.convertFromRaw(this.props.defaultValue))
      defaultEditorState = Draft.EditorState.createWithContent(contentState, decorator);
    }
    if(  (typeof this.props.defaultValue === 'string') || (this.props.defaultValue === undefined && decorator !== undefined)  ) {
      defaultEditorState = Draft.EditorState.createEmpty(decorator);
    }
    this.setState({
      editorState: defaultEditorState
    })
  }

  isReadOnly() {
    return (this.props.readOnly === true) ? true : false;
  }

  render() {
    const {editorState} = this.state;

    let StateLog = this.state.editMode ? (
      <span style={{fontSize: '14px'}}>
        {' '}
        <MaterialButton
          label="CLEAR LOG"
          onClick={this.logClear}
        />
      </span>
    ) : (null)

    if(this.props.editorStyle !== undefined) {
      this.checkRootStyle = () => {
        return (this.props.editorStyle !== undefined) && (this.props.editorStyle.root !== undefined)
      }
      this.checkRootControlStyle = () => {
        return (this.props.editorStyle !== undefined) && (this.props.editorStyle['root-control'] !== undefined)
      }
      this.checkRootInputStyle = () => {
        return (this.props.editorStyle !== undefined) && (this.props.editorStyle['root-input'] !== undefined)
      }
    }

    const rootStyle = this.checkRootStyle ? (this.props.editorStyle.root) : ({})
    const rootControlStyle = this.checkRootControlStyle ? (this.props.editorStyle['root-control']) : ({})
    const rootInputStyle = this.checkRootInputStyle ? (this.props.editorStyle['root-input']) : ({})

    const {
      controls
    } = this.defaultSetting

    const fontFamilyControls = controls.fontFamily ? (
      <FontFamilyControls
        editorState={editorState}
        onToggle={this.toggleFontFamily}
        customStyle={rootControlStyle}
      />
    ) : null

    const fontSizeControls = controls.fontSize ? (
      <FontSizeControls
        editorState={editorState}
        onToggle={this.toggleFontSize}
        customStyle={rootControlStyle}
      />
    ) : null

    const textControls = controls.text ? (
      <TextControls
        editorState={editorState}
        onToggle={this.toggleInlineStyle}
        groupControls={controls.text}
      />
    ) : null

    const linkControls = controls.link ? (
      <LinkControls
        onHandlLink={this._onHandlLink}
        groupControls={controls.link}
      />
    ) : null

    const blockControls = controls.block ? (
      <BlockControls
        editorState={editorState}
        onToggle={this.toggleBlockType}
        groupControls={controls.block}
      />
    ) : null

    const colorControls = controls.color ? (
      <ColorControls
        editorState={editorState}
        onToggle={this.toggleColor}
      />
    ) : null

    const backgrounControls = controls.background ? (
      <BackgroundControls
        editorState={editorState}
        onToggle={this.toggleBackgroundColor}
      />
    ) : null

    const contentControls = controls.content ? (
      <ContentControls
        editorState={editorState}
        onDoHandle={this.onDoHandle}
        groupControls={controls.content}
      />
    ) : null

    const controlsComponentEditor = this.props.readOnly ? null : (
      <div>
        {fontFamilyControls}
        {fontSizeControls}
        {textControls}
        {linkControls}
        {blockControls}
        {colorControls}
        {backgrounControls}
        {contentControls}
        {StateLog}
      </div>
    )

    return (
      <div style={merge(styles.root, rootStyle)}>
        { controlsComponentEditor }
        <div
          style={merge(styles.editor, rootInputStyle)}
          onClick={()=>{
              this.focus(editorState)
            }
          }
        >
          <Editor
            {...this.props}
            customStyleMap={merge(COLORS, BACKGROUNDCOLORS, ALIGN, FONTSIZE, FONTFAMILY)}
            editorState={editorState}
            readOnly={this.props.readOnly}
            onChange={this.onChange}
            onBlur={(e) => {
              this.onBlur(e, editorState)
            }}
            placeholder={this.isReadOnly() ? null : this.state.placeholder}
            blockStyleFn={getBlockStyle}
            ref="editor"
            suppressContentEditableWarning={false}
            spellCheck={false}
          />
        </div>
      </div>
    );
  }

};

const Link = (props) => {
  const {href} = Entity.get(props.entityKey).getData();
  return (
    <a href={href} style={styles.meepEditorLink}>
      {props.children}
    </a>
  );
};
