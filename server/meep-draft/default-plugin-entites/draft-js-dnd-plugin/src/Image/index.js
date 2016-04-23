import React, { Component } from 'react';
import Draggable from '../components/block-draggable-wrapper';
// import Alignment from '../components/block-alignment-wrapper';

class Image extends Component {
  remove = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.blockProps.onRemove(this.props.block.getKey());
  };

  render() {
    const { blockProps, block, attachButtons, theme, alignment, onDragStart, draggable } = this.props;
    const className = `${theme.get('imageWrapper')} ${theme.get(alignment || 'center')}`;
    const fixedBlockUrl = blockProps.src.split('<blockFixed>')[0];
    const image = ( blockProps.progress !== 100 ?
      <div style={{ backgroundColor: '#DEE476', width: `${ blockProps.progress }%`, border: '1px solid' }}>{' '}</div> :
      <img src={fixedBlockUrl || blockProps.url} width={`${ blockProps.progress === undefined ? 100 : blockProps.progress }%`} height="auto" className={ theme.get('image') } />
    )
    return (
        <figure
          className={ className }
          contentEditable={false}
          data-offset-key={ `${block.get('key')}-0-0` }
          onDragStart={onDragStart}
          draggable={draggable}
        >
          {image}
        </figure>
    );
  }
}

export default Draggable(Image);
