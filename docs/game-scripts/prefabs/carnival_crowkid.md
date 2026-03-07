---
id: carnival_crowkid
title: Carnival Crowkid
description: Manages the state, behavior, and trading mechanics of the Carnival Crowkid NPC, including item acceptance logic, scarf appearance, and snack timer handling.
tags: [npc, trader, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4ff5872
system_scope: entity
---

# Carnival Crowkid

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnival_crowkid` defines the entity prefab for the Carnival Crowkid NPC, a seasonal trader that accepts specific food items in exchange for rewards during the Carnival event. It integrates the `talker`, `trader`, `eater`, `locomotor`, and `timer` components to handle dialogue, item trading, movement, and temporary snack possession logic. The entity uses a custom state graph and brain for behavioral control.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
-- ... other entity setup ...
inst:AddComponent("talker")
inst:AddComponent("trader")
inst.components.trader:SetAcceptTest(function(inst, item, giver) return item.prefab == "corn_cooked" end)
-- ... additional initialization ...
```

## Dependencies & tags
**Components used:** `talker`, `named`, `locomotor`, `knownlocations`, `eater`, `trader`, `inspectable`, `fueler`, `timer`, `dynamicshadow`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags added:** `character`, `_named`, `NOBLOCK`, `trader`  
**Tags removed (during initialization):** `_named` (later re-added via `named` component)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shape` | number | `math.random(3)` | Determines the scarf variant (1–3); controls `scarf_1` symbol override. |
| `has_snack` | string or `nil` | `nil` | Stores the prefab name of the currently held snack; resets when timer expires. |
| `ShouldFlyAway` | boolean | `not IsSpecialEventActive(SPECIAL_EVENTS.CARNIVAL)` | If true, Crowkid will attempt to fly away instead of remain stationary. |

## Main functions
### `SetScarfBuild(inst)`
* **Description:** Updates the visual appearance of the scarf based on the `shape` property by overriding or clearing the `scarf_1` symbol in the animstate.
* **Parameters:** `inst` (Entity) – the entity instance.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Callback for timer completion; clears `inst.has_snack` if the timer name matches `"has_snack"`.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `data` (table) – timer data containing `name` field.
* **Returns:** Nothing.

### `AcceptTest(inst, item, giver)`
* **Description:** Test function for the `trader` component; determines whether the Crowkid will accept the given item.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `item` (Entity) – the item being offered.  
  `giver` (Entity) – the entity offering the item.
* **Returns:** `true` if `inst.has_snack` is `nil` and `item.prefab` is `"corn_cooked"` or `"carnivalfood_corntea"`; otherwise `false`.

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Triggered upon successful trade; sets `has_snack`, starts a timer to expire it, transitions to `"give_reward"` state, and removes the item.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `giver` (Entity) – the entity offering the item.  
  `item` (Entity) – the accepted item.
* **Returns:** Nothing.

### `OnRefuseItem(inst, giver, item)`
* **Description:** Triggered when a trade is refused; plays a refusal or "already holding snack" dialogue via `talker:Say`, unless the entity is tagged `busy`.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `giver` (Entity) – the entity offering the item.  
  `item` (Entity) – the refused item.
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Serialization hook; stores `shape` and `has_snack` into save data.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `data` (table) – save data table.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Deserialization hook; restores `shape` and `has_snack`, then reapplies scarf build.
* **Parameters:**  
  `inst` (Entity) – the entity instance.  
  `data` (table) – loaded save data (may be `nil`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` – triggers `OnTimerDone` when timers complete.