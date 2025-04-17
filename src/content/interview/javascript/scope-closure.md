---
title: "作用域和闭包"
date: "2025-03-25"
tags: ["JavaScript", "作用域", "闭包", "变量提升"]
description: "JavaScript中的作用域和闭包概念详解"
---

# JavaScript 作用域和闭包

## 作用域（Scope）

作用域是变量和函数的可访问范围。JavaScript 中主要有以下几种作用域：

### 1. 全局作用域（Global Scope）

在最外层定义的变量和函数属于全局作用域，可以在任何地方访问：

```javascript
var globalVar = 'I am global';
const globalConst = 'I am also global';

function globalFunction() {
  console.log(globalVar); // 可以访问
}
```

### 2. 函数作用域（Function Scope）

在函数内部定义的变量只能在函数内部访问：

```javascript
function functionScope() {
  var functionVar = 'I am function scoped';
  let functionLet = 'I am also function scoped';
  
  console.log(functionVar); // 正常工作
  console.log(functionLet); // 正常工作
}

// console.log(functionVar); // ReferenceError
// console.log(functionLet); // ReferenceError
```

### 3. 块级作用域（Block Scope）

使用 `let` 和 `const` 声明的变量具有块级作用域：

```javascript
if (true) {
  let blockVar = 'I am block scoped';
  const blockConst = 'I am also block scoped';
  var notBlockScoped = 'I am function scoped';
}

// console.log(blockVar); // ReferenceError
// console.log(blockConst); // ReferenceError
console.log(notBlockScoped); // 正常工作
```

## 闭包（Closure）

闭包是函数和其周围状态（词法环境）的引用的组合。简单说，闭包允许函数访问并操作函数外部的变量。

### 1. 基本闭包示例

```javascript
function createCounter() {
  let count = 0;  // 私有变量
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
```

### 2. 实际应用场景

#### 数据私有化

```javascript
function createUser(name) {
  let _name = name;  // 私有变量
  
  return {
    getName() {
      return _name;
    },
    setName(newName) {
      _name = newName;
    }
  };
}

const user = createUser('Alice');
console.log(user.getName()); // "Alice"
user.setName('Bob');
console.log(user.getName()); // "Bob"
// console.log(_name); // ReferenceError
```

#### 函数工厂

```javascript
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2);
const multiplyByThree = multiply(3);

console.log(multiplyByTwo(5));  // 10
console.log(multiplyByThree(5)); // 15
```

## 面试常见问题

### 1. 闭包的优缺点

优点：
- 数据私有化
- 状态保持
- 模块化开发

缺点：
- 内存占用较多
- 可能造成内存泄漏
- 性能问题

### 2. 实践中的注意事项

```javascript
// 循环中的常见问题
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
} 
// 输出: 3, 3, 3

// 正确的做法
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
} 
// 输出: 0, 1, 2
```

### 3. 面试要点

1. 解释什么是闭包及其工作原理
2. 说明闭包的实际应用场景
3. 分析闭包的优缺点
4. 解释变量作用域和作用域链
5. 说明 `let`、`var` 和闭包的关系
6. 如何避免闭包导致的内存泄漏

## 代码练习

尝试实现一个带有私有变量的计数器：

```javascript
// 你的代码：
function createPrivateCounter(initialValue = 0) {
  // 实现这个函数
}

// 测试代码：
const counter = createPrivateCounter(5);
console.log(counter.getValue()); // 应该输出：5
counter.increment();
console.log(counter.getValue()); // 应该输出：6
counter.decrement();
console.log(counter.getValue()); // 应该输出：5
``` 