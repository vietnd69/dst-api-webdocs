---
id: spider_healer_item
title: Spider Healer Item
description: A consumable item that heals the Spider Whisperer and nearby spiders when used.
tags: [consumable, healing, spider]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c94a2685
system_scope: inventory
---

# Spider Healer Item

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spider_healer_item` is a prefab that represents a throwable healing item used exclusively by the Spider Whisperer character. When used (via the `healer` component), it triggers a one-time heal effect on the Spider Whisperer and any nearby spiders within range. It integrates with the `healer`, `inventoryitem`, `inspectable`, `stackable`, and `burnable` components to support standard inventory behaviors and special healing logic.

## Usage example
```lua
-- Typically used via the game's built-in item system; manual usage example:
local inst = SpawnPrefab("spider_healer_item")
-- The item becomes usable when equipped by a spiderwhisperer
inst.components.healer:UseHealer(target) -- triggers OnHealFn for target and nearby spiders
```

## Dependencies & tags
**Components used:** `healer`, `inventoryitem`, `inspectable`, `stackable`, `animstate`, `soundemitter`, `transform`, `network`, `floatable`, `propagator`, `hauntablelaunch`, `burnable`  
**Tags:** Checks `spider` and `spiderwhisperer`; avoids `FX`, `NOCLICK`, `DECOR`, `INLIMBO`.

## Properties
No public properties.

## Main functions
### `OnHealFn(inst, target)`
* **Description:** Triggered when the healer item is used. Heals the Spider Whisperer (if `target` is the user) and all nearby spiders within `TUNING.SPIDER_HEALING_ITEM_RADIUS`. Also spawns visual FX and plays a sound.
* **Parameters:**  
  - `inst` (Entity) — the healer item instance.  
  - `target` (Entity) — the primary healing target (typically the Spider Whisperer).  
* **Returns:** Nothing.  
* **Error states:** Does not apply damage if `target.components.health` is missing, but heal amount defaults to `0` if `target` is not the Spider Whisperer.

## Events & listeners
None identified.