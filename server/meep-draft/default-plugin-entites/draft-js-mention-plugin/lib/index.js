'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Mention = require('./Mention');

var _Mention2 = _interopRequireDefault(_Mention);

var _MentionSearch = require('./MentionSearch');

var _MentionSearch2 = _interopRequireDefault(_MentionSearch);

var _mentionStrategy = require('./mentionStrategy');

var _mentionStrategy2 = _interopRequireDefault(_mentionStrategy);

var _mentionSearchStrategy = require('./mentionSearchStrategy');

var _mentionSearchStrategy2 = _interopRequireDefault(_mentionSearchStrategy);

var _decorateComponentWithProps = require('decorate-component-with-props');

var _decorateComponentWithProps2 = _interopRequireDefault(_decorateComponentWithProps);

var _immutable = require('immutable');

var _mentionStyles = {
  "mention": "draftJsMentionPlugin__mention__29BEd"
};

var _mentionStyles2 = _interopRequireDefault(_mentionStyles);

var _autocompleteStyles = {
  "autocomplete": "draftJsMentionPlugin__autocomplete__2-Dw-",
  "autocompletePopover": "draftJsMentionPlugin__autocompletePopover__Yau-5"
};

var _autocompleteStyles2 = _interopRequireDefault(_autocompleteStyles);

var _autocompleteEntryStyles = {
  "autocompleteEntry": "draftJsMentionPlugin__autocompleteEntry__3hYPz",
  "autocompleteEntryFocused": "draftJsMentionPlugin__autocompleteEntryFocused__3ralB draftJsMentionPlugin__autocompleteEntry__3hYPz",
  "autocompleteEntryText": "draftJsMentionPlugin__autocompleteEntryText__VAEv4",
  "autocompleteEntryAvatar": "draftJsMentionPlugin__autocompleteEntryAvatar__2nAfa"
};

var _autocompleteEntryStyles2 = _interopRequireDefault(_autocompleteEntryStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTheme = (0, _immutable.Map)({
  mention: _mentionStyles2.default.mention,

  autocomplete: _autocompleteStyles2.default.autocomplete,
  autocompletePopover: _autocompleteStyles2.default.autocompletePopover,

  autocompleteEntry: _autocompleteEntryStyles2.default.autocompleteEntry,
  autocompleteEntryFocused: _autocompleteEntryStyles2.default.autocompleteEntryFocused,
  autocompleteEntryText: _autocompleteEntryStyles2.default.autocompleteEntryText,
  autocompleteEntryAvatar: _autocompleteEntryStyles2.default.autocompleteEntryAvatar
});

var callbacks = {
  keyBindingFn: (0, _immutable.Map)(),
  handleKeyCommand: (0, _immutable.Map)(),
  onDownArrow: (0, _immutable.Map)(),
  onUpArrow: (0, _immutable.Map)(),
  onTab: (0, _immutable.Map)(),
  onEscape: (0, _immutable.Map)(),
  handleReturn: (0, _immutable.Map)(),
  onChange: (0, _immutable.Map)()
};

var ariaProps = {
  ariaHasPopup: (0, _immutable.Map)(),
  ariaExpanded: (0, _immutable.Map)(),
  ariaOwneeID: (0, _immutable.Map)(),
  ariaActiveDescendantID: (0, _immutable.Map)()
};

var mentionPlugin = function mentionPlugin() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  var theme = config.theme ? config.theme : defaultTheme;
  var mentionSearchProps = {
    ariaProps: ariaProps,
    callbacks: callbacks,
    mentions: config.mentions,
    theme: theme
  };
  return {
    decorators: [{
      strategy: _mentionStrategy2.default,
      component: (0, _decorateComponentWithProps2.default)(_Mention2.default, { theme: theme })
    }, {
      strategy: _mentionSearchStrategy2.default,
      component: (0, _decorateComponentWithProps2.default)(_MentionSearch2.default, mentionSearchProps)
    }],
    getEditorProps: function getEditorProps() {
      var ariaHasPopup = ariaProps.ariaHasPopup.some(function (entry) {
        return entry;
      });
      var ariaExpanded = ariaProps.ariaExpanded.some(function (entry) {
        return entry;
      });
      return {
        role: 'combobox',
        ariaAutoComplete: 'list',
        ariaHasPopup: ariaHasPopup ? 'true' : 'false',
        ariaExpanded: ariaExpanded ? 'true' : 'false',
        ariaActiveDescendantID: ariaProps.ariaActiveDescendantID.first(),
        ariaOwneeID: ariaProps.ariaOwneeID.first()
      };
    },

    onDownArrow: function onDownArrow(keyboardEvent) {
      return callbacks.onDownArrow.forEach(function (onDownArrow) {
        return onDownArrow(keyboardEvent);
      });
    },
    onTab: function onTab(keyboardEvent) {
      return callbacks.onTab.forEach(function (onTab) {
        return onTab(keyboardEvent);
      });
    },
    onUpArrow: function onUpArrow(keyboardEvent) {
      return callbacks.onUpArrow.forEach(function (onUpArrow) {
        return onUpArrow(keyboardEvent);
      });
    },
    onEscape: function onEscape(keyboardEvent) {
      return callbacks.onEscape.forEach(function (onEscape) {
        return onEscape(keyboardEvent);
      });
    },
    handleReturn: function handleReturn(keyboardEvent) {
      return callbacks.handleReturn.map(function (handleReturn) {
        return handleReturn(keyboardEvent);
      }).find(function (result) {
        return result === true;
      });
    },
    onChange: function onChange(editorState) {
      var newEditorState = editorState;
      if (callbacks.onChange.size !== 0) {
        callbacks.onChange.forEach(function (onChange) {
          newEditorState = onChange(editorState);
        });
      }

      return newEditorState;
    }
  };
};

exports.default = mentionPlugin;