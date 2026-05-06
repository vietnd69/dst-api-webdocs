---
id: globalmapicon
title: Globalmapicon
description: Prefab file registering multiple global map icon entities and a factory function for creating tracked entity icons with owner-classified visibility.
tags: [prefab, minimap, tracking, network]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 4339f3b6
system_scope: entity
---

# Globalmapicon

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`globalmapicon.lua` registers four base map icon prefabs (`globalmapicon`, `globalmapiconnamed`, `globalmapiconunderfog`, `globalmapiconseeable`) and provides the `MakeGlobalTrackingIcons()` factory function for creating custom tracked entity icons. The factory function generates two additional prefabs per call: `{name}_globalicon` (visible only to owner via classified network) and `{name}_revealableicon` (visible to all other players). The prefabs use `MiniMapEntity` for rendering icons on the minimap, with variants supporting fog-of-war visibility, display names, and owner-classified visibility. Position tracking is handled via the `updatelooper` component.

## Usage example
```lua
-- Spawn a base map icon prefab:
local inst = SpawnPrefab("globalmapicon")
inst.Transform:SetPosition(10, 0, 10)

-- Create custom tracked icons for an entity:
MakeGlobalTrackingIcons("my_tracked_entity", {
    icondata = {
        icon = "custom_icon",
        priority = 50,
        selectedicon = "custom_icon_selected",
    }
})

-- Track an entity with the icon (server-side):
if TheWorld.ismastersim then
    local icon = SpawnPrefab("my_tracked_entity_globalicon")
    icon:TrackEntity(target_entity)
end
```

## Dependencies & tags
**External dependencies:**
- `RegisterGlobalMapIcon` -- global function for registering icons with the tracking system
- `MiniMapEntity` -- entity component for minimap icon rendering (C++ entity component)
- `Network` -- entity component for classified target handling (C++ entity component)

**Components used:**
- `updatelooper` -- adds periodic update function for position synchronization

**Tags:**
- `globalmapicon` -- added to all icon prefabs for identification
- `CLASSIFIED` -- added to all icon prefabs for network visibility control

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `icondata` | table | --- | Table containing icon configuration: `icon`, `selectedicon`, `priority`, `selectedpriority`. Set in `gclass_fn` and `revealable_fn`. |
| `owner` | net_entity | --- | (revealableicon only) Owner entity reference. Synced via netvar `"revealableicon.owner"`. Dirty event: `dirty`. |
| `isproxy` | net_bool | --- | (revealableicon only) Proxy state flag. Synced via netvar `"revealableicon.isproxy"`. Dirty event: `dirty`. |
| `_target_displayname` | net_string | --- | (globalmapiconnamed only) Display name for the tracked target. Synced via netvar `"globalmapiconnamed._target_displayname"`. |
| `_target` | entity | `nil` | Target entity being tracked. Set by `TrackEntity()`. |
| `iconnear` | entity | `nil` | (gclass only) Near-range icon instance created by `gclass_Init()`. |
| `iconfar` | entity | `nil` | (gclass only) Far-range icon instance created by `gclass_Init()`. |
| `selected` | boolean | `nil` | (gclass only) Whether icon is currently selected in map screen. |
| `persists` | boolean | `false` | All icon prefabs set `persists = false` -- icons do not save with the world. |
| `TrackEntity` | function | `nil` | Server-side method to track a target entity. Assigned in `common_server()` and factory functions. |
| `SetClassifiedOwner` | function | `nil` | Sets the classified owner for gclass icons. Assigned in `MakeGlobalTrackingIcons()` globalicon prefab. |
| `SetAsProxyExcludingOwner` | function | `nil` | Sets revealable icon as proxy for non-owner visibility. Assigned in `MakeGlobalTrackingIcons()` revealableicon prefab. |
| `SetAsNonProxyExcludingOwner` | function | `nil` | Sets revealable icon as non-proxy. Assigned in `MakeGlobalTrackingIcons()` revealableicon prefab. |

