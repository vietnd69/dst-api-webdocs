---
id: wurt_terraform_item
title: Wurt Terraform Item
description: Manages a rechargeable, spellcasting terraforming tool used by Wurt to deploy terrain-altering projectiles with cooldowns and sanity costs.
tags: [combat, rechargable, spellcaster, terrain]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b3178240
system_scope: entity
---

# Wurt Terraform Item

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wurt_terraform_item` implements a reusable, equippable item that allows the player Wurt to cast terraforming spells (Shadow or Lunar), launching projectiles that create special terrain tiles on impact. The item integrates with the `rechargeable`, `spellcaster`, `equippable`, and `inventoryitem` components to handle cooldowns, spell casting logic, equip animations, and cross-item recharge synchronization. When cast, it applies a debuff (`wurt_terraform_cast_debuff`) to the owner to prevent spam and consumes sanity.

## Usage example
```lua
local terraformer = SpawnPrefab("wurt_swampitem_shadow") -- or "wurt_swampitem_lunar"
player:AddToInventory(terraformer)
-- Once equipped, press use key to cast
-- The item automatically recharges and shows visual FX when ready
```

## Dependencies & tags
**Components used:** `rechargeable`, `spellcaster`, `equippable`, `inventoryitem`, `inspectable`, `complexprojectile`, `debuffable`, `debuff`, `timer`, `staffsanity`, `sanity`, `leader`, `combat`, `weapon`, `reticule`, `groundshadowhandler`, `physics`, `animstate`, `soundemitter`, `transform`, `network`.

**Tags:** Adds `rechargeable`, `weapon`, `NOCLICK` (to projectile), `projectile`, `complexprojectile`, `FX`, `CLASSIFIED` (to debuff entity).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_is_wurt_terraform_equip` | boolean | `true` | Internal flag marking the item as a terraformer. |
| `_terraform_tile_type` | string | `"SHADOW"` or `"LUNAR"` | Type of tile the projectile places on impact. |
| `_extra_onhit_fn` | function | `nil` | Optional callback fired on projectile impact. |
| `_landed_sound` | string | `nil` | Sound event to play on landing. |
| `_fx_type` | string | `"wurt_swampitem_shadow_chargedfx"` | Prefab name for the charged visual FX. |
| `swap_file` | string | `"swap_wurt_swampbomb"` | Animation bank for equippable swap symbol. |
| `swap_symbol` | string | `"swap_shadow"` or `"swap_lunar"` | Symbol name used in owner's animation. |
| `_charged_vfx` | entity | `nil` | Reference to active charged visual FX instance. |

## Main functions
### `CastTerraformingSpell(inst, target, position)`
*   **Description:** Executes the terraform spell by spawning and launching a `wurt_terraform_projectile` from the item. Applies a recharge cooldown, sanity cost, and debuff to the owner. Also discharges any other terraformer items in the owner’s inventory to prevent exploit.
*   **Parameters:**  
    `inst` (entity) — The terraformer item instance.  
    `target` (optional vector) — Target position (unused directly; `position` is used instead).  
    `position` (Vector3) — World position where the projectile is launched toward.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `position` is `nil`.

### `CanCastTerraformingSpell(doer, target, position)`
*   **Description:** Checks whether the owner can cast the terraform spell by verifying absence of the cast-debuff.
*   **Parameters:**  
    `doer` (entity) — The casting entity (usually the player).  
    `target`, `position` — Unused in this check.
*   **Returns:** `true, nil` if castable; `false, "TERRAFORM_TOO_SOON"` if blocked by debuff.

### `OnDischarged(inst)`
*   **Description:** Called when the item’s rechargeable timer completes. Clears the spell function, removing the ability to cast until recharged, and removes visual FX.
*   **Parameters:** `inst` (entity) — The terraformer item.
*   **Returns:** Nothing.

### `OnCharged(inst)`
*   **Description:** Called when the item finishes charging. Assigns the `CastTerraformingSpell` function to the spellcaster component and spawns visual FX if equipped.
*   **Parameters:** `inst` (entity) — The terraformer item.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Handles equip behavior: overrides the owner’s animation symbol, shows carry animation, and checks if charged FX should appear (especially after save/load).
*   **Parameters:**  
    `inst` (entity) — The terraformer item.  
    `owner` (entity) — The entity equipping the item.
*   **Returns:** Nothing.

### `unequip(inst, owner)`
*   **Description:** Handles unequip behavior: clears animation overrides and removes visual FX.
*   **Parameters:**  
    `inst` (entity) — The terraformer item.  
    `owner` (entity) — The entity unequipping the item.
*   **Returns:** Nothing.

### `on_item_putininventory(inst, owner)`
*   **Description:** Syncs recharge progress when picking up a new terraformer item while under the cast-debuff. Ensures the item’s charge percentage does not exceed what the debuff allows, preventing recharge shortcuts.
*   **Parameters:**  
    `inst` (entity) — The newly picked up terraformer.  
    `owner` (entity) — The inventory owner.
*   **Returns:** Nothing.

### `OnHitTerraformer(inst, attacker, target)`
*   **Description:** Projectile impact handler. Spawns a `wurt_swamp_terraformer` tile at impact location, applies terrain effect, and fires optional extra hit callbacks.
*   **Parameters:**  
    `inst` (entity) — The projectile instance.  
    `attacker` (entity) — The casting entity.  
    `target` (entity) — The target hit (unused for terrain placement).
*   **Returns:** Nothing.

### `wurt_terraformer_fn(anim)`
*   **Description:** Shared constructor for shadow/lunar terraformer prefabs. Initializes core components: `equippable`, `rechargeable`, `spellcaster`, `inventoryitem`, `inspectable`, `weapon`, and `reticule`.
*   **Parameters:** `anim` (string) — Animation name for idle loop.
*   **Returns:** Fully configured entity.

### `wurt_swampbomb_shadow()`, `wurt_swampbomb_lunar()`
*   **Description:** Prefab constructors for the Shadow and Lunar terraformers, respectively. Configure type-specific properties (`_terraform_tile_type`, sound, FX, spell type) and return final prefabs.
*   **Parameters:** None.
*   **Returns:** Configured terraformer entity instance.

### `terraform_projectile()`
*   **Description:** Constructor for the `wurt_terraform_projectile` prefab. Sets up physics, projectile behavior via `complexprojectile`, and impact handler.
*   **Parameters:** None.
*   **Returns:** Projectile entity configured to launch and place terrain on hit.

### `cant_terraform_debuff_fn()`
*   **Description:** Constructor for the `wurt_terraform_cast_debuff` entity. A non-networked, hidden entity used only on master to enforce the cast cooldown.
*   **Parameters:** None.
*   **Returns:** Debuff entity with a timer and self-removal after cooldown.

## Events & listeners
- **Listens to:**  
  `timerdone` — On the debuff entity, triggers removal of the `wurt_terraform_cast_debuff` when the timer completes.
- **Pushes:**  
  None (this component does not directly push game events; it interacts with components that do, such as `sanity:DoDelta()` which pushes `sanitydelta`).