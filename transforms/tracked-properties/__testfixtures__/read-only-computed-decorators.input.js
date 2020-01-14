import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class Foo extends Component {
  bar;
  // baz class property
  baz = 'barBaz';

  @alias('model.isFoo')
  isFoo;

  @computed('baz', 'bar')
  get barBazInfo() {
    return `Bar: ${get(this, 'bar')}, Baz: ${get(this, 'baz')}`;
  }

  @(computed('bar', 'isFoo').readOnly())
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bar')}` : 'Bar';
  }

  // This should not remove the 'blah' decorator since its not a computed property.
  @blah('bar')
  get barData() {
    return get(this, 'bar');
  }
}
