---
id: staff_tornado
title: Staff Tornado
description: A consumable weapon that spawns a tornado entity targeting an enemy, with limited uses and integration into the spellcasting and equippable systems.
tags: [combat, consumable, spellcasting, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ceb9eceb
system_scope: combat
---

# Staff Tornado

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `staff_tornado` prefab implements a magical melee weapon that casts tornadoes when used. It functions as both an equippable item with skin support and a spellcasting item with finite uses. When equipped, it overlays a custom animation symbol on the player; when used, it spawns a tornado entity (`tornado`) at a calculated offset toward the target, assigns the original caster as the tornado's owner, and decrements the staff's remaining uses. Upon exhaustion, the staff automatically removes itself. The tornado itself has its own brain, movement properties, and lifetime behavior.

## Usage example
```lua
-- Assuming `player` is a valid entity with an inventory:
local staff = SpawnPrefab("staff_tornado")
player:AddItem(staff)  -- Adds staff to inventory
-- Equipping and casting is handled automatically via game controls
-- once the staff is in the player's hands (via EquipItem or hotbar).
```

## Dependencies & tags
**Components used:** `finiteuses`, `inventoryitem`, `equippable`, `spellcaster`, `locomotor`, `knownlocations`, `inspectable`, `soundemitter`, `animstate`, `transform`, `network`

**Tags:** Adds `nopunch`, `quickcast`, `usesdepleted` (conditionally by `finiteuses`)

## Properties
No public properties are directly exposed by the `staff_tornado` constructor. Configuration values are loaded via constants (e.g., `TUNING.TORNADOSTAFF_USES`, `TUNING.TORNADO_LIFETIME`).

## Main functions
This prefab exposes no standalone public methods beyond those defined on the spawned tornado (`SetDuration` is attached to the *tornado* prefab, not the staff).

## Events & listeners
- **Listens to:** None defined in the staff constructor.
- **Pushes:** 
  - `equipskinneditem` and `unequipskinneditem` (via `owner:PushEvent`) when equipped/unequipped with skin overrides.
  - `"percentusedchange"` (indirectly via `finiteuses:SetUses` when uses change).

> **Note:** The `spawntornado` function is the core spell logic and is passed to `spellcaster:SetSpellFn`. It is not a public method on the staff itself but is invoked internally by the spellcasting system.
