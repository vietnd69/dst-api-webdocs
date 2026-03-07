---
id: purebrilliance
title: Purebrilliance
description: A consumable item that casts a wurt lunar spell, applying debuffs and triggering cheer events on nearby lunar minion followers.
tags: [consumable, spell, debuff, minion]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 38a4545c
system_scope: inventory
---

# Purebrilliance

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`purebrilliance` is a consumable item prefab that, when used, casts a `SPECIALTYPES.WURT_LUNAR` spell targeting the doer. It does not interact with a target entity directly but instead acts on the doer's list of followers (via the `leader` component). If the doer has `lunarminion` followers that are alive, each one receives a `wurt_merm_planar` debuff and triggers a delayed `cheer` event. The item is consumed and removed upon successful spell use. It is designed for use with Wurt's merm mechanics and integrates with DST’s spellcasting and inventory systems.

## Usage example
```lua
local inst = SpawnPrefab("purebrilliance")
inst.components.inventoryitem.owner = some_player
inst.components.inventoryitem:PushToInventory()
-- When used (e.g., via right-click or action):
inst.components.spellcaster:CastSpell(target, position, doer)
```

## Dependencies & tags
**Components used:** `health`, `leader`, `spellcaster`, `stackable`
**Tags:** Adds `purebrilliance`, `mermbuffcast` to the main item; `FX`, `NOCLICK` to the symbol FX variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lightcolour` | table | `{53/255, 132/255, 148/255}` | RGBA light color override for the item (not fully opaque). |
| `fxprefab` | string | `"purebrilliance_castfx"` | Prefab name used for visual effect on cast. |
| `castsound` | string | `"meta4/casting/lunar"` | Sound event played when the spell is cast. |
| `pickupsound` | string | `"gem"` | Sound played when the item is picked up. |

## Main functions
### `Wurt_MermSpellFn(inst, target, pos, doer)`
* **Description:** The spell function executed when `purebrilliance` is used. Iterates over the `doer`'s followers, applying a debuff and scheduling a cheer event for each living `lunarminion`. Then consumes and removes the item. This function is assigned via `spellcaster:SetSpellFn()`.
* **Parameters:**  
  - `inst` (Entity): The `purebrilliance` item instance itself.  
  - `target` (Entity or nil): Not used; spell targets the doer indirectly via followers.  
  - `pos` (Vector3): Not used.  
  - `doer` (Entity): The entity casting/using the spell; must have the `leader` component.  
* **Returns:** Nothing.
* **Error states:**  
  - Skips non-`lunarminion` or dead followers.  
  - Consumes the item regardless of how many followers exist; even with no valid followers, the item is removed.

## Events & listeners
- **Pushes:** `cheer` — fired on each eligible follower with a small random delay (`.3 * math.random()` seconds). Triggered by `PushCheerEvent`, which only fires if the follower has the `lunarminion` tag and is not dead (`not components.health:IsDead()`).  
- **Listens to:** None.