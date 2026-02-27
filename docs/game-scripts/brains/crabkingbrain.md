---
id: crabkingbrain
title: Crabkingbrain
description: Defines the AI behavior tree for the Crab King boss, orchestrating its core actions such as healing, freezing, summoning claws, and targeting players and creatures via priority-based decision nodes.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2c23c926
---

# Crabkingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the artificial intelligence for the Crab King boss entity in `Don't Starve Together`. It uses a Behavior Tree (`BT`) architecture to determine high-priority actions such as casting freezing projectiles, summoning ice claws, and seeking to heal when damaged. The behavior tree is rooted in an `IfNode` that evaluates whether the Crab King is not currently performing inert, casting, fixing, or spawning states. Within the `doing` branch, priority-based `DoAction` nodes evaluate helper functions (`ShouldHeal`, `ShouldFreeze`, `ShouldHaveClaws`) to trigger corresponding actions only when their specific conditions are met.

## Dependencies & Tags

- **Components used:**
  - `combat`: accessed via `inst.components.combat.target` to check active targets.
  - `freezable`: accessed via `inst.components.freezable:IsFrozen()` to verify entity freeze state.
  - `health`: accessed via `inst.components.health:GetPercent()` to determine healing threshold.
  - `knownlocations`: used to remember the spawn point on initialization.
  - `timer`: accessed via `inst.components.timer:TimerExists(name)` to check for active timers (e.g., `"taunt"`, `"cannon_timer"`).

- **Tags:**
  - `icewall`: checked to modify behavior (e.g., enables healing, disables some summoning/casting).
  - `boat`, `character`, `animal`, `monster`, `smallcreature`: used for entity filtering during targeting logic.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wantstosummonclaws` | `boolean?` | `nil` | Set to `true` if claws should be summoned; cleared otherwise. |
| `wantstoheal` | `boolean?` | `nil` | Set to `true` if healing is triggered; cleared otherwise. |
| `wantstotaunt` | `boolean?` | `nil` | Set to `true` if taunt timer is active; cleared otherwise. |
| `wantstofreeze` | `boolean?` | `nil` | Set to `true` when freezing is possible (no ice wall, cooldowns clear, valid targets near). |
| `wantstocannon` | `boolean?` | `nil` | Set to `true` when cannon attack is possible (no `"icewall"` tag, no `"cannon_timer"`, valid targets). |
| `damagetotal` | `number?` | `nil` | Cumulative damage value used to determine stage transitions and freeze eligibility. |

## Main Functions

### `OnStart()`
* **Description:** Initializes the behavior tree for the Crab King. Constructs a priority-based node tree that first checks if the entity is *not* in an `inert`, `casting`, `fixing`, or `spawning` state. Within that condition, it evaluates three `DoAction` nodes in order: `ShouldHeal`, `ShouldFreeze`, and `ShouldHaveClaws`. The first one returning `true` executes its associated behavior.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnInitializationComplete()`
* **Description:** Records the Crab King's initial spawn position using the `knownlocations` component under the key `"spawnpoint"`.
* **Parameters:** None.
* **Returns:** `nil`.

## Helper Functions (used in Behavior Tree)

### `ShouldHaveClaws(inst)`
* **Description:** Sets `inst.wantstosummonclaws = true` if the Crab King should summon ice claws. This occurs only when it lacks the `"icewall"` tag, has no arms (`inst.arms` is falsy), is not in a `"taunt"` timer state, and is not currently casting.
* **Parameters:**  
  - `inst` (`Entity`): The Crab King entity.
* **Returns:** `nil`.

### `ShouldHeal(inst)`
* **Description:** Sets `inst.wantstoheal = true` if the Crab King’s health is below full (`health:GetPercent() < 1`), it has the `"icewall"` tag, and is not currently taunting. Otherwise, clears `wantstoheal`.
* **Parameters:**  
  - `inst` (`Entity`): The Crab King entity.
* **Returns:** `nil`.

### `ShouldTaunt(inst)`
* **Description:** Sets `inst.wantstotaunt = true` if a `"taunt"` timer exists, otherwise clears it.
* **Parameters:**  
  - `inst` (`Entity`): The Crab King entity.
* **Returns:** `nil`.

### `ShouldFreeze(inst)`
* **Description:** Evaluates whether the Crab King can execute a freeze attack. Triggers only when:
  - Not having the `"icewall"` tag,
  - Cumulative damage `damagetotal <= TUNING.CRABKING_FREEZE_THRESHOLD`,
  - Health is at or below stage 1 threshold (`health:GetPercent() <= TUNING.CRABKING_STAGE1_THRESHOLD`).
  
  Then checks if a `"boat_ice"` entity is present within a 25-unit radius, or if valid combat targets (`character`/`animal`/`monster`/`smallcreature`) exist within 20 units *and* are either characters or non-character entities with `"combat"` component targeting the Crab King. If either condition is satisfied, `inst.wantstofreeze` is set to `true`.
* **Parameters:**  
  - `inst` (`Entity`): The Crab King entity.
* **Returns:** `nil`.

### `ShouldCannon(inst)`
* **Description:** Evaluates whether the Crab King can perform a cannon attack. Triggers when:
  - No active `"cannon_timer"` is running,
  - Not having the `"icewall"` tag.
  
  It searches for `"boat_ice"` within 25 units and potential targets within 20 units. Target filtering removes any entity that is:
  - Not a `character` and does *not* have `"combat"` targeting the Crab King, *or*
  - Lacks a `freezable` component, *or*
  - Is currently frozen (`freezable:IsFrozen()`).
  
  If valid entities (boats or targets) are found, `inst.wantstocannon` is set to `true`.
* **Parameters:**  
  - `inst` (`Entity`): The Crab King entity.
* **Returns:** `nil`.

## Events & Listeners

None identified.