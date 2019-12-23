import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  bar;
  baz = 'barBaz';

  @computed('baz')
  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}
