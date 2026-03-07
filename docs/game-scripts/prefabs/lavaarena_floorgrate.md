---
id: lavaarena_floorgrate
title: Lavaarena Floorgrate
description: A decorative and ambient floor component used in the Lava Arena event, featuring synchronized lava animation and periodic ember effects.
tags: [environment, decorator, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cc4f60e6
system_scope: environment
---

# Lavaarena Floorgrate

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_floorgrate` is a static environmental prefab that serves as a decorative floor tile within the Lava Arena event. It displays an animated lava effect using a separate non-networked child entity and coordinates periodic ember spawn effects. The component uses a networked scalar (`_lavaspeed`) to synchronize lava animation speed across clients, and it only simulates physics and logic on the master world (server), while clients handle visual updates.

## Usage example
This prefab is instantiated internally by the game during Lava Arena world generation and is not intended for manual instantiation by modders. However, a typical usage pattern in mod code would be:

```lua
local inst = SpawnPrefab("lavaarena_floorgrate")
inst.Transform:SetPos(x, y, z)
-- No further action needed: animation and ember effects are handled automatically
```

## Dependencies & tags
**Components used:** None (uses only built-in ECS components: `transform`, `animstate`, `soundemitter`, `network`; no custom component calls).
**Tags:** Adds `NOCLICK`; does not modify or check other tags.

## Properties
No public properties — the component relies solely on internal state (`_lavaspeed` is a networked variable, not a direct property).

## Main functions
### `CreateLavaEntity()`
*   **Description:** Constructs a non-networked child entity that renders the background lava animation. It is parented to the main floorgrate entity on non-dedicated clients.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the lava animation entity.
*   **Error states:** None.

### `SpawnEmber(inst)`
*   **Description:** Spawns a short-lived ember FX at the location of the floorgrate, used for ambient visual effects.
*   **Parameters:** `inst` (Entity) — the floorgrate instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnLavaSpeedDirty(inst)`
*   **Description:** Updates the animation speed multiplier of the lava child entity to reflect the current lava flow speed.
*   **Parameters:** `inst` (Entity) — the floorgrate instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst.lava` is `nil` (e.g., on dedicated servers or before lava entity creation).

## Events & listeners
- **Listens to:** `lavaspeeddirty` — updates the lava animation speed on non-master clients when the `_lavaspeed` value changes.
- **Pushes:** `lavaspeeddirty` — fired via `net_tinybyte` when `_lavaspeed` is set on the master (triggered on value change, not manually in source).