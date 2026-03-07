---
id: grotto_waterfall_small
title: Grotto Waterfall Small
description: Represents a mineable moonglass rock in grotto environments that regrows during cave full moons and drops moonglass upon breaking.
tags: [environment, mining, regrowth, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0617f7a6
system_scope: environment
---

# Grotto Waterfall Small

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grotto_waterfall_small` is a prefab that defines two variations (`small1` and `small2`) of small moonglass rocks found in grotto caves. These rocks are mineable and feature dynamic state transitions: they begin as intact structures that can be mined, transition to a fully mined state (non-interactive and visually distinct), and can regrow into full state during cave full moon events if properly mined. The prefabs rely on the `workable` and `lootdropper` components to handle mining interaction and item drops, respectively.

## Usage example
This prefab is automatically instantiated by the worldgen system and is not typically created manually in mod code. However, for reference, its core logic is invoked via built-inprefab instantiation:

```lua
-- Example: How the game internally creates one variant
local inst = Prefab("grotto_waterfall_small1", falls1, assets)
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst:AddComponent("workable")
inst:AddComponent("lootdropper")
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`  
**Tags:** Adds `"moonglass"` and `"NOCLICK"` conditionally; checks `"iscavefullmoon"` via `WatchWorldState`.

## Properties
No public properties exposed to modders. Internal state stored in `inst._type`, `inst.scrapbook_proxy`, and `inst.no_wet_prefix`.

## Main functions
### `set_full(inst)`
*   **Description:** Restores the rock to its full, mineable state: removes `"NOCLICK"` tag, sets physical radius, adjusts animation, and updates workable work left to full.
*   **Parameters:** `inst` (EntityInstance) — the rock entity.
*   **Returns:** Nothing.

### `set_fully_mined(inst)`
*   **Description:** Transitions the rock to a mined state: adds `"NOCLICK"` tag, clears physics radius override, plays mined animation, and registers observation for cave full moon events to enable regrowth.
*   **Parameters:** `inst` (EntityInstance) — the rock entity.
*   **Returns:** Nothing.

### `on_mined(inst, worker, workleft)`
*   **Description:** Called by `workable` component when mining completes (`workleft <= 0`). Spawns break FX, drops loot using `lootdropper`, and transitions the rock to fully mined state.
*   **Parameters:**  
  - `inst` (EntityInstance) — the rock entity.  
  - `worker` (EntityInstance or `nil`) — the entity performing the mining (may be `nil` for automation or environmental triggers).  
  - `workleft` (number) — remaining work units (used to detect completion).
*   **Returns:** Nothing.

### `workableload(inst, data)`
*   **Description:** Loaded-state callback for `workable`. Ensures correct state is restored from saved data; if `data.workleft <= 0`, transitions to mined state.
*   **Parameters:**  
  - `inst` (EntityInstance) — the rock entity.  
  - `data` (table) — saved state data passed by `workable` on load.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `iscavefullmoon` (via `WatchWorldState`) — triggers regrowth check on full moon events in caves.
- **Pushes:** None directly; relies on component events (`workable`, `lootdropper`) for interaction flow.