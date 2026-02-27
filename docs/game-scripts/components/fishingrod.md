---
id: fishingrod
title: Fishingrod
description: Manages the fishing mechanics for a fishing rod, including casting, biting, strain, reeling, and collecting fish.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 47670e58
---

# Fishingrod

## Overview
The `FishingRod` component implements the core logic for fishing in Don't Starve Together. It tracks the rod's current state (e.g., fishing, hooked, caught), manages timing for bite events and line strain, and interfaces with the `fishable` component on water targets to control fish behavior. It also synchronizes state via replica and emits events to the rod and fisherman entities.

## Dependencies & Tags
- Adds tag `"fishingrod"` to the owning entity.
- Relies on the owning entity having `equippable`, `finiteuses` (optional), and `physics`/`transform` components.
- Interacts with the `fishable` component on the target entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity?` | `nil` | The water/pond entity currently being fished at. |
| `fisherman` | `Entity?` | `nil` | The player entity using the rod. |
| `hookedfish` | `Entity?` | `nil` | The fish entity currently hooked but not yet reeled in. |
| `caughtfish` | `Entity?` | `nil` | The fish entity reeled in and ready for collection. |
| `minwaittime` | `number` | `0` | Minimum time (in seconds) before a fish nibbles. |
| `maxwaittime` | `number` | `10` | Maximum time (in seconds) before a fish nibbles. |
| `minstraintime` | `number` | `0` | Minimum time (in seconds) before the line breaks under strain. |
| `maxstraintime` | `number` | `6` | Maximum time (in seconds) before the line breaks under strain. |
| `fishtask` | `Task?` | `nil` | The active delayed task (e.g., nibble or strain timer). |

## Main Functions

### `SetWaitTimes(min, max)`
* **Description:** Sets the minimum and maximum wait times (in seconds) before a fish nibbles. The actual wait time is interpolated based on remaining fish in the target.
* **Parameters:**
  - `min` (number): Minimum nibble delay.
  - `max` (number): Maximum nibble delay.

### `SetStrainTimes(min, max)`
* **Description:** Sets the minimum and maximum times (in seconds) the line holds under strain before breaking. Break time is interpolated based on the rod's durability.
* **Parameters:**
  - `min` (number): Minimum strain time.
  - `max` (number): Maximum strain time.

### `OnUpdate(dt)`
* **Description:** Called every frame while fishing. Checks if the fishing condition is still valid (e.g., rod equipped, fisherman in fishing state) and stops fishing if not.
* **Parameters:**
  - `dt` (number): Delta time in seconds.

### `IsFishing()`
* **Description:** Returns whether the rod is currently active (i.e., target and fisherman are set).
* **Returns:** `boolean`

### `HasHookedFish()`
* **Description:** Returns whether a fish is currently hooked (i.e., nibbled and straining).
* **Returns:** `boolean`

### `HasCaughtFish()`
* **Description:** Returns whether a fish has been fully reeled in and is awaiting collection.
* **Returns:** `boolean`

### `FishIsBiting()`
* **Description:** Returns whether the fish is actively biting (i.e., the fisherman's stategraph has the `"nibble"` tag).
* **Returns:** `boolean`

### `StartFishing(target, fisherman)`
* **Description:** Begins fishing at the specified target entity using the given fisherman (player). Initializes fishing state and starts frame updates.
* **Parameters:**
  - `target` (Entity): The pond/water entity with a `fishable` component.
  - `fisherman` (Entity): The player entity casting the line.

### `WaitForFish()`
* **Description:** Schedules a nibble event after a time determined by remaining fish and configured wait times. Cancels any existing fish task first.
* **Parameters:** None.

### `CancelFishTask()`
* **Description:** Cancels and clears the active fish task (e.g., nibble or strain timer).
* **Parameters:** None.

### `StopFishing()`
* **Description:** Ends the current fishing session, clears all active state (target, fisherman, hooked/caught fish), cancels pending tasks, and stops updates.
* **Parameters:** None.

### `Hook()`
* **Description:** Triggers when the player attempts to hook a fish. Calls the target's `fishable:HookFish()` to capture the fish and schedules line strain timeout. Emits `"fishingstrain"` events.
* **Parameters:** None.

### `Release()`
* **Description:** Releases the currently hooked fish back to the water and stops fishing.
* **Parameters:** None.

### `Reel()`
* **Description:** Completes the reeling process, removing the hooked fish from the target and spawning it at the fisherman's location. Marks it as caught and emits `"fishingcatch"` events.
* **Parameters:** None.

### `Collect()`
* **Description:** Collects the reeled-in fish into the fisherman's inventory. Makes the fish entity fully active and persistent, spawns it into the world near the fisherman, and emits `"fishingcollect"` events.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the current fishing state.
* **Returns:** `string`

## Events & Listeners
- Listens to replica updates:
  - `target` → `ontarget(self, target)`
  - `hookedfish` → `onhookedfish(self, hookedfish)`
  - `caughtfish` → `oncaughtfish(self, caughtfish)`
- Emits events:
  - `"fishingnibble"` (to `inst` and `fisherman`) when a fish nibbles.
  - `"fishingloserod"` (to `inst` and `fisherman`) when the line breaks.
  - `"fishingcancel"` (to `fisherman`) when fishing is stopped.
  - `"fishingstrain"` (to `inst` and `fisherman`) when a fish is hooked.
  - `"fishingcatch"` (to `inst` and `fisherman`, with `{build = ...}`) after a fish is reeled in.
  - `"fishingcollect"` (to `inst` and `fisherman`, with `{fish = ...}`) when a fish is collected.