---
id: sunderarmordebuff
title: Sunderarmordebuff
description: A visual effect prefab that represents a sunder armor debuff in the Lava Arena event, displayed as a non-interactive decorative FX entity.
tags: [fx, visual, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d13dcd1d
system_scope: fx
---

# Sunderarmordebuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Sunderarmordebuff` is a lightweight visual FX prefab used in the Lava Arena event to indicate a sunder armor debuff state. It creates a non-interactive entity with an animation state and decorative tags. It does not implement game logic directly but serves as a client-side visual indicator. Server-side initialization is delegated to an external `master_postinit` function via `event_server_data`.

## Usage example
This prefab is instantiated internally by the Lava Arena event system. Typical usage involves spawning it as a child entity near a debuffed actor:

```lua
local debuffFX = SpawnPrefab("sunderarmordebuff")
if debuffFX ~= nil then
    debuffFX.Transform:SetPosition(x, y, z)
    debuffFX.Transform:SetParent(some_debuffed_entity)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `DECOR` and `NOCLICK`; does not check or remove tags.

## Properties
No public properties.

## Main functions
The component logic resides in the prefab constructor `fn()` — no explicit public methods are defined.

### `fn()`
*   **Description:** Constructor function that builds and configures the `sunderarmordebuff` prefab instance.
*   **Parameters:** None.
*   **Returns:** `inst` — The fully initialized entity instance.
*   **Error states:** Returns early on non-master_sim instances (i.e., client) without calling `master_postinit`.

## Events & listeners
None identified.