---
id: diviningrod
title: Diviningrod
description: Tracks proximity to teleportato components and updates description, sound, and visual feedback when equipped by a player.
tags: [teleportation, feedback, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b3ba0835
system_scope: inventory
---

# Diviningrod

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `diviningrod` prefab functions as a proximity-based tool that detects nearby teleportato components (including parts and `adventure_portal` prefabs) when equipped. It dynamically updates its description, emits sound, and spawns a follow-up visual effect based on the distance to the nearest valid target. It is primarily used in the game to assist players in locating hidden or distant teleportation infrastructure.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
-- Assume diviningrod prefab is spawned and equipped by this player
local rod = SpawnPrefab("diviningrod")
rod.components.equippable:Equip(inst)
-- Rod begins periodic proximity checking via CheckTargetPiece
```

## Dependencies & tags
**Components used:** `equippable`, `inspectable`, `inventoryitem`, `key`, `talker`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `inventoryfloatable`, `hauntable_launch`.

**Tags added:** `irreplaceable`, `nonpotatable`, `diviningrod`, `nopunch`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `closeness` | table or nil | `nil` | Stores the active distance class (`TUNING.DIVINING_DISTANCES[i]`) for the nearest target. Used to track whether to re-trigger description/sound updates. |
| `tracking_parts` | table or nil | `nil` | Cached list of entities with tags `"teleportato"` or `"teleportato_part"`, or prefab `"adventure_portal"`. Rebuilt on first use. |
| `task` | Task or nil | `nil` | Scheduled repeat task (`DoTaskInTime`) calling `CheckTargetPiece`. Cancelled on unequip or model equip. |
| `fx` | Entity or nil | `nil` | Reference to the spawned follow-up effect prefab (e.g., `dr_hot_loop`). Removed on unequip. |
| `disabled` | boolean | `false` | Saved/loading flag; if true, disables proximity checking when equipped. |

## Main functions
### `FindClosestPart(inst)`
*   **Description:** Scans all active entities in the world for valid teleportato components and returns the closest valid, non-Limbo target based on squared distance. Caches results in `inst.tracking_parts` for reuse until next full rebuild.
*   **Parameters:** `inst` (Entity) — the divining rod instance.
*   **Returns:** Entity or `nil` — the nearest valid teleportato part, or `nil` if none found or `inst.tracking_parts` is empty.
*   **Error states:** Returns `nil` if no parts match tags/prefab criteria.

### `CheckTargetPiece(inst)`
*   **Description:** Periodically evaluates proximity to the nearest teleportato part while the rod is equipped. Updates description, plays speech, and triggers visual/sound effects when closeness changes. Schedules the next ping based on the current distance band.
*   **Parameters:** `inst` (Entity) — the divining rod instance.
*   **Returns:** Nothing (side-effect only).
*   **Error states:** Returns early if not equipped or owner is `nil`. Does nothing if `disabled` is `true`. Uses `GetDistanceSqToInst` internally to compute distance; if owner moves, subsequent calls recompute closeness. If the closest part disappears or distance band changes (`closeness` value changes), it triggers description and speech updates.

### `onequip(inst, owner)`
*   **Description:** Callback invoked on equip. Updates owner animation, clears cached tracking data, and starts the first ping timer unless the rod is `disabled`.
*   **Parameters:** `inst` (Entity) — the divining rod; `owner` (Entity) — the player equipping it.
*   **Returns:** Nothing.
*   **Error states:** Does not start `CheckTargetPiece` if `inst.disabled` is `true`.

### `onunequip(inst, owner)`
*   **Description:** Callback invoked on unequip. Restores owner animations, cancels any pending ping task, and removes active effect entities.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Callback invoked when equipping to a hand/model (e.g., from inventory or ground). Cancels the current ping task to prevent conflicts during item transition.
*   **Parameters:** `inst` (Entity); `owner` (Entity); `from_ground` (boolean).
*   **Returns:** Nothing.

### `describe(inst)`
*   **Description:** Inspectable description callback. Returns the uppercase description of the current closeness level (e.g., `"HOT"`, `"WARMER"`, `"WARM"`, `"COLD"`), or `"COLD"` if no target or closeness data is unavailable.
*   **Parameters:** `inst` (Entity).
*   **Returns:** String — the descriptive label (e.g., `"HOT"`), or `"COLD"` as fallback.

## Events & listeners
- **Listens to:** None directly. Relies on `equippable` component callbacks (`SetOnEquip`, `SetOnUnequip`, `SetOnEquipToModel`) for state transitions.
- **Pushes:** Does not push custom events. Uses `talker:Say(...)` for audio feedback and spawns prefabs for visual feedback.