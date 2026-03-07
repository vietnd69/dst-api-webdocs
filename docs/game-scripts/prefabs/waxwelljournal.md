---
id: waxwelljournal
title: Waxwelljournal
description: A magical spellbook prefab used by shadow magic users that manages spellcasting, fuel consumption, sanity impact, and minion spawning through its components and sound-driven idle behavior.
tags: [inventory, spellbook, shadowmagic, fuel, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6a1d0251
system_scope: inventory
---

# Waxwelljournal

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waxwelljournal` is a character-specific inventory item prefab functioning as a spellbook for shadow magic users (e.g., Maxwell). It integrates multiple components—`spellbook`, `aoetargeting`, `aoespell`, `fueled`, `fuel`, and `hauntable`—to provide a complete spellcasting interface. It supports five spells (`SHADOW_WORKER`, `SHADOW_PROTECTOR`, `SHADOW_TRAP`, `SHADOW_PILLARS`, and a disabled `SHADOW_TOPHAT`), each with associated behavior (deployment radius, target validation, repeat-cast conditions, etc.). The item also features dynamic floating behavior triggered when players are nearby, sound-driven animation transitions, and a custom idle/fuel-sound system.

## Usage example
```lua
local inst = SpawnPrefab("waxwelljournal")
-- Spell selection and activation is handled via spellbook UI; once equipped,
-- calling spell selection handlers triggers:
inst.components.spellbook:SetSpellAction(nil)
inst.components.aoetargeting.reticule.reticuleprefab = "reticuleaoe_1d2_12"
inst.components.aoespell:SetSpellFn(WorkerSpellFn)
-- Fuel is consumed automatically on cast via SpellCost()
```

## Dependencies & tags
**Components used:** `spellbook`, `aoetargeting`, `aoespell`, `fueled`, `fuel`, `hauntable`, `inventoryitem`, `inspectable`, `animstate`, `soundemitter`, `transform`, `network`  
**Tags:** `book`, `shadowmagic`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isfloating` | boolean | `false` | Tracks whether the book is currently floating above the ground. |
| `_activetask` | Task | `nil` | Task handle for book-use animation completion. |
| `_soundtasks` | table | `{}` | Table of pending sound tasks keyed by ID. |
| `scrapbook_fueled_rate` | number | Calculated | Fuel rate used for scrapbook integration. |
| `scrapbook_fueled_uses` | boolean | `true` | Flag indicating uses fuel in scrapbook context. |
| `swap_build` | string | `"book_maxwell"` | Build used for swap animation. |
| `castsound` | string | `"maxwell_rework/shadow_magic/cast"` | Sound file used on spell cast. |

## Main functions
### `SpellCost(pct)`
*   **Description:** Calculates the fuel cost for a spell as a percentage of `TUNING.LARGE_FUEL`, multiplied by `-4`. Used by all spell functions.
*   **Parameters:** `pct` (number) - Fractional cost multiplier.
*   **Returns:** number - Negative fuel delta (consumption).

### `PillarsSpellFn(inst, doer, pos)`
*   **Description:** Handles the `SHADOW_PILLARS` spell cast. Spawns `shadow_pillar_spell` at target location (attached to platform if available), deducts fuel and sanity.
*   **Parameters:** `inst` (Entity) - The journal instance; `doer` (Entity) - The casting player; `pos` (Vector3) - World position.
*   **Returns:** `true` on success, `false` with "NO_FUEL" reason on failure.

### `TrapSpellFn(inst, doer, pos)`
*   **Description:** Handles the `SHADOW_TRAP` spell cast. Spawns `shadow_trap` at target location, adjusts tags based on platform, deducts fuel and sanity.
*   **Parameters:** Same as `PillarsSpellFn`.
*   **Returns:** `true` on success, `false` with "NO_FUEL" or platform-based placement error.

### `WorkerSpellFn(inst, doer, pos)`
*   **Description:** Handles the `SHADOW_WORKER` spell cast. Attempts to spawn a `shadowworker` minion. Validates maximum sanity penalty, fuel availability, and spawn feasibility.
*   **Parameters:** Same as `PillarsSpellFn`.
*   **Returns:** `true` on successful spawn; `false` with "NO_FUEL" or "NO_MAX_SANITY".

### `ProtectorSpellFn(inst, doer, pos)`
*   **Description:** Handles the `SHADOW_PROTECTOR` spell cast. Attempts to spawn a `shadowprotector` minion. Validates maximum sanity penalty and fuel.
*   **Parameters:** Same as `PillarsSpellFn`.
*   **Returns:** `true` on successful spawn; `false` with "NO_FUEL" or "NO_MAX_SANITY".

### `FindSpawnPoints(doer, pos, num, radius)`
*   **Description:** Calculates up to `num` valid spawn positions in a circle around `pos`, avoiding blocked terrain. Uses radial distribution logic (TWOPI spacing with optional offset).
*   **Parameters:** `doer` (Entity) - The casting entity; `pos` (Vector3) - Center position; `num` (number) - Max spawn count; `radius` (number) - Spawn radius.
*   **Returns:** table - Array of `Vector3` spawn positions.

### `TrySpawnMinions(prefab, doer, pos)`
*   **Description:** Attempts to spawn a minion of type `prefab` using `petleash:SpawnPetAt` and applies special state logic for animation restarting.
*   **Parameters:** `prefab` (string) - Minion prefab name; `doer` (Entity) - Owner/controller; `pos` (Vector3) - Base spawn position.
*   **Returns:** `true` if spawning succeeded, `false` otherwise.

### `CheckMaxSanity(doer, minionprefab)`
*   **Description:** Checks whether spawning a minion of `minionprefab` would exceed the maximum allowed sanity penalty (from `TUNING.MAXIMUM_SANITY_PENALTY`).
*   **Parameters:** `doer` (Entity); `minionprefab` (string).
*   **Returns:** `true` if sanity penalty is acceptable, `false` otherwise.

### `ShouldRepeatCastWorker(inst, doer)`
*   **Description:** `aoetargeting` callback that returns whether the spell should repeat casting based on current sanity sanity penalty vs. limit for `shadowworker`.
*   **Parameters:** `inst` (Entity); `doer` (Entity).
*   **Returns:** boolean.

### `ShouldRepeatCastProtector(inst, doer)`
*   **Description:** Same as `ShouldRepeatCastWorker`, but for `shadowprotector`.

### `StartAOETargeting(inst)`
*   **Description:** Triggers AOE targeting mode via `playercontroller:StartAOETargetingUsing(inst)`.
*   **Parameters:** `inst` (Entity) - The journal instance.
*   **Returns:** Nothing.

### `OnOpenSpellBook(inst)`
*   **Description:** UI hook. Overrides the inventory item's displayed image to the open-book version.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnCloseSpellBook(inst)`
*   **Description:** UI hook. Clears the image override upon spellbook closure.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetStatus(inst, viewer)`
*   **Description:** `inspectable` callback. Returns `"NEEDSFUEL"` if the book is depleted and usable by the viewer; otherwise `nil`.
*   **Parameters:** `inst` (Entity); `viewer` (Entity).
*   **Returns:** string or `nil`.

### `onturnon(inst)`
*   **Description:** Activates floating animation and idle sound when a player in `shadowmagic` tag is nearby (`range <= 3`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onturnoff(inst, instant)`
*   **Description:** Deactivates floating; if `instant`, stops animation/sound immediately. Otherwise queues closing animation and sound transitions.
*   **Parameters:** `inst` (Entity); `instant` (boolean).
*   **Returns:** Nothing.

### `IsPlayerInRange(inst, range)`
*   **Description:** Checks if any active `shadowmagic` player is within `range` (squared distance used for performance).
*   **Parameters:** `inst` (Entity); `range` (number).
*   **Returns:** `true`/`false`, and (on false) squared distance to closest eligible player.

### `UpdateFloatNear(inst, farfn)`
*   **Description:** Periodic function used when near players. Switches to `UpdateFloatFar` task if no players within close range (range `8`).
*   **Parameters:** `inst` (Entity); `farfn` (function) - Next-state function.
*   **Returns:** Nothing.

### `UpdateFloatFar(inst)`
*   **Description:** Periodic function used when far from players. Switches back to near-state if a player is within `8` units.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onuse(inst, hasfx)`
*   **Description:** Triggers book-use animation and sound, cancels existing `_activetask`, and re-schedules animation completion via `doneact`.
*   **Parameters:** `inst` (Entity); `hasfx` (boolean) - Whether to show FX overlay.
*   **Returns:** Nothing.

### `OnTakeFuel(inst)`
*   **Description:** `fueled` callback. Plays fuel sound, triggers `onuse` if floating, and wakes the entity if sleeping.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnFuelDepleted(inst)`
*   **Description:** `fueled` callback. Stops floating if active and cancels float task.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** `hauntable` callback. If floating, triggers `onuse`; otherwise launches the book toward the haunter. Sets haunt value to tiny.
*   **Parameters:** `inst` (Entity); `haunter` (Entity).
*   **Returns:** `true`.

## Events & listeners
- **Listens to:** `onputininventory` → `topocket` (calls `OnEntitySleep`)  
  `ondropped` → `toground` (calls `OnEntityWake`)  
  `waxwelljournal.playfuelsound` (client) → `CLIENT_PlayFuelSound`  
  `animover` (for sound cleanup during closing)  
  `onfueldsectionchanged`, `percentusedchange`, `sanitydelta`, `gosane`, `goinsane`, `goenlightened` (via `fueled`, `sanity`, and spellbook components)

- **Pushes:** `spellcast`, `castfailed` (via spellbook integration)  
  Events for spell selection, targeting, and minion spawning are handled via internal callbacks and do not directly push custom events.
