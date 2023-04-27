import Component from '@glimmer/component';
import { computed } from '@ember/object';

export default class Foo extends Component {
  @computed('args.foo')
  get bazInfo() {
    return this.args.foo ?? 1;
  }

  @computed('args.no.nested')
  get noNested() {
    return this.args.no.nested ?? 2;
  }

  @computed('args.{x,y,z}')
  get braceExpansion() {
    return this.args.x + this.args.y + this.args.z;
  }
}
