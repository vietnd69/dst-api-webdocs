---
id: disappears
title: Disappears
description: Manages scheduled or immediate entity removal with optional animation, sound, and pickup inhibition.
tags: [removal, animation, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dcb5fc51
system_scope: entity
---

# Disappears

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `disappears` component handles delayed or immediate removal of an entity, optionally playing a disappearance animation and sound. It can optionally prevent the entity from being picked up by updating its `inventoryitem` component. It is commonly used for temporary props, environmental effects, or consumable items that should fade out after use or expiration.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("disappears")
inst.components.disappears.delay = 5
inst.components.disappears.sound = "sparks"
inst.components.disappears.anim = "vanish"
inst.components.disappears:PrepareDisappear()
```

## Dependencies & tags
**Components used:** `inventoryitem` (accessed conditionally to modify `canbepickedup` and `canbepickedupalive`)
**Tags:** Adds `NOCLICK` when disappearing.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `delay` | number | `25` | Base delay (in seconds) before disappearance begins. |
| `disappearsFn` | function or nil | `nil` | Optional callback invoked when disappearance starts. |
| `sound` | string or nil | `nil` | Sound name to play during disappearance. |
| `anim` | string | `"disappear"` | Animation name to play before removal. |
| `disappeartask` | task or nil | `nil` | Internal scheduled task handle. |
| `tasktotime` | number or nil | `nil` | Absolute game time when disappearance should occur. |
| `isdisappear` | boolean or nil | `nil` | Flag indicating whether disappearance has been triggered. |

## Main functions
### `Disappear()`
* **Description:** Immediately triggers entity removal: stops pending tasks, calls `disappearsFn`, plays animation/sound, sets `persists = false`, adds `NOCLICK` tag, disables pickup, and schedules removal after animation completes. Also removes the entity instantly if `IsAsleep()` returns true.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `isdisappear` is already `true`.

### `StopDisappear()`
* **Description:** Cancels any pending scheduled disappearance (via `disappeartask`) and resets timing state. Does *not* revert effects already applied by `Disappear()` (e.g., tag or `canbepickedup` changes).
* **Parameters:** None.
* **Returns:** Nothing.

### `PrepareDisappear()`
* **Description:** Schedules a disappearance with a random delay: total delay = `delay + random(0,10)`. Invokes `StopDisappear()` first to clear any prior task.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug status string indicating the current state (`INACTIVE`, `ACTIVE countdown: X.XX`, or `DISAPPEAR`).
* **Parameters:** None.
* **Returns:** `string` — status message.

## Events & listeners
- **Listens to:** `animover` — fires `inst.Remove` when the disappearance animation completes.

## Notes
- `inst:Remove()` is scheduled after animation completion with a small buffer (`+0.1` seconds) to avoid premature removal if the animation is paused (e.g., off-screen).
- If `inst.components.inventoryitem` exists, `canbepickedup` and `canbepickedupalive` are both set to `false` during disappearance.
- `Disappears.OnRemoveFromEntity = Disappears.StopDisappear` ensures pending tasks are cancelled if the component is removed from the entity before disappearing.
