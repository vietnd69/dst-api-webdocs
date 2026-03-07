---
id: junk_pile_big
title: Junk Pile Big
description: Manages a large, interactive junk pile that can be rummaged by players or mobs to yield loot, trigger daywalker encounters, and spawn a fence blueprint after repeated interaction.
tags: [loot, event, boss, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bd5ceab0
system_scope: environment
---

# Junk Pile Big

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`junk_pile_big` is a large, fixed environmental object that serves as a dynamic resource node in the game world. It supports multiple interaction states — idle, being rummaged (with ambient sound and animation), and hosting a buried `daywalker2` boss or a `junk_pile_blueprint`. The component orchestrates loot distribution, daywalker summoning/respawn logic, and blueprint generation based on scavenge counts. It is used exclusively in Wagstaff-themed ruins and is tightly integrated with the `forestdaywalkerspawner` and `moonstormmanager` systems.

Key interactions include:
- Rummaging triggers picking sounds, animation loops, and may summon a buried `daywalker2`.
- Daywalker emergence and defeat progression is managed via `daywalker_state`.
- After accumulating enough scavenge counts (`TUNING.RUMMAGE_COUNT_FOR_FENCE_BLUEPRINT`), a fence blueprint is spawned.
- Entity sleep/wake events control the periodic shaking timer.

The component uses several child entities: `junk_pile_side` (4 decorative sides), `daywalker2` (when buried), and `junk_pile_blueprint` (temporary loot item).

## Usage example
```lua
local inst = SpawnPrefab("junk_pile_big")
inst.Transform:SetPosition(x, y, z)
inst.components.pickable:SetUp(nil, 0) -- Pre-init for picking
inst.components.workable:SetOnWorkCallback(OnWork) -- Optional override
```

## Dependencies & tags
**Components used:** `health`, `inspectable`, `inventory`, `moonstormmanager`, `pickable`, `pointofinterest`, `timer`, `workable`, `lootdropper`, `forestdaywalkerspawner`

**Tags added on instance:**
- `junk_pile_big`
- `pickable_rummage_str`
- `NPC_workable`
- `noquickpick`
- `event_trigger`

**Child tags:**
- `junk_pile_side`: `FX`, `junk_pile`
- `junk_pile_blueprint`: `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sides` | table | `nil` | Array of 4 `junk_pile_side` entities representing the pile's sides. |
| `variations` | number | `nil` | Bitfield determining side animation variation (`1` or `2`). |
| `daywalker_side` | number or `nil` | `nil` | Index of side where a buried daywalker is anchored (`1`–`4`) or `nil`. |
| `daywalker_state` | number or `nil` | `nil` | Progression of daywalker emergence: `1` = buried, `2` = partially emerged, `nil` = not present. |
| `daywalker` | Entity or `nil` | `nil` | Reference to the currently active `daywalker2` entity. |
| `_pickers` | table | `nil` | Map of picker entities to their callback metadata while rummaging. |
| `_pickingloop` | boolean | `nil` | `true` if picking animation loop is active. |
| `_mobloop` | boolean | `nil` | `true` if any picker is a `junkmob`. |
| `fence_scavenge_count` | number or `nil` | `nil` | Count of successful scavenge actions toward blueprint spawn threshold. |
| `blueprint` | Entity or `nil` | `nil` | Reference to active `junk_pile_blueprint` entity. |
| `hascannon` | boolean | `nil` | `true` if the moonstorm has killed at least one celestial champion. |
| `shaketask` | Task or `nil` | `nil` | Scheduled repeating task that triggers `shake` events. |
| `highlightchildren` | table | `{}` | List of child entities (sides, blueprint) to highlight in editor/UI. |

## Main functions
### `SpawnLoot(inst, digger, nopickup)`
*   **Description:** Spawns junk loot from the pile using shared logic from `junk_pile_common.lua`. Called when the pile is successfully rummaged.
*   **Parameters:**
    *   `digger` (Entity) – Entity performing the rummage.
    *   `nopickup` (boolean) – If `true`, loot is spawned but not immediately collectible.
*   **Returns:** Nothing.
*   **Error states:** Delegates to `junk_common.SpawnJunkLoot`; no side effects if `digger` is `nil`.

### `SpawnBlueprintLoot(inst)`
*   **Description:** Spawns a `fence_electric_item_blueprint` and launches it away from the pile using `Launch2`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onpickedfn(inst, picker, loot)`
*   **Description:** Core handler invoked when the pile is picked/rummaged. Manages daywalker state transitions, loot drops, and blueprint generation.
*   **Parameters:**
    *   `inst` (Entity) – The junk pile instance.
    *   `picker` (Entity) – Entity performing the action (often a player or `junkmob`).
    *   `loot` – Loot data passed by pickable system (unused).
*   **Returns:** Nothing.
*   **Error states:** May skip processing if daywalker state changed mid-rummage (race condition). Does not drop loot if `loot_spawn_cd` timer is running.

### `startpickingloop(inst)`
*   **Description:** Starts the rummage loop animation and sound (e.g., `rummage_lp`). Plays per-side animations if sides exist.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `stoppickingloop(inst)`
*   **Description:** Ends the rummage loop, kills sound, and resets animations to idle states.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoReleaseDaywalker(inst)`
*   **Description:** Releases the buried `daywalker` from the pile, teleports it to a safe exit position, triggers knockback on nearby entities, and spawns a new fence blueprint.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `set_variations(inst, variations)`
*   **Description:** Sets the visual variation (`1` or `2`) for each side based on a bitfield. Updates side animations accordingly.
*   **Parameters:**
    *   `variations` (number) – 4-bit bitfield (default: random `0`–`15`). Least significant bit controls first side, etc.
*   **Returns:** Nothing.

### `spawn_daywalker(inst, side, state)`
*   **Description:** Spawns or hides a `daywalker2` at the specified side position, sets burial state, and adjusts animation.
*   **Parameters:**
    *   `side` (number) – Index (`1`–`4`) of side where to spawn/anchor daywalker.
    *   `state` (number or `nil`) – `1` = fully buried, `2` = partially emerged, `nil` = release existing daywalker.
*   **Returns:** Nothing.

### `ResetFenceBP(inst)`
*   **Description:** Spawns and attaches a `junk_pile_blueprint` as a child, plays pre/loop animations, and adds it to `highlightchildren`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearFenceBP(inst)`
*   **Description:** Removes the blueprint entity, plays its post-animation, and clears references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CanBuryDaywalker(inst, daywalker)`
*   **Description:** Returns `true` if the pile currently has a pending side slot (`daywalker_side` set) and no active daywalker.
*   **Parameters:**
    *   `daywalker` (Entity) – Daywalker instance attempting to be buried.
*   **Returns:** `boolean`.

### `TryBuryDaywalker(inst, daywalker)`
*   **Description:** Attempts to bury the given daywalker in the pile. Returns `true` on success.
*   **Parameters:**
    *   `daywalker` (Entity) – Daywalker to bury.
*   **Returns:** `boolean` – `true` if buried, `false` if pile is full or side is invalid.

### `TryReleaseDaywalker(inst, daywalker)`
*   **Description:** If the given daywalker is currently active, releases it via `DoReleaseDaywalker`.
*   **Parameters:**
    *   `daywalker` (Entity) – Daywalker to release.
*   **Returns:** `boolean` – `true` if released.

### `GetStatus(inst)`
*   **Description:** Returns `"BLUEPRINT"` if a fence blueprint is currently spawned; otherwise `nil`.
*   **Parameters:** None.
*   **Returns:** `string` or `nil`.

### `Shaker(inst)`
*   **Description:** Fires a `shake` event and schedules the next shake after a randomized interval (5–9 seconds).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateShaker(inst)`
*   **Description:** If no daywalker is buried, starts the shake timer if `forestdaywalkerspawner:ShouldShakeJunk()` returns `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartDaywalkerBuried(inst)`
*   **Description:** Cancels existing shake tasks and resets `daywalker_side` when the pile is newly buried.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `startlongaction` – triggers `onstartpicking` when an entity begins a long action (e.g., rummage) near the pile.
  - `shake` – triggers `onshake`, producing rummage effects and animations during shaking.
  - `newstate` / `onremove` – registered per-picker to detect when a picker leaves the rummaging state (via `cancelpicker`).
  - `animover` – registered on `junk_pile_blueprint` to remove itself after post-animation completes.
- **Pushes:**
  - `shake` – event fired periodically during idle shaking.
  - `ms_junkstolen` – sent to all `junkmob` entities within 16 units when junk is successfully stolen.
  - `knockback` – sent to nearby entities during daywalker release.
  - `ms_register_junk_pile_big` – pushed on master simulation to register the pile for event coordination.
