---
id: yoth_knightstick
title: Yoth Knightstick
description: A consumable melee weapon that deals damage and burns fuel while the wielder moves forward.
tags: [combat, consumable,装备, burnable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a37e6c8
system_scope: inventory
---

# Yoth Knightstick

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yoth_knightstick` prefab is a unique, reusable melee weapon that consumes fuel as long as its wielder moves forward. It integrates with several core systems: `equippable` (for equip/unequip logic), `fueled` (for fuel consumption tied to locomotion), `weapon` (for damage), and `fuel` (for being usable as fuel in campfires/kilns). It also supports skinned animations and includes lightweight buoyancy for floating on water.

## Usage example
This prefab is instantiated automatically by the game when spawned (e.g., via crafting or world gen) and does not require manual instantiation. However, modders may reference its components as follows:
```lua
-- Assuming `inst` is an instance of yoth_knightstick
inst.components.fueled:StartConsuming() -- Start burning fuel manually (e.g., for custom logic)
inst.components.weapon:SetDamage(15)      -- Override default damage
inst.components.fueled:StopConsuming()    -- Stop fuel consumption (e.g., on unequip or idle)
```

## Dependencies & tags
**Components used:**  
- `equippable` — for managing equip/unequip behavior  
- `fueled` — to track and consume fuel while moving  
- `weapon` — provides combat damage  
- `fuel` — allows the stick to be used as campfire fuel  
- `inventoryitem`, `inspectable` — for inventory integration  
- `transform`, `animstate`, `soundemitter`, `network` — basic entity infrastructure  
- `locomotor` (via owner) — reads `wantstomoveforward` to control fuel burn  

**Tags:**  
- `weapon` — added to identify the item as a weapon  
- `gallopstick` — custom tag for categorization or mod detection  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_owner` | `Entity` | `nil` | The entity currently holding/equipping the stick. Used to attach `locomote` event listener. |
| `_onlocomote` | `function` | `nil` | Callback fired on `locomote` event; triggers fuel consumption if owner moves forward. |

## Main functions
This prefab is defined entirely within the constructor function `fn()`. It does not expose custom public methods beyond those provided by its components.

## Events & listeners
- **Listens to:**  
  - `locomote` — fired on the owner (`inst._owner`) to detect forward movement and control fuel consumption.  
- **Pushes:**  
  - None directly, but relies on events pushed by attached components:  
    - `equipskinneditem` / `unequipskinneditem` — via `owner:PushEvent(...)` in `OnEquip`/`OnUnequip` when a skin is applied.  
    - `onfueldsectionchanged` — pushed by `fueled` component when fuel level crosses thresholds (e.g., empty → depleted).  
    - `Remove` — triggered via `SetDepletedFn(inst.Remove)` when fuel depletes.