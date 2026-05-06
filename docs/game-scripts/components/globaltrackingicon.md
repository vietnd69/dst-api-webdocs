---
id: globaltrackingicon
title: GlobalTrackingIcon
description: Manages global tracking icons for an entity, visible to specific players and map revealers.
tags: [map, tracking, ui]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: ef7c488a
system_scope: entity
---

# GlobalTrackingIcon

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`GlobalTrackingIcon` manages tracking icons for an entity that are visible globally to specific players. It creates two icon types: a global icon visible only to the tracking owner, and revealable icons visible to other players when nearby. Works alongside the `maprevealable` component to handle far-distance icon visibility. Typically used for tracking moving entities like bosses or special targets across the map.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("globaltrackingicon")
inst.components.globaltrackingicon:StartTracking(player, "mytracker")
-- Later, when tracking is no longer needed:
inst.components.globaltrackingicon:StopTracking()
```

## Dependencies & tags
**Components used:**
- `maprevealable` — added dynamically during `StartTracking()` to handle far-distance icon visibility

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `globalicon` | entity | `nil` | Icon entity visible only to the tracking owner. Spawned as `<name>_globalicon`. |
| `revealableicon` | entity | `nil` | Icon entity visible to other players when nearby. Spawned as `<name>_revealableicon`. |
| `owner` | entity | `nil` | The player entity that owns this tracking icon. Set by `StartTracking()`. |

## Main functions
### `StartTracking(owner, name)`
* **Description:** Begins tracking the entity with icons visible to the specified owner. Disables the entity's MiniMapEntity, spawns a global icon for the owner, and spawns revealable icons for other players. Adds `maprevealable` component if not present.
* **Parameters:**
  - `owner` — player entity that will see the global icon
  - `name` — string prefab name base for icons (default: `self.inst.prefab`)
* **Returns:** nil
* **Error states:** Errors if `owner` is nil when passed to `SetClassifiedOwner()` or `SetAsNonProxyExcludingOwner()` — no nil guard present. Errors if icon prefab `<name>_globalicon` or `<name>_revealableicon` does not exist.

### `StopTracking()`
* **Description:** Stops all tracking, removes both icon entities, re-enables MiniMapEntity, and removes the `maprevealable` component. Clears `owner` reference.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — all entity references are nil-checked before removal operations.

### `OnRemoveFromEntity()`
* **Description:** Lifecycle hook called when component is removed from entity. Automatically calls `StopTracking()` to clean up icons and restore MiniMapEntity state.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnFarRevealableIconCreated(inst, icon)` (local)
* **Description:** Callback function registered with `maprevealable` component via `SetOnIconCreatedFn()`. Called when the far revealable icon is created. Sets the icon as a proxy excluding the tracking owner so other players can see it.
* **Parameters:**
  - `inst` — entity with this component
  - `icon` — the created icon entity
* **Returns:** nil
* **Error states:** Errors if `owner` is nil when `SetAsProxyExcludingOwner()` is called — no nil guard present in callback body.

## Events & listeners
None identified.