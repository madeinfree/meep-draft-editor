/*
  component: font-family
 */
 import React, { Component } from 'react';


export default class FontFamilyControls extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      onOpen: false
    }

    this._onOpen = () => {
      this.setState({
        onOpen: !this.state.onOpen
      })
    }

  }


  render() {
    return (
      <div>123</div>
    )

  }

}
