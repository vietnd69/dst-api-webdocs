---
id: wortox_souljar
title: Wortox Souljar
description: Manages the Wortox character's soul storage jar, handling soul containment, leakage, usage display via finiteuses, and interactions like opening, closing, and hammering.
tags: [inventory, storage, player, wortox, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bf042a76
system_scope: inventory
---

# Wortox Souljar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wortox_souljar` prefab is a portable storage container unique to the Wortox character. It holds `wortox_soul` items and serves dual roles: as an inventory item and as a visual/functional display for soul storage. Internally, it leverages the `container` component for item storage and uses `finiteuses` as a display mechanism for fill percentage (not actual durability). It supports user-triggered actions (`open`, `close`, `hammer`) and auto-regressive leakage of souls when owned by ineligible characters (e.g., non-Wortox players without the skill activated). Leakage is task-driven and suspended while the jar is open or during work.

## Usage example
```lua
local inst = SpawnPrefab("wortox_souljar")
inst:AddComponent("souljar") -- Not needed; component logic is embedded in prefab fn()
inst.components.container:AddItem("wortox_soul", 5)
inst.components.container:Open() -- triggers OnOpen
inst:PushEvent("hammer") -- triggers OnWorked and may leak souls
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `waterproofer`, `container`, `finiteuses`, `workable`, `lootdropper`

**Tags added:** `portablestorage`, `souljar`, `waterproofer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `souljar_needsinit` | boolean | `true` initially | Prevents `UpdatePercent` from running before initialization completes. |
| `soulcount` | number | `0` | Current total soul count (including stacked amounts). |
| `leaksoulstask` | periodic task | `nil` | Task responsible for periodic soul leakage while the jar is closed and held by an ineligible owner. |
| `leaksoulstaskstopper` | boolean | `false` | Temporary flag preventing leakage task creation during entity removal. |
| `souljar_oldpercent` | number | `0` | Tracks previous fill percentage for client notification optimization. |

## Main functions
### `UpdatePercent()`
* **Description:** Recalculates the jar's fill percentage based on the total number of souls (stacked), updates `finiteuses`, and manages the leakage task based on ownership and state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-ops early if `souljar_needsinit` or `leaksoulstaskstopper` is true. Also no-ops during network clientside (as ` OnInit` sets `souljar_needsinit` only on master sim).

### `LeakSouls(count, fromhammered)`
* **Description:** Drops a specified number of `wortox_soul` prefabs from the container's contents at the jar’s world position. If not `fromhammered`, it may play "rattle" animation and sound if the jar is closed and unheld.
* **Parameters:** `count` (number, optional, default `1`) — number of souls to leak. `fromhammered` (boolean, default `false`) — if true, skips playback of rattle animation/sound and checks for owner.  
* **Returns:** Nothing.

### `OnOpen(inst, data)`
* **Description:** Handles opening the jar: changes image to `_open`, plays `lidoff` animation if unheld, and triggers sound. If the opener is a portal-hopping entity (e.g., during skill usage), attempts portal hop.
* **Parameters:** `inst` (Entity) — the jar instance. `data` (table) — event payload, possibly including `doer`.
* **Returns:** Nothing.

### `OnClose(inst)`
* **Description:** Handles closing the jar: restores default image, plays `lidon` animation if unheld, and triggers sound.
* **Parameters:** `inst` (Entity) — the jar instance.
* **Returns:** Nothing.

### `OnFinishWork(inst, worker)`
* **Description:** Called upon successful hammer completion: drops all items via `lootdropper`, empties container, spawns `collapse_small`, and removes the entity.
* **Parameters:** `inst` (Entity), `worker` (Entity) — the hammerer.
* **Returns:** Nothing.

### `OnWorked(inst, worker)`
* **Description:** Called on each hammer tick. Plays hit animation (variant if lid is off) and leaks `4–6` souls.
* **Parameters:** `inst` (Entity), `worker` (Entity).
* **Returns:** Nothing.

### `StopTasks(inst)`
* **Description:** Cancels the periodic leakage task and sets `leaksoulstaskstopper` to prevent new tasks during deletion.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onputininventory`, `ondropped` — triggers `UpdatePercent` on state change.
- **Listens to:** `itemget`, `itemlose` — manages stack listeners for accurate soul count updates.
- **Listens to:** `onremove` — triggers `StopTasks` to clean up leakage task.
- **Pushes:** `ms_souljar_count_changed` — fired on owner when soul count changes; includes `item`, `old`, and `count` fields.
- **Pushes (via `inventoryitem`):** `imagechange` — after `ChangeImageName`.
- **Pushes (via `lootdropper`):** `entity_droploot` — after `DropLoot`.