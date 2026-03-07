---
id: explosiveresist
title: Explosiveresist
description: Manages resistance to explosive damage over time, including accumulation and gradual decay.
tags: [combat, damage, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cb5de85b
system_scope: entity
---

# Explosiveresist

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Explosiveresist` is a component that tracks and manages a damage-resistance buffer against explosive sources. When an entity takes explosive damage, the component increases its internal `resistance` value (up to a maximum of `1.0`). The resistance then decays over time. The component supports persistence via save/load hooks and provides a debug-readable string representation of current resistance level.

It is designed to be attached to entities that should have variable resilience against explosions—such as bosses or vehicles—and integrates with the component update loop to handle decay while active.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("explosiveresist")
-- Simulate explosive damage
inst.components.explosiveresist:OnExplosiveDamage(50, nil)
-- Query current resistance
local resist = inst.components.explosiveresist:GetResistance()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `resistance` | number | `0` | Current resistance value, clamped to `[0, 1]`. |
| `maxresistdamage` | number | `TUNING.EXPLOSIVE_MAX_RESIST_DAMAGE` | Total damage required to reach maximum resistance (`resistance = 1`). |
| `decaytime` | number | `TUNING.EXPLOSIVE_RESIST_DECAY_TIME` | Time (in seconds) over which resistance fully decays once active. |
| `decaydelay` | number | `TUNING.EXPLOSIVE_RESIST_DECAY_DELAY` | Initial cooldown before decay begins after a hit. |
| `delayremaining` | number | `0` | Seconds remaining in the decay delay period. |

## Main functions
### `OnExplosiveDamage(damage, src)`
* **Description:** Processes incoming explosive damage, resetting the decay delay and increasing resistance proportionally.
* **Parameters:**  
  - `damage` (number) — Amount of explosive damage received (must be `> 0` to take effect).  
  - `src` (Entity or `nil`) — Source of the damage; currently unused internally.
* **Returns:** Nothing.

### `GetResistance()`
* **Description:** Returns the current resistance value.
* **Parameters:** None.
* **Returns:** `number` — Resistance in range `[0, 1]`.

### `SetResistance(resistance)`
* **Description:** Sets the resistance value directly (clamped to `[0, 1]`). Starts or stops the component’s update loop based on the new value.
* **Parameters:** `resistance` (number) — Desired resistance level.
* **Returns:** Nothing.

### `DoDelta(delta)`
* **Description:** Applies a delta to the current resistance (used for incremental change).
* **Parameters:** `delta` (number) — Value to add to `resistance`.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called each frame while the component is active. Handles decay after the delay period expires.
* **Parameters:** `dt` (number) — Delta time in seconds since last frame.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Prepares the component’s state for saving to disk.
* **Parameters:** None.
* **Returns:** `{ resistance = integer }` if `resistance >= 0.01`, otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores component state from saved data.
* **Parameters:** `data` (`{ resistance = number }`) — Saved resistance as a percentage (0–100).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for logging or HUD display.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Resistance: 0.75"`.

## Events & listeners
None identified
