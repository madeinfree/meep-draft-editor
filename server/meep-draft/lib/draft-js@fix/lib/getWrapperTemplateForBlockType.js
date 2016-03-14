/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getWrapperTemplateForBlockType
 * 
 */

/**
 * Create these elements once and cache them so they're reference-equal.
 */
'use strict';

var React = require('react');

var cx = require('fbjs/lib/cx');

var UL_WRAP = React.createElement('ul', { className: cx('public/DraftStyleDefault/ul') });
var OL_WRAP = React.createElement('ol', { className: cx('public/DraftStyleDefault/ol') });
var PRE_WRAP = React.createElement('pre', { className: cx('public/DraftStyleDefault/pre') });

function getWrapperTemplateForBlockType(blockType) {
  switch (blockType) {
    case 'unordered-list-item':
      return UL_WRAP;
    case 'ordered-list-item':
      return OL_WRAP;
    case 'code-block':
      return PRE_WRAP;
    default:
      return null;
  }
}

module.exports = getWrapperTemplateForBlockType;