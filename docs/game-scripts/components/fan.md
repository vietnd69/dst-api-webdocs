---
id: fan
title: Fan
description: Provides configurable callback-based functionality for channeling and fanning actions on an entity, optionally managing the 'channelingfan' tag.
tags: [actions, channeling, callbacks]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 88ef0fd8
system_scope: entity
---

# Fan

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fan` is a lightweight component that enables an entity to perform custom fanning or channeling actions via configurable callback functions. It is designed to be attached to prefabs that require dynamic behavior when used for fanning (e.g., cooling down a player or item), with optional support for channeling states (e.g., sustained interaction). The component itself does not implement logic—it delegates behavior to externally provided functions and manages the `channelingfan` tag when a channeling function is assigned.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fan")

inst.components.fan:SetCanUseFn(function(inst, target) return target:HasTag("wet") end)
inst.components.fan:SetOnUseFn(function(inst, target) target:PushEvent("dry") end)
inst.components.fan:SetOnChannelingFn(function(inst, target) target:PushEvent("dry_tick") end)

-- Later, when used:
inst.components.fan:Fan(target)
inst.components.fan:Channel(target)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `channelingfan` on the owning entity when `SetOnChannelingFn` is called.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canusefn` | function or `nil` | `nil` | Optional predicate function `(inst, target) -> boolean` that determines whether the fan action can be used. |
| `onusefn` | function or `nil` | `nil` | Callback function `(inst, target) -> void` executed on a one-shot fan action. |
| `onchannelingfn` | function or `nil` | `nil` | Callback function `(inst, target) -> void` executed during channeling (sustained use). |
| `overridesymbol` | string or `nil` | `nil` | Optional override for the UI symbol displayed during interaction. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Lifecycle callback invoked when the component is removed from its entity. Removes the `channelingfan` tag unconditionally.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetCanUseFn(fn)`
* **Description:** Sets the predicate function used to determine if the fan action is allowed.
* **Parameters:** `fn` (function or `nil`) — a function taking `(inst, target)` and returning `true`/`false`.
* **Returns:** Nothing.

### `SetOnUseFn(fn)`
* **Description:** Sets the callback executed when performing a one-shot fan action (e.g., via `Fan:Fan()`).
* **Parameters:** `fn` (function or `nil`) — a function taking `(inst, target)` with no return value.
* **Returns:** Nothing.

### `SetOnChannelingFn(fn)`
* **Description:** Sets or clears the callback for channeling (sustained) fanning. Automatically manages the `channelingfan` tag based on whether a function is assigned.
* **Parameters:** `fn` (function or `nil`) — a function taking `(inst, target)` with no return value.
* **Returns:** Nothing.

### `SetOverrideSymbol(symbol)`
* **Description:** Sets a custom symbol to override the default UI interaction symbol during fanning/channeling.
* **Parameters:** `symbol` (string or `nil`) — a symbol string (e.g., `"fan"` or `"cool"`).
* **Returns:** Nothing.

### `IsChanneling()`
* **Description:** Returns whether the component currently has a channeling callback assigned.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `onchannelingfn` is not `nil`, otherwise `false`.

### `Channel(target)`
* **Description:** Executes the channeling callback, if present and allowed by the `canusefn` predicate.
* **Parameters:** `target` (entity instance) — the target of the channeling action.
* **Returns:** `boolean` — `true` if the channeling callback was invoked, `false` otherwise (e.g., no callback or `canusefn` returned `false`).
* **Error states:** No direct failure case, but channeling does not occur if `onchannelingfn` is `nil` or `canusefn` exists and returns `false`.

### `Fan(target)`
* **Description:** Executes the one-shot fan callback, if present and allowed by the `canusefn` predicate.
* **Parameters:** `target` (entity instance) — the target of the fan action.
* **Returns:** `boolean` — `true` if the fan callback was invoked, `false` otherwise.
* **Error states:** No direct failure case, but fanning does not occur if `onusefn` is `nil` or `canusefn` exists and returns `false`.

## Events & listeners
None identified
