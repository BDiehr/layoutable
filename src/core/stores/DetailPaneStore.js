import alt from '../util/alt';
import DetailPaneActions from '../actions/DetailPaneActions';

class DetailPaneStore {
  constructor() {
    this.bindListeners({
      selectPane: DetailPaneActions.selectPane,
    });

    this.state = {
      detailPane: null,
    };
  }

  selectPane(detailPane) {
    this.setState({ detailPane });
  }

}

export default alt.createStore(DetailPaneStore, 'DetailPaneStore');
