---
id: gingerbreadpig
title: Gingerbreadpig
description: A mobile, crumb-dropping enemy prefab that chases players and eventually spawns crumb trails for the Gingerbread Hunter mini-game.
tags: [combat, ai, enemy, minigame]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d89f662
system_scope: entity
---

# Gingerbreadpig

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gingerbreadpig` is a playable enemy prefab that patrols the world, drops crumbs periodically while moving, and switches behavior based on player proximity. It is part of the Gingerbread Hunter mini-game, where it acts as a moving crumb source. When a player gets too far away after having been chased, it spawns a crumb trail leading to the Gingerbread Hunter's next objective. It uses a custom brain (`gingerbreadpigbrain`) and integrates with `locomotor`, `playerprox`, `health`, `lootdropper`, and `sleeper` components. Two prefabs are defined: `gingerbreadpig` (active) and `gingerdeadpig` (deanimated crumb source after a kill).

## Usage example
```lua
local gingerpig = SpawnPrefab("gingerbreadpig")
gingerpig.Transform:SetPosition(x, y, z)
gingerpig.components.locomotor.runspeed = 8
gingerpig.components.health:DoDelta(-1) -- triggers death and conversion to gingerdeadpig
gingerpig:StartDroppingCrumbs() -- begins periodic crumb spawning
```

## Dependencies & tags
**Components used:** `locomotor`, `playerprox`, `health`, `combat`, `lootdropper`, `inspectable`, `sleeper`  
**Tags added:** `character`, `electricdamageimmune` (active), `DECOR`, `NOCLICK` (dead)  
**Tags checked:** `idle`, `sleeping` (in `DropCrumb`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chased` | boolean | `false` | Indicates whether this entity is currently being chased by a player. |
| `player_chased_by` | entity reference | `nil` | Reference to the player who last triggered the chase. |
| `crumb_task` | task | `nil` | Periodic task for dropping crumbs; cancelled on entity removal. |
| `killtask` | task | `nil` | Delayed task to kill the entity after a specific time (reset on save/load). |

## Main functions
### `StartDroppingCrumbs(inst)`
* **Description:** Starts a periodic task (`CRUMB_SPAWN_PERIOD = 3` seconds) to drop crumbs via `DropCrumb`. Cancels any existing `crumb_task` first.
* **Parameters:** `inst` (entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** Skips crumb spawning if currently in `idle` or `sleeping` state, or if a crumb item is already nearby within radius `5`.

### `OnPlayerNear(inst, player)`
* **Description:** Event callback fired when a player enters the `playerprox` near distance. Sets `chased = true`, stores the player reference, and pushes `onplayernear` event to the state graph.
* **Parameters:**  
  - `inst` (entity) — the entity instance.  
  - `player` (entity) — the player who triggered proximity.
* **Returns:** Nothing.

### `OnPlayerFar(inst)`
* **Description:** Event callback fired when a player exits the far distance. If `chased_by_player` is true, it uses the `gingerbreadhunter` world component to generate crumb points and spawn a crumb trail. Then replaces itself with a crumb entity.
* **Parameters:** `inst` (entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** Only triggers trail generation if the world has `gingerbreadhunter` and `crumb_pts` generation succeeds; otherwise, does not spawn trail.

### `DropCrumb(inst)`
* **Description:** Spawns a single `crumbs` prefab at the entity's location with a randomized upward velocity and horizontal spread.
* **Parameters:** `inst` (entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** Skips if state graph has `idle` or `sleeping` tag, or if a crumb item already exists nearby.

## Events & listeners
- **Listens to:** `onremove` — cancels `crumb_task` and `killtask` when the entity is removed.
- **Pushes:** `onplayernear` — pushed to the state graph via `inst.sg:PushEvent("onplayernear")` when `OnPlayerNear` is invoked.