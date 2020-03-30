import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class Foo extends Component {
  @tracked bar;
  // baz class property
  @tracked baz = 'barBaz';

  @alias('model.isFoo')
  isFoo;

  @computed('baz', 'isFoo')
  get bazInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'baz')}` : 'Baz';
  }

  @computed('bar', 'isFoo').readOnly()
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bar')}` : 'Bar';
  }
}
