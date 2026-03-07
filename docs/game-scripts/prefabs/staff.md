---
id: staff
title: Staff
description: Implements magical staff prefabs with colour-specific abilities, including fire/lighting, ice/freezing, teleportation, blinking, deconstruction, and light creation.
tags: [combat, magic, inventory, crafting, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f357bfc7
system_scope: world
---

# Staff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `staff` prefabs implement a family of magical staff items — fire, ice, teleport, blink, deconstruction, and light creation — each with distinct behaviours and interactions. Staffs are combat-capable ranged weapons that consume finite uses, may affect sanity, ignite or extinguish targets, freeze entities, teleport or blink them, or destroy structures. They use multiple components (`weapon`, `spellcaster`, `blinkstaff`, `reticule`, `finiteuses`, `hauntable`) and integrate with `inventory`, `equippable`, and `sanity`/`staffsanity` to deliver both direct and ambient gameplay effects. Staffs also respond to hauntable mechanics, with custom hauntable reactions that trigger ability-specific effects on haunt.

## Usage example
```lua
local staff = SpawnPrefab("firestaff")
if staff ~= nil and staff.components.weapon ~= nil then
    staff.components.weapon:SetDamage(5)
    staff.components.weapon:SetRange(8, 10)
    -- Attacking a target triggers the onattack callback (e.g., ignite)
end
```

## Dependencies & tags
**Components used:** `armor`, `blinkstaff`, `burnable`, `combat`, `constructionsite`, `container`, `dryer`, `equippable`, `finiteuses`, `floater`, `freezable`, `fuel`, `fueled`, `harvestable`, `hauntable`, `health`, `hitchable`, `inventory`, `inventoryitem`, `inventoryitemholder`, `itemmimic`, `locomotor`, `minigame_participator`, `occupiable`, `reticule`, `sanity`, `shadowlevel`, `sleeper`, `spawner`, `spellcaster`, `stackable`, `staffsanity`, `stewer`, `teleportedoverride`, `trap`, `weapon`.

**Tags:** Staff prefabs add colour-specific tags (`firestaff`, `icestaff`, `nopunch`, `rangedweapon`, `rangedlighter`, `extinguisher`, `allow_action_on_impassable`), `weapon`, `rangedweapon`, and optionally `shadowlevel`. Staffs also check `INLIMBO`, `playerghost`, `noteleport`, `canlight`, `locomotor`, and `freezable` tags depending on the ability.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `projectiledelay` | number | `FRAMES` | Delay before the projectile is launched in frames (set on red and blue-type staffs). |
| `icestaff_coldness` | number | `1` | Coldness value applied to targets when struck by ice staff (set on blue, blue2, blue3 staffs). |
| `fxcolour` | table | `{r,g,b}` (0..1) | RGB colour used for visual effects, often related to the staff type. |
| `castsound` | string | `"dontstarve/common/staffteleport"` | Sound played on casting (set on purple, yellow, opal). |
| `skin_sound` | string | (optional) | Per-skin sound override for staff usage (used in `onattack_red` and `onattack_blue`). |

## Main functions
No standalone global functions are exposed as component APIs. All behaviour is implemented via callbacks and component methods registered during prefab construction.

## Events & listeners
- **Listens to:** `death` (on burnable targets, via `Burnable.Ignite`); `teleport_move`, `teleported`, `startled` (via events pushed to teleported entities); `onextinguish`, `onignite` (handled internally via burnable callbacks).
- **Pushes:** `sanitydelta`, `invincibletoggle`, `teleport_move`, `teleported`, `attacked`, `unequip`, `equip`, `startled`, `ondeconstructstructure`, `onignite`, `onextinguish`, `unfreeze`, `onwakeup`, `goinsane`, `goenlightened`, `gosane`, `onownerdropped`, `dropitem`, `unequipskinneditem`, `equipskinneditem`, `setoverflow`.