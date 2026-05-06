---
id: maprevealable
title: Maprevealable
description: Manages minimap icon revelation for an entity, controlling visibility based on nearby map revealer sources.
tags: [minimap, revelation, icon]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: d60908e9
system_scope: entity
---

# Maprevealable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`MapRevealable` controls whether an entity's minimap icon is revealed to players based on proximity to map revealer sources. It spawns a `globalmapicon` prefab that tracks the owning entity and manages icon properties like name, priority, and tags. The component runs a periodic refresh task that checks for nearby entities with the `maprevealer` tag to determine revelation status.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maprevealable")

-- Configure icon appearance
inst.components.maprevealable:SetIcon("map_icon_chest")
inst.components.maprevealable:SetIconPriority(10)

-- Add a reveal source (entity-based)
local revealer = SpawnPrefab("maprevealer")
inst.components.maprevealable:AddRevealSource(revealer)

-- Set callback for icon creation
inst.components.maprevealable:SetOnIconCreatedFn(function(inst, icon)
    print("Icon created for entity")
end)
```

## Dependencies & tags
**External dependencies:**
- `SpawnPrefab` -- spawns the minimap icon prefab
- `GetClosestInstWithTag` -- checks for nearby map revealer entities during refresh

**Components used:**
- None identified

**Tags:**
- `maprevealer` -- checked via `GetClosestInstWithTag` to determine revelation status
- Icon entity tags -- dynamically added/removed via `SetIconTag()`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `refreshperiod` | number | `1.5` | Interval in seconds between refresh task ticks. |
| `iconname` | string | `nil` | Name identifier for the minimap icon. Set via `SetIcon()`. |
| `iconpriority` | number | `nil` | Priority value for icon rendering order. Set via `SetIconPriority()`. |
| `iconprefab` | string | `"globalmapicon"` | Prefab name spawned for the minimap icon. |
| `icon` | entity | `nil` | The spawned icon entity. `nil` when not revealing. |
| `task` | task | `nil` | Periodic refresh task handle. Cancelled on component removal. |
| `revealsources` | table | `{}` | Table of reveal sources keyed by source reference. Each entry contains `restriction` and optional `isentity` flag. |
| `icontag` | string | `nil` | Tag applied to the icon entity. Set via `SetIconTag()`. |
| `oniconcreatedfn` | function | `nil` | Callback fired when icon is created. Signature: `fn(inst, icon)`. Set via `SetOnIconCreatedFn()`. |
| `onrefreshfn` | function | `nil` | Callback fired on each refresh tick. Signature: `fn(inst)`. Set via `SetOnRefreshFn()`. |
| `_onremovesource` | function | --- | Internal callback for source entity removal events. Triggers `RemoveRevealSource()`. |
| `MAPREVEALER_TAGS` | table (local) | `{"maprevealer"}` | File-scope constant used in `Refresh()` to query nearby revealers. |

## Main functions
### `SetIcon(iconname)`
*   **Description:** Updates the minimap icon name. If the icon entity exists, immediately applies the new icon via `MiniMapEntity:SetIcon()`.
*   **Parameters:** `iconname` -- string icon name identifier
*   **Returns:** nil
*   **Error states:** None

### `SetIconPriority(priority)`
*   **Description:** Updates the minimap icon rendering priority. If the icon entity exists, immediately applies via `MiniMapEntity:SetPriority()`.
*   **Parameters:** `priority` -- number priority value
*   **Returns:** nil
*   **Error states:** None

### `SetIconPrefab(prefab)`
*   **Description:** Changes the prefab used for the minimap icon. If an icon already exists, stops revealing and refreshes to spawn the new prefab.
*   **Parameters:** `prefab` -- string prefab name
*   **Returns:** nil
*   **Error states:** None

### `SetIconTag(tag)`
*   **Description:** Sets a tag on the icon entity. Removes the previous tag if one exists, then adds the new tag.
*   **Parameters:** `tag` -- string tag name or `nil` to clear
*   **Returns:** nil
*   **Error states:** None

### `SetOnIconCreatedFn(fn)`
*   **Description:** Registers a callback to be fired when the icon entity is created. Called after icon setup but before `TrackEntity()`.
*   **Parameters:** `fn` -- function with signature `fn(inst, icon)`
*   **Returns:** nil
*   **Error states:** None

### `AddRevealSource(source, restriction)`
*   **Description:** Adds a reveal source that enables icon revelation. If the source is an entity table with an `entity` field, listens for its `onremove` event to auto-clean. Triggers `RefreshRevealSources()` to update revelation state.
*   **Parameters:**
    - `source` -- table or string source identifier
    - `restriction` -- string restriction filter or `nil` for no restriction
*   **Returns:** nil
*   **Error states:** None

### `RemoveRevealSource(source)`
*   **Description:** Removes a reveal source. If the source was an entity, removes the `onremove` event listener. Triggers `RefreshRevealSources()` to update revelation state.
*   **Parameters:** `source` -- table or string source identifier
*   **Returns:** nil
*   **Error states:** None

### `RefreshRevealSources()`
*   **Description:** Evaluates all reveal sources to determine if revelation should be active. If any source has no restriction, starts revealing. If all sources have restrictions, starts revealing with the last restriction value. If no sources exist, stops revealing.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `StartRevealing(restriction)`
*   **Description:** Spawns the icon entity if not already present and configures it to track the owning entity. Applies icon tag, priority, and calls `oniconcreatedfn` if set. If icon already exists, updates its restriction.
*   **Parameters:** `restriction` -- string restriction filter or `nil`
*   **Returns:** nil
*   **Error states:** Errors if `self.icon.MiniMapEntity` is nil when icon exists but lacks the component (no guard present).

### `StopRevealing()`
*   **Description:** Removes the icon entity and clears the `icon` reference.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `Refresh()`
*   **Description:** Periodic refresh callback. Checks for nearby entities with the `maprevealer` tag within `PLAYER_REVEAL_RADIUS`. Adds or removes the `maprevealer` source based on proximity. Fires `onrefreshfn` callback if set.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `SetOnRefreshFn(onrefreshfn)`
*   **Description:** Registers a callback to be fired on each refresh tick.
*   **Parameters:** `onrefreshfn` -- function with signature `fn(inst)`
*   **Returns:** nil
*   **Error states:** None

### `Start(delay)`
*   **Description:** Starts the periodic refresh task. Uses `refreshperiod` as the interval. Only creates task if not already running.
*   **Parameters:** `delay` -- number initial delay in seconds before first tick
*   **Returns:** nil
*   **Error states:** None

### `Stop()`
*   **Description:** Stops the periodic refresh task and removes the `maprevealer` reveal source.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when component is removed from entity. Stops the refresh task and removes all reveal sources.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `Refresh(inst, self)` (local)
*   **Description:** File-scope helper function passed to `DoPeriodicTask`. Calls `self:Refresh()` with correct context.
*   **Parameters:**
    - `inst` -- entity instance
    - `self` -- component instance
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
- **Listens to:** `onremove` -- fired on source entities; triggers `RemoveRevealSource()` to clean up when a source entity is removed