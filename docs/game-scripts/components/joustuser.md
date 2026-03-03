---
id: joustuser
title: Joustuser
description: Manages joust-specific logic and callbacks for entities capable of performing jousting actions, including edge detection and custom validation.
tags: [combat, locomotion, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6d35db8b
system_scope: locomotion
---

# Joustuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Joustuser` is a component that enables an entity to support jousting mechanics by encapsulating customizable behavior hooks (for validation and state transitions) and a core edge-detection routine. It is typically attached to entities (e.g., beefalos) that can initiate jousts and must avoid falling off the world or moving into blocked terrain during the action.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("joustuser")
inst.components.joustuser:SetCanJoustFn(function(ent) return not ent:HasTag("frozen") end)
inst.components.joustuser:SetEdgeDistance(3)
if inst.components.joustuser:CheckEdge() then
    -- Entity is near an edge at multiple angles; may abort joust
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `edgedistance` | number | `2` | Distance from the entity's center used to sample the terrain for edge detection. |
| `canjoustfn` | function? | `nil` | Optional callback that takes the entity instance and returns a truthy value if jousting should proceed. |
| `onstartjoustfn` | function? | `nil` | Optional callback executed when jousting starts. |
| `onendjoustfn` | function? | `nil` | Optional callback executed when jousting ends. |

## Main functions
### `SetCanJoustFn(fn)`
* **Description:** Assigns a custom function to determine whether jousting is allowed. This function is called before initiating a joust and may return `nil` (allow) or any truthy value (block, e.g., a reason string).
* **Parameters:** `fn` (function) — a function accepting `inst` (the entity) and returning `nil` (allow) or a blocking reason.
* **Returns:** Nothing.

### `CanJoust()`
* **Description:** Invokes the configured `canjoustfn`, if present. Returns `true` if no function is set or if the function returns `nil`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if jousting is permitted; `false` otherwise.

### `SetOnStartJoustFn(fn)`
* **Description:** Sets the callback executed at the start of a joust action.
* **Parameters:** `fn` (function) — a function accepting `inst` (the entity).
* **Returns:** Nothing.

### `StartJoust()`
* **Description:** Executes the configured start callback, if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOnEndJoustFn(fn)`
* **Description:** Sets the callback executed at the end of a joust action.
* **Parameters:** `fn` (function) — a function accepting `inst` (the entity).
* **Returns:** Nothing.

### `EndJoust()`
* **Description:** Executes the configured end callback, if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckEdge()`
* **Description:** Checks for impassable terrain or void at three points (center, ±30° rotation) in front of the entity using the configured `edgedistance`. Returns `true` only if all three points indicate edge conditions (either above air or blocked ground).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if an edge or obstacle is detected in all sampled directions; `false` otherwise.

### `SetEdgeDistance(distance)`
* **Description:** Updates the sampling distance used for edge detection.
* **Parameters:** `distance` (number) — new edge-check radius.
* **Returns:** Nothing.

## Events & listeners
None identified
