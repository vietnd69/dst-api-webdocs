---
id: mossling
title: Mossling
description: Implements the Mossling prefab, a seasonal creature that spawns during winter and summer in DST, with herd-based AI, combat behaviors, and seasonal lifespan logic.
tags: [combat, ai, seasonal, herd]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3dd1575e
system_scope: entity
---

# Mossling

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mossling` prefab defines a seasonal creature that appears during spring and summer (and summer in the Caves). It is part of a herd (Moose egg herd), uses herd-based AI via `herdmember`, and engages in combat when attacked. The entity has a built-in lifecycle tied to seasonal changes—when spring ends or it enters the Caves, it marks itself for removal. It supports networked persistence via custom save/load handlers and integrates with DST’s combat, health, sound, and anim systems.

## Usage example
The Mossling prefab is not typically instantiated manually; it is spawned by world generation (e.g., during Moose egg hatching). A modder might reference its components like so:

```lua
-- Example: checking if a Mossling is currently under a guardian's protection
if inst.components.herdmember.herd ~= nil then
    local has_guardian = inst.components.herdmember.herd.components.guardian:HasGuardian()
end

-- Example: modifying Mossling walk speed dynamically
inst.components.locomotor.walkspeed = TUNING.MOSSLING_WALK_SPEED * 1.5
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sizetweener`, `sleeper`, `lootdropper`, `inspectable`, `knownlocations`, `inventory`, `herdmember`, `eater`, `burnable`, `locomotor`.  
**Tags added:** `mossling`, `animal`, `herdmember`.  
**Tags checked:** `prey`, `smallcreature`, `monster`, `player`, `moose` (via `RETARGET_CANT_TAGS`, `RETARGET_ONEOF_TAGS` in `RetargetFn`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mother_dead` | boolean | `false` | Tracks whether the Mossling’s mother (e.g., the spawning entity) is dead; affects retargeting logic. |
| `shouldGoAway` | boolean | `false` | Set to `true` when season changes or in caves; triggers removal during sleep. |

## Main functions
### `HasGuardian(inst)`
* **Description:** Helper function that returns `true` if the Mossling belongs to a herd with an active guardian. Used to conditionally adjust behavior (e.g., target retention).  
* **Parameters:** `inst` (Entity) — the Mossling instance.  
* **Returns:** `boolean` — `true` if the herd has a guardian, otherwise `false`.

### `RetargetFn(inst)`
* **Description:** Entity-targeting function for the `combat` component. Determines whether the Mossling can find a valid new target. Only activates if `mother_dead` is `true` or the Mossling is no longer under a guardian’s protection. Uses `FindEntity` to locate a nearby valid target.  
* **Parameters:** `inst` (Entity) — the Mossling instance.  
* **Returns:** `Entity?` — the first valid target found, or `nil`.  
* **Error states:** Returns `nil` if no valid target exists within range (`TARGET_DIST = 6`), or if all candidate entities are tagged with forbidden tags (`prey`, `smallcreature`, `mossling`, `moose`) or do not match required tags (`monster`, `player`).

### `KeepTargetFn(inst, target)`
* **Description:** Validation function for retaining an existing target. Allows target retention unless the Mossling is under a guardian *and* the target is very close (within `LOSE_TARGET_DIST = 13`), in which case it drops the target.  
* **Parameters:**  
  - `inst` (Entity) — the Mossling instance.  
  - `target` (Entity) — the candidate target.  
* **Returns:** `boolean` — `true` if the target should be kept, otherwise `false`.

### `OnAttacked(inst, data)`
* **Description:** Event handler for the `attacked` event. Assigns the attacker as the current target and attempts to share the target with up to 60 allies (other Mosslings or the guardian).  
* **Parameters:**  
  - `inst` (Entity) — the Mossling instance.  
  - `data` (table) — event payload, must include `attacker` (Entity).  
* **Returns:** Nothing.  
* **Note:** Calls `combat:SetTarget(data.attacker)` and `combat:ShareTarget(...)` with a custom filter function that includes other Mosslings and the herd guardian.

### `OnSave(inst, data)`
* **Description:** Saves persistent state before the game is closed. Stores `mother_dead` and `shouldGoAway` flags.  
* **Parameters:**  
  - `inst` (Entity) — the Mossling instance.  
  - `data` (table) — the save table to populate.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores state after loading. Applies previously saved `mother_dead` and `shouldGoAway` flags if present.  
* **Parameters:**  
  - `inst` (Entity) — the Mossling instance.  
  - `data` (table) — the loaded save data.  
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Handles removal of the Mossling during sleep when `shouldGoAway` is `true`. Called automatically by the game state graph during the sleep transition.  
* **Parameters:** `inst` (Entity) — the Mossling instance.  
* **Returns:** Nothing.  
* **Note:** Calls `inst:Remove()` if `inst.shouldGoAway` is `true`.

### `OnSpringChange(inst, isspring)`
* **Description:** Reacts to seasonal changes (spring/summer flag). Sets `shouldGoAway = true` if it is not spring/summer *or* if the world has the `"cave"` tag. Triggers immediate removal if the entity is already sleeping.  
* **Parameters:**  
  - `inst` (Entity) — the Mossling instance.  
  - `isspring` (boolean) — whether the current season is spring/summer.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `OnAttacked` to set or share targets.  
  - `entitysleep` — triggers `OnEntitySleep` to remove the entity if `shouldGoAway`.  
- **Pushes:** None (uses standard game events for save/load, health, and combat).