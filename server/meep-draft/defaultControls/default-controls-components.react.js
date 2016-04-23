import React, { Component } from 'react';

import {
  FontFamilyControls,
  FontSizeControls,
  TextControls,
  LinkControls,
  BlockControls,
  ColorControls,
  BackgroundControls,
  ContentControls
} from './index.react';

export default class DefaultControlsComponents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      editorState,
      onChange,
      controls,
      readOnly,
      defaultStyle,
      openState,
      toggleOpenState
    } = this.props

    const fontFamilyControls = controls.fontFamily ? (
      <FontFamilyControls
        editorState={editorState}
        onChange={onChange}
        openState={ openState }
        toggleOpenState={ toggleOpenState }
      />
    ) : null

    const fontSizeControls = controls.fontSize ? (
      <FontSizeControls
        editorState={editorState}
        onChange={onChange}
        openState={ openState }
        toggleOpenState={ toggleOpenState }
      />
    ) : null

    const textControls = controls.text ? (
      <TextControls
        editorState={editorState}
        groupControls={controls.text}
        onChange={onChange}
        style={defaultStyle}
      />
    ) : null

    const linkControls = controls.link ? (
      <LinkControls
        editorState={editorState}
        groupControls={controls.link}
        onChange={onChange}
      />
    ) : null

    const blockControls = controls.block ? (
      <BlockControls
        editorState={editorState}
        groupControls={controls.block}
        onChange={onChange}
        style={defaultStyle}
      />
    ) : null

    const colorControls = controls.color ? (
      <ColorControls
        editorState={editorState}
        onChange={onChange}
        openState={ openState }
        toggleOpenState={ toggleOpenState }
      />
    ) : null

    const backgrounControls = controls.background ? (
      <BackgroundControls
        editorState={editorState}
        onChange={onChange}
        openState={ openState }
        toggleOpenState={ toggleOpenState }
      />
    ) : null

    const contentControls = controls.content ? (
      <ContentControls
        editorState={editorState}
        groupControls={controls.content}
        onChange={onChange}
      />
    ) : null

    const controlsComponents = readOnly ? null :
    (
      <div>
        {fontFamilyControls}
        {fontSizeControls}
        {textControls}
        {linkControls}
        {blockControls}
        {colorControls}
        {backgrounControls}
        {contentControls}
      </div>
    )
    return (
      <div>
        {controlsComponents}
      </div>
    );
  }
};
