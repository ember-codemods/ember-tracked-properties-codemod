import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddTeamComponent extends Component {
  @service team;
  @tracked teamName;
  @tracked noOfHackers;

  @computed('fooBar')
  get isMaxExceeded() {
    return this.noOfHackers > 10;
  }

  @computed('isMaxExceeded')
  get foo() {
    return this.isMaxExceeded;
  }

  @action
  addTeam() {
    this.team.addTeamName(this.teamName);
  }
}