## Main functions
### `UpdatePosition(inst)` (local)
* **Description:** Updates the icon's world position to match the tracked target's X/Z coordinates. Called periodically via `updatelooper`. Skips update if position hasn't changed.
* **Parameters:** `inst` -- icon entity instance
* **Returns:** None
* **Error states:** Errors if `inst._target` is nil or `_target.Transform` is missing (no guard present).

### `TrackEntity(inst, target, restriction, icon, noupdate)` (local)
* **Description:** Configures the icon to track a target entity. Sets up MiniMapEntity icon, adds `onremove` listener to clean up icon when target is removed, and optionally attaches `updatelooper` for position updates.
* **Parameters:**
  - `inst` -- icon entity instance
  - `target` -- entity to track
  - `restriction` -- minimap restriction setting (optional)
  - `icon` -- custom icon path (optional; falls back to target's icon or prefab name)
  - `noupdate` -- if truthy, skips attaching updatelooper for position updates
* **Returns:** None
* **Error states:** Errors if `target.MiniMapEntity` or `target.prefab` is nil (accessed without guard). Also errors if `target.Transform` is nil (used in `UpdatePosition` callback). Source comment notes this function cannot be run twice without causing issues.

### `common_fn()` (local)
* **Description:** Shared client-side initialization for base icon prefabs. Creates entity, adds Transform/MiniMapEntity/Network components, sets classified tags, configures MiniMapEntity caching and proxy settings, and disables sleeping.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `common_server(inst)` (local)
* **Description:** Shared server-side initialization for base icon prefabs. Sets `_target` to nil, assigns `TrackEntity` method, and sets `persists = false`.
* **Parameters:** `inst` -- entity from `common_fn()`
* **Returns:** None
* **Error states:** None.

### `overfog_fn()` (local)
* **Description:** Prefab constructor for `globalmapicon`. Enables drawing over fog of war, registers with global map icon system, and calls server initialization on master.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `overfog_named_fn()` (local)
* **Description:** Prefab constructor for `globalmapiconnamed`. Same as `overfog_fn()` but adds `net_string` for `_target_displayname` to support custom display names.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `underfog_fn()` (local)
* **Description:** Prefab constructor for `globalmapiconunderfog`. Does not enable fog-of-war override (icon hidden under fog).
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `overfog_seeable_fn()` (local)
* **Description:** Prefab constructor for `globalmapiconseeable`. Enables fog-of-war override with additional visibility flag (second parameter `true`).
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `gclass_or_revealable_CreateIcon(overfog, isproxy, icondata, selected)` (local)
* **Description:** Helper function for `MakeGlobalTrackingIcons`. Creates a minimap icon entity with specified fog, proxy, and icon settings. Used to create near/far icon pairs for classified icons.
* **Parameters:**
  - `overfog` -- boolean for fog-of-war visibility
  - `isproxy` -- boolean for proxy rendering mode
  - `icondata` -- table with `icon`, `selectedicon`, `priority`, `selectedpriority`
  - `selected` -- boolean for selected state styling
* **Returns:** entity instance
* **Error states:** Errors if `icondata` is nil (`icondata.icon` and `icondata.selectedicon` accessed without nil guard).

### `gclass_RefreshIcon(inst)` (local)
* **Description:** Updates icon graphics for near/far icons based on current selection state. Called when selection changes.
* **Parameters:** `inst` -- gclass icon entity
* **Returns:** None
* **Error states:** Errors if `inst.iconnear` or `inst.iconfar` is nil (no guard present). Also errors if `inst.icondata` is nil (accessed without guard when reading `selectedicon`/`icon` fields).

### `gclass_OnMapSelected(inst)` (local)
* **Description:** Event handler for `mapselected` event. Sets `selected = true` and refreshes icon graphics.
* **Parameters:** `inst` -- gclass icon entity
* **Returns:** None
* **Error states:** None.

### `gclass_OnCancelMapTarget(inst)` (local)
* **Description:** Event handler for `cancelmaptarget` event. Clears `selected` and refreshes icon graphics.
* **Parameters:** `inst` -- gclass icon entity
* **Returns:** None
* **Error states:** None.

### `gclass_or_revealable_TrackEntity(inst, target)` (local)
* **Description:** TrackEntity implementation for factory-created icons. Attaches `updatelooper` and sets up `onremove` cleanup listener.
* **Parameters:**
  - `inst` -- icon entity
  - `target` -- entity to track
* **Returns:** None
* **Error states:** Errors if `inst._target.Transform` is nil (`UpdatePosition` callback accesses it without guard).

### `gclass_Init(inst)` (local)
* **Description:** Initializes near/far icon pair for gclass icons. Creates both icon instances and parents them to the main entity.
* **Parameters:** `inst` -- gclass icon entity
* **Returns:** None
* **Error states:** None.

### `gclass_SetClassifiedOwner(inst, owner)` (local)
* **Description:** Sets the classified owner for the icon. Creates near/far icons if owner has HUD; removes them if owner is cleared.
* **Parameters:**
  - `inst` -- gclass icon entity
  - `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None

### `revealable_Init(inst)` (local)
* **Description:** Initialization function for revealable icons. Creates single icon if owner doesn't have HUD (non-owner view); removes icon if owner does have HUD. Assigned to `OnEntitySleep`/`OnEntityWake` on client.
* **Parameters:** `inst` -- revealable icon entity
* **Returns:** None
* **Error states:** None.

### `revealable_SetAsProxyExcludingOwner(inst, owner)` (local)
* **Description:** Sets revealable icon as proxy (visible to non-owners). Updates netvars and reinitializes if not on dedicated server.
* **Parameters:**
  - `inst` -- revealable icon entity
  - `owner` -- owner entity
* **Returns:** None
* **Error states:** None.

### `revealable_SetAsNonProxyExcludingOwner(inst, owner)` (local)
* **Description:** Sets revealable icon as non-proxy. Updates netvars and reinitializes if not on dedicated server.
* **Parameters:**
  - `inst` -- revealable icon entity
  - `owner` -- owner entity
* **Returns:** None
* **Error states:** None.

### `MakeGlobalTrackingIcons(name, data)`
* **Description:** Factory function that creates two prefabs for tracking a custom entity: `{name}_globalicon` (owner-classified) and `{name}_revealableicon` (visible to others). Accepts optional `data` table with `icondata` configuration for custom icons, priorities, and selection styling. Supports `global_common_postinit`, `global_master_postinit`, `revealable_common_postinit`, and `revealable_master_postinit` callbacks for custom initialization.
* **Parameters:**
  - `name` -- string base name for the prefabs
  - `data` -- optional table with configuration:
    - `icondata.icon` -- base icon name (default: `name`)
    - `icondata.globalicon` -- override icon for owner view
    - `icondata.revealableicon` -- override icon for non-owner view
    - `icondata.selectedicon` -- icon when selected in map screen
    - `icondata.priority` -- minimap priority value
    - `icondata.selectedpriority` -- priority when selected
    - `global_common_postinit` -- function(inst) called on client+master for globalicon
    - `global_master_postinit` -- function(inst) called on master only for globalicon
    - `revealable_common_postinit` -- function(inst) called on client+master for revealableicon
    - `revealable_master_postinit` -- function(inst) called on master only for revealableicon
* **Returns:** Two `Prefab` objects (comma-separated return)
* **Error states:** None.



## Events & listeners
**Listens to:**
- `onremove` (on target entity) -- triggers icon removal when tracked target is removed; set up in `TrackEntity()` and `gclass_or_revealable_TrackEntity()`
- `mapselected` -- triggers `gclass_OnMapSelected`; sets icon as selected in map screen (gclass icons only)
- `cancelmaptarget` -- triggers `gclass_OnCancelMapTarget`; clears selection state (gclass icons only)
- `dirty` -- triggers `revealable_Init`; fires when `owner` or `isproxy` netvars change (revealableicon client only)

**Pushes:** None identified.