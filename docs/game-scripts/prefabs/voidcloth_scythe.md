---
id: voidcloth_scythe
title: Voidcloth Scythe
description: A shadow-themed scythe weapon that degrades with use and grants set bonuses when paired with Voidcloth armor.
tags: [combat, weapon, shadow, durability, setbonus]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 38a5ce82
system_scope: combat
---

# Voidcloth Scythe

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
The Voidcloth Scythe is a durable weapon prefab that functions as both a melee weapon and a harvesting tool. It features a degradation system where it breaks after exhausting its uses, becoming repairable at a Forge station. When the owner equips the Voidcloth Hat, the scythe activates a set bonus that increases damage and adds planar damage. It also includes shadow-themed visual effects and dialogue capabilities when wielded by shadow-aligned players.

## Usage example
```lua
local scythe = SpawnPrefab("voidcloth_scythe")
-- Check durability
local uses = scythe.components.finiteuses:GetUses()
-- Use scythe harvesting action
scythe:DoScythe(target, ThePlayer)
-- Enable shadow dialogue
scythe:ToggleTalking(true, ThePlayer)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- damage values, use count, talk intervals
- `ACTIONS` -- defines SCYTHE action
- `TheSim` -- entity finding for AoE harvest
- `TheWorld` -- mastersim check for classified entity
- `TheNet` -- PVP and dedicated server checks
- `STRINGS` -- dialogue lines
- `EQUIPSLOTS` -- equipment slot constants

**Components used:**
- `equippable` -- handles equip/unequip logic and dapperness
- `weapon` -- defines damage and attack callback
- `tool` -- enables harvesting action
- `finiteuses` -- tracks durability and consumption
- `floater` -- manages floating animation state
- `talker` -- enables entity dialogue
- `inspectable` -- overrides name when broken
- `inventoryitem` -- allows pickup and storage
- `planardamage` -- adds planar damage component
- `damagetypebonus` -- adds bonus damage vs lunar aligned
- `shadowlevel` -- sets shadow level for interactions
- `highlightchild` -- used on FX child entity (`inst.fx`) for highlighting
- `colouraddersync` -- used on FX child entity (`inst.fx`) for colour syncing

**Tags:**
- `sharp` -- added on creation
- `show_broken_ui` -- added on creation
- `weapon` -- added on creation
- `shadowlevel` -- added on creation
- `shadow_item` -- added on creation
- `broken` -- added when durability reaches zero

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isbroken` | net_bool | `false` | Networked boolean indicating if the scythe is broken. |
| `_bonusenabled` | boolean | `false` | Internal flag for Voidcloth set bonus activation. |
| `_owner` | entity | `nil` | Reference to the current owner of the scythe. |
| `_classified` | entity | `nil` | Reference to the classified child entity for shadow interactions. |
| `localsounds` | entity | `nil` | Client-side entity for talk sound emission (created only on non-dedicated servers). |
| `fx` | entity | `nil` | Reference to the visual effects child entity. |
| `talktask` | task | `nil` | Scheduled task for periodic talking dialogue. Cancelled when talking is disabled. |

## Main functions

### `AttachClassified(classified)`
* **Description:** Attaches a classified child entity to the scythe for shadow interactions and sets up removal listeners.
* **Parameters:** `classified` -- entity instance to attach as classified.
* **Returns:** None.
* **Error states:** None.

### `DetachClassified()`
* **Description:** Detaches the classified child entity and cleans up listeners.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnRemoveEntity()`
* **Description:** Cleanup function called when the entity is removed. Handles classified entity removal based on simulation authority.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `SayRandomLine(str_list, owner)`
* **Description:** Triggers a random dialogue line from the provided list if the owner is shadow-aligned. Schedules the next line.
* **Parameters:**
  - `str_list` -- table of string keys from STRINGS.
  - `owner` -- player entity owning the scythe.
* **Returns:** None.
* **Error states:** Errors if owner is nil (no nil guard before owner:HasTag() call). Caller must ensure owner is non-nil player entity.

### `ToggleTalking(turnon, owner)`
* **Description:** Enables or disables the periodic talking task for the scythe.
* **Parameters:**
  - `turnon` -- boolean to enable or disable talking.
  - `owner` -- player entity owning the scythe.
* **Returns:** None.
* **Error states:** Errors if owner is nil when turnon is true (no nil guard before owner:HasTag() call).

### `DoScythe(target, doer)`
* **Description:** Performs the scythe harvesting action in an area of effect around the doer. Triggers dialogue and harvests pickable entities in front of the doer.
* **Parameters:**
  - `target` -- target entity of the action.
  - `doer` -- player entity performing the action.
* **Returns:** None.
* **Error states:** Errors if `doer` or `target` is nil (no nil guard before `doer:GetPosition()` or `target.components.pickable` access). Both parameters must be valid entities.

### `IsEntityInFront(entity, doer_rotation, doer_pos)`
* **Description:** Checks if an entity is within the scythe's harvesting angle relative to the doer's facing.
* **Parameters:**
  - `entity` -- entity to check position for.
  - `doer_rotation` -- number representing doer's rotation.
  - `doer_pos` -- vector representing doer's position.
* **Returns:** Boolean indicating if entity is in front.
* **Error states:** Errors if `entity` is nil (no nil guard before `entity:GetPosition()` call).

### `HarvestPickable(ent, doer)`
* **Description:** Attempts to pick a pickable entity and launches the loot towards the doer. Plays pick sound if available.
* **Parameters:**
  - `ent` -- pickable entity to harvest.
  - `doer` -- player entity receiving the loot.
* **Returns:** Boolean success status from the pickable component.
* **Error states:** Errors if `doer` is nil (no nil guard before `doer.SoundEmitter:PlaySound()` call).

### `DoShadowAoE(attacker, target)`
* **Description:** Triggers a shadow area-of-effect attack using the attacker's combat component. Validates targets to exclude allies and specific tags.
* **Parameters:**
  - `attacker` -- player entity performing the attack.
  - `target` -- primary target entity of the attack.
* **Returns:** None.
* **Error states:** Errors if `attacker` is nil (no nil guard before `attacker.components.combat` access).

## Events & listeners
- **Listens to:**
  - `onremove` -- detaches classified entity.
  - `equip` -- checks for Voidcloth Hat to enable set bonus.
  - `unequip` -- disables set bonus if head slot changes.
  - `ontalk` -- plays talk sound.
  - `donetalking` -- stops talk sound.
  - `floater_stopfloating` -- resets animation loop.
  - `isbrokendirty` -- updates visual state when `isbroken` changes.
- **Pushes:**
  - `equipskinneditem` -- pushed on owner entity (`owner:PushEvent`).
  - `unequipskinneditem` -- pushed on owner entity (`owner:PushEvent`).
  - `picksomethingfromaoe` -- pushed on doer entity (`doer:PushEvent`).