import React, { PropTypes, Component } from 'react';
//css
import './draft-vendor/draft-text.css'
import './draft-vendor/draft-editor.css'
import styles from './draft-text.style'
//
import DefaultControls from './defaultSettings/default-controls'
import DefaultControlsComponents from './defaultControls/default-controls-components.react'
//
import {
  ALIGN_LEFT,
  ALIGN_CENTER,
  ALIGN_RIGHT
} from './constants'
//util
import merge from './lib/merge.js'
//draft-js
import Draft, {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  Entity,
  CompositeDecorator,
  ContentState
} from 'draft-js';
//custom-core
import {
  FONTSIZE,
  COLORS,
  BACKGROUNDCOLORS,
  ALIGN,
  FONTFAMILY
} from './draft-custom-core/custom'

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
  getState() {
    return this.state.editorState;
  },
  getConvertToRaw(EditorChange) {
    return EditorChange(convertToRaw(this.getContent()));
  },
  getContent() {
    return this.getState().getCurrentContent();
  },
  getDefaultControls() {
    return (this.props.setting && this.props.setting.customControls) ? this.props.setting.customControls[0] : DefaultControls
  },
  getPlaceHolder() {
    return this.getReadOnly() ? null : this.props.placeholder
  },
  getReadOnly() {
    return (this.props.readOnly === true) ? true : false;
  }
}

export default class DraftText extends Component {

  static defaultProps = {
    placeholder: '',
  }

  constructor(props) {
    super(props);
    //
    for(let fn in DraftTextHandlers) {
      if(typeof DraftTextHandlers[fn] === "function") {
        this[fn] = this::DraftTextHandlers[fn];
      }
    }

    this.state = {
      editorState: EditorState.createEmpty()
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
        return this.getConvertToRaw(this.props.onEditorChange)
      }
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

  render() {
    const {
       editorState
    } = this.state;

    const {
      readOnly
    } = this.props

    const {
      onChange,
      onBlur,
      getPlaceHolder
    } = this;

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
          controls={this.getDefaultControls()}
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
            readOnly={readOnly}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={getPlaceHolder}
            blockStyleFn={getBlockStyle}
            ref="editor"
            suppressContentEditableWarning={false}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
};
