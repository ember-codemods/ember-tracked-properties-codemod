import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked bar;
  @tracked baz = 'barBaz';

  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}
