---
id: fishingrod
title: Fishingrod
description: Manages the fishing mechanic for a fishing rod, including casting, nibbling, strain, and reeling interactions with a fishable entity.
tags: [fishing, inventory, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 47670e58
system_scope: player
---

# Fishingrod

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fishingrod` handles the complete lifecycle of a fishing action for an entity (typically the player). It coordinates casting the rod to a `fishable` target, waiting for a nibble, applying strain to the rod, and reeling in caught fish. It integrates with the `equippable`, `finiteuses`, and `fishable` components to manage state and durability.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fishingrod")

-- Start fishing at a specific fishable target with a fisherman (e.g., player)
local target = some_fishable_entity
local fisherman = the_player
inst.components.fishingrod:StartFishing(target, fisherman)

-- Later, trigger strain and reeling
inst.components.fishingrod:Hook()
-- ... after strain time ...
inst.components.fishingrod:Reel()

-- Finally, collect the fish
inst.components.fishingrod:Collect()
```

## Dependencies & tags
**Components used:** `equippable`, `finiteuses`, `fishable`
**Tags:** Adds `fishingrod` to the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Goi` or `nil` | `nil` | The `fishable` entity being fished at. |
| `fisherman` | `Goi` or `nil` | `nil` | The entity holding and using the fishing rod (e.g., player). |
| `hookedfish` | `Goi` or `nil` | `nil` | The fish entity currently hooked and being reeled. |
| `caughtfish` | `Goi` or `nil` | `nil` | The fish entity that has been successfully reeled and is ready to be collected. |
| `minwaittime` | number | `0` | Minimum time (seconds) before a fish nibbles. |
| `maxwaittime` | number | `10` | Maximum time (seconds) before a fish nibbles. |
| `minstraintime` | number | `0` | Minimum time (seconds) before rod breaks under strain (used with `finiteuses`). |
| `maxstraintime` | number | `6` | Maximum time (seconds) before rod breaks under strain. |
| `fishtask` | `DoTaskInTime` handle or `nil` | `nil` | Reference to the scheduled nibble or strain task. |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a string summarizing the current fishing state for debugging.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"target: X hooked: Y caught: Z"`, with `nil` values omitted.

### `SetWaitTimes(min, max)`
*   **Description:** Sets the range of time (in seconds) to wait before a fish nibbles. The actual wait time interpolates based on remaining fish in the target.
*   **Parameters:** 
    * `min` (number) — minimum wait time in seconds.
    * `max` (number) — maximum wait time in seconds.
*   **Returns:** Nothing.

### `SetStrainTimes(min, max)`
*   **Description:** Sets the range of time (in seconds) before the rod breaks under strain. Used only if the owning entity has a `finiteuses` component.
*   **Parameters:** 
    * `min` (number) — minimum strain time in seconds.
    * `max` (number) — maximum strain time in seconds.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Periodically checks whether fishing should continue (e.g., rod still equipped, fisherman in fishing state). If conditions fail, stops fishing.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `IsFishing()`
*   **Description:** Checks if a fishing action is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `target` and `fisherman` are both non-`nil`.

### `HasHookedFish()`
*   **Description:** Checks if a fish is currently hooked.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `target` and `hookedfish` are both non-`nil`.

### `HasCaughtFish()`
*   **Description:** Checks if a fish has been caught and is ready for collection.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `caughtfish` is non-`nil`.

### `FishIsBiting()`
*   **Description:** Checks if the fisherman is currently in the nibble state.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `fisherman.sg:HasStateTag("nibble")` is `true`.

### `StartFishing(target, fisherman)`
*   **Description:** Begins a fishing action on the specified `fishable` target by the given fisherman. Cancels any ongoing fishing first.
*   **Parameters:** 
    * `target` (`Goi`) — an entity with a `fishable` component.
    * `fisherman` (`Goi`) — the entity using the rod (e.g., player).
*   **Returns:** Nothing.
*   **Error states:** If `target` is `nil` or lacks `components.fishable`, no action is taken.

### `WaitForFish()`
*   **Description:** Schedules a nibble task based on remaining fish in the target. Wait time interpolates between `minwaittime` and `maxwaittime`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `target` is `nil` or lacks `components.fishable`.

### `CancelFishTask()`
*   **Description:** Cancels any pending nibble or strain task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopFishing()`
*   **Description:** Ends the current fishing action. Resets all internal references and cancels scheduled tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Fires `fishingcancel` event on the `fisherman` if it was active.

### `Hook()`
*   **Description:** Hooks a fish on the `target`, applies strain, and schedules rod breakage if `finiteuses` is present.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `target` or `target.components.fishable` is `nil`.

### `Release()`
*   **Description:** Releases the currently hooked fish back into the water (without collecting it).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `hookedfish` is `nil` or `target.components.fishable` is `nil`.

### `Reel()`
*   **Description:** Reels in the hooked fish, spawning it near the fisherman.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `hookedfish` is `nil`. Upon success, pushes `fishingcatch` events with `build` data on both rod and fisherman.

### `Collect()`
*   **Description:** Collects the caught fish, respawning it in the world and ending fishing. Makes the fish entity persistent and visible.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `caughtfish` is `nil`. Pushes `fishingcollect` events with `fish` data on both rod and fisherman.

## Events & listeners
- **Listens to:** None (events are pushed, not listened for).
- **Pushes:** `fishingnibble`, `fishingloserod`, `fishingcancel`, `fishingstrain`, `fishingcatch`, `fishingcollect`.  
  All events are fired on both `self.inst` (the rod) and `self.fisherman` (when non-`nil`), with additional payload data where noted.
