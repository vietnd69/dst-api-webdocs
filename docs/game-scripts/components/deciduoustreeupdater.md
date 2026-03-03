---
id: deciduoustreeupdater
title: Deciduoustreeupdater
description: Manages the transformation of a deciduous tree into a hostile monster state, controlling drake spawning, root attacks, and state transitions.
tags: [combat, ai, monster, spawning, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a79ae2c2
system_scope: environment
---

# Deciduoustreeupdater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deciduoustreeupdater` orchestrates the monster phase of a deciduous tree entity in DST. When activated, it transitions the tree into a hostile state (adding the `monster` tag), periodically spawns drakes (passive and summoned), executes root-based attacks, and manages timing for spawning, duration, and state transitions. It integrates with the `combat` component to find valid targets and with `burnable` to avoid resetting during burning. It is designed specifically for deciduous tree prefabs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deciduoustreeupdater")
-- Activate monster mode after 5 seconds
inst:DoTaskInTime(5, function()
    inst.components.deciduoustreeupdater:StartMonster()
end)
-- Stop monster mode manually
inst:DoTaskInTime(30, function()
    inst.components.deciduoustreeupdater:StopMonster()
end)
```

## Dependencies & tags
**Components used:** `combat`, `burnable`  
**Tags:** Adds `"monster"` when active; removes `"monster"` on deactivation or removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `monster` | boolean | `false` | Whether the tree is currently in monster state. |
| `monster_target` | entity or `nil` | `nil` | Current selected target for root attacks and drakes. |
| `last_monster_target` | entity or `nil` | `nil` | Previous target, used to detect state changes for sway events. |
| `last_attack_time` | number | `0` | Timestamp of the last root attack spawn. |
| `root` | entity or `nil` | `nil` | Reference to the most recently spawned root spike. |
| `starttask` | task or `nil` | `nil` | Delayed task to start updating the component. |
| `drakespawntask` | task or `nil` | `nil` | Periodic task for spawning drakes during monster mode. |
| `ignitedrakespawntask` | task or `nil` | `nil` | Periodic task for spawning drakes during ignited wave. |
| `sleeptask` | task or `nil` | `nil` | Delayed task to handle entity sleep/wake transitions. |

## Main functions
### `StartMonster(starttime)`
* **Description:** Activates monster mode for the deciduous tree, sets monster duration, adds the `monster` tag, and schedules component updates.
* **Parameters:** `starttime` (number, optional) — timestamp to treat as monster start time; defaults to `GetTime()`.
* **Returns:** Nothing.
* **Error states:** No effect if already in monster mode.

### `StopMonster()`
* **Description:** Deactivates monster mode, cancels all pending tasks, removes the `monster` tag, and stops component updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main update loop. Handles monster duration expiration, spawns passive drakes, selects new targets, spawns root spikes on attack timers, and triggers sway events when target status changes.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.

### `SpawnIgniteWave()`
* **Description:** Initiates a secondary drake-spawning wave (used when the tree is ignited), spawning a randomized number of drakes over time.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if not currently in monster mode.

### `OnEntityWake()`
* **Description:** Called when the entity wakes from sleep. If `sleeptask` exists, cancels it and calls `StartMonster`; otherwise, calls `StartMonster` directly.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Called when the entity goes to sleep. Schedules `StopMonster` after 1 second via `sleeptask`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register event handlers directly).
- **Pushes:** `"sway"` — fired when monster target status changes (entered or exited) while not burning.
- **Also observes events:** `"givetarget"` — pushed onto spawned root spikes to assign target and properties.
