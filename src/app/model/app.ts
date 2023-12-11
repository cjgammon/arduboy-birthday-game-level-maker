import { makeObservable, observable, action, autorun } from "mobx";

class AppModel {
  public selectedEnemy?: number | null = null;

  constructor() {
    makeObservable(this, {
      selectedEnemy: observable,
      setSelectedEnemy: action,
    });
  }

  setSelectedEnemy(index: number | null) {
    this.selectedEnemy = index;
  }
}

export default new AppModel();
