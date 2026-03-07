---
id: shadowwatcher
title: Shadowwatcher
description: Creates a non-persistent visual effect entity that disappears when exposed to light or after a random delay, used for atmospheric shadow creature effects.
tags: [fx, lighting, atmosphere, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb5b6f87
system_scope: fx
---

# Shadowwatcher

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowwatcher` is a prefab function that creates a lightweight, non-networked visual entity representing a shadow creature footprint or effect. It is designed to appear only in darkness and vanish when the player gains night vision or the entity is exposed to light. It uses animation states to play a looping animation and integrates with the `LightWatcher` component to detect lighting conditions.

## Usage example
```lua
-- Not intended for direct use by modders; spawned internally for atmospheric effects
-- Example of how the entity behaves when instantiated:
local inst = SpawnPrefab("shadowwatcher")
-- The entity automatically:
--   - Hides itself initially
--   - Checks lighting conditions
--   - Removes itself if light is detected or after a delay
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `lightwatcher`
**Tags:** Adds `NOCLICK`, `FX`; checks `NOCLICK`, `FX`, `lightsource`

## Properties
No public properties

## Main functions
### `Disappear(inst)`
*   **Description:** Cancels pending tasks and triggers the death animation sequence before removing the entity. Called when the entity enters light or the timeout expires.
*   **Parameters:** `inst` (EntityInstance) - the entity instance to act upon.
*   **Returns:** Nothing.
*   **Error states:** Safely handles `nil` `lighttask` and `deathtask` references.

### `OnInit(inst)`
*   **Description:** Initial lighting check performed after a 0-tick delay. Removes the entity if it is in light; otherwise, makes it visible.
*   **Parameters:** `inst` (EntityInstance) - the entity instance to initialize.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `enterlight` — triggers `Disappear` when the entity enters a lit area.  
  - `animqueueover` — triggers `inst.Remove` after the death animation completes.  
  - `nightvision` (on `ThePlayer`) — removes the entity if the player gains night vision.
- **Pushes:** None