/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DraftPasteProcessor
 * @typechecks
 * 
 */

'use strict';

var CharacterMetadata = require('./CharacterMetadata');
var ContentBlock = require('./ContentBlock');
var DraftEntity = require('./DraftEntity');
var Immutable = require('immutable');
var URI = require('fbjs/lib/URI');

var generateRandomKey = require('./generateRandomKey');
var getSafeBodyFromHTML = require('./getSafeBodyFromHTML');
var invariant = require('fbjs/lib/invariant');
var nullthrows = require('fbjs/lib/nullthrows');
var sanitizeDraftText = require('./sanitizeDraftText');

var List = Immutable.List;
var OrderedSet = Immutable.OrderedSet;
var Repeat = Immutable.Repeat;

var NBSP = '&nbsp;';
var SPACE = ' ';

// Corresponds to max indent in campfire editor
var MAX_DEPTH = 4;

// used for replacing characters in HTML
var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');

// Block tag flow is different because LIs do not have
// a deterministic style ;_;
var blockTags = ['p', 'h1', 'h2', 'h3', 'li', 'blockquote', 'pre'];
var inlineTags = {
  b: 'BOLD',
  code: 'CODE',
  del: 'STRIKETHROUGH',
  em: 'ITALIC',
  i: 'ITALIC',
  s: 'STRIKETHROUGH',
  strike: 'STRIKETHROUGH',
  strong: 'BOLD',
  u: 'UNDERLINE'
};

var lastBlock;

function getEmptyChunk() {
  return {
    text: '',
    inlines: [],
    entities: [],
    blocks: []
  };
}

function getWhitespaceChunk(inEntity) {
  var entities = new Array(1);
  if (inEntity) {
    entities[0] = inEntity;
  }
  return {
    text: SPACE,
    inlines: [OrderedSet()],
    entities: entities,
    blocks: []
  };
}

function getSoftNewlineChunk() {
  return {
    text: '\n',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: []
  };
}

function getBlockDividerChunk(block, depth) {
  return {
    text: '\r',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: [{
      type: block,
      depth: Math.max(0, Math.min(MAX_DEPTH, depth))
    }]
  };
}

function getBlockTypeForTag(tag, lastList) {
  switch (tag) {
    case 'h1':
      return 'header-one';
    case 'h2':
      return 'header-two';
    case 'h3':
      return 'header-three';
    case 'h4':
      return 'header-four';
    case 'h5':
      return 'header-five';
    case 'h6':
      return 'header-six';
    case 'li':
      if (lastList === 'ol') {
        return 'ordered-list-item';
      }
      return 'unordered-list-item';
    case 'blockquote':
      return 'blockquote';
    case 'pre':
      return 'code-block';
    default:
      return 'unstyled';
  }
}

function processInlineTag(tag, node, currentStyle) {
  var styleToCheck = inlineTags[tag];
  if (styleToCheck) {
    currentStyle = currentStyle.add(styleToCheck).toOrderedSet();
  } else if (node instanceof HTMLElement) {
    (function () {
      var htmlElement = node;
      currentStyle = currentStyle.withMutations(function (style) {
        if (htmlElement.style.fontWeight === 'bold') {
          style.add('BOLD');
        }

        if (htmlElement.style.fontStyle === 'italic') {
          style.add('ITALIC');
        }

        if (htmlElement.style.textDecoration === 'underline') {
          style.add('UNDERLINE');
        }

        if (htmlElement.style.textDecoration === 'line-through') {
          style.add('STRIKETHROUGH');
        }
      }).toOrderedSet();
    })();
  }
  return currentStyle;
}

