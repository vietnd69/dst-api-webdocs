---
id: moose
title: Moose
description: Manages the moose boss entity's behavior, stats, and lifecycle in DST, including combat logic, egg-laying mechanics, and seasonal responsiveness.
tags: [combat, ai, boss, seasonal, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c6eb0e1c
system_scope: entity
---

# Moose

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moose` prefab implements the moose boss entity, a large, aggressive creature that patrols and attacks players and other creatures. It integrates with the game's ECS to manage health, combat, locomotion, loot dropping, and seasonal behavior. The moose is only active during spring (unless in the caves) and will remove itself when the season changes. It has unique mechanics including egg-laying via a timer, a disarm cooldown, and a named identity system.

## Usage example
```lua
local moose = Prefab("moose", fn, assets, prefabs)
local inst = moose()
inst.components.health:SetMaxHealth(500)
inst.components.combat:SetDefaultDamage(35)
```

## Dependencies & tags
**Components used:** `playerprox`, `health`, `combat`, `explosiveresist`, `sleeper`, `lootdropper`, `inspectable`, `named`, `knownlocations`, `inventory`, `entitytracker`, `timer`, `eater`, `drownable`, `locomotor`, `dynamicshadow`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** `moose`, `epic`, `animal`, `scarytoprey`, `largecreature`, `structure`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WantsToLayEgg` | boolean | `false` | Whether the moose is ready to lay an egg. Set to true by the "WantsToLayEgg" timer. |
| `CanDisarm` | boolean | `false` | Whether the moose can be disarmed. Set to true by the "DisarmCooldown" timer. |
| `shouldGoAway` | boolean | `false` | Indicates whether the moose should be removed due to seasonal change or cave environment. |

## Main functions
### `RetargetFn(inst)`
* **Description:** Finds a new target for the moose. Prioritizes entities near its egg, then any valid target within range. Skips re-targeting if the moose is in a "busy" state.
* **Parameters:** `inst` (Entity) - the moose instance.
* **Returns:** Entity or `nil` — the closest valid target within `TARGET_DIST`, or `nil` if none found.
* **Error states:** Returns `nil` if no valid target exists or if the moose is currently in the `busy` state tag.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the moose should continue pursuing a current target. Ensures both the moose and the target remain near the landing point (or current position).
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `target` (Entity) — the currently targeted entity.
* **Returns:** boolean — `true` if target remains valid (combat checks pass and distance constraints hold).
* **Error states:** Returns `false` if the target is out of range or too far from the landing point.

### `OnSpringChange(inst, isspring)`
* **Description:** Responds to seasonal changes. Sets `shouldGoAway` to `true` if not spring or if the world is a cave, and removes the moose if it is asleep.
* **Parameters:**  
  * `isspring` (boolean) — whether the current season is spring.  
  * `inst` (Entity) — the moose instance.
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** Automatically sets the attacker as the moose's combat target upon being attacked.
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `data` (table) — event data containing `attacker`.
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes key state values for world save compatibility.
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `data` (table) — table to populate with save data.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores serialized state values on load.
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `data` (table) — loaded data from save.
* **Returns:** Nothing.

### `ontimerdone(inst, data)`
* **Description:** Handles timer completions for laying eggs and disarm cooldown.
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `data` (table) — timer event data containing `name` field.
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** If `shouldGoAway` is true and the moose is asleep, removes the entity from the world.
* **Parameters:** `inst` (Entity) — the moose instance.
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Ensures the moose spawns at ground level (`y = 0`) by correcting its world position if airborne.
* **Parameters:**  
  * `inst` (Entity) — the moose instance.  
  * `data` (table) — pre-load data (unused).
* **Returns:** Nothing.

### `OnDead(inst)`
* **Description:** Awards the "moosegoose_killed" achievement upon the moose's death.
* **Parameters:** `inst` (Entity) — the moose instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `attacked` — triggers `OnAttacked` to engage the attacker as target.  
  * `entitysleep` — triggers `OnEntitySleep` to remove the moose if needed.  
  * `timerdone` — triggers `ontimerdone` for egg-laying and disarm timers.  
  * `EggHatch` — triggers `ontimerdone` (same handler as above).  
  * `death` — triggers `OnDead` to award achievement.  
  * `isspring` world state — triggers `OnSpringChange` on seasonal update.
- **Pushes:** None identified.