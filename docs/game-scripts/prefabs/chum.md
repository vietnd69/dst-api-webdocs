---
id: chum
title: Chum
description: A throwable fishing bait item that spawns chum or a green splash effect depending on terrain, and creates an AOE when thrown into ocean tiles.
tags: [fishing, combat, consumable, equipment, ocean]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fa1aa20a
system_scope: inventory
---

# Chum

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chum` is a throwable inventory item that functions as fishing bait. It is equipped as an item and thrown by the player, with behavior differing based on the terrain: it spawns a chum prefab on land or waterlogged surfaces, or triggers a green splash effect and spawns a chum AOE prefab in ocean tiles. It integrates with multiple systems including projectile physics, reticule targeting (for aiming), equippable animations, weapon damage (as a backup tool), and ocean-specific throwing mechanics.

## Usage example
```lua
local inst = SpawnPrefab("chum")
inst.Transform:SetPosition(x, y, z)
inst.components.stackable:SetSize(1)
inst.components.equippable:Equip(player)
-- When thrown via player action, physics and targeting are handled automatically
```

## Dependencies & tags
**Components used:** `reticule`, `oceanthrowable`, `complexprojectile`, `equippable`, `weapon`, `forcecompostable`, `locomotor`, `inspectable`, `inventoryitem`, `stackable`, `hauntable`
**Tags:** Adds `NOCLICK` during flight; adds `allow_action_on_impassable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Set to `false` during projectile phase to avoid persistence in world save. |
| `animstate` | AnimState | — | Uses `"chum_pouch"` bank and build for idle and carry animations. |
| `animtime` | number | `0.75` | Time multiplier for animation playback. |

## Main functions
### `OnHit(inst, attacker, target)`
*   **Description:** Triggered when the projectile hits terrain or an entity. Checks if the impact location is in an ocean tile. If yes, spawns a green splash and a `chum_aoe`; otherwise spawns a single `chum` at the location. Destroys the chum item after impact.
*   **Parameters:**  
  `inst` (Entity) — the chum projectile entity.  
  `attacker` (Entity or nil) — the entity that threw the chum (often the player).  
  `target` (Entity or nil) — the entity hit, if any (unused in current logic).
*   **Returns:** Nothing.
*   **Error states:** Uses `TheWorld.Map:IsOceanAtPoint(...)` — behavior is silent if the map API returns unexpected results.

### `onequip(inst, owner)`
*   **Description:** Configures visual carry animation when the chum is equipped. Replaces the default swap object with the chum pouch model and shows the `ARM_carry` overlay.
*   **Parameters:**  
  `inst` (Entity) — the chum item.  
  `owner` (Entity) — the player equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores normal arm animation when the chum is unequipped. Hides the carry overlay and re-enables the normal arm.
*   **Parameters:**  
  `inst` (Entity) — the chum item.  
  `owner` (Entity) — the player unequipping the item.
*   **Returns:** Nothing.

### `onthrown(inst)`
*   **Description:** Initializes physics and animation for the projectile phase. Applies spin animation, sets physics to non-colliding (except ground), and flags the item to not persist (since it will be consumed).
*   **Parameters:** `inst` (Entity) — the chum entity transitioning to projectile state.
*   **Returns:** Nothing.

### `OnAddProjectile(inst)`
*   **Description:** Called by the `oceanthrowable` component before launch to configure the projectile physics and callbacks. Configures horizontal speed, gravity, launch offset, and sets the `onthrown` and `OnHit` callbacks.
*   **Parameters:** `inst` (Entity) — the chum entity before launch.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).
