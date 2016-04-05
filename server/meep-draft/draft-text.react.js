import React, { PropTypes, Component } from 'react';
import { fromJS } from 'immutable';
//css
import './draft-vendor/draft-text.css';
import './draft-vendor/draft-editor.css';
import styles from './draft-text.style';
//
import DefaultControls from './defaultSettings/default-controls';
import ToolBarControls from './defaultSettings/tool-bar-default-controls';
import DefaultControlsComponents from './defaultControls/default-controls-components.react';
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
//pluginEntities
import LinkPluginEntites from './default-plugin-entites/link-entites/decorator';
import ToolBarPluginEntites from './default-plugin-entites/tool-bar-entites/components/tool-bar.react'
import createPluginDecorator from './default-plugin-entites/create-plugin-decorator'
import moveSelectionToEnd from './default-plugin-entites/moveSelectionToEnd';
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
  getToolBarControls() {
    //this is for toolbar controls setting if use the toolbar controls
    return ToolBarControls;
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
      editorState: this.props.defaultValue ? EditorState.createWithContent(ContentState.createFromBlockArray(Draft.convertFromRaw(this.props.defaultValue))) : EditorState.createEmpty()
    };

    this.focus = (editorState) => {
      if(!editorState.getSelection().getHasFocus()) {
        this.refs.editor.focus();
      }
    }
    //
    this.onChange = (editorState) => {
      this.setState({
        editorState,
      });
    };
    //
    this.onPluginChange = (editorState) => {
      let newEditorState = editorState;
      this.props.plugins.forEach((plugin) => {
        if (plugin.onChange) {
          newEditorState = plugin.onChange(newEditorState);
        }
      });

      if (this.onChange) {
        this.onChange(newEditorState);
      }
    }
    //
    this.onBlur = (e, editorState) => {
      if(this.props.onEditorChange) {
        return this.getConvertToRaw(this.props.onEditorChange)
      }
    }

  }

  createHandleHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push(this.getEditorState);
    newArgs.push(this.onChange);
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result === true) return true;
    }

    return false;
  };

  createOnHooks = (methodName, plugins) => (event) => (
    plugins
      .filter((plugin) => typeof plugin[methodName] === 'function')
      .forEach((plugin) => plugin[methodName](event))
  );

  createFnHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push(this.getEditorState);
    newArgs.push(this.onChange);
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result !== undefined) return result;
    }

    return false;
  };

  createPluginHooks = () => {
    const pluginHooks = {};
    const plugins = this.resolvePlugins();

    plugins.forEach((plugin) => {
      Object.keys(plugin).forEach((attrName) => {
        if (attrName === 'onChange') return;

        if (attrName.indexOf('on') === 0) {
          pluginHooks[attrName] = this.createOnHooks(attrName, plugins);
        }

        if (attrName.indexOf('handle') === 0) {
          pluginHooks[attrName] = this.createHandleHooks(attrName, plugins);
        }

        // checks if the function ends with Fn
        if (attrName.length - 2 === attrName.indexOf('Fn')) {
          pluginHooks[attrName] = this.createFnHooks(attrName, plugins);
        }
      });
    });
    return pluginHooks;
  }

  resolvePlugins = () => {
    const plugins = this.props.plugins.slice(0);
    if (this.props.defaultKeyBindings) {
      plugins.push(defaultKeyBindingPlugin);
    }

    return plugins;
  };

  componentWillMount() {
    let createCompositeDecorator;
    //Default state setting
    let defaultEditorState;

    if(this.props.plugins) {
      // if it's has other plugins..
      const concatPlugin = this.props.plugins.concat(LinkPluginEntites);
      createCompositeDecorator = createPluginDecorator(concatPlugin, this.getState, this.onPluginChange);
      defaultEditorState = EditorState.set(this.getState(), { decorator: createCompositeDecorator });
    } else {
      // use the default plugins..
      const concatPlugin = [LinkPluginEntites];
      createCompositeDecorator = createPluginDecorator(concatPlugin, this.getState, this.onPluginChange);
      defaultEditorState = EditorState.set(this.getState(), { decorator: createCompositeDecorator });
    }
    this.onChange(defaultEditorState);
  }

  render() {
    const {
       editorState
    } = this.state;

    const {
      readOnly,
      setting
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

    const controlsComponentEditor= this.props.readOnly ? null : setting.toolBar === 'basic' ? (
      <div>
        <DefaultControlsComponents
          editorState={this.getState()}
          onChange={this.onChange}
          readOnly={this.props.readOnly}
          controls={this.getDefaultControls()}
        />
      </div>
    ) : null

    const toolBarControlsComponent = this.props.readOnly ? null : setting.toolBar === 'float' ? (
      <ToolBarPluginEntites
        editorState={editorState}
      >
        <DefaultControlsComponents
          editorState={this.getState()}
          onChange={this.onChange}
          readOnly={this.props.readOnly}
          controls={this.getToolBarControls()}
          defaultStyle={rootControlStyle}
        />
      </ToolBarPluginEntites>
    ) : null

    const pluginHooks = this.props.plugins ? this.createPluginHooks() : null

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
            {...pluginHooks}
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
        {toolBarControlsComponent}
      </div>
    );
  }
};
