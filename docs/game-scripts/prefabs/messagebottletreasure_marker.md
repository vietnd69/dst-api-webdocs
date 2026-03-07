---
id: messagebottletreasure_marker
title: Messagebottletreasure Marker
description: Renders a minimap marker for message bottle treasure locations without gameplay interaction.
tags: [minimap, marker, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3b083bd9
system_scope: world
---

# Messagebottletreasure Marker

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This prefab serves as a dedicated minimap marker entity for indicating the location of message bottle treasure. It provides visual placement on the minimap with a fixed priority and icon, and emits world-scoped events when added or removed from the world. It has no gameplay logic, interactions, or persistence.

## Usage example
```lua
-- The prefab is automatically instantiated by the world generator.
-- Typical usage is internal to DST's map generation systems:
local marker = Prefab("messagebottletreasure_marker")
local inst = SpawnPrefab("messagebottletreasure_marker")
inst.Transform:SetPosition(x, 0, z)
```

## Dependencies & tags
**Components used:** `Transform`, `MiniMapEntity`, `Network`
**Tags:** Adds `NOCLICK`, `NOBLOCK`; checks `NOCLICK`, `NOBLOCK`.

## Properties
No public properties.

## Main functions
### `OnAdd(inst)`
*   **Description:** Callback invoked when the marker is added to the world; fires a world event to notify listeners of its presence.
*   **Parameters:** `inst` (Entity) - the marker entity instance.
*   **Returns:** Nothing.

### `OnRemove(inst)`
*   **Description:** Callback invoked when the marker is removed from the world; fires a world event to notify listeners of its removal.
*   **Parameters:** `inst` (Entity) - the marker entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` - triggers `OnRemove`.
- **Pushes:** `messagebottletreasure_marker_added` (when added), `messagebottletreasure_marker_removed` (when removed), both with the marker instance as payload.