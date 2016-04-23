import Styles from './lib/styles';
import userSelectNone from './lib/user-select-none';
export default new Styles({
  root: {
    background: '#fff',
    fontFamily: '\'Georgia\', serif',
    fontSize: '14px',
  },
  editor: {
    border: '1px solid #000',
    fontSize: '16px',
    fontFamily: "'Inconsolata', 'Menlo', 'Consolas', monospace",
    fontSize: '16px',
    padding: '20px',
  },
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    userSelect: 'none',
  },
  styleButton: {
    color: '#59bcc9',
    cursor: 'pointer',
  },
  meepEditorInline: {
    display: 'inline-block',
    userSelectNone,
  },
  meepEditorInlineFontFamily: {
    textAlign: 'center'
  },
  meepEditorDefaultColor: {
    color: '#59bcc9',
  },
  meepEditorDefaultButton: {
    fontSize: '16px',
    cursor: 'pointer',
    width: '30px',
    display: 'inline-block',
    textAlign: 'center',
  },
  meepEditorActiveButton: {
    color: '#8E8E8E',
  },
  meepEditorActionSelect: {
    color: '#000',
  },
  meepEditorLink: {
    cursor: 'pointer',
    color: '#3b5998',
    textDecoration: 'underline',
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
    border: '1px solid #000',
  },
  meepEditorActiveColorButton: {
    border: '2px solid #000'
  },
  meepEditorActiveColorBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 5px #ccc',
  },
  //BackgroundButton
  meepEditorActiveBackgroundBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 5px #ccc',
  },

  //FontSizeBox
  meepEditorSelectMainBox: {
    position: 'relative',
    cursor: 'pointer',
    height: '100%',
  },
  meepEditorSelectMainBoxOpen: {
    borderColor: '#437A82',
    color: '#ccc',
    zIndex: 1001,
  },
  meepEditorSelectItemBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    boxShadow: 'rgba(0,0,0,.2) 0 2px 8px',
    marginTop: '-1px',
    zIndex: 1,
    height: '130px',
    overflowY: 'auto'
  },
  meepEditorSelectBoxLabel: {
    paddingRight: '8px',
    lineHeight: '24px',
  },
  meepEditorSelectBoxIcon: {
    paddingRight: '8px',
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
    color: '#59bcc9',
  },
  meepEditorSelectItemHover: {
    color: '#000',
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
    width: '100px',
  },
})
