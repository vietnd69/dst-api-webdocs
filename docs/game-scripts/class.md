---
id: class
title: Class
description: Provides a lightweight object-oriented programming framework with support for class inheritance, property setters, and read-only properties.
tags: [oop, utility, base]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 54cf8ca7
system_scope: entity
---

# Class

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`class.lua` implements a minimal metaprogramming-based OOP system for Lua 5.1, enabling class-based inheritance, property access control (read-only, setters), and optional runtime instance tracking. It serves as the foundational abstraction for defining entities, components, and other structured data models throughout the DST codebase. The system uses metatables to provide prototype-style behavior with class semantics, including support for hot-reloading via `ReloadedClass`.

## Usage example
```lua
local Point = Class(
    nil,
    function(self, x, y)
        self.x = x or 0
        self.y = y or 0
    end,
    { x = nil, y = nil }
)

local p = Point(3, 4)
print(p.x, p.y) -- 3, 4

makeReadonly(p, "x")
p.x = 10 -- assertion fails with "Cannot change read only property"
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `Class(base, _ctor, props)`
*   **Description:** Creates and returns a new class table. Accepts an optional base class, constructor function, and a property specification table. When `props` is provided, the class supports read-only properties and custom setters.
*   **Parameters:**
    *   `base` (table or nil) – the parent class (shallow-copy inheritance).
    *   `_ctor` (function or nil) – the constructor function, called on instantiation as `class._ctor(instance, ...)`.
    *   `props` (table or nil) – a table of initial property definitions; keys are property names, values are setter functions (or `nil` for read-only defaults).
*   **Returns:** A class table usable as a callable constructor.
*   **Error states:** If `props` is non-nil but `_` (internal storage) cannot be initialized, assertions will fail.

### `makereadonly(t, k)`
*   **Description:** Converts a property `k` on class/table `t` into a read-only property.
*   **Parameters:**
    *   `t` (table) – the class or instance table.
    *   `k` (string or number) – the property key to make read-only.
*   **Returns:** Nothing.
*   **Error states:** Fails with assertion if `t` lacks internal property storage (`_[k] == nil` and no prior definition).

### `addsetter(t, k, fn)`
*   **Description:** Attaches a custom setter function `fn` to property `k`, invoked on any subsequent assignment.
*   **Parameters:**
    *   `t` (table) – the class or instance table.
    *   `k` (string or number) – the property key.
    *   `fn` (function) – setter callback with signature `fn(instance, newValue, oldValue)`.
*   **Returns:** Nothing.
*   **Error states:** Fails with assertion if `t` lacks internal property storage.

### `removesetter(t, k)`
*   **Description:** Removes any attached setter and restores the property to a plain data member.
*   **Parameters:**
    *   `t` (table) – the class or instance table.
    *   `k` (string or number) – the property key.
*   **Returns:** Nothing.

### `ReloadedClass(mt)`
*   **Description:** Removes the class table `mt` from the global `ClassRegistry`, used primarily during hot-reload to avoid stale registry entries.
*   **Parameters:** `mt` (table) – the class metatable (i.e., the class table).
*   **Returns:** Nothing.

### `HandleClassInstanceTracking()`
*   **Description:** Periodically dumps top class instance counts to console for leak detection (only active when `TrackClassInstances == true`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only operates when `TrackClassInstances == true` and `CWD` is defined.

### `is_a(self, klass)`
*   **Description:** Internal helper (added to class tables) that checks if `self` is an instance descending from `klass`.
*   **Parameters:**
    *   `self` (table) – an object instance.
    *   `klass` (table) – a class table.
*   **Returns:** `true` if `self` inherits from `klass`, otherwise `false`.

### `is_instance(obj)`
*   **Description:** Returns `true` if `obj` is an instance of the class (i.e., created via `Class()`).
*   **Parameters:** `obj` (any) – value to check.
*   **Returns:** `boolean`.

### `is_class(self)`
*   **Description:** Returns `true` if `self` is a class (not an instance).
*   **Parameters:** `self` (table) – typically a class table.
*   **Returns:** `boolean`.

## Events & listeners
None identified.
