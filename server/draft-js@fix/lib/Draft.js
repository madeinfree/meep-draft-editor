/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Draft
 */

'use strict';

var BlockMapBuilder = require('./BlockMapBuilder');
var CharacterMetadata = require('./CharacterMetadata');
var CompositeDraftDecorator = require('./CompositeDraftDecorator');
var ContentBlock = require('./ContentBlock');
var ContentState = require('./ContentState');
var DraftEditor = require('./DraftEditor.react');
var DraftModifier = require('./DraftModifier');
var DraftEntity = require('./DraftEntity');
var DraftEntityInstance = require('./DraftEntityInstance');
var EditorState = require('./EditorState');
var KeyBindingUtil = require('./KeyBindingUtil');
var RichTextEditorUtil = require('./RichTextEditorUtil');
var SelectionState = require('./SelectionState');

var convertFromDraftStateToRaw = require('./convertFromDraftStateToRaw');
var convertFromRawToDraftState = require('./convertFromRawToDraftState');
var generateRandomKey = require('./generateRandomKey');
var getDefaultKeyBinding = require('./getDefaultKeyBinding');

var DraftPublic = {
  Editor: DraftEditor,
  EditorState: EditorState,

  CompositeDecorator: CompositeDraftDecorator,
  Entity: DraftEntity,
  EntityInstance: DraftEntityInstance,

  BlockMapBuilder: BlockMapBuilder,
  CharacterMetadata: CharacterMetadata,
  ContentBlock: ContentBlock,
  ContentState: ContentState,
  SelectionState: SelectionState,

  KeyBindingUtil: KeyBindingUtil,
  Modifier: DraftModifier,
  RichUtils: RichTextEditorUtil,

  convertFromRaw: convertFromRawToDraftState,
  convertToRaw: convertFromDraftStateToRaw,
  genKey: generateRandomKey,
  getDefaultKeyBinding: getDefaultKeyBinding
};

module.exports = DraftPublic;