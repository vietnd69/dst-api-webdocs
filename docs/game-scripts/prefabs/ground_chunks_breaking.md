---
id: ground_chunks_breaking
title: Ground Chunks Breaking
description: Spawns a short-lived local FX entity that plays a stone-breaking animation and sound at a specified location.
tags: [fx, world, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9114ec3e
system_scope: fx
---

# Ground Chunks Breaking

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ground_chunks_breaking` is a lightweight FX prefab that spawns a non-persistent, local-only visual and audio effect — a stone-breaking animation — at a given position. It is designed to be used in conjunction with larger world events (e.g., stone walls breaking, quarrying, or geological effects) and only runs on non-dedicated clients. The effect plays once and auto-cleans up.

## Usage example
This prefab is typically instantiated via `SpawnPrefab("ground_chunks_breaking")`, often after computing an appropriate transform position (e.g., at a wall’s location). Direct component access is unnecessary, as it is a complete prefab.

```lua
local inst = SpawnPrefab("ground_chunks_breaking")
if inst ~= nil then
    inst.Transform:SetWorldPosition(x, y, z)
    inst.AnimState:PlayAnimation("idle")
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag.

## Properties
No public properties.

## Main functions
### `PlayChunksAnim(proxy)`
*   **Description:** Creates and initializes the local FX entity that plays the stone-breaking animation and sound. This function is called on the client after a one-frame delay to ensure correct positioning. It does not return a value.
*   **Parameters:** `proxy` (entity) — the entity from which to copy transform (position and rotation) via GUID. Used to align the FX with the source event (e.g., a breaking wall).
*   **Returns:** Nothing.
*   **Error states:** If the proxy GUID is invalid or the transform cannot be set, the entity may appear at the world origin (`0,0,0`) or behave unexpectedly — though no explicit error handling is present.

### `fn()`
*   **Description:** Prefab constructor. Creates and configures the entity. On dedicated servers, the FX is skipped entirely. On non-mastersim clients, the entity is returned early (no delay or cleanup). On mastersim, the entity is set to non-persistent and removed after 1 second.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — the constructed FX entity.
*   **Error states:** None identified. Returns `nil` only if `CreateEntity()` fails (extremely rare).

## Events & listeners
- **Listens to:** `animover` — removes the FX entity when the animation completes, ensuring cleanup.
- **Pushes:** None identified.