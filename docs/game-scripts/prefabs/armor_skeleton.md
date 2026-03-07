---
id: armor_skeleton
title: Armor Skeleton
description: Grants the wearer temporary resistance to multiple damage types by consuming nightmare fuel and spawning visual shield effects when damaged.
tags: [combat, armor, equipment, resistance, fuel]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 995dd089
system_scope: entity
---

# Armor Skeleton

> Based on game build **714001** | Last updated: 2026-03-04

## Overview
`armor_skeleton` is a wearable equipment prefab that activates resistance to specific damage types when equipped and fueled. It dynamically spawns visual shield effects upon taking damage and relies on the `resistance`, `fueled`, `equippable`, `cooldown`, and `shadowlevel` components to manage its state. The armor degrades using nightmare fuel and enforces a recharge delay between shield activations. It integrates with DST’s equipped-item skinning system and supports dedicated server/client separation for sound playback.

## Usage example
```lua
-- The prefab is typically used as a crafted or found item and equipped directly
-- Example usage within mod code (not typical for end users):

local inst = SpawnPrefab("armorskeleton")
inst.components.equippable:Equip(player)
-- Automatic behavior: On damage, a shield shield effect spawns and resistance is added
-- Fuel is consumed and cooldown begins after each shield activation
```

## Dependencies & tags
**Components used:** `resistance`, `fueled`, `equippable`, `cooldown`, `shadowlevel`, `inventoryitem`, `inspectable`  
**Tags added:** `fossil`, `shadowlevel`  
**Tags checked:** None directly via `HasTag`, but `EquipHasTag("forcefield")` is used for logic exclusion.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SHIELD_DURATION` | number | `10 * FRAMES` | Duration (in seconds) a shield effect remains active after damage. |
| `SHIELD_VARIATIONS` | number | `3` | Number of visual shield variants per shield group. |
| `MAIN_SHIELD_CD` | number | `1.2` | Minimum cooldown (in seconds) before the main shield (`variation 3`) can be selected again. |
| `RESISTANCES` | table | Array of 7 strings | List of damage tags the armor grants resistance to. |
| `inst.lastmainshield` | number | `0` | Timestamp of last main shield usage (client/server sync via behavior). |
| `inst.task` | task | `nil` | Task handle managing shield expiry timer. |
| `inst.playfuelsound` | net_event | — | Client-side network event to trigger fuel-add sound. |

## Main functions
### `PickShield(inst)`
* **Description:** Selects a visual shield variant based on cooldown timing and randomness. Prefers the main shield (variation 3) after `MAIN_SHIELD_CD` or probabilistically based on elapsed time.
* **Parameters:** `inst` (entity) — the armor instance.
* **Returns:** number — shield variant index (1–6).
* **Error states:** None.

### `OnShieldOver(inst, OnResistDamage)`
* **Description:** Cleanup callback executed when the shield duration ends. Removes all resistance tags and restores the original damage handler.
* **Parameters:** `inst` (entity), `OnResistDamage` (function) — the previous damage handler to restore.
* **Returns:** None.

### `OnResistDamage(inst)`
* **Description:** Called when the armor-wearer takes damage. Spawns a shadow shield effect parented to the owner, cancels any existing expiry task, starts a new one, disables damage resistance temporarily, consumes fuel, and initiates cooldown charging if needed.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `ShouldResistFn(inst)`
* **Description:** Determines if the armor should currently resist damage. Only active when equipped and if the owner isn’t wearing another forcefield-style item.
* **Parameters:** `inst` (entity).
* **Returns:** boolean — `true` only if equipped and no other forcefield is active.

### `OnChargedFn(inst)`
* **Description:** Fired when cooldown finishes (recharge complete). Restores resistance tags and re-enables `OnResistDamage` as the active damage handler.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `nofuel(inst)`
* **Description:** Called when fuel is depleted. Clears the charged callback and forces cooldown completion.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `ontakefuel(inst)`
* **Description:** Starts the cooldown if the armor is fueled and not already recharging; plays fuel sound; handles server/client sound logic.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `onequip(inst, owner)`
* **Description:** Executed when the armor is equipped. Applies skin overrides (if skinned), resets last-main-shield time, and begins cooldown if fueled.
* **Parameters:** `inst` (entity), `owner` (entity) — the equipper.
* **Returns:** None.

### `onunequip(inst, owner)`
* **Description:** Executed when unequipped. Clears skin overrides, cancels shield task, restores resistance handler, and removes resistance tags.
* **Parameters:** `inst` (entity), `owner` (entity).
* **Returns:** None.

### `onequiptomodel(inst, owner, from_ground)`
* **Description:** Executed when picked up from the ground (before equipping). Clears any active shield and resistance.
* **Parameters:** `inst` (entity), `owner` (entity), `from_ground` (boolean).
* **Returns:** None.

### `GetShadowLevel(inst)`
* **Description:** Provides dynamic shadow level for lighting effects: returns `TUNING.ARMOR_SKELETON_SHADOW_LEVEL` when fueled, otherwise `0`.
* **Parameters:** `inst` (entity).
* **Returns:** number — shadow level value.

## Events & listeners
- **Listens to:** `armorskeleton.playfuelsound` (client-only) — triggers fuel sound when player opens the container with this item.
- **Pushes:** None directly (events are handled via component hooks).