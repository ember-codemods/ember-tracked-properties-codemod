import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked
  foo = 'bar';
  baz;

  get fooBar() {
    return `Foo: ${get(this, 'foo')}`;
  }

  get fooBarDetail() {
    return `Foo bar detail: ${get(this, 'fooBar')}`;
  }

  @computed('bang')
  get fooBarDetailWithBaz() {
    return `(${get(this, 'fooBarDetail')}) ${get(this, 'baz')}`;
  }
}
