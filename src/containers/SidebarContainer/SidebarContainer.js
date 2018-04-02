import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';

const mapStateToProps = (state, ownProps) => {
  return {
    activeTab: state.components.getIn([
      'tabs',
      state.components.get('activeTab'),
    ]),
  };
};

const GridContainer = connect(mapStateToProps)(Sidebar);

export default GridContainer;