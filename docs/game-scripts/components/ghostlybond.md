---
id: ghostlybond
title: Ghostlybond
description: Manages the lifecycle, bonding progression, and summoning/recalling mechanics of a ghost companion entity linked to a player.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: eda01229
---

# Ghostlybond

## Overview
This component handles the core logic for a player's ghost companion—including spawning, summoning, bonding progression over time, recall, and death recovery—within the Entity Component System. It synchronizes ghost state with the player, tracks bonding level progress, and manages entity lifecycle events (e.g., summoning, recall, removal, save/load).

## Dependencies & Tags
- **Components used:**  
  - `pethealthbar` (accessed via `self.inst.components.pethealthbar`)
- **Tags added/removed dynamically:**  
  - `ghostfriend_summoned` (added when `summoned = true`, removed otherwise)  
  - `ghostfriend_notsummoned` (added when `notsummoned = true`, removed otherwise)  
- **Event listeners registered on the ghost:**  
  - `"onremove"` → `_ghost_onremove(self)`  
  - `"death"` → `_ghost_death(self)`  
- **No explicit component additions/removals on `inst`** beyond internal event callbacks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The player entity the ghost is bound to. |
| `ghost` | `Entity?` | `nil` | Reference to the spawned ghost entity. May be `nil` if not yet spawned or removed. |
| `ghost_prefab` | `string?` | `nil` | Prefab name used to spawn the ghost. |
| `bondleveltimer` | `number?` | `nil` | Accumulated time toward the next bond level. `nil` when bond level is at max (or not active). |
| `bondlevelmaxtime` | `number` | — | Time required (in seconds) to advance one bond level. Set in `Init`. |
| `paused` | `boolean` | `false` | Pauses bond-level progression when `true`. |
| `bondlevel` | `number` | `1` | Current bond level (1–3). |
| `maxbondlevel` | `number` | `3` | Maximum allowed bond level. |
| `externalbondtimemultipliers` | `SourceModifierList` | — | Tracks additive modifiers affecting bond progress rate (e.g., from items/effects). |
| `summoned` | `boolean` | `false` | Internal state flag indicating whether the ghost is currently summoned. |
| `notsummoned` | `boolean` | `false` | Internal state flag indicating whether the ghost is currently in stored/limbo state. |
| `spawnghosttask` | `Task?` | `nil` | Delayed task used to spawn the ghost after initialization (to avoid scene conflicts). |

> Note: `_ctor` is replaced by the `Class` constructor; properties are initialized in `GhostlyBond`'s function body.

## Main Functions

### `OnUpdate(dt)`
* **Description:** Advances the bond level timer by `dt` × effective multiplier. If the timer exceeds `bondlevelmaxtime`, increments the bond level and resets. Pauses if `paused` is true or `bondleveltimer` is `nil`. Called via `StartUpdatingComponent`.
* **Parameters:**  
  - `dt` *(number)* — Delta time since last frame.

### `LongUpdate(dt)`
* **Description:** Alias for `OnUpdate(dt)`—ensures bond progression updates in long updates (e.g., for consistency in certain gameplay loops).
* **Parameters:**  
  - `dt` *(number)* — Delta time.

### `SetBondTimeMultiplier(src, mult, key)`
* **Description:** Registers or updates a bond-time multiplier from an external source (e.g., a temporary effect), using a `SourceModifierList`.
* **Parameters:**  
  - `src` — Identifier for the modifier source (e.g., `"item_name"`).  
  - `mult` *(number)* — Multiplier value applied to bond progress rate.  
  - `key` — Unique key for the modifier to enable updates/removal.

### `ResumeBonding()`
* **Description:** Resumes bond-level progression by unpausing and restarting the update loop if active.
* **Parameters:** None.

### `PauseBonding()`
* **Description:** Pauses bond-level progression and stops the update loop.
* **Parameters:** None.

### `SetBondLevel(level, time, isloading)`
* **Description:** Sets the current bond level (capped at `maxbondlevel`), manages the timer, and triggers callbacks/events if the level changes. Called during loading, leveling up, or reset.
* **Parameters:**  
  - `level` *(number)* — Target bond level.  
  - `time` *(number?)* — Remaining time after leveling up (defaults to `0`).  
  - `isloading` *(boolean?)* — Whether this change occurs during save/load (affects event context).

### `Init(ghost_prefab, bond_levelup_time)`
* **Description:** Initializes the component with the ghost prefab and time per bond level. Schedules the ghost to be spawned after `0` seconds via `DoTaskInTime`.
* **Parameters:**  
  - `ghost_prefab` *(string)* — Prefab name of the ghost.  
  - `bond_levelup_time` *(number)* — Time in seconds required to advance one bond level.

### `SpawnGhost()`
* **Description:** Spawns the ghost entity, links it to the player, registers death/removal event callbacks, and resets the bond level to `1` with recall state.
* **Parameters:** None.

### `Summon(summoningitem, pos)`
* **Description:** Attempts to summon the ghost from its stored state. If successful, moves the ghost to the given world position (or player position), removes parent, triggers recision/skin updates, and sets `notsummoned = false`.
* **Parameters:**  
  - `summoningitem` *(Entity)* — The item used to summon (used for skin recision).  
  - `pos` *(Vector3?)* — Optional world position to spawn at. Defaults to player position.

### `SummonComplete()`
* **Description:** Finalizes summoning: sets `summoned = true`, `notsummoned = false`, runs callbacks, and pushes the `"ghostlybond_summoncomplete"` event.
* **Parameters:** None.

### `Recall(was_killed)`
* **Description:** Attempts to recall the ghost back to the player. If successful, marks `summoned = false`, runs callbacks (including `was_killed` status), but does *not* yet remove the ghost. Actual recall happens in `RecallComplete()`.
* **Parameters:**  
  - `was_killed` *(boolean)* — Whether the recall was triggered by the ghost’s death.

### `RecallComplete()`
* **Description:** Completes the recall process: removes ghost from the scene, parents it to the player, places it at origin, sets `notsummoned = true`, and triggers callbacks/events.
* **Parameters:** None.

### `ChangeBehaviour()`
* **Description:** Invokes a custom behavior change callback (if set), typically to switch AI behavior of the summoned ghost.
* **Parameters:** None.  
* **Returns:** *(boolean)* — Returns `false` if no callback or conditions not met; otherwise result of `changebehaviourfn`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string including ghost reference, bond level, remaining time to next level, multiplier, and paused state.
* **Parameters:** None.

## Events & Listeners
- **Events listened to (on `self.ghost`):**  
  - `"onremove"` → calls `_ghost_onremove(self)`  
  - `"death"` → calls `_ghost_death(self)`  
- **Events pushed (on `self.inst`):**  
  - `"ghostlybond_level_change"` — when bond level changes (`data.level`, `prev_level`, `ghost`, `isloading`)  
  - `"ghostlybond_summoncomplete"` — after summoning completes (`ghost`)  
  - `"ghostlybond_recallcomplete"` — after recall completes (`ghost`)  

> Note: `_ghost_onremove` nils `self.ghost` and triggers `SpawnGhost()` to re-spawn after ghost removal; `_ghost_death` sets bond level to `1` and initiates recall.