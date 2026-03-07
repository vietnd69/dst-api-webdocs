---
id: sand_spike
title: Sand Spike
description: Creates animated ground spikes and blocks that emerge from the sand, deal damage, destroy workable structures, pick plants, and transform into glass when ignited.
tags: [environment, combat, prefab]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: faeae961
system_scope: environment
---

# Sand Spike

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sand_spike.lua` file defines prefabs for dynamic ground-based hazards: sand spikes and sand blocks. These entities spawn from the terrain, remain dormant initially (`notarget`, inactive physics), and transition through several phases: activation (revealing and launching into combat mode), damage/destruction phase (attacking nearby targets and breaking workables), and finally glass transformation when ignited. The prefabs rely heavily on `health`, `combat`, `burnable`, `pickable`, `workable`, and `mine` components to interact with the world.

## Usage example
```lua
-- Spawn a random-size sand spike
local spike = SpawnPrefab("sandspike")
spike.Transform:SetPosition(x, y, z)

-- Spawn a specific-size sand spike (short/med/tall)
local spike = SpawnPrefab("sandspike_med")

-- Spawn a sand block (larger hazard)
local block = SpawnPrefab("sandblock")
block.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `burnable`, `workable`, `pickable`, `mine`, `locomotor`, `inventoryitem`, `inspectable`  
**Tags added:** `notarget`, `hostile`, `groundspike`, `object`, `stone`, `NOCLICK` (added transiently during transitions), `_combat`, `pickable`, `NPC_workable` (via `COLLAPSIBLE_TAGS`), `*_workable` (via `COLLAPSIBLE_WORK_ACTIONS`), `antlion`, `flying`, `ghost`, `shadow`, `playerghost`, `FX`, `DECOR`, `INLIMBO` (via `NON_COLLAPSIBLE_TAGS`), `_inventoryitem`, `locomotor` (via `TOSSITEM_CANT_TAGS`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spikesize` | string | `"short"`, `"med"`, or `"tall"` (random if not specified) | Size variant affecting radius, damage, and health. |
| `animname` | string | `"short"`, `"med"`, `"tall"`, or `"block"` | Animation state identifier and internal naming. |
| `spikeradius` | number | Based on `RADIUS[animname]` | Radius used for entity detection and launching. |

## Main functions
### `StartSpikeAnim(inst)`
*   **Description:** Initiates the active phase after the "pre" animation completes; removes `notarget`, enables physics, sets combat/health state, and schedules damage phase.
*   **Parameters:** `inst` (Entity) — The sand spike instance.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure conditions; relies on valid animation callbacks.

### `DoDamage(inst, OnIgnite)`
*   **Description:** Triggers post-activation damage behavior: sets a timer to destroy the spike, detects and interacts with nearby entities (workables, pickables, combat targets), and tosses inventory items.
*   **Parameters:** `inst` (Entity) — The spike instance; `OnIgnite` (function) — Ignition callback to pass to burnable component.
*   **Returns:** Nothing.

### `DoBreak(inst)`
*   **Description:** Destroys the spike by killing its health component.
*   **Parameters:** `inst` (Entity) — The spike instance.
*   **Returns:** Nothing.

### `OnDeath(inst)`
*   **Description:** Handles spike death, transitioning to break animation, removing active components (e.g., `burnable`), disabling physics, and cleaning up event callbacks.
*   **Parameters:** `inst` (Entity) — The spike instance.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Transforms the spike into glass after a delay when ignited; cancels damage timer, enables invincibility, disables combat/ignition callbacks, and switches animation to transformation sequence.
*   **Parameters:** `inst` (Entity) — The spike instance.
*   **Returns:** Nothing.

### `ChangeToGlass(inst)`
*   **Description:** Replaces the spike with its glass variant at the same position after transformation completes.
*   **Parameters:** `inst` (Entity) — The spike instance.
*   **Returns:** Nothing.

### `SpikeLaunch(inst, launcher, basespeed, startheight, startradius)`
*   **Description:** Applies physics velocity to an item (e.g., debris or inventory item) to launch it away from the spike/block.
*   **Parameters:**  
    `inst` (Entity) — Item being launched;  
    `launcher` (Entity) — The spike/block causing the launch;  
    `basespeed` (number) — Base speed scalar;  
    `startheight` (number) — Initial launch height offset;  
    `startradius` (number) — Launch offset radius.
*   **Returns:** Nothing.

### `MakeSpikeFn(shape, size)`
*   **Description:** Factory function returning a prefab constructor for sand spikes or blocks. Creates the entity, adds core components, tags, and setup logic.
*   **Parameters:**  
    `shape` (string) — `"spike"` or `"block"`;  
    `size` (string) — Optional spike size (`"short"`, `"med"`, `"tall"`).
*   **Returns:** Function — A prefab creation function (used by `Prefab()`).

## Events & listeners
- **Listens to:** `animover` — Triggers state transitions (e.g., `StartSpikeAnim`, `ChangeToObstacle`, `ChangeToGlass`, `inst.Remove` on death);  
`death` — Triggers `OnDeath`.
- **Pushes:** None directly — relies on components (e.g., `health.Kill`) to push events.

