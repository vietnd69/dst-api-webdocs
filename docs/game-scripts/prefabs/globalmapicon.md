---
id: globalmapicon
title: Globalmapicon
description: Manages networked map icons used to track entities on the global minimap, supporting fog-of-war visibility states and optional name labels.
tags: [network, map, icon]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d8add29f
system_scope: map
---

# Globalmapicon

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`globalmapicon` is a specialized prefab component system used to create and track entities whose positions are rendered on the minimap, particularly in contexts involving fog-of-war or global world visibility. It is not a standalone component but a set of prefabs (`globalmapicon`, `globalmapiconnamed`, `globalmapiconunderfog`, `globalmapiconseeable`) that wrap an entity with `MiniMapEntity`, `Transform`, and `Network` capabilities. The system supports dynamic tracking of a target entity via `TrackEntity()`, automatically syncing position updates using the `updatelooper` component on the master simulation.

## Usage example
```lua
local icon = SpawnPrefab("globalmapicon")
icon.components.globalmapicon:TrackEntity(target_entity, nil, "myicon.png")

-- Later, for named display (server-side only):
local named_icon = SpawnPrefab("globalmapiconnamed")
named_icon.components.globalmapicon:TrackEntity(target_entity, nil, nil)
named_icon._target_displayname:Set("My Target")
```

## Dependencies & tags
**Components used:** `Transform`, `MiniMapEntity`, `Network`, `updatelooper` (added dynamically)  
**Tags:** Adds `globalmapicon` and `CLASSIFIED` to each instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `Entity` or `nil` | `nil` | Reference to the entity being tracked; set via `TrackEntity()`. |
| `_x`, `_z` | number | `0` | Cached world X and Z coordinates for position change detection. |
| `_target_displayname` | `net_string` | `nil` | (Only in `globalmapiconnamed`) Networked string for displaying a custom label on the minimap. |

## Main functions
### `TrackEntity(target, restriction, icon, noupdate)`
* **Description:** Configures the icon to follow the specified `target` entity. Updates the icon's position every frame via `UpdatePosition` (unless `noupdate` is true). Also sets the minimap icon image (either explicitly, copied from the target, or inferred from `prefab`). Registers an `onremove` listener to auto-cleanup when the target is removed.
* **Parameters:**  
  `target` (`Entity`) — the entity to track.  
  `restriction` (`MiniMapRestriction?`, optional) — restriction mask for minimap visibility.  
  `icon` (`string?`, optional) — filename of the icon image (e.g., `"beefalo.png"`). If omitted and `target.MiniMapEntity` exists, copies the icon; otherwise defaults to `target.prefab..".png"`.  
  `noupdate` (`boolean?`, optional) — if `true`, skips adding the `updatelooper` and positional updates.  
* **Returns:** Nothing.
* **Error states:** This function must only be called once per instance (see `TODO(JBK)` comment); calling it again without re-initialization causes undefined behavior.

### `UpdatePosition(inst)`
* **Description:** Internal helper function (called by `updatelooper`) that reads the target's world position and updates the icon’s own transform. Only triggers if the X or Z coordinate changed since the last update.
* **Parameters:**  
  `inst` (`Entity`) — the icon entity instance (passed implicitly as `self` in the loop).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — fired by the target entity; calls `inst:Remove()` to destroy this icon when the target is removed.