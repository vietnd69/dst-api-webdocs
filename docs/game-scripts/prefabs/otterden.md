---
id: otterden
title: Otterden
description: A structure that spawns and houses otters, stores loot, and reacts to player interaction or combat damage by releasing or aggroing otters.
tags: [structure, inventory, spawner, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 01e5b730
system_scope: entity
---

# Otterden

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`otterden` is a structured entity that functions as a nest for otters: it holds items in an inventory, periodically spawns otters via the `childspawner` component, and responds to external events (searching, hitting, fire, sleep/wake cycles). When searched or attacked, it releases otters to aggro the source. During winter or cavenight, spawning is paused unless forced. When destroyed, it becomes `otterden_dead`. It interacts heavily with `childspawner`, `inventory`, `lootdropper`, `searchable`, `combat`, and `health` components.

## Usage example
```lua
local den = SpawnPrefab("otterden")
den.Transform:SetPosition(pos)
-- No further setup required — components are initialized in the constructor.
-- The den will automatically spawn otters during appropriate times of day/season.
-- Players can search it to loot items and provoke otters.
```

## Dependencies & tags
**Components used:** `childspawner`, `combat`, `health`, `inventory`, `lootdropper`, `searchable`, `timer`, `burnable`, `hauntable`, `snowcovered`, `inspector`  
**Tags added:** `angry_when_rowed`, `pickable_search_str`, `soulless`, `wet`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_force_spawn` | boolean | `nil` | Temporarily overrides spawn restrictions (`CanSpawn`). |
| `_is_sleeping_inside` | boolean | `false` | Tracks whether an otter is currently sleeping inside. |
| `_pile1_showing` | boolean | `nil` | Controls visibility of the first loot pile visual layer. |
| `_pile2_showing` | boolean | `nil` | Controls visibility of the second loot pile visual layer. |
| `SLEEPING_LOOT_TIME` | number | (computed from `TUNING.AUTUMN_LENGTH`) | Interval (in seconds) between loot generation ticks during wake state in non-winter. |
| `SLEEPING_LOOT_NAME` | string | `"entitysleep_generate_loot"` | Name of the timer used to periodically add loot while awake. |
| `SLEEP_TIMER_NAME` | string | `"push_sleep_anim"` | Name of the timer used to toggle the sleeping animation on the den. |

## Main functions
### `OnGoHome(inst, child)`
* **Description:** Called when an otter returns to the den. Plays the "enter" sound, transfers otter inventory to the den (if space exists), and plays hit→idle animation sequence.
* **Parameters:** `inst` (Entity) — the den; `child` (Entity) — the returning otter.
* **Returns:** Nothing.
* **Error states:** Drops all otter items if the den's inventory is full.

### `try_generate_loot_item(inst)`
* **Description:** Attempts to add a random loot item to the den’s inventory. If full, tries to increment a stackable item instead.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** `true` if loot was successfully added, `false` otherwise.
* **Error states:** Returns `false` if inventory is full and no valid stackable loot exists.

### `OnSpawned(inst, child)`
* **Description:** Called when a new otter is spawned *outside* the den. Plays the "enter" sound.
* **Parameters:** `inst` (Entity) — the den; `child` (Entity) — the newly spawned otter.
* **Returns:** Nothing.

### `OnOccupied(inst)`
* **Description:** Marks the den as occupied and resumes the sleep-timer animation.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** Nothing.

### `OnVacate(inst)`
* **Description:** Marks the den as vacated and pauses the sleep-timer animation.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** Nothing.

### `CanSpawn(inst)`
* **Description:** Controls whether otters may be spawned. Returns `true` if spawning is forced, or if current time is neither cavenight nor winter.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** `true` if spawning is allowed, `false` otherwise.

### `OnHit(inst, attacker)`
* **Description:** Triggered when the den takes damage. Spawns one otter to aggro the attacker, plays hit animation, and emits hit sound.
* **Parameters:** `inst` (Entity) — the den; `attacker` (Entity) — source of damage.
* **Returns:** Nothing.

### `GetDenStatus(inst, viewer)`
* **Description:** Provides UI status text: `"GENERIC"` if empty, `"HAS_LOOT"` if at least one item present.
* **Parameters:** `inst` (Entity) — the den; `viewer` (Entity) — the viewer (unused).
* **Returns:** String (`"GENERIC"` or `"HAS_LOOT"`).

### `OnSearched(inst, searcher)`
* **Description:** Triggered when a player searches the den. Releases one otter to aggro the searcher, gives one item from the den to the searcher, updates visual pile layers based on inventory fullness, and disables further searching if den is now empty.
* **Parameters:** `inst` (Entity) — the den; `searcher` (Entity) — the searching player.
* **Returns:** Boolean `true` on success, or `false, "NOTHING_INSIDE"` if empty.
* **Error states:** Returns `false, "NOTHING_INSIDE"` if the inventory has no items.

### `OnIgnited(inst, source, doer)`
* **Description:** Called on fire ignition. Forces all existing otters outside to aggro the fire source, releases all remaining otters, and calls `DefaultBurnFn`.
* **Parameters:** `inst` (Entity) — the den; `source` (Entity) — igniting source; `doer` (Entity) — optional doer of ignition.
* **Returns:** Nothing.

### `OnKilled(inst, data)`
* **Description:** Handles den destruction. Releases all otters, drops loot, spawns `otterden_dead` on the same platform, and removes the entity.
* **Parameters:** `inst` (Entity) — the den; `data` (table) — event payload (includes optional `afflicter`).
* **Returns:** Nothing.

### `OnItemGet(inst, data)`
* **Description:** Triggered when an item is added to the den’s inventory. Controls pile animation visibility (`pile1`/`pile2`) based on inventory count and enables/disables searchable state.
* **Parameters:** `inst` (Entity) — the den; `data` (table) — event payload with `item` and other metadata.
* **Returns:** Nothing.

### `OnMoved(inst, mover)`
* **Description:** When the den is moved (e.g., picked up), triggers aggro for all otters outside.
* **Parameters:** `inst` (Entity) — the den; `mover` (Entity) — the mover.
* **Returns:** Nothing.

### `OnIsNightChanged(inst, isnight)`
* **Description:** Pauses spawning when night begins (cavenight or winter), resumes at day.
* **Parameters:** `inst` (Entity) — the den; `isnight` (boolean) — current night state.
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Starts the loot-generation timer for non-winter seasons and begins listening for seasonal changes.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Stops the loot-generation timer and removes seasonal listener.
* **Parameters:** `inst` (Entity) — the den.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles two timers:
  * `SLEEPING_LOOT_NAME`: periodic loot addition during wake state.
  * `SLEEP_TIMER_NAME`: toggles sleeping animation (sleep ↔ idle) if an otter is inside.
* **Parameters:** `inst` (Entity) — the den; `data.name` (string) — timer name.
* **Returns:** Nothing.
* **Error states:** Timer continues rescheduling unless `try_generate_loot_item` fails for `SLEEPING_LOOT_NAME`.

### `OnPreLoad(inst, data)`
* **Description:** Restores childspawner settings from save data using world settings.
* **Parameters:** `inst` (Entity) — the den; `data` (table) — save payload.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death`, `itemget`, `timerdone`, `onmoved`
- **Pushes:** None directly (other components may push events based on callbacks).
- **World state listeners:** `iscavenight`, `iswinter`