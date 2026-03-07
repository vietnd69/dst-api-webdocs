---
id: gravestone
title: Gravestone
description: Manages the lifecycle, haunting mechanics, and ghost spawning behavior of a grave in the world, including seasonal flower decoration and upgrade stages.
tags: [grave, ghost, haunt, decoration, upgrade]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 84fd1c5e
system_scope: world
---

# Gravestone

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gravestone` is a prefab that represents an in-world grave marker. It supports multiple upgrade stages (undecorated → decorated with petals → final stage), interacts with the haunt system to update epitaphs and haunt values, spawns small ghosts periodically under specific conditions, and coordinates with the `decoratedgrave_ghostmanager` and `hauntable` components. It also handles saving/loading of buried mound data, custom epitaphs, stone variants, and ghost entity linkage. The system is primarily active on the master simulation.

## Usage example
```lua
-- Spawning a default gravestone prefab (handled internally by DST)
local inst = SpawnPrefab("gravestone")
inst.Transform:SetPosition(x, y, z)

-- Upgrading via decoration (handled automatically by upgradeable component)
-- No direct calls needed; decoration occurs when a player interacts with the grave
-- while holding petals or equivalent upgrade items.

-- Custom epitaph (typically set via tile editor or dug grave instance)
inst.components.inspectable:SetDescription("'A loving memory'")
```

## Dependencies & tags
**Components used:** `gravediggable`, `hauntable`, `inspectable`, `inventoryitem`, `timer`, `upgradeable`, `decoratedgrave_ghostmanager`, `skilltreeupdater`, `combat` (indirect, via `AllPlayers` checks), `luck` (indirect, via `GetEntityLuckChance`).  
**Tags added:** `grave`, `gravediggable`.  
**Tags checked:** `ghostlyfriend`, `questing`, `ghostkid`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `random_stone_choice` | string | `"1"`–`"4"` (random) | Identifier for the gravestone visual variant (used for animation and inventory image). |
| `mound` | Entity | `nil` (created in constructor) | The buried mound entity linked to the grave; removed on dig up. |
| `ghost` | Entity | `nil` | Reference to the smallghost entity spawned on this grave; linked via `LinkToHome`. |
| `setepitaph` | string | `nil` | Custom epitaph string (set via tile editor). |
| `_epitaph_index` | number | `1`–`#STRINGS.EPITAPHS` (random) | Index into `STRINGS.EPITAPHS` for the default epitaph. |
| `scrapbook_anim` | string | `"grave1"` / `"dug_grave1"` | Animation name used for scrapbook icons. |
| `scrapbook_hide` | table | `{ "flower" }` | Layers hidden in scrapbook view. |

## Main functions
### `on_day_change(inst)`
* **Description:** Attempts to spawn a `smallghost` once per day if the grave has no ghost and no nearby ghost is blocking. Spawning chance increases with `ghostlyfriend` players and Wendy's `smallghost_1` skill.
* **Parameters:** `inst` (Entity) — the gravestone instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `AllPlayers` is empty or if a ghost already exists within range (`TUNING.UNIQUE_SMALLGHOST_DISTANCE`).

### `OnHaunt(inst)`
* **Description:** Updates the haunt value and epitaph upon haunting. If not a custom epitaph (`setepitaph`), randomly picks a new epitaph distinct from the current one and sets haunt value to `TUNING.HAUNT_SMALL`; otherwise sets to `TUNING.HAUNT_TINY`.
* **Parameters:** `inst` (Entity).
* **Returns:** `true` (always).
* **Error states:** Rarely, if all epitaphs match the current one, defaults to the last epitaph in `STRINGS.EPITAPHS`.

### `OnDugUp(inst, tool, worker)`
* **Description:** Handles the transition when the grave is dug up. Triggers FX, removes the `gravediggable` component, plays slide animation, schedules self-removal, and erodes the mound.
* **Parameters:**  
  - `inst` (Entity)  
  - `tool` (Entity)  
  - `worker` (Entity)  
* **Returns:** `true`.

### `OnDecorated(inst)`
* **Description:** Triggered when the grave reaches the decorated stage (stage > 1). Plays FX, sets up flower-related timers (`petal_decay`, `try_evil_flower`), and registers the grave with `decoratedgrave_ghostmanager`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `try_evil_flower(inst)`
* **Description:** Attempts to spawn an `flower_evil` nearby if winter is not active and below the configured petal count threshold (`TUNING.WENDYSKILL_GRAVESTONE_EVILFLOWERCOUNT`).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `initiate_flower_state(inst)`
* **Description:** Enables flower animation layer, starts petal decay and evil flower timers, and registers with ghost manager. Called during initial decoration and load.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Callback for timer expiration. Handles petal decay (advances upgrade stage) and evil flower spawning/re-arming.
* **Parameters:**  
  - `inst` (Entity)  
  - `data` (table) — contains `name` of the timer (`"petal_decay"` or `"try_evil_flower"`)  
* **Returns:** Nothing.

### `SetStoneType(inst, stone_type)`
* **Description:** Helper for `dug_gravestone` prefab; updates animation and inventory image based on stone type index.
* **Parameters:**  
  - `inst` (Entity)  
  - `stone_type` (number or nil) — stone variant (`1`–`4`). Defaults to random if `nil`.  
* **Returns:** Nothing.

### `SetDugEpitaph(inst, index, setstring)`
* **Description:** Helper for `dug_gravestone`; sets the epitaph either by index or custom string.
* **Parameters:**  
  - `inst` (Entity)  
  - `index` (number or nil) — index into `STRINGS.EPITAPHS`.  
  - `setstring` (string or nil) — custom epitaph string. If both are `nil`, uses random.  
* **Returns:** Nothing.

### `OnDugDeployed(inst, pt, deployer)`
* **Description:** Deploys a new full `gravestone` from a `dug_gravestone` item. Copies epitaph, stone type, and mound state; plays placement animation and sound.
* **Parameters:**  
  - `inst` (Entity, `dug_gravestone`)  
  - `pt` (Vector3) — placement position.  
  - `deployer` (Entity) — player/entity placing the grave.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` (via `inst:ListenForEvent`) — triggers `OnTimerDone`.  
  - `cycles` (via `inst:WatchWorldState`) — triggers `on_day_change`.  
- **Pushes:** None directly. Relies on component events (`hauntable`, `upgradeable`) for inter-component signaling.