---
id: mindcontroller
title: Mindcontroller
description: A classified entity component that tracks and manages mind control progression and duration for a target entity, primarily used by the Stalker's mind control mechanic.
tags: [combat, classified, debuff, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ca35ff4e
system_scope: entity
---

# Mindcontroller

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`Mindcontroller` is a transient, classified entity component responsible for managing the progression and duration of a mind control effect on a target entity. It acts as a controlled "debuff" attached to the victim, incrementing an internal level counter over time and stopping itself when the control expires. It integrates with the `debuff` component and synchronizes state over the network via `net_byte`. The component is instantiated and managed exclusively on the master sim, and only emits minimal logic on clients.

## Usage example
```lua
-- Typically not added manually; created by the Stalker prefab during mind control
-- This example shows conceptual usage:
local mindcontroller = SpawnPrefab("mindcontroller")
mindcontroller.components.debuff:Attach(target)
```

## Dependencies & tags
**Components used:** `debuff`, `net_byte`
**Tags:** Adds `CLASSIFIED` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_level` | net_byte | `0` | Networked level counter (0 to `MAX_LEVEL = 135`). |
| `countdown` | number | Initial value derived from `CONTROL_LEVEL` | Local tick countdown used to stop the debuff. |
| `CONTROl_LEVEL` | number (constant) | `110` | Threshold level at which mind control is considered active. |
| `EXTEND_TICKS` | number (constant) | `25` | Additional ticks added to countdown if level < `CONTROL_LEVEL`. |

## Main functions
### `OnAttached(inst, target)`
* **Description:** Callback invoked when the debuff is attached to a target entity. Parents the mindcontroller to the target and reports the target to the network component.
* **Parameters:**  
  - `inst` (Entity) — The mindcontroller entity instance.  
  - `target` (Entity) — The entity being controlled.
* **Returns:** Nothing.

### `ExtendDebuff(inst)`
* **Description:** Resets or extends the internal countdown timer based on current level. Adds extra ticks (`EXTEND_TICKS`) if the current level is below `CONTROL_LEVEL`.
* **Parameters:**  
  - `inst` (Entity) — The mindcontroller entity instance.
* **Returns:** Nothing.

### `OnUpdate(inst, ismastersim)`
* **Description:** Runs periodically to advance the mind control level, notify the target of progress, and decrement the countdown timer. Stops the debuff when the countdown expires.
* **Parameters:**  
  - `inst` (Entity) — The mindcontroller entity instance.  
  - `ismastersim` (boolean) — True when running on the master simulation (server).
* **Returns:** Nothing.
* **Error states:** Noop on clients (except level reporting via network sync). Only the master sim modifies `countdown` and calls `debuff:Stop()`.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`. Logic is driven via periodic task and `debuff` callbacks.
- **Pushes:** `mindcontrollevel` and `mindcontrolled` events on the target entity (`parent:PushEvent(...)`) during `OnUpdate`, when attached and past `CONTROL_LEVEL`, respectively.

Note: These pushed events originate from the *target* entity, not the mindcontroller itself.