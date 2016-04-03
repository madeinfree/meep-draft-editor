import React from 'react';

//draft-js
import Draft, {
  Entity
} from 'draft-js';

import styles from '../../draft-text.style'

const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'link'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {href} = Entity.get(props.entityKey).getData();
  return (
    <a href={href} style={styles.meepEditorLink}>
      {props.children}
    </a>
  );
};

const decorator = {
  decorators: [
    {
      strategy: findLinkEntities,
      component: Link
    }
  ]
};

export default decorator;
