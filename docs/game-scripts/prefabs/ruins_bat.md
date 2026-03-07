---
id: ruins_bat
title: Ruins Bat
description: A consumable equippable weapon that allows the player to summon shadow tentacles on attack, with a limited number of uses and shadow level scaling.
tags: [combat, consumable, equipment, shadow]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61533c9a
system_scope: entity
---

# Ruins Bat

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `ruins_bat` prefab is a one-time-use equippable weapon that spawns shadow tentacles on successful attacks. It integrates with the `weapon`, `equippable`, `finiteuses`, `inventoryitem`, `shadowlevel`, and `inspectable` components. When equipped, it overrides the player's arm animation and hides normal arms; unequipping restores default visuals. On each attack, it attempts a luck-based roll to spawn a `shadowtentacle` at a nearby walkable location, excluding holes.

## Usage example
```lua
local bat = SpawnPrefab("ruins_bat")
if bat ~= nil then
    player:PushEvent("equipskinneditem", bat:GetSkinName())
    bat.components.equippable:Equip(player)
    -- Attack logic handled via weapon component's SetOnAttack callback
end
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `inspectable`, `inventoryitem`, `equippable`, `shadowlevel`, `combat` (via spawned `shadowtentacle`)  
**Tags:** Adds `sharp` and `weapon` and `shadowlevel` to the bat instance; spawned tentacles use `combat` and are assigned an `owner`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.weapon.damage` | number | `TUNING.RUINS_BAT_DAMAGE` | Damage dealt by the weapon on attack. |
| `inst.components.weapon.onattack` | function | `onattack` (defined locally) | Callback fired on attack to conditionally spawn shadow tentacles. |
| `inst.components.finiteuses.total` | number | `TUNING.RUINS_BAT_USES` | Maximum number of attacks allowed. |
| `inst.components.finiteuses.current` | number | `TUNING.RUINS_BAT_USES` | Current remaining uses. Decrements on each attack. |
| `inst.components.equippable.walkspeedmult` | number | `TUNING.RUINS_BAT_SPEED_MULT` | Movement speed multiplier when the bat is equipped. |
| `inst.components.shadowlevel.level` | number | `TUNING.RUINS_BAT_SHADOW_LEVEL` | Shadow level applied to the entity (used for visibility in shadow realms). |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Executed when the bat is equipped. Applies skin overrides (if any), sets carry animation, and hides normal arms.
*   **Parameters:** `inst` (Entity) – the bat instance; `owner` (Entity) – the entity equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Executed when unequipped. Restores normal arm animation and clears skin overrides.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onattack(inst, owner, target)`
*   **Description:** Attack callback for the weapon component. Attempts to spawn a shadow tentacle using a luck roll. If successful, spawns a tentacle at a nearby valid position, assigns the original target or `nil`, and plays attack sounds.
*   **Parameters:** `inst` (Entity) – the bat; `owner` (Entity) – attacker; `target` (Entity or nil) – target of the attack.
*   **Returns:** Nothing.
*   **Error states:** Fails silently if `FindWalkableOffset` returns `nil` or tentacle spawn fails.

## Events & listeners
- **Listens to:** None directly; event handlers (`onequip`, `onunequip`, `onattack`) are invoked via component callbacks (`SetOnEquip`, `SetOnUnequip`, `SetOnAttack`).
- **Pushes:** `equipskinneditem`, `unequipskinneditem` (via `owner:PushEvent(...)`) when equipping/unequipping skinned variants.