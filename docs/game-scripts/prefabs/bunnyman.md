---
id: bunnyman
title: Bunnyman
description: A sentient pig-like creature that can follow players, wear hats, and enter a powerful "beard lord" nightmare state under certain conditions.
tags: [entity, ai, follower, combat, sanity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ffddeefa
system_scope: entity
---

# Bunnyman

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bunnyman` prefab represents a sentient rabbit-pig hybrid NPC with complex behavior involving loyalty, trading, combat, and sanity effects. It uses the Entity Component System to integrate with many game systems: it can follow a leader, wear equipment, accept/ trade items, share combat aggro with nearby同类, and transform into a "beard lord" with enhanced traits upon exposure to low-sanity observers or forced nightmare events. It is not a component itself but a full prefab definition, and its behavior is implemented via numerous attached components.

## Usage example
While modders typically do not create a `bunnyman` from scratch (it is a predefined NPC), this shows how its core components might be used on a custom entity:

```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst.components.follower.maxfollowtime = TUNING.PIG_LOYALTY_MAXTIME

inst:AddComponent("eater")
inst.components.eater:SetDiet({ FOODTYPE.VEGGIE }, { FOODTYPE.VEGGIE })
inst.components.eater:SetCanEatRaw()

inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(15)
inst.components.combat:SetAttackPeriod(1.5)

inst:AddComponent("sanityaura")
inst.components.sanityaura.aurafn = function(obs) return -TUNING.SANITYAURA_MED end

inst:AddComponent("trader")
inst.components.trader:SetAcceptTest(function(_, item) return item:HasTag("hat") end)
```

## Dependencies & tags
**Components used:**  
`talker`, `spawnfader`, `locomotor`, `embarker`, `drownable`, `bloomer`, `eater`, `combat`, `named`, `follower`, `health`, `inventory`, `lootdropper`, `knownlocations`, `timer`, `trader`, `sanityaura`, `sleeper`, `inspectable`, `acidinfusible`

**Tags added:**  
`cavedweller`, `character`, `pig`, `manrabbit`, `scarytoprey`, `regular_bunnyman`, `trader`, `_named` (removed on master sim before replication)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `beardlord` | boolean | `nil` | `true` when the bunnyman is in forced "beard lord" nightmare state (e.g., from low-sanity observer or timer). |
| `clearbeardlordtask` | task reference | `nil` | Task handle to clear the `beardlord` state after 5 seconds of no observation. |
| `scrapbook_hide` | table | `{ "hat", "ARM_carry", "HAIR_HAT" }` | List of animation symbols hidden in scrapbook view. |
| `has_nightmare_state` | boolean | `true` | Flag indicating this entity supports forced nightmare transition. |

## Main functions
### `SetForcedBeardLord(inst, duration)`
* **Description:** Forces the bunnyman into the "beard lord" state (visual beard, nightmare transformation). Used for both event-driven and timer-based transitions. If a `forcenightmare` timer already exists, it extends or preserves its duration.
* **Parameters:**  
  - `inst` (Entity instance) – the bunnyman instance.  
  - `duration` (number or `nil`) – time in seconds until the beard lord state expires; `nil` is used during loading/rehydration to avoid resetting.
* **Returns:** Nothing.

### `OnForceNightmareState(inst, data)`
* **Description:** Event handler triggered by `ms_forcenightmarestate`. Calls `DoShadowFx` to spawn transition effects and invokes `SetForcedBeardLord` with the provided duration.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `data` (table) – must contain `data.duration` (number).
* **Returns:** Nothing.

### `CalcSanityAura(inst, observer)`
* **Description:** Sanitizes aura calculation. Returns a negative sanity aura if the observer is "crazy" (low sanity + no dapper effects) or the bunnyman is in forced beard lord state; otherwise returns a small positive aura if the bunnyman is following the observer, or zero.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `observer` (Entity instance) – the entity detecting the aura.
* **Returns:** `number` – `–TUNING.SANITYAURA_MED`, `+TUNING.SANITYAURA_SMALL`, or `0`.

### `ShouldAcceptItem(inst, item)`
* **Description:** Accepts items for trading: any headgear, and food (except carrots under loyalty saturation conditions). Carrots are accepted only if the leader is unknown or loyalty is `<= 0.9`.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `item` (Entity instance) – the item being offered.
* **Returns:** `boolean` – `true` if accepted, `false` otherwise.

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Handles item receipt during trades or feeding. Feeds edible items (especially carrots to build loyalty). Equips headgear by dropping current head item and equipping the new one.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `giver` (Entity instance).  
  - `item` (Entity instance).
* **Returns:** Nothing.

### `OnRefuseItem(inst, item)`
* **Description:** Handles rejected items by transitioning to the "refuse" state and waking the bunnyman if asleep.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `item` (Entity instance).
* **Returns:** Nothing.

### `NormalRetargetFn(inst)`
* **Description:** Computes the next valid combat target based on proximity and tag heuristics (must be monster/wonkey/pirate, have meat visible, and not wear a "manrabbitscarer" item).
* **Parameters:**  
  - `inst` (Entity instance).
* **Returns:** `Entity or nil`.

### `LootSetupFunction(lootdropper)`
* **Description:** Configures drop table on death: nightmare/forced beard lord drops fixed "forced_beardlordloot"; other cases use `beardlordloot` if killed by a crazy observer; otherwise random carrot/meat/tail with one extra random item.
* **Parameters:**  
  - `lootdropper` (LootDropper component).
* **Returns:** Nothing (modifies the component’s loot table directly).

### `IsForcedNightmare(inst)`
* **Description:** Utility to check if the "forcenightmare" timer exists.
* **Parameters:**  
  - `inst` (Entity instance).
* **Returns:** `boolean` – `true` if a `forcenightmare` timer is active.

### `SwitchLeaderToRabbitKing(inst, rabbitking)`
* **Description:** Transfers loyalty and combat focus to the rabbit king if the current leader is the rabbit king.
* **Parameters:**  
  - `inst` (Entity instance).  
  - `rabbitking` (Entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` – sets attacker as combat target and shares aggro with nearby manrabbits or hosted thralls.  
  `newcombattarget` – shares new target with nearby allies.  
  `ms_forcenightmarestate` – triggers nightmare transformation and beard lord state.  
  `timerdone` – handles expiration of forced nightmare timer and revert to normal state.

- **Pushes:**  
  `gainloyalty` – fired when loyalty is added via `follower:AddLoyaltyTime`.  
  `onwakeup` – fired by `sleeper:WakeUp()` during item receipt or refusal.  
  `dropitem` – fired internally when equipping or dropping headgear.
