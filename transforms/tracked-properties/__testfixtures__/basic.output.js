import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  bar;
  @tracked
  baz = 'barBaz';

  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}
