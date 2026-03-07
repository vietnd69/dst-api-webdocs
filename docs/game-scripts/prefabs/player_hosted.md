---
id: player_hosted
title: Player Hosted
description: Creates a non-player hostile entity that mimics a player model and behaves as a parasitic shadow thrall with combat, sanity-draining, and retention behavior toward its designated owner.
tags: [combat, ai, player, shadow]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1496ceb9
system_scope: entity
---

# Player Hosted

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`player_hosted` is a prefab function that constructs a hostile, player-shaped entity (typically used for shadow thralls/parasites). It extends the base character infrastructure with components for combat, health, sanity aura, and locomotion. The entity is networked, pristined, and configured to track and attack non-hosted entities while respecting its owner (identified via `hosted_userid`). It uses the `SGplayer_hosted` state graph and `hostedbrain` AI. The prefab integrates with `inspectable`, `skinner`, `health`, `combat`, and `sanityaura` components to deliver consistent gameplay behavior and visual representation.

## Usage example
```lua
local inst = Prefab("player_hosted", fn, assets)
-- Typically instantiated via TheWorld:SpawnPrefab("player_hosted")
-- Internally, this creates an entity with combat, health, and brain components preconfigured
```

## Dependencies & tags
**Components used:** `skinner`, `inspectable`, `sanityaura`, `locomotor`, `inventory`, `health`, `combat`, `network`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `physics` (via `MakeCharacterPhysics`)
**Tags:** `monster`, `hostile`, `scarytoprey`, `shadowthrall`, `shadow_aligned`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skeleton_prefab` | string | `"skeleton_player"` | The prefab name used for skeleton-based rendering. |
| `hosted_userid` | net_string | (GUID-linked string) | Identifies the owning player; used to determine if this entity belongs to the local viewer. |
| `displaynamefn` | function | `DisplayNameFn` | Callback to return localized name (e.g., `"ME"` if owned by `ThePlayer`). |
| `OnSave` / `OnLoad` | function | `OnSave`, `OnLoad` | Save/load hooks for persisting `skeleton_prefab` and `hosted_userid`. |

## Main functions
### `RetargetFn(inst)`
*   **Description:** Finds the closest valid target within range for combat. Uses `FindEntity` with a custom filter to exclude hosted/masked entities and respects tag restrictions.
*   **Parameters:** `inst` (Entity) — the entity instance invoking retargeting.
*   **Returns:** Entity or `nil` — the nearest valid target or `nil` if none found.
*   **Error states:** May return `nil` if no suitable entity exists within `TUNING.SHADOWTHRALL_PARASITE_TARGET_DIST`.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether the current target should be retained during combat. Ensures the target remains valid and is not the hosted entity itself.
*   **Parameters:** `inst` (Entity), `target` (Entity).
*   **Returns:** boolean — `true` if the target is valid and not hosted; `false` otherwise.

### `DisplayNameFn(inst)`
*   **Description:** Returns a special name if the local player owns this entity; otherwise returns `nil`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** string or `nil` — `"PLAYER_HOSTED_ME"` if `ThePlayer.userid == inst.hosted_userid`, else `nil`.

### `GetStatus(inst, viewer)`
*   **Description:** Returns `"ME"` to the viewer if they own this entity; otherwise returns `nil`. Used for UI/inspection context.
*   **Parameters:** `inst` (Entity), `viewer` (Entity or `nil`).
*   **Returns:** string or `nil` — `"ME"` if viewer owns this entity; `nil` otherwise.

### `OnSave(inst, data)`
*   **Description:** Serializes key state (`skeleton_prefab`, `hosted_userid`) for world save.
*   **Parameters:** `inst` (Entity), `data` (table) — table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `skeleton_prefab` and sets `hosted_userid` from saved data.
*   **Parameters:** `inst` (Entity), `data` (table or `nil`) — saved state.
*   **Returns:** Nothing.

## Events & listeners
None identified.