import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  foo = 'bar';
  baz;

  @computed('foo')
  get fooBar() {
    return `Foo: ${get(this, 'foo')}`;
  }

  @computed('fooBar')
  get fooBarDetail() {
    return `Foo bar detail: ${get(this, 'fooBar')}`;
  }

  @computed('fooBarDetail', 'bang')
  get fooBarDetailWithBaz() {
    return `(${get(this, 'fooBarDetail')}) ${get(this, 'baz')}`;
  }
}
