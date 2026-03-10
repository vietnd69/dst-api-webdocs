---
id: metaclass
title: Metaclass
description: Provides a userdata-based class system with custom metamethod handling, enabling safe garbage collection and replacement of core Lua operations like `__gc` and `__len`.
tags: [internal, metaprogramming, system]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b64c477d
system_scope: entity
---

# Metaclass

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Metaclass` implements a class factory that constructs classes backed by Lua userdata instead of plain tables. This design allows overriding critical metamethods such as `__gc` (garbage collection) and `__len` (length), which are otherwise unavailable for tables. It is an internal infrastructure utility used to build robust, garbage-collectable class instances with fine-grained control over core operations.

## Usage example
```lua
local MyClass = MetaClass(nil, function(self, value)
    self.value = value
end)

local obj = MyClass(42)
print(obj.value)  -- 42
print(#obj)       -- uses __len if defined in class or base
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
### `MetaClass(base, _ctor)`
*   **Description:** Constructs a new class using userdata as the underlying object type. Supports inheritance via `base` and custom construction via `_ctor`.
*   **Parameters:**  
    - `base` (table or nil) — optional parent class or table of methods to copy.  
    - `_ctor` (function or nil) — optional constructor function called with `(self, ...)` when instantiating. If omitted and `base` is a function, `base` is treated as `_ctor`.  
*   **Returns:** (table) A class table that can be invoked as a constructor (e.g., `MyClass(arg)`).
*   **Error states:** None — the function always returns a valid class table.

### `c.is_a(self, klass)`
*   **Description:** Checks if an instance `self` is of class `klass` or inherits from it (inclusive of inheritance chain via `_base`).
*   **Parameters:**  
    - `self` (userdata) — instance to test.  
    - `klass` (table) — class (or base class) table to check against.  
*   **Returns:** (boolean) `true` if `self` is an instance of `klass` or descends from it; `false` otherwise.

## Events & listeners
None identified