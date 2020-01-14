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

  get barBazInfo() {
    return `Bar: ${get(this, 'bar')}, Baz: ${get(this, 'baz')}`;
  }

  @(computed('isFoo').readOnly())
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bar')}` : 'Bar';
  }

  // This should not remove the 'blah' decorator since its not a computed property.
  @blah('bar')
  get barData() {
    return get(this, 'bar');
  }
}
