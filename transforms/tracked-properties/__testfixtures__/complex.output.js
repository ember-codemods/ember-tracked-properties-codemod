import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked
  firstName = 'Foo';
  @tracked lastName;
  @tracked phone;
  zipcode;

  get fullName() {
    return `Name: ${get(this, 'firstName')} ${get(this, 'lastName')}`;
  }

  @computed('areaCode')
  get phoneNumber() {
    return `(${get(this, 'areaCode')}) ${get(this, 'phone')}`;
  }
}
