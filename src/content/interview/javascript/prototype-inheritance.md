---
title: "原型和继承"
date: "2024-03-20"
tags: ["JavaScript", "面试重点", "原型链"]
description: "深入理解 JavaScript 中的原型机制和继承方式"
---

# JavaScript 原型与继承完全指南

## 1. 原型基础

### 1.1 什么是原型？

在 JavaScript 中，每个对象都有一个原型对象，可以通过 `__proto__` 属性访问。对象会从原型"继承"属性和方法。

```javascript
const person = {
  name: 'John'
};

console.log(person.__proto__ === Object.prototype);  // true
console.log(person.__proto__.__proto__);            // null
```

### 1.2 构造函数、原型对象和实例的关系

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

console.log(john.__proto__ === Person.prototype);         // true
console.log(Person.prototype.constructor === Person);     // true
console.log(john instanceof Person);                      // true
```

## 2. 原型链

### 2.1 原型链查找机制

当访问一个对象的属性时，JavaScript 引擎会：
1. 先在对象自身查找该属性
2. 如果没找到，就在对象的原型上查找
3. 如果还没找到，就在原型的原型上查找
4. 直到找到该属性或到达原型链的末端（null）

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog('Rex');
console.log(dog.bark());   // "Rex barks"
console.log(dog.speak());  // "Rex makes a sound"
```

### 2.2 属性遮蔽（Property Shadowing）

```javascript
function Parent() {
  this.name = 'parent';
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child() {
  Parent.call(this);
  this.name = 'child';
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child = new Child();
console.log(child.getName());  // "child"
```

## 3. 继承的实现方式

### 3.1 原型链继承

```javascript
function Parent() {
  this.colors = ['red', 'blue'];
}

function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 问题：所有实例共享引用类型属性
const child1 = new Child();
const child2 = new Child();
child1.colors.push('green');
console.log(child2.colors);  // ['red', 'blue', 'green']
```

### 3.2 构造函数继承

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

function Child(name) {
  Parent.call(this, name);
}

// 优点：实例属性独立
// 缺点：无法继承原型方法
const child1 = new Child('child1');
const child2 = new Child('child2');
child1.colors.push('green');
console.log(child2.colors);  // ['red', 'blue']
```

### 3.3 组合继承（最常用）

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);  // 第一次调用父构造函数
  this.age = age;
}

Child.prototype = new Parent();  // 第二次调用父构造函数
Child.prototype.constructor = Child;

Child.prototype.getAge = function() {
  return this.age;
};

const child = new Child('John', 18);
console.log(child.getName());  // "John"
console.log(child.getAge());   // 18
```

### 3.4 寄生组合继承（优化版）

```javascript
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}

function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);

Child.prototype.getAge = function() {
  return this.age;
};
```

## 4. ES6 Class 继承

### 4.1 基本语法

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);  // 必须先调用 super()
  }
  
  bark() {
    return `${this.name} barks`;
  }
  
  // 重写父类方法
  speak() {
    return super.speak() + ' and barks';
  }
}

const dog = new Dog('Rex');
console.log(dog.speak());  // "Rex makes a sound and barks"
```

### 4.2 静态方法继承

```javascript
class Parent {
  static getType() {
    return 'Parent';
  }
}

class Child extends Parent {
  static getChildType() {
    return 'Child of ' + super.getType();
  }
}

console.log(Child.getType());      // "Parent"
console.log(Child.getChildType()); // "Child of Parent"
```

## 5. 实际应用场景

### 5.1 混入模式（Mixin）

```javascript
const speakerMixin = {
  speak() {
    return `${this.name} is speaking`;
  }
};

const walkerMixin = {
  walk() {
    return `${this.name} is walking`;
  }
};

function Person(name) {
  this.name = name;
}

// 混入多个功能
Object.assign(Person.prototype, speakerMixin, walkerMixin);

const person = new Person('John');
console.log(person.speak());  // "John is speaking"
console.log(person.walk());   // "John is walking"
```

### 5.2 工厂模式与原型

```javascript
function createPerson(name) {
  const personPrototype = {
    speak() {
      return `${this.name} is speaking`;
    },
    walk() {
      return `${this.name} is walking`;
    }
  };
  
  return Object.create(personPrototype, {
    name: {
      value: name,
      writable: true,
      enumerable: true
    }
  });
}

const person = createPerson('John');
console.log(person.speak());  // "John is speaking"
```

## 6. 面试常见问题

### 6.1 原型链相关

1. `prototype` vs `__proto__`
```javascript
function Person() {}
const person = new Person();

console.log(Person.prototype);           // Person 的原型对象
console.log(person.__proto__);           // 同上
console.log(Person.prototype === person.__proto__);  // true
```

2. 如何判断原型链关系
```javascript
// 方法一：instanceof
console.log([] instanceof Array);        // true
console.log([] instanceof Object);       // true

// 方法二：isPrototypeOf
console.log(Array.prototype.isPrototypeOf([]));  // true

// 方法三：getPrototypeOf
console.log(Object.getPrototypeOf([]) === Array.prototype);  // true
```

### 6.2 继承相关

1. ES5 vs ES6 继承的区别
```javascript
// ES5
function Animal() {
  this.colors = ['black', 'white'];
}
Animal.prototype.getColors = function() {
  return this.colors;
};

// ES6
class Animal {
  constructor() {
    this.colors = ['black', 'white'];
  }
  
  getColors() {
    return this.colors;
  }
}
```

主要区别：
- ES6 类不会提升，而 ES5 的函数会提升
- ES6 类内部默认严格模式
- ES6 类的方法不可枚举
- ES6 类必须使用 new 调用
- ES6 子类必须在构造函数中调用 super()

## 7. 最佳实践

1. 优先使用 ES6 class 语法
2. 避免修改内置对象的原型
3. 使用 Object.create(null) 创建无原型对象
4. 合理使用组合而非继承
5. 注意内存泄漏问题

```javascript
// 不好的实践
Array.prototype.customMethod = function() {};

// 好的实践
class CustomArray extends Array {
  customMethod() {}
}
```

记住：
1. 理解原型链的工作机制
2. 掌握不同继承方式的优缺点
3. 知道何时使用继承，何时使用组合
4. 理解 ES6 class 的特性和限制 