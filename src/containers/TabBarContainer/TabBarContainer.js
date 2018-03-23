import { connect } from 'react-redux';
import TabBar from '../../components/tabs/TabBar/TabBar';

const mapStateToProps = (state, ownProps) => {
  return {
    tabs: state.components.get('tabs'),
    activeTab: state.components.get('activeTab'),
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//   };
// };

const TabBarContainer = connect(
  mapStateToProps,
)(TabBar);

export default TabBarContainer;
