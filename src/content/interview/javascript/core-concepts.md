---
title: "JavaScript 核心概念"
date: "2024-03-20"
tags: ["JavaScript", "面试精选"]
description: "JavaScript 面试必备知识点，包含原型链、事件循环、异步编程等核心概念"
---

# JavaScript 核心概念面试指南

## 1. 数据类型与类型检测

### 1.1 基本数据类型
JavaScript 有 8 种基本数据类型：
- number
- string
- boolean
- undefined
- null
- symbol (ES6)
- bigint (ES2020)
- object

```javascript
// 类型检测方法
console.log(typeof 42);           // 'number'
console.log(typeof '42');         // 'string'
console.log(typeof true);         // 'boolean'
console.log(typeof undefined);    // 'undefined'
console.log(typeof null);         // 'object' (这是一个历史遗留bug)
console.log(typeof Symbol());     // 'symbol'
console.log(typeof 42n);          // 'bigint'
console.log(typeof {});           // 'object'
```

### 1.2 类型转换
```javascript
// 隐式转换
console.log(1 + '2');     // '12'
console.log('1' + 2);     // '12'
console.log(1 - '2');     // -1
console.log('1' - 2);     // -1
console.log(Boolean([])); // true
console.log(!![]);        // true
console.log([] == false); // true

// 显式转换
console.log(Number('42'));    // 42
console.log(String(42));      // '42'
console.log(Boolean(0));      // false
console.log(Object(42));      // Number {42}
```

## 2. 原型与继承

### 2.1 原型链
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person('Alice');
console.log(alice.sayHello());  // "Hello, I'm Alice"

// 原型链查找过程
console.log(alice.__proto__ === Person.prototype);        // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null);         // true
```

### 2.2 继承实现
```javascript
// ES6 之前的继承
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);  // 调用父类构造函数
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// ES6 的 class 继承
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
    super(name);
  }
  
  bark() {
    return `${this.name} barks`;
  }
}
```

## 3. 作用域与闭包

### 3.1 作用域
```javascript
var globalVar = 'global';
let blockVar = 'block';

function scopeTest() {
  var functionVar = 'function';
  
  if (true) {
    let blockVar = 'inner block';
    var functionVar2 = 'function 2';
    console.log(blockVar);     // 'inner block'
  }
  
  console.log(functionVar);    // 'function'
  console.log(functionVar2);   // 'function 2'
  // console.log(blockVar);    // ReferenceError
}
```

### 3.2 闭包实例
```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
```

## 4. 异步编程

### 4.1 Promise
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve(random);
    } else {
      reject(new Error('Number too small!'));
    }
  }, 1000);
});

promise
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));

// Promise.all 示例
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => console.log(results))  // [1, 2, 3]
  .catch(error => console.error(error));
```

### 4.2 Async/Await
```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// 错误处理最佳实践
async function handleUserData() {
  try {
    const user = await fetchUserData(123);
    console.log(user);
  } catch (error) {
    // 处理错误
  }
}
```

## 5. 事件循环

### 5.1 宏任务与微任务
```javascript
console.log('1');  // 同步任务

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3');  // 微任务
  });

console.log('4');  // 同步任务

// 输出顺序：1, 4, 3, 2
```

### 5.2 实际应用
```javascript
async function loadData() {
  console.log('开始加载');  // 1
  
  setTimeout(() => {
    console.log('定时器执行');  // 4
  }, 0);
  
  await Promise.resolve();
  console.log('Promise 已完成');  // 3
  
  console.log('加载完成');  // 2
}

loadData();
```

## 6. 常见面试题解析

### 6.1 this 指向问题
```javascript
const obj = {
  name: 'object',
  sayName() {
    console.log(this.name);
  },
  sayNameArrow: () => {
    console.log(this.name);
  }
};

obj.sayName();        // 'object'
obj.sayNameArrow();   // undefined

const fn = obj.sayName;
fn();  // undefined (在全局环境调用)
```

### 6.2 防抖与节流
```javascript
// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 节流
function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

### 6.3 深拷贝实现
```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 防止循环引用
  if (hash.has(obj)) return hash.get(obj);
  
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  
  return cloneObj;
}
```

## 7. ES6+ 重要特性

### 7.1 解构与展开运算符
```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a, b, rest);  // 1, 2, [3, 4, 5]

// 对象解构
const { name, age, ...other } = { name: 'John', age: 30, city: 'NY', country: 'USA' };
console.log(name, age, other);  // 'John', 30, { city: 'NY', country: 'USA' }

// 展开运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

const obj1 = { foo: 'bar' };
const obj2 = { ...obj1, baz: 'qux' };  // { foo: 'bar', baz: 'qux' }
```

### 7.2 Map 与 Set
```javascript
// Map
const map = new Map();
map.set('key', 'value');
map.set(obj, 'value2');

// Set
const set = new Set([1, 2, 2, 3, 3]);
console.log([...set]);  // [1, 2, 3]

// WeakMap 和 WeakSet
const weakMap = new WeakMap();
let obj = { foo: 'bar' };
weakMap.set(obj, 'value');
obj = null;  // 对象可被垃圾回收
```

## 8. 性能优化

### 8.1 代码优化
```javascript
// 避免频繁操作 DOM
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const el = document.createElement('div');
  fragment.appendChild(el);
}
document.body.appendChild(fragment);

// 使用事件委托
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent);
  }
});
```

### 8.2 内存管理
```javascript
// 避免内存泄漏
function addHandler() {
  const el = document.getElementById('element');
  el.addEventListener('click', () => {
    console.log('Clicked');
  });
}

// 正确的做法
function addHandler() {
  const el = document.getElementById('element');
  const handler = () => console.log('Clicked');
  el.addEventListener('click', handler);
  
  // 清理函数
  return () => {
    el.removeEventListener('click', handler);
  };
}
```

记住，这些知识点不仅是为了应对面试，更重要的是在实际开发中能够灵活运用。建议：
1. 理解原理，而不是死记硬背
2. 多动手实践，加深理解
3. 关注最新的 JavaScript 发展动态
4. 结合实际项目经验来理解这些概念 