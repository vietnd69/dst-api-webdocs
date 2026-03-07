---
id: oceanfishableflotsam
title: Oceanfishableflotsam
description: Represents a floating object in the ocean that can be caught with fishing rods and later fished up for loot or salvaged with a winch.
tags: [fishing, ocean, loot, salvaging]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1fb891e1
system_scope: world
---

# Oceanfishableflotsam

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
`oceanfishableflotsam` is a special water-dwelling entity that behaves as a fishable target in ocean environments. It exists in two states: as a submerged entity (`oceanfishableflotsam_water`) that swims near the surface and can be caught by fishing hooks, and as a landed entity (`oceanfishableflotsam`) that appears on land or dry ground after being hauled in, from which players can manually pick it up for loot or salvagers can retrieve it via winches. It integrates with several core components: `oceanfishable`, `winchtarget`, `inventoryitem`, `pickable`, and `hauntable`.

## Usage example
```lua
-- Creates a flotsam at a given ocean position
local flotsam = SpawnPrefab("oceanfishableflotsam_water")
flotsam.Transform:SetPosition(x, y, z)

-- Attaches it to a fishing hook (hook must already exist)
if hook.components.oceanfishable then
    flotsam.components.oceanfishable:SetRod(hook.components.oceanfishable:GetRod())
end
```

## Dependencies & tags
**Components used:**  
- `oceanfishable`  
- `winchtarget`  
- `inventoryitem`  
- `pickable`  
- `lootdropper`  
- `hauntable`  
- `symbolswapdata`  
- `inspectable`  
- `complexprojectile` (added temporarily when being caught)

**Tags added on water state:** `ignorewalkableplatforms`, `notarget`, `NOCLICK`, `NOBLOCK`, `oceanfishable`, `oceanfishinghookable`, `swimming`, `winchtarget`, `scarytooceanprey` (added when hooked)

**Tags added on land state:** None explicitly added; relies on default behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `updatetask` | `PeriodicTask?` | `nil` | Internal task used to run `OnUpdate` periodically while swimming. |
| `overrideflotsamsinkfn` | `function?` | `overrideflotsamsinkfn` | Custom sink handler that replaces the default flotsam sink animation. |
| `catch_distance` | number | `TUNING.OCEAN_FISHING.MUDBALL_CATCH_DIST` | Radius within which a fishing hook can attract this flotsam. |

## Main functions
### `OnMakeProjectile(inst)`
* **Description:** Transitions the flotsam from swimming state to projectile state when caught by a hook. Adds the `complexprojectile` component and sets up the impact callback (`OnLand`).
* **Parameters:** `inst` (entity instance) — the flotsam entity.
* **Returns:** `inst` — returns the same entity for chaining.
* **Error states:** None known.

### `OnLand(inst)`
* **Description:** Handles impact when the projectile (flotsam) hits water or land. If on land, spawns the landed variant; if still in water, resumes swimming updates.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.
* **Error states:** May spawn extra prefabs on each call depending on environment detection.

### `OnReelingIn(inst, doer)`
* **Description:** Triggered when the rod starts reeling in a hooked flotsam. Plays a splash effect at the current position.
* **Parameters:** `inst` (entity), `doer` (entity performing the action, e.g., player).  
* **Returns:** Nothing.

### `OnReelingInPst(inst, doer)`
* **Description:** Plays a struggle animation loop if the line is not under high tension at reeling completion.
* **Parameters:** `inst` (entity), `doer` (entity).  
* **Returns:** Nothing.

### `OverrideUnreelRateFn(inst, rod)`
* **Description:** Overrides the default unreeling rate for the rod handling this flotsam.
* **Parameters:** `inst` (entity), `rod` (fishing rod component).  
* **Returns:** `UNREEL_RATE` (`0.5`) — a fixed unreel rate regardless of rod tension.

### `OnSetRod(inst, rod)`
* **Description:** Updates the `scarytooceanprey` tag based on whether the flotsam is currently attached to a rod and plays a splash effect.
* **Parameters:** `inst` (entity), `rod` (`OceanFishingRod?`).
* **Returns:** Nothing.

### `OnPicked(inst, picker)`
* **Description:** Spawns loot (two items drawn from `weighted_loot`) and optionally a HALLOWEEN_ORNAMENT if the event is active. Prevents the flotsam from being added to the picker’s inventory.
* **Parameters:** `inst` (entity), `picker` (`?` — can be `nil` if haunter).
* **Returns:** `true` — signals `InventoryItem` component not to give the item.
* **Error states:** None known.

### `OnSalvage(inst)`
* **Description:** Called by the `WinchTarget` component to salvage this flotsam (e.g., via ship winch). Spawns a new `oceanfishableflotsam` instance at the same position.
* **Parameters:** `inst` (entity).  
* **Returns:** `product` — the newly spawned `oceanfishableflotsam` instance.

### `OnHaunt(inst)`
* **Description:** Handles haunting by ghosts: attempts to spawn loot and sets haunt value.
* **Parameters:** `inst` (entity).  
* **Returns:** `true` — always indicates a successful haunt attempt.
* **Error states:** Loot is only spawned if `HAUNT_CHANCE_OCCASIONAL` roll succeeds.

### `OnEntityWake(inst)`
* **Description:** Starts the `OnUpdate` periodic task when the entity wakes up.
* **Parameters:** `inst` (entity).  
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Cancels the `OnUpdate` periodic task when the entity sleeps.
* **Parameters:** `inst` (entity).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onsink` — triggers `OnSink` to replace flotsam with water version.  
  - `on_landed` — triggers `OnLanded`, which checks if still in ocean and pushes `onsink` if so.  
  - `onremove` (dynamically added to rod) — handled by `rod_onremove` internally within `oceanfishable:SetRod`.

- **Pushes:**  
  - `onsink` — triggered from `OnLanded` when landed on ocean point.  
  - `on_landed` — pushed automatically by the projectile/physics system when the flotsam lands.
