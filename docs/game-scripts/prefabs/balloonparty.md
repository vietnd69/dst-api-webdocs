---
id: balloonparty
title: Balloonparty
description: A party-themed decorative balloon that grants nearby players periodic sanity recovery when active in the world, with associated confetti effects and a debuff buff that scales with party size.
tags: [decoration, sanity, party, fx, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 68c626f3
system_scope: entity
---

# Balloonparty

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloonparty` is a decorative, equippable item prefabs system that spawns a party-themed balloon. When placed in the world, it generates a confetti cloud effect and periodically applies a sanity-restoring debuff (`balloonparty_buff`) to nearby players (within `CONFFETI_CLOUD_DIST`). The sanity bonus scales with the number of party participants (`CLASSIFIED` or `confetti_cloud` tags) within range. It integrates with the `equippable` and `debuff` components and modifies the `sanity` component of affected players.

## Usage example
```lua
-- Spawn a balloonparty balloon in the world
local balloon = SpawnPrefab("balloonparty")
balloon.Transform:SetPosition(x, y, z)

-- Equip it to a player to attach it (e.g., held in hand)
player.components.equippable:Equip(balloon)
```

## Dependencies & tags
**Components used:** `equippable`, `debuff`, `health`, `sanity`, `transform`, `animstate`, `physics`, `network`, `soundemitter`, `dynamicshadow`

**Tags added:** `nopunch`, `cattoyairborne`, `balloon`, `noepicmusic`, `confetti_cloud`, `FX`, `confetti_buff`, `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `balloon_num` | number | `1` | Identifier for balloon shape (used in symbol override and scrapbook data). |
| `colour_idx` | number | `0` | Index used by `BALLOONS.SetColour()` to determine balloon color. |
| `balloon_build` | string | `"balloon_shapes_party"` | Animation build name for the balloon symbol override. |

## Main functions
### `onpop(inst)`
*   **Description:** Triggers when the balloon pops. Spawns a confetti cloud at the balloon's world position and calls `BALLOONS.DoPop_Floating` for visual/audio pop effects.
*   **Parameters:** `inst` (entity) — the balloon entity instance.
*   **Returns:** Nothing.

### `ApplyBuff(inst)`
*   **Description:** For each player within `CONFFETI_CLOUD_DIST` squared, applies the `balloonparty_buff` debuff to grant periodic sanity recovery.
*   **Parameters:** `inst` (entity) — the confetti cloud entity.
*   **Returns:** Nothing.

### `buff_OnTick(inst, target)`
*   **Description:** Runs periodically while the `balloonparty_buff` is active on a player. Checks if the player is alive, not a ghost, and near an active confetti cloud. If valid, grants sanity based on party size (`CONFFETI_PARTY_SANITY_DELTA` indexed by participant count). Otherwise, stops the debuff.
*   **Parameters:**  
  - `inst` (entity) — the buff entity.  
  - `target` (entity) — the affected player.  
*   **Returns:** Nothing.

### `buff_OnAttached(inst, target)`
*   **Description:** Called when `balloonparty_buff` is attached to a player. Sets the buff as a child of the player entity, starts a periodic task (`buff_OnTick`), and listens for the player's `death` event to stop the debuff.
*   **Parameters:**  
  - `inst` (entity) — the buff entity.  
  - `target` (entity) — the player receiving the debuff.  
*   **Returns:** Nothing.

### `confetti_fn()`
*   **Description:** Constructor for the `balloonparty_confetti_cloud` prefab. Creates a non-networked FX entity that plays confetti animations, emits sound, spawns 4 mini-party balloons, and starts a periodic task (`ApplyBuff`) to grant debuffs to nearby players.
*   **Parameters:** None (internal prefab factory).
*   **Returns:** Entity instance (non-persistent, client-side only).

### `buff_fn(tunings, dodelta_fn)`
*   **Description:** Constructor for the `balloonparty_buff` debuff entity. Creates a hidden, non-persistent entity that integrates with the `debuff` component. Sets attach/detach callbacks and marks `keepondespawn = true`.
*   **Parameters:**  
  - `tunings` (table) — unused tunings parameter (signature includes it for compatibility).  
  - `dodelta_fn` (function) — unused (debuff uses `buff_OnTick`).  
*   **Returns:** Entity instance (non-persistent, server-side only).

### `confettiballoon_fn()`
*   **Description:** Constructor for the `balloonparty_confetti_balloon` FX prefab. Creates small, physics-driven mini-balloons that float upward, animate, and self-remove after rising ~35 units or 15 seconds.
*   **Parameters:** None (internal prefab factory).
*   **Returns:** Entity instance (non-persistent, client-side only).

## Events & listeners
- **Listens to:**  
  - `animqueueover` (`confetti_fn`) — removes the confetti cloud entity after animations complete.  
  - `death` (`buff_OnAttached`) — stops the `balloonparty_buff` when the target player dies.  
- **Pushes:**  
  - None directly. Debuff callbacks and `ApplyBuff` trigger external component behavior (e.g., `sanity:DoDelta`).