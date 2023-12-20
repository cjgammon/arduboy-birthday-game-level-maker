import { makeObservable, observable, action } from "mobx";

class AppModel {
  public selectedEnemy?: number | null = null;
  public selectedCoin?: number | null = null;

  constructor() {
    makeObservable(this, {
      selectedCoin: observable,
      selectedEnemy: observable,
      setSelectedEnemy: action,
      setSelectedCoin: action,
    });
  }

  setSelectedEnemy(index: number | null) {
    this.selectedCoin = null;
    this.selectedEnemy = index;
  }

  setSelectedCoin(index: number | null) {
    this.selectedEnemy = null;
    this.selectedCoin = index;
  }
}

export default new AppModel();
