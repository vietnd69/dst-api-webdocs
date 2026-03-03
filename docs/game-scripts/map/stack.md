---
id: stack
title: Stack
description: A utility class implementing a generic LIFO stack data structure for storing and retrieving ordered values.
tags: [utility, data-structure, helper]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: utility
source_hash: a8ef4d4d
---
# Stack

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Stack` component provides a simple, standalone implementation of a Last-In-First-Out (LIFO) stack data structure. It is not an ECS component and is used purely as a utility helper for managing ordered collections of values in Lua code. It is typically instantiated via `Stack:Create()` and supports basic stack operations: `push`, `pop`, size query (`getn`), linear search (`find`), and debug listing (`list`).

This file is located in `map/stack.lua`, indicating it may be used in world generation or map-related scripts, though its generic nature allows use across any context where ordered value management is needed.

## Usage example
```lua
local Stack = require("map/stack")
local s = Stack:Create()

s:push("apple", "banana", "cherry")
print(s:getn()) -- 3

local item1 = s:pop()
print(item1) -- "cherry"

local a, b = s:pop(2)
print(a, b) -- "banana", "apple"

print(s:getn()) -- 0
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
The returned stack object contains only internal state and no documented public properties beyond its methods. The `_et` field holds the underlying entry table but is not intended for direct external access.

## Main functions
### `Stack:Create()`
* **Description:** Constructs and returns a new stack table with bound methods.
* **Parameters:** None.
* **Returns:** A table containing stack operations (`push`, `pop`, `getn`, `list`, `find`).
* **Error states:** None.

### `stack:push(...)`
* **Description:** Adds one or more values to the top of the stack.
* **Parameters:**
  * `...` (any, variadic): Values to push onto the stack. nil is ignored.
* **Returns:** None.
* **Error states:** Passing no arguments or only `nil` results in no modification.

### `stack:pop(num)`
* **Description:** Removes and returns up to `num` values from the top of the stack (defaults to 1).
* **Parameters:**
  * `num` (number, optional): Number of values to pop. Must be >= 1. Defaults to `1`.
* **Returns:** Up to `num` return values in LIFO order. If fewer values remain than requested, only available values are returned (fewer than `num`).
* **Error states:** If stack is empty, returns no values (not even `nil`).

### `stack:getn()`
* **Description:** Returns the current number of elements in the stack.
* **Parameters:** None.
* **Returns:** `number` — the count of stack elements.
* **Error states:** None.

### `stack:list()`
* **Description:** Prints stack contents to console for debugging, showing index and value for each entry.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `stack:find(value)`
* **Description:** Checks if `value` exists anywhere in the stack using shallow equality (`==`).
* **Parameters:**
  * `value` (any): Value to search for.
* **Returns:** `true` if found, `false` otherwise.
* **Error states:** None.

## Events & listeners
This file does not use or emit events.