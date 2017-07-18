import React, { PropTypes, Component } from 'react';
import Im from 'immutable';
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
  getSelection,
  getSelectionRect
} from './default-plugin-entites/plugins-util/get-selection-rect';
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
  ContentState,
  SelectionState,
  Modifier
} from 'draft-js';
//pluginEntities
import LinkPluginEntites from './default-plugin-entites/link-entites/decorator';
import ToolBarPluginEntites from './default-plugin-entites/tool-bar-entites/components/tool-bar.react'
import createPluginDecorator from './default-plugin-entites/create-plugin-decorator'
import moveSelectionToEnd from './default-plugin-entites/moveSelectionToEnd';
import * as defaultKeyBindingPlugin from './util/defaultKeyBindingPlugin';
import proxies from './util/proxies';
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
    defaultKeyBindings: true,
    plugins: [],
    setting: {
      toolBar: 'basic'
    }
  }

  constructor(props) {
    super(props);
    //
    for (const method of proxies) {
      this[method] = (...args) => (
        this.refs.editor[method](...args)
      );
    }
    //
    for(let fn in DraftTextHandlers) {
      if(typeof DraftTextHandlers[fn] === "function") {
        this[fn] = this::DraftTextHandlers[fn];
      }
    }

    this.state = {
      editorState: this.props.defaultValue ? EditorState.createWithContent(ContentState.createFromBlockArray(Draft.convertFromRaw(this.props.defaultValue))) : EditorState.createEmpty(),
      openState: Im.fromJS({
        fontFamily: false,
        fontSize: false,
        fontColor: false,
        fontBackground: false
      })
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
    this.onBlur = (e) => {
      //  e.preventDefault();
      if(this.props.onEditorChange) {
        return this.getConvertToRaw(this.props.onEditorChange)
      }
    }
    /*
     * this is the method when open the tool then always close other tools first.
     */
    this.toggleOpenState = (key) => {
      let openState = this.state.openState;
      openState.forEach((state, k) => {
         if(k === key) {
           openState = openState.setIn([k], !openState.getIn([k]));
         } else {
           openState = openState.setIn([k], false);
         }
      })
      this.setState({
        openState: openState
      })
    }

  }

  createEventHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push({
      getEditorState: this.getState,
      setEditorState: this.onPluginChange
    })
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result === true) return true;
    }

    return false;
  };

  createFnHooks = (methodName, plugins) => (...args) => {
    const newArgs = [].slice.apply(args);
    newArgs.push({
      getEditorState: this.getState,
      setEditorState: this.onPluginChange
    })
    for (const plugin of plugins) {
      if (typeof plugin[methodName] !== 'function') continue;
      const result = plugin[methodName](...newArgs);
      if (result !== undefined) return result;
    }

    return false;
  };

  createPluginHooks = () => {
    const pluginHooks = {};
    const eventHookKeys = [];
    const fnHookKeys = [];
    const plugins = this.resolvePlugins();

    plugins.forEach((plugin) => {
      Object.keys(plugin).forEach((attrName) => {
        if (attrName === 'onChange') return;

        if (eventHookKeys.indexOf(attrName) !== -1 || fnHookKeys.indexOf(attrName) !== -1) return;

        const isEventHookKey = ( attrName.indexOf('on') === 0 || attrName.indexOf('handle') === 0 );
        if(isEventHookKey) {
          eventHookKeys.push(attrName);
          return;
        }

        const isFnHookKey = ( attrName.length - 2 === attrName.indexOf('Fn') );
        if(isFnHookKey) {
          fnHookKeys.push(attrName);
        }

        eventHookKeys.forEach((attrName) => {
          pluginHooks[attrName] = this.createEventHooks(attrName, plugins);
        });

        fnHookKeys.forEach((attrName) => {
          pluginHooks[attrName] = this.createFnHooks(attrName, plugins);
        });

        return pluginHooks;

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
    let defaultEditorState;
    if(this.props.plugins) {
      this.props.setting.toolBar = this.props.setting.toolBar ? this.props.setting.toolBar : 'basic';
      const concatPlugin = [LinkPluginEntites].concat(this.props.plugins);
      createCompositeDecorator = createPluginDecorator(concatPlugin, this.getState, this.onPluginChange);
      defaultEditorState = EditorState.set(this.getState(), { decorator: createCompositeDecorator });
    } else {
      const concatPlugin = [LinkPluginEntites];
      createCompositeDecorator = createPluginDecorator(concatPlugin, this.getState, this.onPluginChange);
      defaultEditorState = EditorState.set(this.getState(), { decorator: createCompositeDecorator });
    }
    this.onChange(moveSelectionToEnd(defaultEditorState));
  }

  componentDidUpdate(prevProps, prevState) {
    // 判斷每個block中文字的style是否改變，是的話：call onEditorChange()
    let currBlockMap = this.state.editorState.getImmutable().getIn(['currentContent', 'blockMap']);
    let prevBlockMap = prevState.editorState.getImmutable().getIn(['currentContent', 'blockMap']);
    let isStyleChanged;
    if(currBlockMap.size === prevBlockMap.size) {
      // no newline
      currBlockMap.mapKeys(key => {
        if(currBlockMap.getIn([key, 'text']) === prevBlockMap.getIn([key, 'text']) && currBlockMap.getIn([key, 'characterList']) !== prevBlockMap.getIn([key, 'characterList'])) {
          // style change
          isStyleChanged = true;
        } else {
          // the text of this block is changed
          isStyleChanged = false;
        }
      })
    } else {
      // type newline
      isStyleChanged = false;
    }
    if(this.props.onEditorChange && isStyleChanged) {
      return this.getConvertToRaw(this.props.onEditorChange)
    }
  }

  render() {
    const {
       editorState,
       openState
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
          onChange={this.onPluginChange}
          openState={ openState }
          readOnly={this.props.readOnly}
          controls={this.getDefaultControls()}
          toggleOpenState={ this.toggleOpenState }
        />
      </div>
    ) : null

    let rectInfo;
    let oldRect;
    if(setting.toolBar === 'float') {
      const rect = getSelectionRect(document.getSelection());
      if(rect) {
        rectInfo = {
          left: rect.left,
          top: rect.top
        }
        oldRect = rectInfo;
      }
    }

    const toolBarControlsComponent = this.props.readOnly ? null : setting.toolBar === 'float' ? (
      <ToolBarPluginEntites
        editorState={editorState}
        rect={rectInfo ? rectInfo : null}
      >
        <DefaultControlsComponents
          editorState={editorState}
          openState={ openState }
          onChange={this.onPluginChange}
          readOnly={this.props.readOnly}
          controls={this.getToolBarControls()}
          defaultStyle={rootControlStyle}
        />
      </ToolBarPluginEntites>
    ) : null

    const pluginHooks = this.props.plugins ? this.createPluginHooks() : null;
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
            { ...this.props }
            { ...pluginHooks }
            customStyleMap={ merge(COLORS, BACKGROUNDCOLORS, ALIGN, FONTSIZE, FONTFAMILY) }
            editorState={ editorState }
            readOnly={ readOnly }
            onChange={ this.onPluginChange }
            onBlur={ onBlur }
            placeholder={ getPlaceHolder }
            blockStyleFn={ getBlockStyle }
            ref="editor"
            spellCheck={ false }
          />
        </div>
        { toolBarControlsComponent }
      </div>
    );
  }
};
