---
id: fan
title: Fan
description: A component that enables an entity to perform channeling and fanning actions through configurable callback functions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 88ef0fd8
---

# Fan

## Overview
The `Fan` component allows an entity to support *fanning* and *channeling* interactions by attaching customizable callback functions to these actions. It manages the `channelingfan` tag on its host entity based on whether a channeling callback is set, and enforces optional usage restrictions via a `canusefn` callback before executing actions.

## Dependencies & Tags
- Adds/Removes the `"channelingfan"` tag on the entity when `SetOnChannelingFn` is called with a non-nil or nil function, respectively.
- No other components are explicitly added or required by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity. |
| `canusefn` | `function?` | `nil` | Optional predicate function; if present, must return `true` for use to proceed. Signature: `func(inst, target) → boolean`. |
| `onusefn` | `function?` | `nil` | Callback executed when the entity is *fanned*. Signature: `func(inst, target)`. |
| `onchannelingfn` | `function?` | `nil` | Callback executed when the entity is *channeling*. Signature: `func(inst, target)`. |
| `overridesymbol` | `string?` | `nil` | Optional symbol override (commented out in current implementation). |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Removes the `"channelingfan"` tag from the entity when the component is removed.
* **Parameters:** None.

### `SetCanUseFn(fn)`
* **Description:** Sets the optional usage predicate function used to gate both fanning and channeling actions.
* **Parameters:**  
  `fn` (`function?`) — A function of signature `(inst, target) → boolean` that returns `true` if the action is allowed.

### `SetOnUseFn(fn)`
* **Description:** Assigns the callback invoked when the entity is *fanned*.
* **Parameters:**  
  `fn` (`function?`) — A function of signature `(inst, target)` called upon successful fan action.

### `SetOnChannelingFn(fn)`
* **Description:** Assigns the callback invoked when the entity is *channeling*, and manages the `"channelingfan"` tag.
* **Parameters:**  
  `fn` (`function?`) — A function of signature `(inst, target)` called upon successful channeling. If non-nil, adds the `"channelingfan"` tag; otherwise, removes it.

### `SetOverrideSymbol(symbol)`
* **Description:** Assigns an optional symbol override (currently unused in core logic, per commented code).
* **Parameters:**  
  `symbol` (`string?`) — Symbol string to override default visual representation.

### `IsChanneling()`
* **Description:** Returns `true` if the component currently has a channeling callback assigned.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `onchannelingfn` is not `nil`.

### `Channel(target)`
* **Description:** Attempts to initiate channeling on the given target, executing `onchannelingfn` only if `canusefn` (if defined) allows it.
* **Parameters:**  
  `target` (`Entity`) — The target entity to channel.

### `Fan(target)`
* **Description:** Attempts to fan the given target, executing `onusefn` only if `canusefn` (if defined) allows it.
* **Parameters:**  
  `target` (`Entity`) — The target entity to fan.

## Events & Listeners
None.