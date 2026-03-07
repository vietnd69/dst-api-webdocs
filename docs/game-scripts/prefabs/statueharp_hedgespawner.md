---
id: statueharp_hedgespawner
title: Statueharp Hedgespawner
description: Spawns decorative hedgehounds from a harp-shaped statue and manages timed_respawn of hounds after destruction.
tags: [environment, loot, event, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 634db5d2
system_scope: environment
---

# Statueharp Hedgespawner

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`statueharp_hedgespawner` is a prefab component that creates a decorative, interactable statue which spawns hedgehounds (costume items) upon destruction. It uses the `workable`, `lootdropper`, and `timer` components to handle mining, loot drops, and respawn timing. The component also integrates with the Yoth Knight system to conditionally include princess-themed costume items when the Knight Shrine event is active.

## Usage example
```lua
-- Typically created via Prefab("statueharp_hedgespawner", ...) and used as-is.
-- Example of manual event triggering for respawn:
local inst = SpawnPrefab("statueharp_hedgespawner")
inst.Transform:SetPosition(x, 0, z)
inst:PushEvent("trigger_hedge_respawn")
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `timer`, `yoth_knightmanager` (world component check)
**Tags:** `statue`, `hedgespawner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charlie_test` | boolean | `nil` | Flag to prevent duplicate hedge spawning; set on first spawn. |
| `_has_dropped_loot` | boolean | `nil` | Tracks whether loot has already been dropped after mining. |
| `_COSTUME_ITEMS` | table | `COSTUME_ITEMS` | Reference to the global list of costume pairs used for hedge drops. |

## Main functions
### `OnWorked(inst, worker, workleft)`
* **Description:** Handles post-mine animation and loot logic. Plays appropriate animation based on remaining work and triggers loot drop when fully destroyed.
* **Parameters:** 
  - `inst` (Entity) — the statue entity.
  - `worker` (Entity) — the entity performing work (may be `nil` during load).
  - `workleft` (number) — current work remaining.
* **Returns:** Nothing.
* **Error states:** Sets `workable` to `false` after full destruction; drops loot only once.

### `SpawnHedgeHounds(inst)`
* **Description:** Spawns two random hedgehounds around the statue using nearby walkable positions.
* **Parameters:** `inst` (Entity) — the statue instance.
* **Returns:** Nothing.
* **Error states:** None; uses `FindWalkableOffset` to avoid placing inside obstacles.

### `primehounds(inst)`
* **Description:** Ensures hounds are spawned only once per entity instance.
* **Parameters:** `inst` (Entity) — the statue instance.
* **Returns:** Nothing.
* **Error states:** Skips spawning if `charlie_test` flag is already set.

### `OnTimerDone(inst, data)`
* **Description:** Callback for timer expiration; triggers hedge respawn based on timer name.
* **Parameters:** 
  - `inst` (Entity) — the statue instance.
  - `data` (table) — timer data, must contain `name`.
* **Returns:** Nothing.
* **Error states:** Only responds to `"hedgerespawn"` and `"primehounds"` timers.

### `GetCostumesForHoundDrops(inst)`
* **Description:** Constructs and shuffles a list of two costume pairs (body + hat) for hound drops; includes princess items if Knight Shrine is active.
* **Parameters:** `inst` (Entity) — the statue instance.
* **Returns:** table — list of 4 prefabs: `[body1, body2, hat1, hat2]`.
* **Error states:** None; uses `shuffleArray`, which modifies input array.

## Events & listeners
- **Listens to:** `trigger_hedge_respawn` — triggers respawn of hounds immediately.
- **Listens to:** `timerdone` — handles respawn timer completion.
- **Pushes:** None (no events are fired by this component).