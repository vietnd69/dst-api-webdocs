---
id: eyeplant
title: Eyeplant
description: Manages the entity logic for the Eyeplant, a stationary hostile plant that targets and attacks enemies within range using combat, health, and locomotion components.
tags: [combat, hostile, stationary, plant, ai]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e75a5f70
system_scope: entity
---

# Eyeplant

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`eyeplant.lua` defines the `Prefab` for the Eyeplant entity — a stationary plant-based monster that detects and attacks valid targets in the game world. It uses the `combat`, `health`, `locomotor`, `eater`, and `inventory` components to govern behavior. The prefab is non-mobile (`walkspeed = 0`) and relies on an AI state graph (`SGeyeplant`) for animation and state transitions. It supports skin overrides and participates in fire mechanics (`MakeSmallBurnable`, `MakeMediumPropagator`).

## Usage example
The Eyeplant prefab is typically instantiated by the worldgen or spawn systems and does not require manual component addition. However, modders can customize its behavior by modifying the returned `Prefab` or overriding components post-creation:
```lua
local eyeplant = Prefab("eyeplant", nil, assets)
local inst = SpawnPrefabs("eyeplant")
inst.components.combat:SetDefaultDamage(5) -- override default damage
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `eater`, `inventory`, `inspectable`, `lootdropper`  
**Tags added:** `eyeplant`, `veggie`, `lifedrainable`, `smallcreature`, `hostile`  
**Tags checked during retargeting:** `_combat`, `_health` (must be present); `magicgrowth`, `INLIMBO`, `plantkin` (must be absent); at least one of `character`, `monster`, `animal`, `prey`, `eyeplant`, `lureplant` must be present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SetSkin` | function | `SetSkin(inst, skin_build, GUID)` | Public method to override animation symbol skins or reset to default build. |
| `minionlord` | entity? | `nil` | Optional reference to a controlling entity used by `checkmaster()` to avoid self-targeting or targeting under same master. |
| `inst.sg.mem.burn_on_electrocute` | boolean | `true` | Sets electrocution-induced burning behavior in the state graph memory. |

## Main functions
### `SetSkin(inst, skin_build, GUID)`
*   **Description:** Applies or clears skin overrides for all animation symbols used by the Eyeplant. Used when spawning with a custom skin (e.g., for events or modded variants).
*   **Parameters:**  
    `skin_build` (string or nil) — the build asset to use for overriding symbols; if `nil`, clears all overrides and resets to default `"eyeplant"` build.  
    `GUID` (string) — unique identifier for the skin asset.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on `AnimState:OverrideItemSkinSymbol` correctness.

### `checkmaster(tar, inst)`
*   **Description:** Helper used in combat retargeting to prevent Eyeplants from attacking each other if sharing the same master, or from attacking their master.
*   **Parameters:**  
    `tar` (entity) — potential target.  
    `inst` (entity) — this Eyeplant instance.
*   **Returns:** `true` if `tar` should not be attacked due to master alignment; `false` otherwise.
*   **Error states:** Returns `false` if either entity lacks `minionlord` or targets are unrelated.

### `retargetfn(inst)`
*   **Description:** The combat retarget function — calls `FindEntity` with radius, filtering, and tag constraints to locate a valid new target.
*   **Parameters:** `inst` (entity) — the Eyeplant instance.
*   **Returns:** An entity or `nil` if no suitable target is found within `TUNING.EYEPLANT_ATTACK_DIST`.
*   **Error states:** Returns `nil` if no matching entity exists or the Eyeplant is asleep (ignored by `SetRetargetFunction`).

### `shouldKeepTarget(inst, target)`
*   **Description:** Determines whether the Eyeplant should continue attacking its current target based on distance and validity.
*   **Parameters:**  
    `inst` (entity) — the Eyeplant instance.  
    `target` (entity) — current target.
*   **Returns:** `true` if target is valid, alive, and within `TUNING.EYEPLANT_STOPATTACK_DIST`; `false` otherwise.
*   **Error states:** Returns `false` if `target` is invalid, dead, or too far (distance squared compared to squared threshold).

### `onnewcombattarget(inst, data)`
*   **Description:** Event handler — triggers a transition to the `"attack"` state when a new combat target is assigned, provided the Eyeplant is not already attacking or dead.
*   **Parameters:** `data` (table) — event payload containing `target` entity.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if state graph has `"attack"` or `"hit"` tag, or if dead.

### `ongotnewitem(inst, data)`
*   **Description:** Event handler — attempts to perform a `MURDER` action on newly picked-up items (e.g., if dropped near the Eyeplant).
*   **Parameters:** `data` (table) — event payload containing `item` entity.
*   **Returns:** Nothing.
*   **Error states:** Only processes if `data.item.components.health` is non-nil; pushes buffered action with zero delay.

## Events & listeners
- **Listens to:**  
  `newcombattarget` — triggers state change to `"attack"` via `onnewcombattarget`.  
  `gotnewitem` — attempts to attack items with health via `ongotnewitem`.
- **Pushes:** None defined in this file.

### Events from components used
- `combat` component fires `newcombattarget` internally when a new target is selected; this is listened to directly by `eyeplant.lua`.
- `health` component may fire `death` events (handled elsewhere or via state graph).
- `lootdropper` component may fire `lootdropped` events (not directly handled here).