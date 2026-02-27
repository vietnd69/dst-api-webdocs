---
id: poppable
title: Poppable
description: Provides a toggleable state to mark an entity as 'popped' and optionally execute a callback function when popped for the first time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 45373639
---

# Poppable

## Overview
The `Poppable` component allows an entity to be marked as "popped" exactly once. When `Pop()` is called for the first time, it sets an internal `popped` flag to `true` and, if configured, executes an optional callback function (`onpopfn`) passed during initialization. It is a lightweight utility for one-time state transitions.

## Dependencies & Tags
- **Component Usage:** None — this component has no runtime dependencies on other components.
- **Tags:** None are added or removed.

## Properties
The `_ctor` constructor does not initialize any public properties beyond `self.inst`. All key state variables (`popped`, `onpopfn`) are commented out in the constructor, indicating they are intentionally not initialized by default and are only used conditionally or externally.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned on construction) | Reference to the entity the component is attached to. |
| `popped` | `boolean` | *undefined* | Internal state flag indicating whether `Pop()` has been called. *Not initialized in constructor.* |
| `onpopfn` | `function?` | `nil` | Optional callback function to invoke on the first call to `Pop()`. *Commented out and never initialized in the constructor.* |

## Main Functions

### `Pop()`
* **Description:** Marks the entity as popped and, if not already popped, executes the `onpopfn` callback (if defined). If called again after being popped, it does nothing.
* **Parameters:** None.

## Events & Listeners
None — this component does not listen for or dispatch any events.