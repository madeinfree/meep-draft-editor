import React, { Component } from 'react';
import ReactDom, { findDOMNode } from 'react-dom';
import Portal from 'react-portal';
import {
  RichUtils,
  Entity
} from 'draft-js';

import '../style.css';


export default class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastLeft: 0,
      lastTop: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('change', nextProps.rect);
    if(this.shouldUpdate){
      this.shouldUpdate = false;
      return true;
    }
    if(this.props.children !== nextProps.children) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    const toolbar = findDOMNode(this.refs.toolbar);
    if (toolbar) {
      this.shouldUpdate = true;
      const rect = toolbar.getBoundingClientRect();
      const selection = document.getSelection();

      const scrollY = window.scrollY ? window.scrollY : window.pageYOffset;
      const scrollX = window.scrollX ? window.scrollX : window.pageXOffset;
      this.setState({
        top: (rect.height + scrollY),
        left: ((rect.width/2)+(0/2)+scrollX)
     });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      rect
    } = this.props
    if (rect) {
      this.setState({
        lastLeft: rect.left,
        lastTop: rect.top
     });
    }
    if(this.shouldUpdate){
       this.shouldUpdate = false;
       this.componentDidMount();
    }
  }

  render() {

    const {
      editorState,
      rect
    } = this.props

    const isCollapsed = editorState.getSelection().isCollapsed();
    if(isCollapsed) {
      this.display = 'none';
    } else {
      this.display = 'block';
    }

    return (
      <Portal isOpened={true}>
        <div
          className='tool-bar'
          ref='toolbar'
          style={{
            top: rect ? (rect.top - 40) : (this.state.lastTop - 40),
            left: rect ? rect.left : this.state.lastLeft,
            width: '300px',
            backgroundColor: 'black',
            borderRadius: '10px',
            padding: '10px',
            display: this.display
          }}
        >
          {this.props.children}
        </div>
      </Portal>
    );
  }
};
