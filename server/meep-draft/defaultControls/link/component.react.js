/*
  component: link
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

const LinkControls = (props) => {
  const {
    onHandlLink,
    groupControls
  } = props
  const links = [];

  groupControls.set ? links.push(
    <span
      key={`link-2`}
      style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
      onClick={(e) => {
        onHandlLink(e, 'addLink')
      }}
    >
      <i className="fa fa-link"></i>
    </span>
  ) : null

  groupControls.unset ? links.push(
    <span
      key={`link-1`}
      style={merge(styles.meepEditorDefaultColor, styles.meepEditorDefaultButton)}
      onClick={(e) => {
        onHandlLink(e, 'removeLink')
      }}
    >
      <i className="fa fa-unlink"></i>
    </span>
  ) : null

  return (
    <span>
      {links}
    </span>
  )
}

export default LinkControls;
