---
id: atrium_gate_activatedfx
title: Atrium Gate Activatedfx
description: Renders visual and lighting effects for the activated Atrium Gate, managing animation states, network replication, and cleanup.
tags: [fx, visual, replication]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b95f159b
system_scope: fx
---

# Atrium Gate Activatedfx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`atrium_gate_activatedfx` is a visual effects prefab that provides animated, glowing FX for the Atrium Gate when it is activated. It runs as a standalone entity with animation, sound, and lighting components, and automatically associates with a parent `atrium_gate` entity on replication. It is designed to be lightweight (`persists = false`) and non-interactive (`NOCLICK`, `DECOR` tags applied during active states).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("atrium_gate_activatedfx")
inst:SetFX("overload")
-- ... later ...
inst:KillFX()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `light`, `network`
**Tags:** Adds/Removes `FX`, `DECOR`, `NOCLICK` depending on animation state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | string? | `nil` | Current animation state identifier (e.g., `"idle"`, `"overload"`). Used internally by `SetFX`. |
| `killed` | boolean | `false` | Flag indicating whether the FX has been terminated. Prevents redundant state changes. |

## Main functions
### `SetFX(anim)`
* **Description:** Switches the visual animation to the specified state (`anim`), applying appropriate pre/loop/post animations and updating tags for clickability and rendering order. Does nothing if `killed` is true or the new animation is identical to the current one.
* **Parameters:** `anim` (string) — the animation state name (e.g., `"idle"`, `"overload"`).
* **Returns:** Nothing.

### `KillFX()`
* **Description:** Triggers the post-animation (`_pst`), schedules removal of the entity after the animation completes, and marks the FX as killed. Prevents further changes via `SetFX`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityReplicated(inst)`
* **Description:** Called on the client when the entity is replicated. Adds this FX instance to the parent `atrium_gate`'s `highlightchildren` array for grouping/reference.
* **Parameters:** `inst` — the entity instance (self).
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleans up the parent's `highlightchildren` array on entity removal by removing this instance.
* **Parameters:** `inst` — the entity instance (self).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animqueueover` — triggers `inst.Remove` after the post-animation finishes in `KillFX`.
- **Pushes:** None.
- **Callback hooks:** `inst.OnRemoveEntity` and `inst.OnEntityReplicated` are assigned as entity-level callbacks; the component itself does not fire custom events.

