---
id: shadowthrall_mimics
title: Shadowthrall Mimics
description: Manages spawning of shadow mimic entities that copy existing items during Cavenight when Shadow Rifts are active.
tags: [shadow, spawning, event, mimic]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 4586bfe0
system_scope: entity
---

# Shadowthrall Mimics

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`ShadowThrall_Mimics` is a server-only component that manages the spawning of shadow mimic entities. When Shadow Rifts are active in the rift pool and it is Cavenight, this component periodically attempts to spawn mimic copies of eligible entities near players. Mimics are clones of existing items that behave as shadow-affiliated entities. The component tracks active mimics, respects a global cap via `TUNING.ITEMMIMIC_CAP`, and coordinates spawn attempts per connected player.

## Usage example
```lua
-- Server-side only - will assert on client
local inst = CreateEntity()
inst:AddComponent("shadowthrall_mimics")

-- Check if a target can be mimicked
if inst.components.shadowthrall_mimics:IsTargetMimicable(some_entity) then
    inst.components.shadowthrall_mimics:SpawnMimicFor(some_entity)
end

-- Check if mimics are currently enabled
if inst.components.shadowthrall_mimics:IsEnabled() then
    -- Shadow Rifts are active and it is Cavenight
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/itemmimic_data` -- provides `MUST_TAGS` and `CANT_TAGS` for entity filtering

**Components used:**
- `riftspawner` -- checks `RiftIsShadowAffinity()` to determine if Shadow Rifts are active
- `itemmimic` -- added to spawned mimic entities to mark them as mimics
- `Transform` -- used for position queries and setting mimic spawn locations

**Tags:**
- None identified (uses tag checks via `itemmimic_data.MUST_TAGS` and `itemmimic_data.CANT_TAGS`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `_activeplayers` | table | `{}` | List of currently connected player entities. |
| `_activemimics` | table | `{}` | Map of active mimic entities (key = entity, value = true). |
| `_scheduled_spawn_attempts` | table | `{}` | Map of periodic spawn tasks per player. |
| `_rift_enabled_modifiers` | SourceModifierList | --- | Tracks Shadow Rift modifiers; empty means mimics disabled. |

## Main functions
### `IsTargetMimicable(target)`
*   **Description:** Checks whether a target entity is eligible to be mimicked. Returns true if the target has all required tags from `itemmimic_data.MUST_TAGS` and none of the excluded tags from `itemmimic_data.CANT_TAGS`.
*   **Parameters:** `target` -- entity instance to check
*   **Returns:** boolean -- true if target can be mimicked, false otherwise
*   **Error states:** Errors if `target` is nil or does not have `HasTags`/`HasOneOfTags` methods.

### `SpawnMimicFor(item)`
*   **Description:** Attempts to spawn a mimic copy of the given item. First validates the item via `IsTargetMimicable()`, then calls internal spawn logic. The mimic is spawned at a random walkable offset near the original item and inherits the original's prefab, skin, and persist data.
*   **Parameters:** `item` -- entity instance to mimic
*   **Returns:** `true, mimic` on success; `false` on failure (invalid target, no walkable offset, or other spawn failure)
*   **Error states:** Errors if `item` is nil or lacks required components for position/prefab queries. Errors if called on client (component asserts master-sim only).

### `IsEnabled()`
*   **Description:** Returns whether shadow mimic spawning is currently enabled. Enabled when at least one Shadow Rift is in the rift pool (tracked via `_rift_enabled_modifiers`).
*   **Parameters:** None
*   **Returns:** boolean -- true if Shadow Rifts are active, false otherwise
*   **Error states:** None

### `GetDebugString()`
*   **Description:** Returns a debug string showing current active mimic count vs cap and enabled state. Format: `ShadowThrall Mimics: X/Y; ENABLED` or `ShadowThrall Mimics: X/Y; DISABLED`.
*   **Parameters:** None
*   **Returns:** string -- debug information
*   **Error states:** None

### `Debug_PlayerSpawns(player)`
*   **Description:** Debug function that immediately triggers a spawn attempt for the specified player. Used for testing spawn logic without waiting for the periodic task.
*   **Parameters:** `player` -- player entity to trigger spawn attempt for
*   **Returns:** nil
*   **Error states:** Errors if `player` is nil or lacks `DoPeriodicTask` method.

## Events & listeners
- **Listens to:**
  - `onremove` (on mimic entities) -- removes mimic from `_activemimics` table when mimic is removed
  - `ms_playerjoined` -- adds player to `_activeplayers` and starts spawn scheduling if conditions met
  - `ms_playerleft` -- removes player from `_activeplayers` and cancels their spawn task
  - `ms_riftaddedtopool` -- enables mimic spawning if the added rift has Shadow affinity
  - `ms_riftremovedfrompool` -- disables mimic spawning if no Shadow Rifts remain in pool
  - `iscavenight` (world state) -- toggles spawn scheduling based on Cavenight state