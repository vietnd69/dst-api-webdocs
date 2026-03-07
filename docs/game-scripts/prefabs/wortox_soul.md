---
id: wortox_soul
title: Wortox Soul
description: Manages a soul entity that follows and heals nearby hurt players, with behavior modified by Wortox's skill tree.
tags: [combat, healing, inventory, skill]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7acf6704
system_scope: entity
---

# Wortox Soul

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_soul` creates and manages a floating soul entity that automatically seeks and heals the nearest hurt player within range. It is created when Wortox uses a Soul Jar and behaves differently based on his activated skill tree nodes (e.g., increased range, speed, burst healing, or reduced delay). The soul can be held in inventory (`pocket` only), dropped to ground (where it begins automatic healing), or removed visually. It supports stacking and integrates with the `rechargeable` component to toggle tags like `nosouljar`.

## Usage example
```lua
local soul = SpawnPrefab("wortox_soul")
soul.components.soul:SetOwner(player)
soul.components.rechargeable:SetCharge(1)
soul.components.inventoryitem:OnPutInInventory(player)
-- When dropped, it will auto-heal hurt players in range
soul.components.inventoryitem:OnDropped()
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `rechargeable`, `inspectable`, `soul`, `waterproofer`, `updatelooper`, `health`, `skilltreeupdater`.  
**Tags added/checked:** `soul`, `nosteal`, `sloweat`, `NOCLICK`, `rechargeable`, `rechargeable_bonus`, `waterproofer`, `nosouljar`, `FX`, `NOCLICK`.  
**Tags listen:** `animover`, `ondropped`, `onputininventory`, `onremove`, `hastaildirty`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_hastail` | `net_bool` | `nil` | Networked boolean controlling whether the soul emits a tail visual. |
| `_issmall` | `net_bool` | `nil` | Networked boolean indicating if the soul is in small (visual-only) state. |
| `soul_heal_mult` | number | `0` | Multiplier applied to healing amount. |
| `soul_bursting` | boolean | `false` | Indicates if the soul is currently performing burst healing. |
| `soulhealfinishing` | boolean | `false` | True when the soul has finished healing and is about to be removed. |
| `soul_doburst` | boolean | `false` | True if soul should perform a burst animation before healing. |
| `soul_doburst_faster` | boolean | `false` | True if the burst delay should be reduced. |
| `soul_heal_range_modifier` | number | `0` | Additional range added to the base healing range. |
| `soul_follow_speed` | number | `TUNING.WORTOX_SOUL_SPEED` | Speed used when moving toward target. |
| `soul_heal_player_efficient` | boolean | `false` | True if soul heals more efficiently (e.g., full heal per tick). |

## Main functions
### `topocket(inst)`
*   **Description:** Configures the soul for storage in inventory. Cancels pending healing timer and marks it as persistent. Called on `onputininventory`.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `KillSoul_FromPocket(inst)`
*   **Description:** Initiates the healing process when a soul is dropped from inventory. Optionally triggers burst animation before healing. Sets up a delayed `KillSoul_FromPocket_Bursted` task if bursting is enabled.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `KillSoul_FromPocket_Bursted(inst)`
*   **Description:** Performs the final burst and healing logic after the burst animation completes. Plays animation `"idle_small_pst"` and removes the soul on animation end.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `toground(inst)`
*   **Description:** Called when soul is dropped to world. Starts the healing timer (`TUNING.WORTOX_SOUL_HEAL_DELAY`) by scheduling `KillSoul_FromPocket`.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `MakeSmallVisual(inst)`
*   **Description:** Forces visual transition to small state (no healing, just visual effect), typically used when the soul is consumed without healing. Removes soul immediately after `"idle_small_pst"` animation.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Handles stack splitting when soul is dropped: spawns additional souls up to the max allowed per location (`10 - #findentities(soul_tags)`).
*   **Parameters:** `inst` (Entity) — the soul entity (may be a stack).
*   **Returns:** Nothing.

### `OnCharged(inst)` / `OnDischarged(inst)`
*   **Description:** Toggle `nosouljar` tag based on `rechargeable` state. Removes the tag when charged; adds when discharged.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `CreateTail()`
*   **Description:** Creates and returns a one-frame FX entity used as a visual tail. Plays `"disappear"` animation and self-removes on `animover`.
*   **Parameters:** None.
*   **Returns:** Entity — the tail FX entity.

### `OnUpdateProjectileTail(inst, dt)`
*   **Description:** Client-side update loop that generates trailing FX tails behind the soul when it moves quickly. Tracks movement speed, spawn positions, and rotation; cleans up old tails.
*   **Parameters:**  
  `inst` (Entity) — the soul entity.  
  `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.

### `OnHasTailDirty(inst)`
*   **Description:** Reacts to `_hastail` state change: initializes or removes the tail update loop via `updatelooper`.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `HideTail(inst)` / `ShowTail(inst)`
*   **Description:** Toggles the `blob` animation layer to hide/show the main ball,配合 `_hastail` net_bool.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `SoulProtectorTick(inst)`
*   **Description:** Runs periodically when `wortox_soulprotector_2` skill is active. Scans all players in healing range to find the most hurt one (lowest health %) and steers the soul toward them. Adjusts tail visibility based on speed.
*   **Parameters:** `inst` (Entity) — the soul entity.
*   **Returns:** Nothing.

### `ModifyStats(inst, owner)`
*   **Description:** Applies skill tree bonuses to the soul's behavior (range, speed, burst, delay, efficiency) based on `wortox_soulprotector_*` skills. Sets up periodic task for `SoulProtectorTick` if skill 2 is active.
*   **Parameters:**  
  `inst` (Entity) — the soul entity.  
  `owner` (Entity) — the player who owns the soul.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` — triggers removal after `"idle_pst"` or `"idle_small_pst"` animations.  
  `ondropped` — calls `toground` to start healing.  
  `onputininventory` — calls `topocket` to stop healing and persist.  
  `onremove` — cleans up tail references.  
  `hastaildirty` — client-side trigger for tail state change.
- **Pushes:**  
  none directly.