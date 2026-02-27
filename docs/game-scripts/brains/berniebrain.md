---
id: berniebrain
title: Berniebrain
description: Manages behavior for Bernie the shaggy monster, including leader tracking, taunting of nearby sanity monsters, and transformation into "Big Bernie" when near a qualifying player.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 76e54e5f
---

# Berniebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `BernieBrain` component implements the behavior tree for the "Bernie" character (shaggy monster). It handles leader detection based on player sanity and relationship conditions, coordination of taunting nearby sanity-based creatures, and triggering of the transformation into "Big Bernie" when specific proximity and player state conditions are met. It extends `Brain`, uses the behavior tree (`BT`) system, and relies on the `Combat` and `Timer` components to manage targeting and cooldowns, and the `Sanity` component (indirectly via deprecated `IsCrazy` usage) to verify player sanity states.

## Dependencies & Tags
- **Components used:**
  - `combat`: accessed via `target.components.combat:TargetIs()`, `:CanTarget()`, `:SetTarget()`
  - `timer`: accessed via `self.inst.components.timer:TimerExists(name)` to check for cooldown timers
  - `sanity`: accessed indirectly via deprecated `self._leader.components.sanity:IsCrazy()` call (commented out in current code)
- **Tags checked (via `inst:HasTag()` or passed to `FindEntities`):** `shadowcreature`, `_combat`, `locomotor`, `INLIMBO`, `notaunt`, `bernieowner`
- **Tags added/removed:** None directly within this brain; relies on external tags attached to `inst` and targets.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_targets` | table or nil | `nil` | List of valid tauntable shadow creatures within range; set during behavior tree evaluation. |
| `_leader` | entity or nil | `nil` | The current leader player the Bernie is following or targeting for "Big Bernie" transformation; updated each frame or conditionally. |

## Main Functions

### `BernieBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree for Bernie. This is the entry point called when the brain begins executing. It constructs a priority-based behavior tree with nodes for transformation, taunting, leader presence checks, following, and wandering.
* **Parameters:** None.
* **Returns:** None.

### `IsTauntable(inst, target)`
* **Description:** A helper function used by `FindShadowCreatures` and `TauntCreatures`. Determines if a given entity qualifies as a valid target for taunting by Bernie (i.e., has a `combat` component, is not already targeting Bernie, and can be targeted by Bernie).
* **Parameters:**
  - `inst`: The Bernie entity instance.
  - `target`: The candidate target entity.
* **Returns:** `boolean` — `true` if `target` can be taunted, otherwise `false`.

### `FindShadowCreatures(inst)`
* **Description:** Scans the area around Bernie for nearby entities tagged as `shadowcreature` (and with `_combat` and `locomotor` tags) while excluding those tagged with `INLIMBO` or `notaunt`. Filters the results to retain only those that are tauntable per `IsTauntable`.
* **Parameters:** `inst` — the Bernie entity instance.
* **Returns:** A table of valid tauntable shadow creatures if any exist within `TAUNT_DIST` (16 units); otherwise `nil`.

### `TauntCreatures(self)`
* **Description:** Assigns Bernie as the current target of all entities listed in `self._targets` using the `combat` component, and transitions Bernie into the `"taunt"` state if at least one creature was successfully taunted.
* **Parameters:**
  - `self`: The brain instance (carries `_targets` and `inst`).
* **Returns:** None.

### `FindLeader(self)`
* **Description:** Searches through all players to find the closest valid leader. A leader must be visible, on the same platform as Bernie, and satisfy either `isleadercrazy` or `hotheaded` relationship checks. Selection prioritizes proximity (uses squared distance comparisons for efficiency).
* **Parameters:** `self` — the brain instance.
* **Returns:** The closest qualifying player entity or `nil` if none found.

### `GetLeader(self)`
* **Description:** Validates the currently cached `_leader`. If the leader is no longer valid (not existing, not visible, not satisfying sanity/relationship checks), it clears `_leader` to `nil`. Note: The sanity check uses the deprecated `IsCrazy()` call, which is commented out in the current logic.
* **Parameters:** `self` — the brain instance.
* **Returns:** The valid leader entity or `nil`.

### `countbigbernies(leader)`
* **Description:** Returns the number of Bernie entities currently registered under `leader.bigbernies`, used to track how many Bernies have transformed for a given player.
* **Parameters:** `leader` — the player entity with a `bigbernies` table.
* **Returns:** `number` — the count of Bernies.

### `ShouldGoBig(self)`
* **Description:** Determines if Bernie should transform into "Big Bernie". A qualifying player must have the `"bernieowner"` tag, must not have initialized `bigbernies` or `blockbigbernies` tables, must satisfy `isleadercrazy` or `hotheaded` checks, must be visible, and must be within `BIG_LEADER_DIST_SQ` (64 units, i.e., 8 units squared).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if transformation conditions are met; otherwise `false`. Also sets `self._leader` to the qualifying player.

### `OnEndBlockBigBernies(leader)`
* **Description:** Cleans up the `blockbigbernies` timer on the leader after `.5` seconds, unblocking further Big Bernie transformations from other Bernies.
* **Parameters:** `leader` — the player entity.
* **Returns:** None.

### `DoGoBig(inst, leader)`
* **Description:** Initiates transformation into "Big Bernie". Prevents race conditions by setting a `.5` second block timer (`blockbigbernies`) on the leader if not already present, and calls `inst:GoBig(leader)`.
* **Parameters:**
  - `inst`: The Bernie entity instance.
  - `leader`: The player entity to link the transformation to.
* **Returns:** None.

## Events & Listeners
- **Listens to:** None. Behavior is driven by explicit state transitions and behavior tree evaluation, not event listeners.
- **Pushes:** None. Transitions are handled by calling `self.inst.sg:GoToState(...)`.