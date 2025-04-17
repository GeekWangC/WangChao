---
title: "变量和数据类型"
date: "2025-03-25"
tags: ["JavaScript", "基础概念", "变量", "数据类型"]
description: "JavaScript中的变量声明和数据类型详解"
---

# JavaScript 变量和数据类型

## 变量声明

在 JavaScript 中，我们可以使用 `var`、`let` 和 `const` 来声明变量：

```javascript
// var - 函数作用域
var name = 'John';

// let - 块级作用域
let age = 25;

// const - 常量，不可重新赋值
const PI = 3.14159;
```

### var 和 let 的区别

1. 作用域
   - `var` 是函数作用域
   - `let` 是块级作用域

2. 变量提升
   - `var` 存在变量提升
   - `let` 不存在变量提升

## 数据类型

JavaScript 有以下基本数据类型：

1. **Number**
   ```javascript
   let num = 42;
   let float = 3.14;
   ```

2. **String**
   ```javascript
   let str = 'Hello';
   let str2 = "World";
   let template = `Template literal: ${str}`;
   ```

3. **Boolean**
   ```javascript
   let isTrue = true;
   let isFalse = false;
   ```

4. **Null & Undefined**
   ```javascript
   let empty = null;
   let notDefined = undefined;
   ```

5. **Symbol** (ES6)
   ```javascript
   const symbol = Symbol('description');
   ```

6. **BigInt** (ES2020)
   ```javascript
   const bigInt = 9007199254740991n;
   ```

### 引用类型

1. **Object**
   ```javascript
   const person = {
     name: 'John',
     age: 30
   };
   ```

2. **Array**
   ```javascript
   const numbers = [1, 2, 3, 4, 5];
   ```

## 类型检查

使用 `typeof` 操作符：

```javascript
typeof 42; // "number"
typeof "Hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (这是一个历史遗留的bug)
typeof {}; // "object"
typeof []; // "object"
typeof Symbol(); // "symbol"
```

## 面试要点

1. 说明 `var`、`let` 和 `const` 的区别
2. 解释变量提升（Hoisting）
3. 说明 `null` 和 `undefined` 的区别
4. 解释为什么 `typeof null` 返回 "object"
5. 说明基本类型和引用类型的区别 