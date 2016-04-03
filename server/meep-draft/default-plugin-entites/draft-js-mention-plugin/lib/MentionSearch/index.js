'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MentionOption = require('./MentionOption');

var _MentionOption2 = _interopRequireDefault(_MentionOption);

var _addMention = require('../modifiers/addMention');

var _addMention2 = _interopRequireDefault(_addMention);

var _getSearchText2 = require('../utils/getSearchText');

var _getSearchText3 = _interopRequireDefault(_getSearchText2);

var _decodeOffsetKey2 = require('../utils/decodeOffsetKey');

var _decodeOffsetKey3 = _interopRequireDefault(_decodeOffsetKey2);

var _draftJs = require('draft-js');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MentionSearch = function (_Component) {
  _inherits(MentionSearch, _Component);

  function MentionSearch() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, MentionSearch);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MentionSearch)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      focusedOptionIndex: 0,
      isOpen: false
    }, _this.componentDidUpdate = function () {
      // In case the list shrinks there should be still an option focused.
      // Note: this might run multiple times and deduct 1 until the condition is
      // not fullfilled anymore.
      var size = _this.filteredMentions.size;
      if (size > 0 && _this.state.focusedOptionIndex >= size) {
        _this.setState({
          focusedOptionIndex: _this.filteredMentions.size - 1
        });
      }
    }, _this.componentWillUnmount = function () {
      _this.props.callbacks.onChange = _this.props.callbacks.onChange.delete(_this.key);
    }, _this.onEditorStateChange = function (editorState) {
      var removeList = function removeList() {
        if (_this.state.isOpen) {
          _this.closeDropdown();
        }

        return editorState;
      };

      // identify the start & end positon of the search-text

      var _decodeOffsetKey = (0, _decodeOffsetKey3.default)(_this.props.offsetKey);

      var blockKey = _decodeOffsetKey.blockKey;
      var decoratorKey = _decodeOffsetKey.decoratorKey;
      var leafKey = _decodeOffsetKey.leafKey;

      var _editorState$getBlock = editorState.getBlockTree(blockKey).getIn([decoratorKey, 'leaves', leafKey]);

      var start = _editorState$getBlock.start;
      var end = _editorState$getBlock.end;

      // get the current selection

      var selection = editorState.getSelection();

      // the list should not be visible if a range is selected or the editor has no focus
      if (!selection.isCollapsed() || !selection.getHasFocus()) return removeList();

      // only show the search component for the current block
      var sameBlock = selection.getAnchorKey() === blockKey;
      if (!sameBlock) return removeList();

      // Checks that the cursor is after the @ character but still somewhere in
      // the word (search term). Setting it to allow the cursor to be left of
      // the @ causes troubles as due selection confusion.
      var anchorOffset = selection.getAnchorOffset();
      if (anchorOffset <= start || end < anchorOffset) return removeList();

      // If none of the above triggered to close the window, it's safe to assume
      // the dropdown should be open. This is useful when a user focuses on another
      // input field and then comes back: the dropwdown will again.
      if (!_this.state.isOpen) {
        _this.openDropdown();
      }

      return editorState;
    }, _this.onMentionSelect = function (mention) {
      _this.closeDropdown();
      var newEditorState = (0, _addMention2.default)(_this.props.getEditorState(), mention);
      _this.props.setEditorState(newEditorState);
    }, _this.onDownArrow = function (keyboardEvent) {
      keyboardEvent.preventDefault();
      var newIndex = _this.state.focusedOptionIndex + 1;
      _this.onMentionFocus(newIndex >= _this.filteredMentions.size ? 0 : newIndex);
    }, _this.onTab = function (keyboardEvent) {
      keyboardEvent.preventDefault();
      _this.commitSelection();
    }, _this.onUpArrow = function (keyboardEvent) {
      keyboardEvent.preventDefault();
      if (_this.filteredMentions.size > 0) {
        var newIndex = _this.state.focusedOptionIndex - 1;
        _this.onMentionFocus(Math.max(newIndex, 0));
      }
    }, _this.onEscape = function (keyboardEvent) {
      keyboardEvent.preventDefault();

      _this.closeDropdown();

      // to force a re-render of the outer component to change the aria props
      _this.props.setEditorState(_this.props.getEditorState());
    }, _this.onMentionFocus = function (index) {
      var descendant = 'mention-option-' + _this.key + '-' + index;
      _this.props.ariaProps.ariaActiveDescendantID = _this.props.ariaProps.ariaActiveDescendantID.set(_this.key, descendant);
      _this.setState({
        focusedOptionIndex: index
      });

      // to force a re-render of the outer component to change the aria props
      _this.props.setEditorState(_this.props.getEditorState());
    }, _this.getMentionsForFilter = function () {
      var selection = _this.props.getEditorState().getSelection();

      var _getSearchText = (0, _getSearchText3.default)(_this.props.getEditorState(), selection);

      var word = _getSearchText.word;

      var mentionValue = word.substring(1, word.length).toLowerCase();
      var mentions = _this.props.mentions ? _this.props.mentions : (0, _immutable.List)([]);
      var filteredValues = mentions.filter(function (mention) {
        return !mentionValue || mention.get('name').toLowerCase().indexOf(mentionValue) > -1;
      });
      var size = filteredValues.size < 5 ? filteredValues.size : 5;
      return filteredValues.setSize(size);
    }, _this.commitSelection = function () {
      _this.onMentionSelect(_this.filteredMentions.get(_this.state.focusedOptionIndex));
      return true;
    }, _this.openDropdown = function () {
      // This a really nasty way of attaching & releasing the key related functions.
      // It assumes that the keyFunctions object will not loose its reference and
      // by this we can replace inner parameters spread over different modules.
      // This better be some registering & unregistering logic. PRs are welcome :)
      _this.props.callbacks.onDownArrow = _this.props.callbacks.onDownArrow.set(_this.key, _this.onDownArrow);
      _this.props.callbacks.onUpArrow = _this.props.callbacks.onUpArrow.set(_this.key, _this.onUpArrow);
      _this.props.callbacks.onEscape = _this.props.callbacks.onEscape.set(_this.key, _this.onEscape);
      _this.props.callbacks.handleReturn = _this.props.callbacks.handleReturn.set(_this.key, _this.commitSelection);
      _this.props.callbacks.onTab = _this.props.callbacks.onTab.set(_this.key, _this.onTab);

      var descendant = 'mention-option-' + _this.key + '-' + _this.state.focusedOptionIndex;
      _this.props.ariaProps.ariaActiveDescendantID = _this.props.ariaProps.ariaActiveDescendantID.set(_this.key, descendant);
      var owneeId = 'mentions-list-' + _this.key;
      _this.props.ariaProps.ariaOwneeID = _this.props.ariaProps.ariaOwneeID.set(_this.key, owneeId);
      _this.props.ariaProps.ariaHasPopup = _this.props.ariaProps.ariaHasPopup.set(_this.key, true);
      _this.props.ariaProps.ariaExpanded = _this.props.ariaProps.ariaExpanded.set(_this.key, true);
      _this.setState({
        isOpen: true
      });
    }, _this.updateAriaCloseDropdown = function () {
      _this.props.ariaProps.ariaHasPopup = _this.props.ariaProps.ariaHasPopup.delete(_this.key);
      _this.props.ariaProps.ariaExpanded = _this.props.ariaProps.ariaExpanded.delete(_this.key);
      _this.props.ariaProps.ariaActiveDescendantID = _this.props.ariaProps.ariaActiveDescendantID.delete(_this.key);
      _this.props.ariaProps.ariaOwneeID = _this.props.ariaProps.ariaOwneeID.delete(_this.key);
    }, _this.closeDropdown = function () {
      // make sure none of these callbacks are triggered
      _this.props.callbacks.onDownArrow = _this.props.callbacks.onDownArrow.delete(_this.key);
      _this.props.callbacks.onUpArrow = _this.props.callbacks.onUpArrow.delete(_this.key);
      _this.props.callbacks.onEscape = _this.props.callbacks.onEscape.delete(_this.key);
      _this.props.callbacks.handleReturn = _this.props.callbacks.handleReturn.delete(_this.key);
      _this.updateAriaCloseDropdown();
      _this.setState({
        isOpen: false
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MentionSearch, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.key = (0, _draftJs.genKey)();
      this.props.callbacks.onChange = this.props.callbacks.onChange.set(this.key, this.onEditorStateChange);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // since the initial state is false we have to set the proper aria states
      // for a closed popover
      this.updateAriaCloseDropdown();

      // Note: to force a re-render of the outer component to change the aria props
      this.props.setEditorState(this.props.getEditorState());
    }

    // Get the first 5 mentions that match

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.filteredMentions = this.getMentionsForFilter();
      var theme = this.props.theme;

      return _react2.default.createElement(
        'span',
        _extends({}, this.props, { className: theme.get('autocomplete'), spellCheck: false }),
        this.state.isOpen && this.filteredMentions.size > 0 ? _react2.default.createElement(
          'div',
          {
            className: theme.get('autocompletePopover'),
            contentEditable: false,
            role: 'listbox',
            id: 'mentions-list-' + this.key
          },
          this.filteredMentions.map(function (mention, index) {
            return _react2.default.createElement(_MentionOption2.default, {
              key: mention.get('name'),
              onMentionSelect: _this2.onMentionSelect,
              onMentionFocus: _this2.onMentionFocus,
              isFocused: _this2.state.focusedOptionIndex === index,
              mention: mention,
              index: index,
              id: 'mention-option-' + _this2.key + '-' + index,
              theme: theme
            });
          })
        ) : null,
        this.props.children
      );
    }
  }]);

  return MentionSearch;
}(_react.Component);

exports.default = MentionSearch;