function joinChunks(A, B) {
  // Sometimes two blocks will touch in the DOM and we need to strip the
  // extra delimiter to preserve niceness.
  var lastInB = B.text.slice(0, 1);

  if (A.text.slice(-1) === '\r' && lastInB === '\r') {
    A.text = A.text.slice(0, -1);
    A.inlines.pop();
    A.entities.pop();
    A.blocks.pop();
  }

  // Kill whitespace after blocks
  if (A.text.slice(-1) === '\r') {
    if (B.text === SPACE || B.text === '\n') {
      return A;
    } else if (lastInB === SPACE || lastInB === '\n') {
      B.text = B.text.slice(1);
      B.inlines.shift();
      B.entities.shift();
    }
  }

  return {
    text: A.text + B.text,
    inlines: A.inlines.concat(B.inlines),
    entities: A.entities.concat(B.entities),
    blocks: A.blocks.concat(B.blocks)
  };
}

/**
 * Check to see if we have anything like <p> <blockquote> <h1>... to create
 * block tags from. If we do, we can use those and ignore <div> tags. If we
 * don't, we can treat <div> tags as meaningful (unstyled) blocks.
 */
function containsSemanticBlockMarkup(html) {
  return blockTags.some(function (tag) {
    return html.indexOf('<' + tag) !== -1;
  });
}

function hasValidLinkText(link) {
  !(link instanceof HTMLAnchorElement) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Link must be an HTMLAnchorElement.') : invariant(false) : undefined;
  var protocol = link.protocol;
  return protocol === 'http:' || protocol === 'https:';
}

function genFragment(node, inlineStyle, lastList, inBlock, blockTags, depth, inEntity) {
  var nodeName = node.nodeName.toLowerCase();
  var newBlock = false;
  var nextBlockType = 'unstyled';
  var lastLastBlock = lastBlock;

  // Base Case
  if (nodeName === '#text') {
    var text = node.textContent;
    if (text.trim() === '' && inBlock !== 'pre') {
      return getWhitespaceChunk(inEntity);
    }
    if (inBlock !== 'pre') {
      // Can't use empty string because MSWord
      text = text.replace(REGEX_LF, SPACE);
    }

    // save the last block so we can use it later
    lastBlock = nodeName;

    return {
      text: text,
      inlines: Array(text.length).fill(inlineStyle),
      entities: Array(text.length).fill(inEntity),
      blocks: []
    };
  }

  // save the last block so we can use it later
  lastBlock = nodeName;

  // BR tags
  if (nodeName === 'br') {
    if (lastLastBlock === 'br' && (!inBlock || getBlockTypeForTag(inBlock, lastList) === 'unstyled')) {
      return getBlockDividerChunk('unstyled', depth);
    }
    return getSoftNewlineChunk();
  }

  var chunk = getEmptyChunk();
  var newChunk = null;

  // Inline tags
  inlineStyle = processInlineTag(nodeName, node, inlineStyle);

  // Handle lists
  if (nodeName === 'ul' || nodeName === 'ol') {
    if (lastList) {
      depth += 1;
    }
    lastList = nodeName;
  }

  // Block Tags
  if (!inBlock && blockTags.indexOf(nodeName) !== -1) {
    chunk = getBlockDividerChunk(getBlockTypeForTag(nodeName, lastList), depth);
    inBlock = nodeName;
    newBlock = true;
  } else if (lastList && inBlock === 'li' && nodeName === 'li') {
    chunk = getBlockDividerChunk(getBlockTypeForTag(nodeName, lastList), depth);
    inBlock = nodeName;
    newBlock = true;
    nextBlockType = lastList === 'ul' ? 'unordered-list-item' : 'ordered-list-item';
  }

  // Recurse through children
  var child = node.firstChild;
  if (child != null) {
    nodeName = child.nodeName.toLowerCase();
  }

  var entityId = null;
  var href = null;

  while (child) {
    if (nodeName === 'a' && child.href && hasValidLinkText(child)) {
      href = new URI(child.href).toString();
      entityId = DraftEntity.create('LINK', 'MUTABLE', { url: href });
    } else {
      entityId = undefined;
    }

    newChunk = genFragment(child, inlineStyle, lastList, inBlock, blockTags, depth, entityId || inEntity);

    chunk = joinChunks(chunk, newChunk);
    var sibling = child.nextSibling;

    // Put in a newline to break up blocks inside blocks
    if (sibling && blockTags.indexOf(nodeName) >= 0 && inBlock) {
      chunk = joinChunks(chunk, getSoftNewlineChunk());
    }
    if (sibling) {
      nodeName = sibling.nodeName.toLowerCase();
    }
    child = sibling;
  }

  if (newBlock) {
    chunk = joinChunks(chunk, getBlockDividerChunk(nextBlockType, depth));
  }

  return chunk;
}

