---
id: balloonvest
title: Balloonvest
description: An equippable body-slot item that provides buoyancy and floats on water while consuming magical fuel over time; popping a balloon on the vest interrupts swimming immersion and prevents drowning.
tags: [inventory, flotation, fuel, combat]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c73768eb
system_scope: inventory
---

# Balloonvest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloonvest` is a wearable entity prefab that serves as a flotation device and fuel-powered visual prop. It is equipped to the `EQUIPSLOTS.BODY` slot and grants swimming immunity by preventing drowning damage while in water. When equipped, it begins consuming magical fuel and modifies the owner's animation by overriding the `swap_body` symbol. The vest features two pop mechanisms: one triggered by the owner taking damage (depleting one balloon on attack), and another when the fuel is fully depleted (triggering a full pop animation). It uses shared utility functions defined in `balloons_common.lua`.

## Usage example
```lua
local inst = SpawnPrefab("balloonvest")
inst.components.equippable:Equip(player)
-- Balloonvest starts consuming fuel and watching for owner damage events
-- Fuel depletes over time (~1 day of game time)
-- Attacking while equipped pops one balloon; fuel exhaustion pops all balloons
```

## Dependencies & tags
**Components used:** `fueled`, `flotationdevice`, `equippable`, `inventory`, `poppable`  
**Tags added:** `cattoy`, `balloon`, `noepicmusic`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"wes/common/foley/balloon_vest"` | Sound label used for footstep or movement Foley when equipped. |

## Main functions
Not applicable — this is a prefab definition file, not a component class. The core logic resides in component callbacks (e.g., `onequip`, `onunequip`) defined at top level.

## Events & listeners
- **Listens to:** `attacked` — triggered on the owner when they take damage; invokes `onownerattackedfn`, which pops one balloon (if attached and poppable).  
- **Pushes:** None directly. Relies on component events:
  - `onfueldsectionchanged` — fired by `fueled` when fuel sections change (e.g., low fuel UI updates).
  - Component-level events such as `onpop` (via `poppable:Pop()`) trigger visual/audio effects elsewhere.
