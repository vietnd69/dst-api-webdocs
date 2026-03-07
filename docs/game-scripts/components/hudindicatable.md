---
id: hudindicatable
title: Hudindicatable
description: Marks an entity as eligible for HUD tracking by the HUD indicatable manager.
tags: [hud, tracking, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e1d225d5
system_scope: ui
---

# Hudindicatable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `hudindicatable` component enables an entity to be tracked by the HUD system via the `hudindicatablemanager` component on the `TheWorld` entity. It provides a mechanism to control whether and how the entity should be displayed on the HUD (e.g., minimap indicators, icons) through a configurable tracking function. It automatically registers or unregisters itself with the world manager when added to or removed from the entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("hudindicatable")
inst:AddComponent("hudindicatable")
-- Optional: customize when the entity should be tracked
inst.components.hudindicatable:SetShouldTrackFunction(function(self, viewer)
    return viewer:HasTag("player") and not viewer:HasTag("ghost")
end)
```

## Dependencies & tags
**Components used:** `hudindicatablemanager` (on `TheWorld`)
**Tags:** None added or checked; relies on tag `hudindicatable` being added externally (e.g., during prefab definition).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shouldtrackfn` | function | `function() return true end` | Function `(entity, viewer) -> boolean` determining if this entity should be visible on the HUD for a given viewer. |

## Main functions
### `SetShouldTrackFunction(fn)`
* **Description:** Sets the function used to determine whether this entity should be tracked by the HUD for a given viewer.
* **Parameters:** `fn` (function) — A function taking two arguments (`self`, `viewer`) and returning a boolean.
* **Returns:** Nothing.

### `ShouldTrack(viewer)`
* **Description:** Evaluates whether this entity should be tracked for the specified viewer using the configured `shouldtrackfn`.
* **Parameters:** `viewer` (Entity) — The entity (typically a player) for whom tracking is being evaluated.
* **Returns:** `boolean` — `true` if the entity should be tracked, otherwise `false`.

### `RegisterWithWorldComponent()`
* **Description:** Registers this entity with the `hudindicatablemanager` component in the world if it exists.
* **Parameters:** None.
* **Returns:** Nothing.

### `UnRegisterWithWorldComponent()`
* **Description:** Unregisters this entity from the `hudindicatablemanager` and fires the `"unregister_hudindicatable"` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup callback called when the component is removed from its entity; triggers unregistration.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggers `UnRegisterWithWorldComponent`.
- **Pushes:** `unregister_hudindicatable` — fired when unregistered (e.g., on entity removal).
