---
id: maprevealable
title: Maprevealable
description: Manages the dynamic appearance and behavior of a map icon that reveals an entity's location on the mini-map based on nearby reveal sources.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 2d680960
---

# Maprevealable

## Overview
This component controls the visibility and properties (such as icon, priority, and restriction) of a map icon that represents the entity it is attached to. It periodically checks for nearby "maprevealer" entities within `PLAYER_REVEAL_RADIUS` and dynamically adds/removes them as reveal sources. When at least one reveal source is active, it spawns and tracks a mini-map icon; otherwise, it removes the icon entirely.

## Dependencies & Tags
- **Components added to entity:** None directly, but it depends on `inst:DoPeriodicTask`, `inst:ListenForEvent`, `inst:RemoveEventCallback`, and `SpawnPrefab`.
- **Tags applied to entity:** The component itself does not add tags to the host entity, but it listens for `onremove` on reveal source entities.
- **Internal tag list:** Uses `{"maprevealer"}` (defined as `MAPREVEALER_TAGS`) to detect nearby reveal sources.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity this component is attached to. |
| `refreshperiod` | `number` | `1.5` | Interval (in seconds) for recurring map-reveal checks. |
| `iconname` | `string?` | `nil` | Optional icon texture name to use on the mini-map icon. |
| `iconpriority` | `number?` | `nil` | Optional priority value for ordering overlapping map icons. |
| `iconprefab` | `string` | `"globalmapicon"` | Prefab name used to spawn the mini-map icon. |
| `icon` | `GloballyVisibleMapIcon?` | `nil` | Reference to the currently active mini-map icon entity. |
| `task` | `PeriodicTask?` | `nil` | Scheduled task used to run periodic refresh logic. |
| `revealsources` | `table` | `{}` | Dictionary mapping reveal source identifiers to their configuration (e.g., `restriction`). |
| `_onremovesource` | `function` | (internal lambda) | Callback for handling `onremove` events on entity-based reveal sources. |

*Note:* No public `_ctor`-level variable declarations exist beyond `inst`; all other properties are initialized in the constructor function.

## Main Functions

### `SetIcon(iconname)`
* **Description:** Updates the icon texture used on the mini-map icon. Only takes effect if an icon currently exists.
* **Parameters:**  
  `iconname` (`string?`) — New icon name (e.g., `"map_marker_small"`). Pass `nil` to clear.

### `SetIconPriority(priority)`
* **Description:** Sets the z-order priority of the mini-map icon. Higher-priority icons appear above lower ones.
* **Parameters:**  
  `priority` (`number?`) — Integer priority value. Pass `nil` to remove priority enforcement.

### `SetIconPrefab(prefab)`
* **Description:** Changes the prefab used to spawn the map icon. If changed while an icon exists, it stops and reinitializes icon management.
* **Parameters:**  
  `prefab` (`string`) — New prefab name (e.g., `"globalmapicon"`).

### `SetIconTag(tag)`
* **Description:** Applies or removes a string tag on the mini-map icon, used for grouping/filtering or styling in the UI.
* **Parameters:**  
  `tag` (`string?`) — Tag to assign. Pass `nil` to remove any existing tag.

### `SetOnIconCreatedFn(fn)`
* **Description:** Registers a callback function executed once the icon is first created. Allows late-stage customization of the spawned icon entity.
* **Parameters:**  
  `fn` (`function`) — Signature: `fn(inst: Entity, icon: GloballyVisibleMapIcon)`. Called *after* icon initialization (tags/priority) but *before* `TrackEntity`.

### `AddRevealSource(source, restriction)`
* **Description:** Registers a new source that contributes to map visibility (e.g., a nearby player or structure). Triggers a refresh.
* **Parameters:**  
  `source` (`string` or `table`) — Unique identifier (e.g., `"player1"` or `{ entity = player_entity }`).  
  `restriction` (`string?`) — Optional restriction string (e.g., `"visible"`); `nil` implies unconditional reveal.

### `RemoveRevealSource(source)`
* **Description:** Unregisters a reveal source and refreshes icon state if needed.
* **Parameters:**  
  `source` (`string` or `table`) — Must match an existing key in `revealsources`.

### `RefreshRevealSources()`
* **Description:** Evaluates all current reveal sources to determine whether to show/hide the map icon and with what restriction. If any source has `nil` restriction, reveals unconditionally; otherwise uses the last restriction found.
* **Parameters:** None.

### `StartRevealing(restriction)`
* **Description:** Ensures the map icon exists (spawning if needed) and configures its restriction. Does nothing if the icon already exists with the same restriction.
* **Parameters:**  
  `restriction` (`string?`) — restriction string (see `AddRevealSource`). Default `""`.

### `StopRevealing()`
* **Description:** Destroys and nullifies the current icon if present.
* **Parameters:** None.

### `Refresh()`
* **Description:** Core periodic logic: checks for nearby `"maprevealer"`-tagged entities within `PLAYER_REVEAL_RADIUS` and adds/removes `"maprevealer"` as a reveal source accordingly. Then calls optional `onrefreshfn`.
* **Parameters:** None (called via periodic task).

### `SetOnRefreshFn(onrefreshfn)`
* **Description:** Registers a callback invoked at the end of each `Refresh()` call.
* **Parameters:**  
  `onrefreshfn` (`function`) — Signature: `fn(inst: Entity)`.

### `Start(delay)`
* **Description:** Starts the periodic refresh task if not already running.
* **Parameters:**  
  `delay` (`number`) — Initial delay (seconds) before first execution.

### `Stop()`
* **Description:** Cancels the refresh task and removes `"maprevealer"` as a reveal source.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup routine invoked when component is removed. Stops task, tears down all reveal sources, and destroys the icon.
* **Parameters:** None.

## Events & Listeners
- Listens to `"onremove"` events on entity-type reveal sources (registered via `AddRevealSource`), which triggers `RemoveRevealSource(source)`.
- Triggers no official events itself (i.e., `PushEvent` is not used).
- Uses `inst:DoPeriodicTask` for scheduled `Refresh` calls.

---