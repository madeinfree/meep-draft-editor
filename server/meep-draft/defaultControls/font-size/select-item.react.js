/*
  component: font-family
 */
import React, { Component } from 'react';

import merge from '../../lib/merge.js';
import styles from '../../draft-text.style';

 export default class SelectFamilyItem extends Component {
   constructor(props, context) {
     super(props, context);

     this.state = {
       hover: false
     }

     this.onToggle = (e) => {
       e.preventDefault();
       this.props.onToggle(this.props.style);
     }

     this._onHover = () => {
       this.setState({
         hover: true
       })
     }
     this._onLeave = () => {
       this.setState({
         hover: false
       })
     }
   }
   render() {
     return (
       <span
         style={merge(styles.meepEditorSelectItem,
                      this.state.hover?styles.meepEditorSelectItemHover:null,
                      this.props.active?styles.meepEditorActiveButton:null
                     )}
         onMouseOver={this._onHover}
         onMouseLeave={this._onLeave}
         onClick={(event)=>{
           this.onToggle(event)
           this.props.onOpen()
         }}
       >
         {this.props.size} px
       </span>
     );
   }
 }
