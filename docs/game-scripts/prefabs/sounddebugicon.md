---
id: sounddebugicon
title: Sounddebugicon
description: Renders a temporary visual debug icon at a specific world location for sound-related testing.
tags: [audio, debug, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a03e1e00
system_scope: fx
---

# Sounddebugicon

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sounddebugicon` is a lightweight, non-persistent prefab used during development to visually indicate sound-emission events in the world. It spawns a small animated label and icon at a given position, displays it briefly, and then automatically removes itself after 0.5 seconds. It is purely a client-side debugging utility, as indicated by its `FX` tag and `persists = false` setting.

## Usage example
```lua
-- Typically instantiated via PrefabManager in response to sound events
-- Usage is internal to the engine; modders rarely create this prefab directly.
-- Example of how it might be spawned manually (though not recommended):
local icon = SpawnPrefab("sounddebugicon")
icon.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `label`
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
### `fn()`
*   **Description:** Constructor function that initializes the entity instance. Sets up transform, animation state, and label components, configures label appearance and offset, loads the `"sound"` bank with `"sounddebug"` build, plays the `"idle"` animation, sets final offset, tags as `FX`, disables persistence, and schedules automatic removal after 0.5 seconds.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — the fully initialized and configured entity instance.
*   **Error states:** None.

## Events & listeners
None identified.