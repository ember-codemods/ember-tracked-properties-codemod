# ember-tracked-properties-codemod

## Usage

```
npx ember-tracked-properties-codemod path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->

- [basic-with-prefix-false](#basic-with-prefix-false)
- [basic](#basic)
- [chained-complex-computed](#chained-complex-computed)
- [chained-computed](#chained-computed)
- [complex](#complex)
- [non-computed-decorators](#non-computed-decorators)
- [with-tracked](#with-tracked)
  <!--FIXTURES_TOC_END-->

## <!--FIXTURES_CONTENT_START-->

<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](__testfixtures__/basic.input.js)</small>):

```js
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
```

**Output** (<small>[basic.output.js](__testfixtures__/basic.output.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  bar;
  @tracked baz = 'barBaz';

  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}
```

---

<a id="basic-with-prefix-false">**basic-with-prefix-false ({alwaysPrefix: `false`})**</a>

**Input** (<small>[basic-with-prefix-false.input.js](__testfixtures__/basic-with-prefix-false.input.js)</small>):

```js
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
```

**Output** (<small>[basic-with-prefix-false.output.js](__testfixtures__/basic-with-prefix-false.output.js)</small>):

```js
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
```

---

<a id="complex">**complex**</a>

**Input** (<small>[complex.input.js](__testfixtures__/complex.input.js)</small>):

```js
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
```

**Output** (<small>[complex.output.js](__testfixtures__/complex.output.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked firstName = 'Foo';
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
```

---

<a id="chained-computed">**chained-computed**</a>

**Input** (<small>[chained-computed.input.js](__testfixtures__/chained-computed.input.js)</small>):

```js
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
```

**Output** (<small>[chained-computed.output.js](__testfixtures__/chained-computed.output.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked foo = 'bar';
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
```

---

<a id="chained-complex">**chained-complex**</a>

**Input** (<small>[chained-complex-computed.input.js](__testfixtures__/chained-complex-computed.input.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddTeamComponent extends Component {
  @service team;
  @tracked teamName;
  noOfHackers;

  @computed('fooBar', 'noOfHackers')
  get isMaxExceeded() {
    return this.noOfHackers > 10;
  }

  @computed('isMaxExceeded')
  get foo() {
    return this.isMaxExceeded;
  }

  @action
  addTeam() {
    this.team.addTeamName(this.teamName);
  }
}
```

**Output** (<small>[chained-complex-computed.output.js](__testfixtures__/chained-complex-computed.output.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddTeamComponent extends Component {
  @service team;
  @tracked teamName;
  @tracked noOfHackers;

  @computed('fooBar')
  get isMaxExceeded() {
    return this.noOfHackers > 10;
  }

  @computed('isMaxExceeded')
  get foo() {
    return this.isMaxExceeded;
  }

  @action
  addTeam() {
    this.team.addTeamName(this.teamName);
  }
}
```

---

<a id="non-computed-decorators">**non-computed-decorators**</a>

**Input** (<small>[non-computed-decorators.input.js](__testfixtures__/non-computed-decorators.input.js)</small>):

```js
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class Foo extends Component {
  bar;
  // baz class property
  baz = 'barBaz';

  @alias('model.isFoo')
  isFoo;

  @computed('baz', 'isFoo')
  get bazInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'baz')}` : 'Baz';
  }

  @computed('bar', 'isFoo').readOnly()
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bab')}` : 'Bar';
  }
}
```

**Output** (<small>[non-computed-decorators.output.js](__testfixtures__/non-computed-decorators.output.js)</small>):

```js
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class Foo extends Component {
  bar;
  // baz class property
  @tracked baz = 'barBaz';

  @alias('model.isFoo')
  isFoo;

  @computed('isFoo')
  get bazInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'baz')}` : 'Baz';
  }

  @computed('bar', 'isFoo').readOnly()
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bab')}` : 'Bar';
  }
}
```

---

<a id="with-tracked">**with-tracked**</a>

**Input** (<small>[with-tracked.input.js](__testfixtures__/with-tracked.input.js)</small>):

```js
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { computed, get } from '@ember/object';

export default class Foo extends Component {
  @tracked bar;
  baz = 'barBaz';

  @computed('baz')
  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}
```

**Output** (<small>[with-tracked.output.js](__testfixtures__/with-tracked.output.js)</small>):

```js
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
```

---
