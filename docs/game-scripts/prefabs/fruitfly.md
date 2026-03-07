---
id: fruitfly
title: Fruitfly
description: Manages fruit fly entities with distinct behaviors for hostile lord/mini variants, friendly companions, and seed-bearing fruit fly fruit that spawn companions.
tags: [combat, ai, follower, leader, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1521675c
system_scope: entity
---

# Fruitfly

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fruitfly` prefab file defines four interrelated prefabs: `lordfruitfly` (a large hostile boss), `fruitfly` (smaller hostile minions), `friendlyfruitfly` (a companion that follows the player), and `fruitflyfruit` (an inventory item that spawns and bonds with a friendly fruit fly). The prefabs share common logic in their `common()` and `common_server()` helper functions, including physics, tags, and sanity/health modifiers, but diverge significantly in combat behavior, leadership, and interactivity. The `fruitflyfruit` acts as a leader entity that establishes a follower relationship with a spawned `friendlyfruitfly`.

## Usage example
```lua
-- Spawn a hostile lord fruit fly
local lord = SpawnPrefab("lordfruitfly")
if lord ~= nil then
    -- Lord fruit flies are self-contained leaders with combat
    -- No additional setup required in most modding cases
end

-- Spawn a friendly fruit fly and manually bind it to a leader
local ff = SpawnPrefab("friendlyfruitfly")
if ff ~= nil and leader ~= nil then
    ff.components.follower:SetLeader(leader)
end

-- Create a fruit fly fruit (item) to later bind a companion
local fruit = SpawnPrefab("fruitflyfruit")
if fruit ~= nil then
    fruit.Transform:SetPosition(x, y, z)
    -- On master simulation, this will automatically spawn and bind a friendly fruit fly
end
```

## Dependencies & tags
**Components used:** `inspectable`, `sleeper`, `locomotor`, `leader`, `combat`, `health`, `knownlocations`, `lootdropper`, `sanityaura`, `follower`, `perishable`, `inventoryitem`, `fuel`.  
**Tags added:** `flying`, `ignorewalkableplatformdrowning`, `insect`, `small`, `lordfruitfly`, `hostile`, `epic`, `smallepic`, `fruitfly`, `companion`, `friendlyfruitfly`, `cattoyairborne`, `fruitflyfruit`, `nonpotatable`, `irreplaceable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hascausedhavoc` | boolean | `false` | Required condition for minions to engage in combat. |
| `planttarget` | entity or nil | `nil` | Used by lord fruit fly to track target plants (combat override). |
| `soiltarget` | entity or nil | `nil` | Used by lord fruit fly to track target soil (combat override). |
| `CanTargetAndAttack` | function | — | Exposed on minions; checks if leader is nil and `hascausedhavoc` is true. |
| `IsTargetedByOther` | function | — | Exposed on lord; checks if target is claimed by another fruit fly. |
| `NumFruitFliesToSpawn` | function | — | Exposed on lord; calculates how many minions to spawn per buzz. |

## Main functions
### `LordLootSetupFunction(lootdropper)`
* **Description:** Configures the loot table for the lord fruit fly—either drops a `fruitflyfruit` (if no friendly fruit flies exist) or 4 seeds with one optional extra.
* **Parameters:** `lootdropper` (LootDropper component) — used to register chance-based loot.
* **Returns:** Nothing.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the lord fruit fly should remain engaged with a target, based on being targetable and within the deaggro distance of its remembered "home" location.
* **Parameters:** `inst` (entity) — the fruit fly; `target` (entity) — the proposed target.
* **Returns:** boolean — `true` if the target is within range and valid.

### `RetargetFn(inst)`
* **Description:** Periodic retarget function for the lord fruit fly; finds a new target (e.g., player) if no plant/soil target is present.
* **Parameters:** `inst` (entity) — the fruit fly.
* **Returns:** entity or `nil` — the newly selected target.

### `OnAttacked(inst, data)`
* **Description:** Called when the lord fruit fly is attacked; clears plant/soil targets and re-engages the attacker as the primary combat target.
* **Parameters:** `inst` (entity) — the fruit fly; `data` (table) — event payload containing `attacker`.
* **Returns:** Nothing.

### `IsTargetedByOther(inst, self, target)`
* **Description:** Called by the lord fruit fly to check if a target is already claimed by another fruit fly (including itself and its followers).
* **Parameters:** `inst` (entity) — the self entity checking target conflict; `self` (entity) — the potential conflicting follower/lord; `target` (entity) — the contested target entity.
* **Returns:** boolean — `true` if another fruit fly is targeting the same entity.

### `NumFruitFliesToSpawn(inst)`
* **Description:** Calculates how many minion fruit flies should spawn per “buzz” event based on current followers and tune constants.
* **Parameters:** `inst` (entity) — the lord fruit fly.
* **Returns:** number — integer count of minions to spawn.

### `CanTargetAndAttack(inst)`
* **Description:** Helper on minions to determine if combat is allowed; requires no leader and `hascausedhavoc` set.
* **Parameters:** `inst` (entity) — the minion fruit fly.
* **Returns:** boolean — `true` if combat is allowed.

### `ShouldKeepTarget(inst, target)`
* **Description:** Keeps target only if the minion meets `CanTargetAndAttack` and is within deaggro range.
* **Parameters:** `inst` (entity) — the minion; `target` (entity).
* **Returns:** boolean.

### `MiniRetargetFn(inst)`
* **Description:** Retarget function for minions; only returns a target if combat is allowed.
* **Parameters:** `inst` (entity).
* **Returns:** entity or `nil`.

### `LootSetupFunction(lootdropper)`
* **Description:** Loot setup for minions; only gives seeds with low probability.
* **Parameters:** `lootdropper` (LootDropper).
* **Returns:** Nothing.

### `OnLoseChild(inst, child)`
* **Description:** Triggered when the leader (`fruitflyfruit`) loses a follower (`friendlyfruitfly`). Marks the fruit as dead: adds perishable/fuel components, updates inventory image, and changes animation.
* **Parameters:** `inst` (entity) — the fruit fly fruit; `child` (entity) — the departing follower.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Provides status for `inspectable` component—returns `"DEAD"` if not tagged as `fruitflyfruit`.
* **Parameters:** `inst` (entity).
* **Returns:** string or `nil`.

### `OnInit(inst)`
* **Description:** On initialization, if tagged as `fruitflyfruit`, attempts to bind a `friendlyfruitfly` follower.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `SpawnFriendlyFruitFly(inst)`
* **Description:** Spawns a `friendlyfruitfly` prefab at a random nearby walkable position.
* **Parameters:** `inst` (entity) — the `fruitflyfruit` leader.
* **Returns:** entity or `nil`.

### `FriendlyShouldWakeUp(inst)`
* **Description:** Custom wake test for friendly fruit fly; wakes if default wake test passes or it’s too far from leader.
* **Parameters:** `inst` (entity).
* **Returns:** boolean.

### `FriendlyShouldSleep(inst)`
* **Description:** Custom sleep test for friendly fruit fly; sleeps only if default sleep test passes and it’s near its leader.
* **Parameters:** `inst` (entity).
* **Returns:** boolean.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` or `MiniOnAttacked` to re-aggro attacker.
- **Listens to:** `death` — triggers `OnDead` on lord fruit fly to notify world of death.
- **Listens to:** `stopfollowing` — triggers `OnStopFollowing` to remove `companion` tag.
- **Listens to:** `startfollowing` — triggers `OnStartFollowing` to add `companion` tag when leader is a `fruitflyfruit`.
- **Pushes:** `ms_lordfruitflykilled` — world event when lord fruit fly dies.