import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SelectedComponentEditor.css';

function handleNameKeyDown(e) {
  e.nativeEvent.stopImmediatePropagation();
}

class SelectedComponentEditor extends React.Component {
  static propTypes = {
    selectedComponents: PropTypes.object.isRequired,
    // parents: PropTypes.object.isRequired,
    updateComponentName: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.handleNameKeyDown = handleNameKeyDown.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  getComponentTotalString() {
    const total = this.props.selectedComponents.size;
    if (total === 0) {
      return 'No components selected';
    } else if (total === 1) {
      return '1 component selected';
    }
    return `${total} components selected`;
  }

  handleNameChange(e) {
    e.stopPropagation();
    this.props.updateComponentName(
      this.props.selectedComponents.keySeq().first(),
      e.target.value,
    );
  }

  renderComponentDetails() {
    if (this.props.selectedComponents.size === 1) {
      return (
        <div className={s['details-table']}>
          <div className={s['details-table-column']}>
            <span>Type</span>
            <span>Name</span>
          </div>
          <div className={s['details-table-column']}>
            {this.props.selectedComponents.first().get('type')}
            <input
              type="text"
              value={this.props.selectedComponents.first().get('name')}
              onKeyDown={this.handleNameKeyDown}
              onChange={this.handleNameChange}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className={s.root}>
        {this.renderComponentDetails()}
        <div className={s['total-display']}>{this.getComponentTotalString()}</div>
      </div>
    );
  }
}

export default withStyles(s)(SelectedComponentEditor);
