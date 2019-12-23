import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  firstName = 'Foo';
  lastName;
  phone;
  zipcode;

  @computed('firstName', 'lastName')
  get fullName() {
    return `Name: ${get(this, 'firstName')} ${get(this, 'lastName')}`;
  }

  @computed('areaCode', 'phone')
  get phoneNumber() {
    return `(${get(this, 'areaCode')}) ${get(this, 'phone')}`;
  }
}
