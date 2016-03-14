import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
// components load
import * as DefaultControlComponents from './components/index.react';
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
  SelectionState } from '../draft-js@fix/lib/Draft';

//type-core
import BLOCK_TYPES from './draft-type-core/block'
import {
  FONTSIZESTYLE,
  TEXTSTYLE,
  COLORSTYLE,
  BACKGROUNDCOLORSTYLE,
  ALIGNSTYLE,
  FONTFAMILYSTYLE
} from './draft-type-core/inline'
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
      placeholder: 'Write somthing...'
    }
    //
    this.state = {
      editorState: undefined,
      editMode: 0,
      placeholder: this.hasPlaceholder(),
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
      this.stateCache(this.props.onEditorChange)
      // console.log(editorState.getCurrentContent()
      //                        .getBlockForKey(editorState.getSelection().getStartKey())
      //                        .getText())
    }
    this.stateCache = (EditorChange) => {
      EditorChange({
        getEditorState: this.state.editorState,
        getCurrentContent: this.state.editorState.getCurrentContent(),
        getStateText: this.state.editorState.getCurrentContent().getBlockForKey(this.state.editorState.getSelection().getStartKey()).getText(),
        getCustomState: (editorStateKey) => {
          return this.state.editorState[editorStateKey]();
        },
        getConvertToRaw: convertToRaw(this.state.editorState.getCurrentContent(), merge(COLORS, BACKGROUNDCOLORS, ALIGN, FONTSIZE, FONTFAMILY))
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
    const {
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
      console.log('gggg1');
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
    //Set the default value
    if(this.props.defaultValue) {
      let {
        defaultValue
      } = this.props
      let contentState = Draft.ContentState.createFromBlockArray(Draft.convertFromRaw(this.props.defaultValue))
      defaultEditorState = Draft.EditorState.createWithContent(contentState, decorator);
    }
    if(this.props.defaultValue === undefined && decorator !== undefined) {
      defaultEditorState = Draft.EditorState.createWithContent(decorator);
    }
    this.setState({
      editorState: defaultEditorState
    })
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

    let rootStyle = this.checkRootStyle ? (this.props.editorStyle.root) : ({})
    let rootControlStyle = this.checkRootControlStyle ? (this.props.editorStyle['root-control']) : ({})
    let rootInputStyle = this.checkRootInputStyle ? (this.props.editorStyle['root-input']) : ({})
    let render = [];

    // this.ControlsComponentsRender = () => {
    //   for(let c in DefaultControlComponents) {
    //     let ControlsComponent = DefaultControlComponents[c];
    //     render.push(
    //       <ControlsComponent
    //         key={c}
    //         editorState={editorState}
    //         customStyle={rootControlStyle}
    //       />
    //     )
    //   }
    // }
    // this.ControlsComponentsRender();
    let controlsComponentEditor = this.props.readOnly ? null : (
      <div>
        <FontFamilyControls
          editorState={editorState}
          onToggle={this.toggleFontFamily}
          customStyle={rootControlStyle}
        />
        <FontSizeControls
          editorState={editorState}
          onToggle={this.toggleFontSize}
          customStyle={rootControlStyle}
        />
        <TextControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <LinkControls
          onHandlLink={this._onHandlLink}
        />
        <BlockControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <ColorControls
          editorState={editorState}
          onToggle={this.toggleColor}
        />
        <BackgroundControls
          editorState={editorState}
          onToggle={this.toggleBackgroundColor}
        />
        <ContentControls
          editorState={editorState}
          onDoHandle={this.onDoHandle}
        />
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
            customStyleMap={merge(COLORS, BACKGROUNDCOLORS, ALIGN, FONTSIZE, FONTFAMILY)}
            editorState={editorState}
            readOnly={this.props.readOnly}
            onChange={this.onChange}
            placeholder={this.state.placeholder}
            blockStyleFn={getBlockStyle}
            ref="editor"
            suppressContentEditableWarning={false}
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

class FontFamilyControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      onOpen: false
    }

    this._onOpen = () => {
      this.setState({
        onOpen: !this.state.onOpen
      })
    }
  }
  render() {
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    let fontFamily = 'Arial';
    let itemMap = (
      ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier', 'Courier New', '標楷體', 'Helvetica','Impace','Lucida Grande','Lucida Sans','微軟正黑體', 'Monospace','新細明體','Sans Serif','Serif','Tahoma','Times','Times New Roman','Verdana'].map((family, idx) => {
          if(currentStyle.has(FONTFAMILYSTYLE[idx].style)) {
            fontFamily = (FONTFAMILYSTYLE[idx].style)
          }
          return (
            <SelectFamilyItem
              active={currentStyle.has(FONTFAMILYSTYLE[idx].style)}
              key={`font_family_button_${idx}`}
              size={family}
              style={FONTFAMILYSTYLE[idx].style}
              onToggle={this.props.onToggle}
              onOpen={this._onOpen}
            />
          )
      })
    )
    let items = this.state.onOpen ? (
      <div
        style={styles.meepEditorSelectItemBox}
      >
        {itemMap}
      </div>
    ) : ( null )
    let customControlStyle = this.props.customStyle
    return (
      <div
        style={merge(
          styles.meepEditorInline,
          styles.meepEditorInlineFontFamily
        )}
      >
        <div
          style={merge(styles.meepEditorSelectMainBox,
                       customControlStyle,
                       this.state.onOpen?styles.meepEditorSelectMainBoxOpen:null)}
        >
          <div
            onClick={this._onOpen}
          >
            <span
              style={styles.meepEditorSelectBoxLabel}
            >{fontFamily}</span>
            <i
              style={styles.meepEditorSelectBoxIcon}
              className="fa fa-caret-down">
            </i>
          </div>
          {items}
        </div>
      </div>
    );
  }
}

class FontSizeControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      onOpen: false,
    }

    this._onOpen = () => {
      this.setState({
        onOpen: !this.state.onOpen
      })
    }
  }
  render() {
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    let fontSize = 10;
    let itemMap = (
      [10, 13, 16, 20, 24, 28, 32].map((size, idx) => {
        if(currentStyle.has(FONTSIZESTYLE[idx].style)) {
          fontSize = (FONTSIZESTYLE[idx].style).split('-')[1]
        }
        return (
          <SelectItem
            active={currentStyle.has(FONTSIZESTYLE[idx].style)}
            key={`font_size_button_${idx}`}
            size={size}
            style={FONTSIZESTYLE[idx].style}
            onToggle={this.props.onToggle}
            onOpen={this._onOpen}
          />
        )
      })
    )
    let items = this.state.onOpen ? (
      <div
        style={styles.meepEditorSelectItemBox}
      >
        {itemMap}
      </div>
    ) : ( null )
    let customControlStyle = this.props.customStyle
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorSelectMainBox,
                       customControlStyle,
                       this.state.onOpen?styles.meepEditorSelectMainBoxOpen:{})}
        >
          <div
            onClick={this._onOpen}
          >
            <span
              style={styles.meepEditorSelectBoxLabel}
            >{fontSize} px</span>
            <i
              style={styles.meepEditorSelectBoxIcon}
              className="fa fa-caret-down">
            </i>
          </div>
          {items}
        </div>
      </div>
    );
  }
}

class SelectItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hover: false
    }

    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    }

    this._onHover = () => {
      this.setState({
        hover: true
      })
    }
    this._onLeave = () => {
      this.setState({
        hover: false
      })
    }
  }
  render() {
    return (
      <span
        style={merge(styles.meepEditorSelectItem,
                     this.state.hover?styles.meepEditorSelectItemHover:null,
                     this.props.active?styles.meepEditorActiveButton:null
                    )}
        onMouseOver={this._onHover}
        onMouseLeave={this._onLeave}
        onClick={(event)=>{
          this.onToggle(event)
          this.props.onOpen()
        }}
      >
        {this.props.size} px
      </span>
    );
  }
}

class SelectFamilyItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hover: false
    }

    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    }

    this._onHover = () => {
      this.setState({
        hover: true
      })
    }
    this._onLeave = () => {
      this.setState({
        hover: false
      })
    }
  }
  render() {
    return (
      <span
        style={merge(styles.meepEditorSelectFamilyItem,
                     this.props.active?styles.meepEditorActiveButton:null,
                     this.state.hover?styles.meepEditorSelectItemHover:null)
              }
        onMouseOver={this._onHover}
        onMouseLeave={this._onLeave}
        onClick={(event)=>{
          this.onToggle(event)
          this.props.onOpen()
        }}
      >
        {this.props.size}
      </span>
    );
  }
}

const TextControls = (props) => {
  let currentStyle = props.editorState.getCurrentInlineStyle();
  let button = (TEXTSTYLE.map((type, index) => {
    return (
      <StyleButton
        key={`text_button_${index}`}
        active={currentStyle.has(type.style)}
        label={<i className={type.label}></i>}
        style={type.style}
        onToggle={props.onToggle}
      /> )
  }))
  return (
    <div
      style={
        merge(styles.controls,
              styles.meepEditorInline,
             )
      }
    >
      {button}
    </div>
  )
}

