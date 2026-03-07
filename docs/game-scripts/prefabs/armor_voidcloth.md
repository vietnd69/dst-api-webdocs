---
id: armor_voidcloth
title: Armor Voidcloth
description: A wearable item that grants shadow-aligned resistance, planar defense, and sets a negative sanity aura when equipped.
tags: [combat, equipment, sanity, shadow, set_bonus]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3924dd05
system_scope: inventory
---

# Armor Voidcloth

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `armor_voidcloth` prefab is an equippable clothing item that belongs to the Voidcloth equipment set. It provides physical armor, planar defense, and shadow-aligned damage resistance. When equipped, it applies a negative sanity aura to the wearer and spawns visual FX particles that follow the owner. The item supports skinning via `GetSkinBuild()` and integrates with the game's broken/repaired state system using forge-based repair logic.

## Usage example
```lua
-- Example: Equipping the voidcloth armor on a player entity
local player = ThePlayer
local voidcloth = SpawnPrefab("armor_voidcloth")
if voidcloth then
    player:PushEvent("equipped", voidcloth)
    player.components.inventory:Equip(voidcloth)
    -- The onEquip logic handles FX, symbol overrides, and sanity aura
end
```

## Dependencies & tags
**Components used:** `damagetyperesist`, `equippable`, `floater`, `highlightchild`, `inspectable`, `inventoryitem`, `armor`, `planardefense`, `setbonus`, `shadowlevel`, `colouraddersync`, `updatelooper`  
**Tags:** `cloth`, `shadow_item`, `show_broken_ui`, `shadowlevel`, `FX`, `broken`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fx` | entity or `nil` | `nil` | Reference to the spawned FX prefab instance (set during equip). |
| `foleysound` | string | `"dontstarve/movement/foley/shadowcloth_armour"` | Sound event played for footsteps while wearing the armor. |
| `scrapbook_specialinfo` | string | `"VOIDCLOTHARMOR"` | Metadata key used by the scrapbook UI to display special information. |

## Main functions
### `SetupEquippable(inst)`
*   **Description:** Initializes the `equippable` component with body slot, equip/unequip callbacks, and sound settings.
*   **Parameters:** `inst` (entity) — the armor instance.
*   **Returns:** Nothing.

### `OnEnabledSetBonus(inst)`
*   **Description:** Applies additional `shadow_aligned` damage resistance when the Voidcloth set bonus is active.
*   **Parameters:** `inst` (entity) — the armor instance (used as the source).
*   **Returns:** Nothing.

### `OnDisabledSetBonus(inst)`
*   **Description:** Removes the set-bonus `shadow_aligned` resistance when the set bonus is no longer active.
*   **Parameters:** `inst` (entity) — the armor instance.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Executed when the armor is equipped; applies symbol override, spawns FX, and sets negative sanity aura to `0`.
*   **Parameters:**  
    * `inst` (entity) — the armor instance.  
    * `owner` (entity) — the entity equipping the armor.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Executed when the armor is unequipped; clears symbol override, removes FX, and resets the negative sanity aura modifier.
*   **Parameters:**  
    * `inst` (entity) — the armor instance.  
    * `owner` (entity) — the entity unequipping the armor.  
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Transitions the armor into a broken state: removes equippable, switches animation, updates UI override, and sets swap data for broken visuals.
*   **Parameters:** `inst` (entity) — the armor instance.
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Repairs the armor: re-initializes the equippable component, restores animation, clears broken tag, and resets UI override.
*   **Parameters:** `inst` (entity) — the armor instance.
*   **Returns:** Nothing.

### `fx_AttachToOwner(inst, owner)`
*   **Description:** Attaches the FX prefab to the owner entity, registers color synchronization, and spawns FX frames (client only).
*   **Parameters:**  
    * `inst` (entity) — the FX instance (`armor_voidcloth_fx`).  
    * `owner` (entity) — the entity to attach to.  
*   **Returns:** Nothing.
*   **Error states:** FX frames are not spawned on dedicated servers (`TheNet:IsDedicated()` returns `true`).

## Events & listeners
- **Listens to:** `onremove` — used internally by `colouradder:AttachChild()` to clean up children when removed.  
- **Pushes:**  
    * `equipskinneditem` — fired on owner during equip if using a skin.  
    * `unequipskinneditem` — fired on owner during unequip if using a skin.  
    * `broken` — implicit via `MakeForgeRepairable` integration (not explicitly pushed here, but triggers repair callbacks).  
    * `repair` — implicit via `MakeForgeRepairable` integration.  

(No other event listeners or pushes are present in the provided code.)