function getChunkForHTML(html) {
  html = html.trim().replace(REGEX_CR, '').replace(REGEX_NBSP, SPACE);

  var safeBody = getSafeBodyFromHTML(html);
  if (!safeBody) {
    return null;
  }
  lastBlock = null;

  // Sometimes we aren't dealing with content that contains nice semantic
  // tags. In this case, use divs to separate everything out into paragraphs
  // and hope for the best.
  var workingBlocks = containsSemanticBlockMarkup(html) ? blockTags : ['div'];

  // Start with -1 block depth to offset the fact that we are passing in a fake
  // UL block to start with.
  var chunk = genFragment(safeBody, OrderedSet(), 'ul', null, workingBlocks, -1);

  // join with previous block to prevent weirdness on paste
  if (chunk.text.indexOf('\r') === 0) {
    chunk = {
      text: chunk.text.slice(1),
      inlines: chunk.inlines.slice(1),
      entities: chunk.entities.slice(1),
      blocks: chunk.blocks
    };
  }

  // Kill block delimiter at the end
  if (chunk.text.slice(-1) === '\r') {
    chunk.text = chunk.text.slice(0, -1);
    chunk.inlines = chunk.inlines.slice(0, -1);
    chunk.entities = chunk.entities.slice(0, -1);
    chunk.blocks.pop();
  }

  // If we saw no block tags, put an unstyled one in
  if (chunk.blocks.length === 0) {
    chunk.blocks.push({ type: 'unstyled', depth: 0 });
  }

  // Sometimes we start with text that isn't in a block, which is then
  // followed by blocks. Need to fix up the blocks to add in
  // an unstyled block for this content
  if (chunk.text.split('\r').length === chunk.blocks.length + 1) {
    chunk.blocks.unshift({ type: 'unstyled', depth: 0 });
  }

  return chunk;
}

var DraftPasteProcessor = {
  processHTML: function processHTML(html) {
    var chunk = getChunkForHTML(html);
    if (chunk == null) {
      return null;
    }
    var start = 0;
    return chunk.text.split('\r').map(function (textBlock, ii) {
      // Make absolutely certain that our text is acceptable.
      textBlock = sanitizeDraftText(textBlock);
      var end = start + textBlock.length;
      var inlines = nullthrows(chunk).inlines.slice(start, end);
      var entities = nullthrows(chunk).entities.slice(start, end);
      var characterList = List(inlines.map(function (style, ii) {
        var data = { style: style, entity: null };
        if (entities[ii]) {
          data.entity = entities[ii];
        }
        return CharacterMetadata.create(data);
      }));
      start = end + 1;

      return new ContentBlock({
        key: generateRandomKey(),
        type: nullthrows(chunk).blocks[ii].type,
        depth: nullthrows(chunk).blocks[ii].depth,
        text: textBlock,
        characterList: characterList
      });
    });
  },

  processText: function processText(textBlocks, character) {
    return textBlocks.map(function (textLine) {
      textLine = sanitizeDraftText(textLine);
      return new ContentBlock({
        key: generateRandomKey(),
        type: 'unstyled',
        text: textLine,
        characterList: List(Repeat(character, textLine.length))
      });
    });
  }
};

module.exports = DraftPasteProcessor;