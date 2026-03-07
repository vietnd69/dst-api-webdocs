---
id: drownable
title: Drownable
description: Manages drowning and void-falling logic for entities, including damage application, item dropping, and teleportation behavior.
tags: [drowning, physics, inventory, damage, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2f4c101e
system_scope: entity
---

# Drownable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Drownable` component handles all gameplay effects related to an entity submerging in water or falling into the void. It determines when drowning or falling should occur, applies penalties (health, hunger, sanity, moisture), triggers item dropping based on conditions, and manages teleportation to shore or safe ground. The component interacts closely with `health`, `hunger`, `sanity`, `moisture`, `inventory`, `sleeper`, `flotationdevice`, `equippable`, and `inventoryitem` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("drownable")

-- Enable drowning logic (default is `true`)
inst.components.drownable.enabled = true

-- Set custom damage tuning via a function
inst.components.drownable:SetCustomTuningsFn(function(entity)
    return { HEALTH = 5, HUNGER = 10, SANITY = 5, WETNESS = 15 }
end)

-- Manually trigger drowning behavior (e.g., during a cutscene)
inst.components.drownable:OnFallInOcean()
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `moisture`, `inventory`, `sleeper`, `flotationdevice`, `equippable`, `inventoryitem`  
**Tags:** Checks `stronggrip` (to prevent item dropping), `player` (for camera/fade behavior)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `nil` → initialized to `true` via deferred task | Whether drowning mechanics are active for this entity. |
| `dest_x`, `dest_y`, `dest_z` | number | `nil` | Destination coordinates for teleportation after drowning/void-fall. |
| `src_x`, `src_y`, `src_z` | number | `nil` | Source coordinates where drowning/void-fall began. |
| `teleport_pt_stack` | table | `nil` | Stack of teleport point overrides keyed by source entity. |
| `shoulddropitemsfn` | function | `nil` | Optional custom function to override default item-drop behavior. |
| `ontakedrowningdamage` | function | `nil` | Optional callback when drowning damage is applied. |
| `customtuningsfn` | function | `nil` | Optional function returning custom damage tunings per entity. |

## Main functions
### `IsInDrownableMapBounds(x, y, z)`
*   **Description:** Checks whether the given world coordinates are within the playable map bounds (used to avoid overreaching for out-of-bounds mods).
*   **Parameters:** `x`, `y`, `z` (numbers) — world coordinates.
*   **Returns:** `true` if inside bounds; `false` otherwise.
*   **Error states:** None.

### `IsSafeFromFalling()`
*   **Description:** Determines if the entity is on solid ground or otherwise safe from falling (e.g., on a platform or solid ground).
*   **Parameters:** None.
*   **Returns:** `true` if safe; `false` if falling risk exists.
*   **Error states:** None.

### `IsOverVoid()`
*   **Description:** Returns `true` if the entity is currently positioned over a void tile (invalid tile), and not safe from falling.
*   **Parameters:** None.
*   **Returns:** `true` if over void; `false` otherwise.
*   **Error states:** None.

### `IsOverWater()`
*   **Description:** Returns `true` if the entity is positioned over an ocean tile (deep or shallow water), and not safe from falling.
*   **Parameters:** None.
*   **Returns:** `true` if over water; `false` otherwise.
*   **Error states:** None.

### `ShouldDrown()`
*   **Description:** Checks if the entity should begin drowning (enabled + not invincible + over water).
*   **Parameters:** None.
*   **Returns:** `true` if drowning is required; `false` otherwise.
*   **Error states:** None.

### `ShouldFallInVoid()`
*   **Description:** Checks if the entity should fall into the void (enabled + not invincible + over void).
*   **Parameters:** None.
*   **Returns:** `true` if void-fall is triggered; `false` otherwise.
*   **Error states:** None.

### `GetFallingReason()`
*   **Description:** Returns the current falling condition (`FALLINGREASON.OCEAN` or `FALLINGREASON.VOID`), or `nil` if neither.
*   **Parameters:** None.
*   **Returns:** `FALLINGREASON.OCEAN`, `FALLINGREASON.VOID`, or `nil`.

### `CheckDrownable()`
*   **Description:** Evaluates falling state and fires `onsink` or `onfallinvoid` events if applicable.
*   **Parameters:** None.
*   **Returns:** `true` if a drowning/fall event occurred; `false` otherwise.

### `WashAshore()`
*   **Description:** Teleports the entity to a safe shore location after drowning in ocean and triggers `on_washed_ashore` event.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `VoidArrive()`
*   **Description:** Teleports the entity to a shore point after falling into the void and triggers `on_void_arrive` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnFallInOcean(shore_x, shore_y, shore_z)`
*   **Description:** Handles logic when an entity falls into ocean: records source position, sets destination, wakes sleeper, and drops active/hand items (if not `keepondrown` or `irreplaceable`).
*   **Parameters:** `shore_x`, `shore_y`, `shore_z` (numbers or `nil`) — optional override shore coordinates.
*   **Returns:** Nothing.
*   **Error states:** If `shore_x` is `nil`, tries `GetTeleportPtOverride()`, then `FindRandomPointOnShoreFromOcean`.

### `OnFallInVoid(teleport_x, teleport_y, teleport_z)`
*   **Description:** Handles logic when an entity falls into the void: records source, sets destination, wakes sleeper. Void penalties are currently not implemented.
*   **Parameters:** `teleport_x`, `teleport_y`, `teleport_z` (numbers or `nil`) — optional override destination.
*   **Returns:** Nothing.

### `TakeDrowningDamage()`
*   **Description:** Applies drowning-related damage and stat penalties in a specific order: moisture → flotation protection → hunger → health penalty/health → sanity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:**  
    *   Flotation devices (if enabled and equipped) prevent damage; calls `OnPreventDrowningDamage` on the first such item.  
    *   Damage values are clamped with a 30-unit buffer (e.g., can’t reduce health below 30).  
    *   Health penalties are applied unscaled; other damage is scaled by shallow water (`TUNING.DROWNING_SHALLOW_SCALE`) if applicable.

### `DropInventory()`
*   **Description:** Drops a subset of inventory items if conditions allow (`ShouldDropItems` is `true`, not `irreplaceable`, not `keepondrown`). Drop count depends on tile type (shallow vs normal ocean).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShouldDropItems()`
*   **Description:** Determines whether items should drop when drowning (defaults to `true`, unless `stronggrip` tag or `shoulddropitemsfn` returns `false`).
*   **Parameters:** None.
*   **Returns:** `true` if items drop; `false` otherwise.

### `GetDrowningDamageTuning()`
*   **Description:** Retrieves tunings table for damage (by prefab name uppercase, or `DEFAULT`/`CREATURE` fallback), optionally overridden by `customtuningsfn`.
*   **Parameters:** None.
*   **Returns:** Table of tunings (e.g., `{HEALTH=...}`, or `nil` if none defined).

### `Teleport()`
*   **Description:** Teleports the entity to `self.dest_x`, `self.dest_y`, `self.dest_z`, using a random offset within radius to avoid holes and players.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetWashingAshoreTeleportSpot(excludeclosest)`
*   **Description:** (Currently unused) Returns a random shore point near the entity’s ocean location, with walkable offset.
*   **Parameters:** `excludeclosest` (boolean) — whether to exclude the nearest shore point.
*   **Returns:** `x`, `y`, `z` (numbers) — destination coordinates.

### `GetTeleportPtOverride()`
*   **Description:** Returns the top-most teleport point override from the stack, or `nil`.
*   **Parameters:** None.
*   **Returns:** `Vector3` point, or `nil`.

### `PushTeleportPt(src, pt)`
*   **Description:** Pushes a teleport point override onto the stack, keyed by `src`. Registers `onremove` event if `src` is an entity.
*   **Parameters:**  
    * `src` — source entity or token (any hashable value)  
    * `pt` (`Vector3`) — teleport destination.
*   **Returns:** Nothing.

### `PopTeleportPt(src)`
*   **Description:** Removes the teleport point override for `src` from the stack and cleans up the event listener if applicable.
*   **Parameters:** `src` — source entity or token.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `onremove` (on source entity) — used internally in `PushTeleportPt` to clean up teleport overrides when the source is removed.
- **Pushes:**  
  * `onsink` — fired when entity begins sinking in ocean (`CheckDrownable`).  
  * `onfallinvoid` — fired when entity begins falling into void (`CheckDrownable`).  
  * `on_washed_ashore` — fired after washing ashore (`WashAshore`).  
  * `on_void_arrive` — fired after void-teleport completion (`VoidArrive`).
