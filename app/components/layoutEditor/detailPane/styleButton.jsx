import React, { PropTypes } from 'react';
import LayoutActions from '../../../actions/LayoutActions';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

const propTypes = {
  display: PropTypes.any,
  actionProperty: PropTypes.any,
  actionValue: PropTypes.any,
  currentValue: PropTypes.any,
};

const StyleButton = ({display, actionProperty, actionValue, currentValue}) => {
  const classes = classNames('direction-btn-grp__btn', {
    'direction-btn-grp__btn--selected': currentValue === actionValue,
  });

  return (
    <Button
      className={classes}
      onClick={() => LayoutActions.updateItemProperty({ property: actionProperty, value: actionValue})}
      >
      {display}
    </Button>
  );
};

StyleButton.propTypes = propTypes;
export default StyleButton;
