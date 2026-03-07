---
id: armor_dreadstone
title: Armor Dreadstone
description: A high-defense body armor piece that regenerates condition during Insanity Mode and synergizes with the Dreadstone set.
tags: [combat, armor, sanity, set_bonus]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ad9dead9
system_scope: inventory
---

# Armor Dreadstone

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`Armor Dreadstone` is a body armor prefab that provides substantial physical and planar defense while integrating with the `sanity`, `setbonus`, and `shadowlevel` systems. It dynamically regenerates its condition when worn by a character in Insanity Mode, using the `armor` and `setbonus` components. It also applies passive dapperness effects and blocks shadow-aligned damage. The prefab is part of the Dreadstone equipment set and relies heavily on event callbacks and periodic tasks for state management.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("armordreadstone")
if inst ~= nil then
    inst.components.equippable:SetOnEquip(function(item, owner)
        print("Dreadstone armor equipped")
    end)
    inst.components.equippable:SetOnUnequip(function(item, owner)
        print("Dreadstone armor unequipped")
    end)
end
```

## Dependencies & tags
**Components used:** `armor`, `planardefense`, `equippable`, `damagetyperesist`, `shadowlevel`, `setbonus`, `inventoryitem`, `inspectable`  
**Tags added:** `dreadstone`, `hardarmor`, `shadow_item`, `shadowlevel`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `regentask` | Task or nil | `nil` | Reference to the periodic task responsible for condition regeneration; `nil` when inactive. |

## Main functions
### `OnBlocked(owner)`
* **Description:** Plays a sound effect when the armor blocks an attack.
* **Parameters:** `owner` (Entity) — the entity wearing the armor.
* **Returns:** Nothing.
* **Error states:** No known failure conditions; relies on `owner.SoundEmitter` existing.

### `GetSetBonusEquip(inst, owner)`
* **Description:** Returns the equipped Dreadstone hat if the owner is wearing both head and body pieces of the set.
* **Parameters:** `inst` (Entity) — the armor instance; `owner` (Entity) — the wearing character.
* **Returns:** Entity or `nil` — the `dreadstonehat` instance if equipped and valid.

### `DoRegen(inst, owner)`
* **Description:** Repairs the armor's condition periodically during Insanity Mode, based on current sanity and set bonus status.
* **Parameters:** `inst` (Entity) — the armor instance; `owner` (Entity) — the wearing character.
* **Returns:** Nothing.
* **Error states:** No operation if owner lacks `sanity` component or is not in Insanity Mode. Condition regeneration rate is inversely proportional to sanity percentage.

### `StartRegen(inst, owner)`
* **Description:** Starts the periodic condition regeneration task if not already running.
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Nothing.
* **Error states:** No effect if `inst.regentask` is non-`nil`.

### `StopRegen(inst)`
* **Description:** Cancels and clears the periodic condition regeneration task if active.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Handles logic when the armor is equipped — sets up animation overrides, registers "blocked" event listener, and initiates or stops regeneration based on damage state and sanity.
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Nothing.
* **Error states:** Skin-related events may not fire if no skin build is present.

### `onunequip(inst, owner)`
* **Description:** Handles logic when the armor is unequipped — clears animation overrides, removes event listener, and stops regeneration.
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Nothing.

### `OnTakeDamage(inst, amount)`
* **Description:** Triggered when the armor takes damage; starts condition regeneration if not already active and the owner is in Insanity Mode.
* **Parameters:** `inst` (Entity); `amount` (number) — damage amount (unused).
* **Returns:** Nothing.
* **Error states:** No effect if owner is missing `sanity` component.

### `CalcDapperness(inst, owner)`
* **Description:** Calculates dapperness penalty for wearing the armor during Insanity Mode, adjusted for set synergy.
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Number — dapperness value (`0`, `TUNING.CRAZINESS_MED * 0.5`, or `TUNING.CRAZINESS_MED` depending on set status and regeneration state).

## Events & listeners
- **Listens to:** `blocked` — on `owner` to trigger sound playback.
- **Pushes:** `equipskinneditem`, `unequipskinneditem` — via `owner` when skin builds are present.