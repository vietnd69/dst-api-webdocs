---
id: glasscutter
title: Glasscutter
description: A consumable weapon prefab that deals damage with finite uses, deals bonus damage against shadow enemies, and provides visual feedback via equipped animations.
tags: [combat, consumable, shadow, weapon]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f653e51f
system_scope: inventory
---

# Glasscutter

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `glasscutter` prefab is a consumable combat item designed for attacking enemies, particularly effective against shadow-type enemies. It combines the `weapon`, `finiteuses`, `equippable`, and `damagetypebonus` components to provide damage output, limited durability, visual equipment effects, and shadow-specific bonuses. When its uses are depleted, it automatically removes itself from the game world.

## Usage example
```lua
local inst = Prefab("glasscutter", fn, assets)
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(15)
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(10)
inst.components.finiteuses:SetUses(10)
inst.components.finiteuses:SetOnFinished(inst.Remove)
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `equippable`, `damagetypebonus`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `physics`, `floatable`  
**Tags:** Adds `sharp` and `pointy`; checks `shadow`, `shadowminion`, `shadowchesspiece`, `stalker`, `stalkerminion`, `shadowthrall` during attack.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skin_equip_sound` | string? | `nil` | Optional sound played during equipment (applies only during equip). |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Handles logic when the glasscutter is equipped. Updates animation state to show "ARM_carry", overrides symbol/override skin for visual appearance, and optionally plays a skin-specific sound.
*   **Parameters:**  
    - `inst` (Entity) — the glasscutter entity.  
    - `owner` (Entity) — the entity equipping the item (typically a player).  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if `skin_equip_sound` is `nil` or owner lacks `SoundEmitter`.

### `onunequip(inst, owner)`
*   **Description:** Restores the owner's default arm animation ("ARM_normal") when unequipped. Optionally pushes event for skinned items.
*   **Parameters:**  
    - `inst` (Entity) — the glasscutter entity.  
    - `owner` (Entity) — the entity unequipping the item.  
*   **Returns:** Nothing.

### `onattack(inst, attacker, target)`
*   **Description:** Modifies wear rate during attack based on whether the target is a shadow-type entity. Sets `attackwear` to a higher value if the target matches shadow tags, otherwise default wear.
*   **Parameters:**  
    - `inst` (Entity) — the glasscutter entity.  
    - `attacker` (Entity) — the entity performing the attack.  
    - `target` (Entity?) — the entity being attacked, or `nil`.  
*   **Returns:** Nothing.  
*   **Error states:** No direct error, but wear rate defaults to `1` if `target` is invalid or not a shadow type.

## Events & listeners
- **Listens to:** None (none registered directly in this file).  
- **Pushes:** `equipskinneditem`, `unequipskinneditem` (via `owner:PushEvent(...)`) — fired when a skin build is present during equip/unequip.  
- **Component events used:**  
  - `finiteuses.onfinished` — calls `inst.Remove()` when uses are depleted.  
  - `weapon.onattack` — sets `attackwear` value dynamically based on target type.  
  - `equippable.onequip` / `equippable.onunequip` — invokes custom logic for equip/unequip.