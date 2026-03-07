---
id: grotto_pool_big
title: Grotto Pool Big
description: Creates and manages a large grotto pool entity with visual, lighting, and child object placement functionality.
tags: [environment, prefabs, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f01925c4
system_scope: environment
---

# Grotto Pool Big

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grotto_pool_big` is a non-persistent prefab used to render a large moonglass pool in the Grotto environment. It establishes the pool's geometry, lighting, minimap icon, and physics collision. On non-dedicated clients, it also spawns a visual steam FX effect. In the master simulation, it sets up runtime components (`watersource`, `inspectable`), registers itself with the world’s grotto pool registry, instantiates child decorative elements (moonglass clusters and waterfall), and handles save/load persistence for those child entities.

## Usage example
This prefab is typically spawned via world generation systems (e.g., room/task layouts). It is not intended for ad-hoc instantiation by mods, but if needed:
```lua
local inst = SpawnPrefab("grotto_pool_big")
if inst ~= nil and TheWorld.ismastersim then
    -- Additional setup (if any) would occur here
end
```

## Dependencies & tags
**Components used:** `watersource`, `inspectable`
**Tags:** Adds `antlion_sinkhole_blocker`, `birdblocker`, `watersource`, `FX`, `NOCLICK`

## Properties
No public properties.

## Main functions
### `makebigmist(proxy)`
*   **Description:** Creates a non-networked FX entity (steam) that visually overlays the pool. It mirrors the transform of a proxy entity and removes itself when the proxy is removed.
*   **Parameters:** `proxy` (Entity or `nil`) — The reference entity whose transform is copied. If `nil`, returns `nil`.
*   **Returns:** `inst` (Entity) — The steam FX entity, or `nil` if `proxy` is `nil`.
*   **Error states:** Returns `nil` if `proxy` is `nil`; the returned entity does not persist.

### `setup_children(inst)`
*   **Description:** Spawns and positions child prefabs (waterfall, moonglass clusters) relative to the pool’s world position. Each child listens for `onremove` to clear its reference from `inst._children`.
*   **Parameters:** `inst` (Entity) — The pool entity whose children to instantiate.
*   **Returns:** Nothing.

### `register_pool(inst)`
*   **Description:** Registers the pool as a large grotto pool with the world using the event `ms_registergrottopool`.
*   **Parameters:** `inst` (Entity) — The pool entity being registered.
*   **Returns:** Nothing.

### `on_save(inst, data)`
*   **Description:** Populates save data with GUIDs and layout indices of active child entities to support persistence across sessions.
*   **Parameters:** `inst` (Entity), `data` (table) — The save data table to populate.
*   **Returns:** `data.children_ids` (table of GUIDs) — List of child GUIDs being saved.

### `on_load_postpass(inst, newents, data)`
*   **Description:** Reconstructs `inst._children` after entity loading is complete by resolving saved GUIDs against the `newents` map.
*   **Parameters:** `inst` (Entity), `newents` (table mapping GUIDs to entities), `data` (table) — Loaded save data containing `children_ids` and `children_indexes`.
*   **Returns:** Nothing.

### `on_removed(inst)`
*   **Description:** Cleans up child entities when the pool is removed, ensuring no orphaned prefabs remain.
*   **Parameters:** `inst` (Entity) — The pool entity being removed.
*   **Returns:** Nothing.

### `poolfn()`
*   **Description:** The prefab constructor. Initializes the pool entity, configures its visuals, physics, lighting, and network behavior. Sets up master-only components and event handlers.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — The fully initialized pool entity.

## Events & listeners
- **Listens to:** `onremove` (via `inst:ListenForEvent("onremove", on_removed)`) — Triggers cleanup of child entities.
- **Pushes:** `ms_registergrottopool` — Emitted during initialization to register the pool with the world.

