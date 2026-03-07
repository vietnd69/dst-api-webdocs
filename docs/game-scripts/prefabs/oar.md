---
id: oar
title: Oar
description: Provides the logic and configuration for oar items used in boat rowing, including durability tracking, waterproofing, and attachment to entities.
tags: [inventory, water, equipment, durability]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3454edb6
system_scope: inventory
---

# Oar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines prefabs and factory functions for oar-type items in DST. It creates entities with `oar`, `weapon`, `equippable`, `edible`, `waterproofer`, `fuel`, and `finiteuses` components, enabling rowing, combat, consumption, and durability mechanics. The core `fn` function is reused by multiple oar variants (`oar`, `oar_driftwood`, `malbatross_beak`, `oar_monkey`, `yotd_oar`), each configuring components with variant-specific tuning and assets.

## Usage example
```lua
-- Add an oar to an actor’s inventory
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("inventory")
inst.components.inventory:GiveItem(GetPrefabFn("oar")())

-- Check rowing consumption
inst.components.finiteuses:GetUses(ACTIONS.ROW)
```

## Dependencies & tags
**Components used:** `edible`, `inventoryitem`, `oar`, `inspectable`, `waterproofer`, `weapon`, `equippable`, `fuel`, `finiteuses`  
**Tags:** `allow_action_on_impassable`, `waterproofer` (conditionally added based on `is_waterproof`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `force` | number | — | Rowing force magnitude; assigned from `data.FORCE`. |
| `max_velocity` | number | — | Maximum boat speed when rowing; assigned from `data.MAX_VELOCITY`. |

## Main functions
### `fn(data, build, swap_build, fuel_value, is_wooden, is_waterproof)`
* **Description:** Constructs and configures an oar entity. Sets up physics, animations, components (including durability, waterproofer, weapon, etc.), and event callbacks. Returns the fully initialized prefab instance.
* **Parameters:**
  * `data` (table) — tuning data containing `FORCE`, `MAX_VELOCITY`, `DAMAGE`, `ATTACKWEAR`, `USES`, `ROW_FAIL_WEAR`.
  * `build` (string) —AnimState bank/build name (e.g., `"oar"`).
  * `swap_build` (string) —AnimState symbol name for when held (e.g., `"swap_oar"`).
  * `fuel_value` (number or `nil`) — fuel value for the `fuel` component; `nil` disables fuel.
  * `is_wooden` (boolean or `nil`) — if truthy, adds the `edible` component with `FOODTYPE.WOOD`.
  * `is_waterproof` (boolean or `nil`) — if truthy, adds the `waterproofer` component and `waterproofer` tag.
* **Returns:** `inst` (Entity) — fully configured oar entity.

## Events & listeners
- **Pushes:** `equipskinneditem` — via `owner:PushEvent` when equipping a skinned oar.
- **Pushes:** `toolbroke` — via `owner:PushEvent` when `finiteuses` reaches zero.
- **Pushes:** (Handled in callbacks) `onfiniteusesfinished` triggers `toolbroke`; equipped state changes trigger `ARM_carry`/`ARM_normal` animation updates.