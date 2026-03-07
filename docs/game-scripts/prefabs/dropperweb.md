---
id: dropperweb
title: Dropperweb
description: A spider den that slowly regenerates and spawns spider droppers, and can web nearby webbable entities over time.
tags: [combat, environment, ai, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 392f7013
system_scope: environment
---

# Dropperweb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dropperweb` is a prefab (not a standalone component) representing a spider den entity in the game. It functions as a persistent lair that gradually spawns spider dropper minions and occasionally webs nearby webbable entities (e.g., players or creatures). It integrates with the `childspawner` and `health` components for lifecycle and behavior management. It also responds to world generation settings via `WorldSettings_ChildSpawner_*` utilities.

## Usage example
```lua
-- The dropperweb is instantiated as a prefab, not added as a component manually.
local den = SpawnPrefab("dropperweb")
den.Transform:SetPosition(x, y, z)

-- Once active, it spawns spider droppers automatically over time.
-- To force immediate spawning of all pending minions:
den.components.childspawner:ReleaseAllChildren()
```

## Dependencies & tags
**Components used:** `health`, `childspawner`, `groundcreepentity`, `minimapentity`, `transform`, `network`  
**Tags added:** `cavedweller`, `spiderden`  
**Tags checked:** `webbed`, `webbable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lastwebtime` | number | `GetTime()` at spawn | Last time webbing activity occurred; used to track 1-day intervals. |
| `SummonChildren` | function | `SummonChildren` (local) | Public method to force immediate release of all available spider dropper children. |

## Main functions
### `SpawnInvestigators(inst, data)`
*   **Description:** Called when the den’s creep activates; spawns up to two spider dropper children at the den’s location and transitions them to the `dropper_enter` state. Does *not* remove the target.
*   **Parameters:** `inst` (Entity) — the dropperweb instance; `data` (table) — event data (unused except for `data.target`).
*   **Returns:** Nothing.
*   **Error states:** No effect if the `childspawner` component is missing.

### `OnEntityWake(inst)`
*   **Description:** Checks if 1 game day has passed since the last webbing event. If so, it finds unwebbed, webbable entities within range (`TUNING.MUSHTREE_WEBBED_SPIDER_RADIUS`) and converts them into `mushtree_tall_webbed` prefabs (web traps). Also updates `inst.lastwebtime`.
*   **Parameters:** `inst` (Entity) — the dropperweb instance.
*   **Returns:** Nothing.
*   **Error states:** Skips webbing if less than one day has elapsed or if `webbable` count or webbed capacity limits are exceeded.

### `OnGoHome(inst, child)`
*   **Description:** Callback executed when a spider dropper child returns to the den; drops the child’s equipped head item (e.g., hats).
*   **Parameters:** `inst` (Entity) — the dropperweb instance; `child` (Entity) — the spider returning home.
*   **Returns:** Nothing.

### `SummonChildren(inst, data)`
*   **Description:** Forces immediate release of all currently available spider dropper children if the den is alive (`health > 0`). Adds a debuff to each spawned child and transitions them to `dropper_enter`.
*   **Parameters:** `inst` (Entity) — the dropperweb instance; `data` (table) — event data (unused).
*   **Returns:** Nothing.
*   **Error states:** No effect if `childspawner` is missing or if `health:IsDead()` is `true`.

## Events & listeners
- **Listens to:** `creepactivate` — triggers `SpawnInvestigators` when an entity enters the den’s ground creep radius.
- **Pushes:** None directly. However, child spiders created via `SpawnChild` or `ReleaseAllChildren` may fire their own events during state transitions.