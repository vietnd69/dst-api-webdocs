---
id: maprevealable
title: Maprevealable
description: Manages dynamic map revealed areas by spawning and tracking mini-map icons based on nearby map revealers and custom sources.
tags: [map, world, visibility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2d680960
system_scope: world
---

# Maprevealable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Maprevealable` is an entity component that dynamically controls the visibility of a mini-map icon by monitoring surrounding map revealers (e.g., players or structures) and custom reveal sources. It periodically checks for entities tagged as `maprevealer` within range, and also accepts manually added reveal sources. When at least one valid source is present, it spawns a `globalmapicon` prefab and tracks the owning entity on the mini-map, optionally applying restrictions or custom behaviors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maprevealable")

-- Configure icon appearance and behavior
inst.components.maprevealable:SetIcon("minimap_icon_key")
inst.components.maprevealable:SetIconPriority(10)
inst.components.maprevealable:SetIconTag("my_custom_tag")

-- Add a custom reveal source (e.g., a lantern or beacon)
inst.components.maprevealable:AddRevealSource(some_source, "night_restriction")

-- Assign a callback for when the component refreshes
inst.components.maprevealable:SetOnRefreshFn(function(e)
    print("Map revealable refresh triggered for:", e.prefab)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `maprevealer` internally (via `MAPREVEALER_TAGS`) when inspecting nearby entities; may add the tag set by `SetIconTag` to the spawned icon.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `refreshperiod` | number | `1.5` | Interval in seconds between map reveal checks. |
| `iconname` | string\|nil | `nil` | The mini-map icon key used by `MiniMapEntity:SetIcon`. |
| `iconpriority` | number\|nil | `nil` | Priority level for overlay order on the mini-map. |
| `iconprefab` | string | `"globalmapicon"` | Prefab name used to spawn the mini-map icon. |
| `icon` | GlobalMapIcon\|nil | `nil` | Reference to the spawned icon entity (internal). |
| `task` | periodic task\|nil | `nil` | Reference to the scheduled refresh task. |
| `revealsources` | table | `{}` | Dictionary mapping sources to `{ restriction = restriction, isentity = bool }`. |
| `oniconcreatedfn` | function\|nil | `nil` | Optional callback invoked after icon creation, before `TrackEntity`. |
| `onrefreshfn` | function\|nil | `nil` | Optional callback invoked each time `Refresh()` runs. |
| `_onremovesource` | function | `(see code)` | Internal handler used to auto-remove sources when their entity is removed. |

## Main functions
### `SetIcon(iconname)`
* **Description:** Updates the icon key used for the mini-map display.
* **Parameters:** `iconname` (string\|nil) — The key identifying the icon in `minimapdata.lua`.
* **Returns:** Nothing.
* **Error states:** If `iconname` is unchanged, no action is taken.

### `SetIconPriority(priority)`
* **Description:** Sets the display priority for the mini-map icon, affecting overlay order.
* **Parameters:** `priority` (number\|nil) — Higher numbers appear on top of lower ones.
* **Returns:** Nothing.
* **Error states:** If `priority` is unchanged, no action is taken.

### `SetIconPrefab(prefab)`
* **Description:** Changes the prefab used to spawn the icon. Triggers a full icon reset (stop then refresh reveal sources).
* **Parameters:** `prefab` (string) — The new icon prefab name.
* **Returns:** Nothing.

### `SetIconTag(tag)`
* **Description:** Assigns a tag to be added to or removed from the spawned icon. Ensures clean tag management on icon creation/destruction.
* **Parameters:** `tag` (string\|nil) — Tag to attach to the icon entity.
* **Returns:** Nothing.

### `SetOnIconCreatedFn(fn)`
* **Description:** Registers a callback invoked once the icon entity is created.
* **Parameters:** `fn` (function) — Signature: `fn(entity, icon_entity)`.
* **Returns:** Nothing.

### `AddRevealSource(source, restriction)`
* **Description:** Registers a new source that causes the map area to be revealed. Sources can be arbitrary keys or entity tables.
* **Parameters:**  
  - `source` (any) — Unique identifier or table with `entity` property.  
  - `restriction` (string\|nil) — Optional mini-map restriction string (e.g., `"night"`).
* **Returns:** Nothing.
* **Error states:** If `source` is a table with an `entity`, an `"onremove"` listener is registered. Adding an existing source updates its restriction if different.

### `RemoveRevealSource(source)`
* **Description:** Removes a previously added reveal source.
* **Parameters:** `source` (any) — The source key to remove.
* **Returns:** Nothing.
* **Error states:** If the source is an entity table, the `"onremove"` callback is unregistered before removal.

### `StartRevealing(restriction)`
* **Description:** Ensures an icon is spawned and tracking the entity, or updates the restriction if already active.
* **Parameters:** `restriction` (string\|nil) — Mini-map restriction to apply.
* **Returns:** Nothing.

### `StopRevealing()`
* **Description:** Removes the icon entity and nullifies internal reference.
* **Parameters:** None.
* **Returns:** Nothing.

### `Refresh()`
* **Description:** Periodically checks for nearby `maprevealer` entities within `PLAYER_REVEAL_RADIUS`. Adds/removes `"maprevealer"` as a reveal source accordingly and invokes the optional `onrefreshfn` callback.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOnRefreshFn(onrefreshfn)`
* **Description:** Registers a callback invoked on every refresh cycle.
* **Parameters:** `onrefreshfn` (function) — Signature: `fn(entity)`.
* **Returns:** Nothing.

### `Start(delay)`
* **Description:** Starts the periodic refresh task with optional initial delay.
* **Parameters:** `delay` (number) — Delay before first refresh, in seconds.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Cancels the refresh task and removes the `"maprevealer"` reveal source.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup routine called when the component is removed from its entity. Stops the task, removes all reveal sources, and cancels any entity listeners.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` — registered per entity reveal source to auto-remove it when the source entity is destroyed.
- **Pushes:** None identified.
