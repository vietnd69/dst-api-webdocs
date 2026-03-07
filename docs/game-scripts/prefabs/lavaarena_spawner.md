---
id: lavaarena_spawner
title: Lavaarena Spawner
description: Creates a non-networked decorative entity with animated scratch marks and spawner teeth used for visual context in the Lava Arena biome.
tags: [environment, fx, decor]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e76d8086
system_scope: environment
---

# Lavaarena Spawner

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_spawner` is a visual-only prefab used in the Lava Arena world type. It renders static environmental decoration — specifically, animated scratch marks and spawner teeth — to enhance the thematic immersion of the arena. The entity is non-persistent (`persists = false`) and is only created on the client side (non-dedicated servers), with a corresponding server-side initialization hook via `event_server_data`.

## Usage example
This prefab is instantiated automatically by the game world when loading the Lava Arena biome. Modders typically do not need to manually spawn it, but could reference it via `SpawnPrefab("lavaarena_spawner")` in custom level or room generation logic.

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `DECOR`, `NOCLICK`, `FX` to child decorative entities. The main entity does not hold tags.

## Properties
No public properties.

## Main functions
### `CreateScratches()`
*   **Description:** Creates and returns a non-networked, background-layered entity with scratch mark animation for decorative purposes.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — A fully configured child entity with `Transform`, `AnimState`, and tags `DECOR` and `NOCLICK`.
*   **Error states:** None; always returns a valid entity.

### `CreateSpawnTooth(variation)`
*   **Description:** Creates and returns a non-networked spawner tooth FX entity. Optionally overrides the `spawntooth` symbol with a variation ID.
*   **Parameters:** `variation` (number) — Used to select one of four visual variants (`variation % 4`).
*   **Returns:** `inst` (Entity) — A fully configured child entity with `Transform`, `AnimState`, and tags `FX` and `NOCLICK`.
*   **Error states:** If `variation > 0`, it applies `OverrideSymbol("spawntooth", ...)`; no error state is defined.

### `GetDecorPos(index)`
*   **Description:** Calculates 3D world-space positions for decorating the spawner perimeter.
*   **Parameters:** `index` (number) — Integer in range `[0, NUM_DECOR)` (i.e., `0` to `5` inclusive).
*   **Returns:** `x, y, z` (three numbers) — Position coordinates in world space.
*   **Error states:** None.

### `AddDecor(inst)`
*   **Description:** Attaches scratch and tooth decoration entities to the parent spawner instance. populates `inst.highlightchildren` array.
*   **Parameters:** `inst` (Entity) — The parent spawner entity.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Pushes:** None identified.  
- **Listens to:** None identified.  
The server-side `master_postinit` hook (via `event_server_data`) exists but is external to this file and not documented here.