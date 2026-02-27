---
id: fishable
title: Fishable
description: Manages fish availability, hooking, and respawning for water-based entities in the game.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 21b4ba3f
---

# Fishable

## Overview
The `Fishable` component tracks and manages fish resources associated with a water entity (e.g., a lake or ocean tile), including fish count, hooking logic, respawn mechanics, and state persistence. It enables interaction with fishing rods by providing hooks for catching and releasing fish, and responds to freezing events by temporarily disabling fishability.

## Dependencies & Tags
- Adds/removes the `"fishable"` tag on the entity depending on frozen state.
- Relies on external components such as `weighable` (when present on caught fish) and `DynamicShadow`/`Physics` (for temporary fish state management).
- No other components are explicitly added via `AddComponent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `fish` | `table` | `{}` | Map of possible fish prefabs (keys = prefab names). |
| `maxfish` | `integer` | `10` | Maximum fish capacity per tile. |
| `fishleft` | `integer` | `10` | Current number of available fish. |
| `hookedfish` | `table` | `{}` | Map of currently hooked fish instances (keys = fish entities). |
| `fishrespawntime` | `number` | `nil` | Delay (in seconds) before fish respawn (set via `SetRespawnTime`). |
| `respawntask` | `Task` | `nil` | Pending respawn task handle. |
| `frozen` | `boolean` | `false` | Indicates if the water surface is frozen. |
| `getfishfn` | `function` | `nil` | Optional hook to determine fish prefab dynamically (set via `SetGetFishFn`). |

## Main Functions
### `AddFish(prefab)`
* **Description:** Adds a fish prefab to the pool of possible catches.
* **Parameters:**  
  `prefab` (`string`): The name of the fish prefab to add.

### `SetGetFishFn(fn)`
* **Description:** Sets a custom function to dynamically determine which fish prefab is caught, overriding the random selection from `fish` pool.
* **Parameters:**  
  `fn` (`function`): A function taking `(tile_entity, fisherman)` as arguments and returning a prefab name.

### `SetRespawnTime(time)`
* **Description:** Configures the time interval (in seconds) for fish to respawn after being caught.
* **Parameters:**  
  `time` (`number`): Respawn delay; if `nil`, respawning is disabled.

### `HookFish(fisherman)`
* **Description:** Spawns a fish instance, hooks it, and reduces the fish count. Returns the fish entity (hidden and temporarily disabled).
* **Parameters:**  
  `fisherman` (`Entity` or `nil`): The player fishing; used for ownership and debugging context.

### `ReleaseFish(fish)`
* **Description:** Releases a currently hooked fish, restoring its fish count. The fish is removed entirely.
* **Parameters:**  
  `fish` (`Entity`): The fish entity to release.

### `RemoveFish(fish)`
* **Description:** Removes a hooked fish without releasing it (e.g., when fish escapes). Triggers respawn logic.
* **Parameters:**  
  `fish` (`Entity`): The fish entity to remove.

### `IsFrozenOver()`
* **Description:** Returns whether the water is currently frozen (unfishable).
* **Returns:** `boolean` — `true` if frozen, else `false`.

### `Freeze()`
* **Description:** Marks the water as frozen, disabling fishability by removing the `"fishable"` tag.

### `Unfreeze()`
* **Description:** Marks the water as unfrozen, restoring fishability by adding the `"fishable"` tag.

### `RefreshFish()`
* **Description:** Schedules a respawn task to increment fish count after `fishrespawntime` seconds.
* **Parameters:** None.

### `GetFishPercent()`
* **Description:** Returns the ratio of remaining fish to maximum fish (as a value between 0 and 1).
* **Returns:** `number` — Fish availability percentage.

### `OnSave()`
* **Description:** Returns save data when `fishleft < maxfish`, otherwise `nil`.
* **Returns:** `{fish = number}` or `nil`.

### `OnLoad(data)`
* **Description:** Restores fish count from save data and schedules respawn if needed.
* **Parameters:**  
  `data` (`table?`) — Save data containing `fish` (remaining fish count).

## Events & Listeners
- Listens to the `"frozen"` event (via `self.frozen = onfrozen`, passed in class options) to toggle the `"fishable"` tag.