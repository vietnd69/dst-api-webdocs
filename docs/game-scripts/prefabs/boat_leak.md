---
id: boat_leak
title: Boat Leak
description: Prefab that represents a leak on boats, plugging when entities block it and launching items when plugged long enough.
tags: [boat, water, vehicle]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: b5eb217b
system_scope: entity
---

# Boat Leak

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`boat_leak` is a prefab that spawns on boats to simulate water leakage. When entities block the leak opening, it becomes plugged and applies wetness to nearby entities. If plugged long enough, it launches inventory items into the air. The leak is removed when repaired via the `boatleak` component callbacks.

## Usage example
```lua
-- Leak spawns automatically on boats; callbacks are set internally during prefab construction
-- External code typically interacts via the boatleak component state
local inst = SpawnPrefab("boat_leak")
inst.components.boatleak:SetPlugged(true)  -- Manually plug/unplug the leak
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- constants for haunt values, wetness rates, and plug timers

**Components used:**
- `boatleak` -- core leak state management with spring/repair callbacks
- `updatelooper` -- runs `FindLeakBlocker` periodically
- `lootdropper` -- added but not actively used in this prefab
- `inspectable` -- added when leak springs, removed when repaired
- `hauntable` -- added when leak springs for ghost interactions
- `moisture` -- accessed on entities to apply wetness rate bonuses
- `inventoryitem` -- accessed on items for moisture and landing state
- `mine` -- deactivated on items before launching
- `floater` -- checked to determine if item is heavy
- `hullhealth` -- checked for `leakproof` property on boat

**Tags:**
- `boatleak` -- added on creation for entity identification
- `NOCLICK` -- added when repaired, removed when sprung
- `NOBLOCK` -- added when repaired, removed when sprung

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_wettargets` | table | `{}` | Tracks entities receiving wetness from the leak. |
| `launchtime` | number | `nil` | Countdown timer before launching plugged items. |
| `jiggletime` | number | `nil` | Countdown timer for item jiggle animation phase. |
| `FindLeakBlocker` | function | `FindLeakBlocker` | Assigned update function for leak detection. |
| `persists` | boolean | `false` | Entity does not persist through save/load. |

## Main functions
### `onsprungleak(inst)`
* **Description:** Called when the leak springs open. Adds `inspectable` and `hauntable` components, initializes wet target tracking, and removes `NOCLICK`/`NOBLOCK` tags.
* **Parameters:** `inst` -- the boat leak entity instance
* **Returns:** None
* **Error states:** None

### `onrepairedleak(inst)`
* **Description:** Called when the leak is repaired. Removes `inspectable` and `hauntable` components, clears wet target moisture bonuses, and adds `NOCLICK`/`NOBLOCK` tags.
* **Parameters:** `inst` -- the boat leak entity instance
* **Returns:** None
* **Error states:** None

### `FindLeakBlocker(inst, dt)`
* **Description:** Main update function that finds entities within `BLOCK_RADIUS` (0.4) blocking the leak. Applies wetness to entities, tracks inventory items, and manages launch/jiggle timers when plugged.
* **Parameters:**
  - `inst` -- the boat leak entity instance
  - `dt` -- delta time since last update
* **Returns:** None
* **Error states:** Errors if `inst.components.boatleak` is nil when calling `SetPlugged()` — no nil guard present.

### `checkforleakimmune(inst)`
* **Description:** Validates that the leak spawned on a valid boat. Removes the leak if spawned on land or a leakproof boat (via `hullhealth.leakproof`).
* **Parameters:** `inst` -- the boat leak entity instance
* **Returns:** None
* **Error states:** Errors if `inst:GetCurrentPlatform()` returns an entity without `hullhealth` component — no nil guard on `boat.components.hullhealth`.

### `SpikeLaunch(inst, launcher, basespeed, startheight, startradius)`
* **Description:** Launches an entity with physics velocity. Calculates random angle and applies vertical/horizontal velocity for projectile motion.
* **Parameters:**
  - `inst` -- entity to launch
  - `launcher` -- the boat leak entity launching the item
  - `basespeed` -- base horizontal speed value
  - `startheight` -- initial Y position for teleport
  - `startradius` -- spawn radius offset from launcher
* **Returns:** None
* **Error states:** None

### `LaunchItems(items, launcher)`
* **Description:** Launches all inventory items from the plugged leak. Deactivates mines, sets items to not landed, removes physics colliders, and listens for landing events.
* **Parameters:**
  - `items` -- table of item entities to launch
  - `launcher` -- the boat leak entity
* **Returns:** None
* **Error states:** None

### `JiggleItems(items)`
* **Description:** Applies small vertical velocity to items as a pre-launch jiggle effect. Deactivates mines and sets items to not landed state.
* **Parameters:** `items` -- table of item entities to jiggle
* **Returns:** None
* **Error states:** None

### `OnEndFlung(inst)`
* **Description:** Cleanup function called when launched item enters limbo or lands. Removes event callbacks and restores inventory item physics.
* **Parameters:** `inst` -- the launched item entity
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `enterlimbo` - triggers `OnEndFlung` cleanup on launched items
- **Listens to:** `on_landed` - triggers `OnEndFlung` cleanup on launched items
- **Pushes:** None identified