const LinkControls = (props) => {
  let {
    onHandlLink
  } = props
  return (
    <span>
      <span
        style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
        onClick={(e) => {
          onHandlLink(e, 'addLink')
        }}
      >
        <i className="fa fa-link"></i>
      </span>
      <span
        style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
        onClick={(e) => {
          onHandlLink(e, 'removeLink')
        }}
      >
        <i className="fa fa-unlink"></i>
      </span>
    </span>
  )
}

const BlockControls = (props) => {
  let {
    editorState
  } = props
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent()
                               .getBlockForKey(selection.getStartKey())
                               .getType();
  let button = (BLOCK_TYPES.map((type, index) => {
    return (
      <StyleButton
        key={`block_button_${index}`}
        active={type.style === blockType}
        label={<i className={type.label}></i>}
        style={type.style}
        onToggle={props.onToggle}
      /> )
  }))
  return (
    <div
      style={styles.meepEditorInline}
    >
      {button}
    </div>
  )
}

class ColorControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false
    }

    this._onOpen = () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }
  render() {
    let {
      editorState
    } = this.props
    let currentStyle = editorState.getCurrentInlineStyle();
    let button = this.state.isOpen ? (COLORSTYLE.map((type, idx) => {
      return (
        <ColorButton
          key={`color_button_${idx}`}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onToggle={this.props.onToggle}
        />)
    })) : ( null )
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorDefaultButton, styles.meepEditorActionSelect)}
          onClick={this._onOpen}
        >
          <i className="fa fa-font"></i>
        </div>
        <div
          style={styles.meepEditorActiveColorBox}
        >
          {button}
        </div>
      </div>
    )
  }
}

class BackgroundControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false
    }

    this._onOpen = () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }
  render() {
    let {
      editorState
    } = this.props
    let currentStyle = editorState.getCurrentInlineStyle();
    let button = this.state.isOpen ? (BACKGROUNDCOLORSTYLE.map((type, idx) => {
      return (
        <BackgroundButton
          key={`background_button_${idx}`}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onToggle={this.props.onToggle}
        />)
    })) : ( null )
    return (
      <div
        style={styles.meepEditorInline}
      >
        <div
          style={merge(styles.meepEditorDefaultButton, styles.meepEditorActionSelect)}
          onClick={this._onOpen}
        >
          <i className="fa fa-cog"></i>
        </div>
        <div
          style={styles.meepEditorActiveBackgroundBox}
        >
          {button}
        </div>
      </div>
    );
  }
}

const ContentControls = (props) => {
  return (
    <div
      style={styles.meepEditorInline}
    >
      <ContentButton
        label={<i className="fa fa-undo"></i>}
        doAction="undo"
        editorState={props.editorState}
        onDoHandle={props.onDoHandle}
      />
      <ContentButton
        label={<i className="fa fa-repeat"></i>}
        doAction="redo"
        editorState={props.editorState}
        onDoHandle={props.onDoHandle}
      />
    </div>
  );
}

class ContentButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span
        style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
        onMouseDown={() => {
          this.props.onDoHandle(this.props.editorState, this.props.doAction)
        }}
      >
        {this.props.label}
      </span>
    );
  }
}

class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let style;
    let labelColor;
    if (this.props.active) {
      style = styles.meepEditorActiveButton;
      labelColor = '#437A82'
    } else {
      style = styles.styleButton;
      labelColor = '#59bcc9'
    }

    return (
      <span
        style={merge(style, styles.meepEditorDefaultButton)}
        labelColor={labelColor}
        onMouseDown={this.onToggle}
      >
        {this.props.label}
      </span>
    );
  }
}

class ColorButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let style;
    let labelColor;
    if (this.props.active) {
      style = styles.meepEditorActiveColorButton;
    } else {
      style = styles.styleButton;
    }

    return (
      <span
        style={merge(styles.meepEditorDefaultColorButton, style, {backgroundColor: this.props.style})}
        onMouseDown={this.onToggle}
      >
      </span>
    );
  }
}

class BackgroundButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let style;
    let labelColor;
    if (this.props.active) {
      style = styles.meepEditorActiveColorButton;
    } else {
      style = styles.styleButton;
    }
    return (
      <span
        style={merge(styles.meepEditorDefaultColorButton, style, {backgroundColor: this.props.style.split('-')[1]})}
        onMouseDown={this.onToggle}
      >
      </span>
    );
  }
}

/**
  暫時解決 React DOM editor 時會出現警告錯誤，等待 React 15.0 版修正。
  issue: https://github.com/facebook/react/issues/5837
 */
console.error = (function() {
    var error = console.error

    return function(exception) {
        if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
            error.apply(console, arguments)
        }
    }
})()
