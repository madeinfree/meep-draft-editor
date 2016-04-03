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
import DefaultControls from './defaultSettings/default-controls'
import DefaultControlsComponents from './defaultControls/default-controls-components.react'
//
import {
  ALIGN_LEFT,
  ALIGN_CENTER,
  ALIGN_RIGHT
} from './constants'
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
    case ALIGN_LEFT: return 'custon-align-left';
    case ALIGN_CENTER: return 'custon-align-center';
    case ALIGN_RIGHT: return 'custon-align-right';
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

const Link = (props) => {
  const {href} = Entity.get(props.entityKey).getData();
  return (
    <a href={href} style={styles.meepEditorLink}>
      {props.children}
    </a>
  );
};

const DraftTextHandlers = {
  hasPlaceholder() {
    if (this.props.placeholder === undefined) {
      return this.defaultSetting.placeholder;
    } else {
      return this.props.placeholder
    }
  },
  getState() {
    return this.state.editorState;
  },
  getConvertToRaw() {
    return convertToRaw(this.getState().getCurrentContent());
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
      controls: (props.setting && props.setting.customControls) ? props.setting.customControls[0] : DefaultControls
    }
    this.state = {
      editorState: EditorState.createEmpty(),
      placeholder: this.hasPlaceholder(),
    };

    this.focus = (editorState) => {
      if(!editorState.getSelection().getHasFocus()) {
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
      EditorChange(this.getConvertToRaw());
    }
    //


    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content))
    }
    this.logClear = () => {
      console.clear()
    }
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

    const {
      controls
    } = this.defaultSetting

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

    const controlsComponentEditor= this.props.readOnly ? null : (
      <div>
        <DefaultControlsComponents
          editorState={this.getState()}
          onChange={this.onChange}
          readOnly={this.props.readOnly}
          controls={controls}
        />
      </div>
    )

    return (
      <div style={merge(styles.root, rootStyle)}>
        { controlsComponentEditor }
        <div
          style={merge(styles.editor, rootInputStyle)}
          onClick={()=>{
            this.focus(editorState)
          }}
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
