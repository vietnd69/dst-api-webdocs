---
id: focalpoint
title: Focalpoint
description: A deprecated placeholder entity used to provide backward-compatible access to the Focalpoint component for older code.
tags: [deprecated, legacy]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 294ea1d7
system_scope: entity
---

# Focalpoint

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`focalpoint` is a deprecated prefab that creates a hidden, non-persistent entity intended solely for maintaining backward compatibility with older mod code. It attaches a `focalpoint` component and provides legacy wrapper functions (`PushTempFocus`, `AttachToEntity`) that delegate to the underlying component. The entity itself is never visible (`inst:Hide()`), does not persist across sessions (`inst.persists = false`), and dynamically attaches to active players via world-level events (`playeractivated`/`playerdeactivated`). This prefab should not be used in new code.

## Usage example
```lua
-- Legacy usage — do not use in new mods
local fp = TheWorld:SpawnPrefab("focalpoint")
fp:PushTempFocus(some_target, 5, 20, 1)
```

## Dependencies & tags
**Components used:** `focalpoint`
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties

## Main functions
### `PushTempFocus(target, minrange, maxrange, priority)`
*   **Description:** Legacy wrapper function that forwards the call to the attached `focalpoint` component. Maintains compatibility for code that previously called this function directly on the prefab instance.
*   **Parameters:** 
    *   `target` (entity or nil) — the entity to focus on, or `nil` to clear focus.
    *   `minrange` (number) — minimum distance for focus.
    *   `maxrange` (number) — maximum distance for focus.
    *   `priority` (number) — priority level for this focus source.
*   **Returns:** Nothing (delegates to `inst.components.focalpoint:PushTempFocus(...)`).
*   **Error states:** Does nothing if the `focalpoint` component is not attached.

### `AttachToEntity(entity)`
*   **Description:** Legacy wrapper that reparents the prefab's entity to the given entity (typically a player) and clears all focus sources on the `focalpoint` component.
*   **Parameters:** `entity` (entity or nil) — the entity to attach to (`nil` detaches it).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the `focalpoint` component is not attached.

## Events & listeners
- **Listens to:** `playeractivated` — triggers `AttachToEntity(inst, player.entity)` to bind to the newly activated player.
- **Listens to:** `playerdeactivated` — triggers `AttachToEntity(inst, nil)` to detach from the deactivated player.
- **Pushes:** None identified.

## Notes
- This prefab is marked as deprecated in its source comment and exists only to prevent breaking older mods.
- New mods should directly attach the `focalpoint` component to the appropriate entity and use its public methods instead of relying on this intermediate prefab.
- The entity is hidden, non-persistent, and assigned the internal `CLASSIFIED` tag.
