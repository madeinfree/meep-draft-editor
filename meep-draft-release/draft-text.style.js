'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _styles = require('meepworks/styles');

var _styles2 = _interopRequireDefault(_styles);

var _userSelectNone = require('../lib/user-select-none');

var _userSelectNone2 = _interopRequireDefault(_userSelectNone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _styles2.default({
  root: {
    fontFamily: '\'Georgia\', serif',
    fontSize: 14,
    marginTop: '20px'
  },
  editor: {
    cursor: 'text',
    fontSize: 16,
    minHeight: 150,
    border: '1px solid #59bcc9'
  },
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none'
  },
  styleButton: {
    color: '#59bcc9',
    cursor: 'pointer'
  },
  meepEditorInline: {
    display: 'inline-block',
    userSelectNone: _userSelectNone2.default
  },
  meepEditorDefaultColor: {
    color: '#59bcc9'
  },
  meepEditorDefaultButton: {
    fontSize: '16px',
    cursor: 'pointer',
    width: '30px',
    display: 'inline-block',
    textAlign: 'center'
  },
  meepEditorActiveButton: {
    color: '#437A82'
  },
  meepEditorActionSelect: {
    color: '#59bcc9'
  },
  meepEditorLink: {
    cursor: 'pointer',
    color: '#3b5998',
    textDecoration: 'underline'
  },
  //ColorButton
  meepEditorDefaultColorButton: {
    cursor: 'pointer',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    textAlign: 'center',
    marginLeft: '2px',
    marginRight: '2px',
    border: '1px solid #000'
  },
  meepEditorActiveColorButton: {
    border: '2px solid #000'
  },
  meepEditorActiveColorBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 5px #ccc'
  },
  //BackgroundButton
  meepEditorActiveBackgroundBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 5px #ccc'
  },

  //FontSizeBox
  meepEditorSelectMainBox: {
    position: 'relative',
    cursor: 'pointer',
    color: '#59bcc9',
    height: '100%'
  },
  meepEditorSelectMainBoxOpen: {
    borderColor: '#437A82',
    color: '#437A82',
    zIndex: 1001
  },
  meepEditorSelectItemBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    boxShadow: 'rgba(0,0,0,.2) 0 2px 8px',
    marginTop: '-1px',
    zIndex: 1
  },
  meepEditorSelectBoxLabel: {
    paddingRight: '8px',
    lineHeight: '24px'
  },
  meepEditorSelectBoxIcon: {
    paddingRight: '8px'
  },
  meepEditorSelectItem: {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'block',
    paddingBottom: '5px',
    paddingTop: '5px',
    textAlign: 'center',
    width: '50px',
    color: '#59bcc9'
  },
  meepEditorSelectItemHover: {
    color: '#000'
  },
  //Family
  meepEditorSelectFamilyItem: {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'block',
    paddingBottom: '5px',
    paddingTop: '5px',
    textAlign: 'center',
    color: '#59bcc9',
    width: '100px'
  }
});