---
id: watersource
title: Watersource
description: Manages the availability state of a water source entity and toggles the 'watersource' tag accordingly.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9b6d52a3
---

# Watersource

## Overview
This component tracks whether an entity qualifies as a water source and dynamically maintains the `watersource` tag on the entity based on its availability. It provides a simple interface to mark the source as used (via the `Use()` method) and ensures tag consistency when the component is attached or removed.

## Dependencies & Tags
- **Tags used/managed:** `watersource`  
  - Adds the tag when `available` is `true`.  
  - Removes the tag when `available` is `false` or when the component is removed from the entity.  
- **Dependencies:** None identified.

## Properties
| Property     | Type     | Default Value | Description |
|--------------|----------|---------------|-------------|
| `available`  | `boolean`| `true`        | Indicates whether the water source is currently available. Controls the presence of the `watersource` tag. |
| `onusefn`    | `function?` | `nil`       | Optional callback function invoked when `Use()` is called. Not initialized in `_ctor` but supported via external assignment. |
| `override_fill_uses` | `number?` | `nil`   | Reserved for future use; used by fillable items (e.g., `wateringcan`) to specify partial-fill behavior. Not used internally by this component. |

## Main Functions
### `Use()`
* **Description:** Invokes the optional `onusefn` callback (if set) when the water source is consumed or interacted with.  
* **Parameters:** None.

## Events & Listeners
- Listens to internal property updates via the `available` function (passed to `Class` as a property setter), which automatically triggers `onavailable(self, available)` when `self.available` is assigned.  
- Does not push or listen to any game events via `inst:ListenForEvent` or `inst:PushEvent`.