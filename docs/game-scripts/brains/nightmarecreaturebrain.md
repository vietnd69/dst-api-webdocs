---
id: nightmarecreaturebrain
title: Nightmarecreaturebrain
description: Manages the AI behavior tree for nightmare creatures, prioritizing submission to shadow-dominant targets while harassing otherwise weak or distant targets via wander-and-chase tactics with battle cries.
tags: [ai, boss, combat, shadow]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d433bfcb
---

# Nightmarecreaturebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the behavior tree for nightmare creatures, such as the Shadow Creature variants. It orchestrates high-priority interactions with shadow-dominant entities, enemy targeting, harassment via ranged movement and battle cries, and default wandering behavior. It integrates closely with the `combat`, `locomotor`, `knownlocations`, and `shadowsubmissive` components to determine target eligibility, movement speed, and harassment conditions. The brain dynamically switches between states like `ChaseAndHarass`, `Harass`, `LoiterAndHarass`, and default `Wander`, using priority-based evaluation in the behavior tree root node.

## Usage example

This brain is typically assigned automatically via the entity prefab definition (e.g., in a `prefabs/` file). The component does not require manual instantiation or direct method calls in most cases.

```lua
-- Example instantiation inside a prefab definition (e.g., nightmARE_creature.lua)
inst:AddBrain("brains/nightmarecreaturebrain")
```

The brain activates automatically on `OnStart()`, initializing its behavior tree. No explicit setup is required by external scripts.

## Dependencies & tags

**Components used:**
- `combat` – for `target`, `nextbattlecrytime`, and `BattleCry()` function.
- `knownlocations` – for retrieving home locations (`GetLocation("war_home")` and `GetLocation("home")`).
- `locomotor` – for checking `walkspeed`.
- `shadowsubmissive` – for determining if the creature should submit to a target (`ShouldSubmitToTarget`).

**Tags:** None added, removed, or explicitly checked. The brain reads the `"shadowdominance"` tag on targets via the `shadowsubmissive` component, but does not manage tags itself.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_harasstarget` | `Entity` or `nil` | `nil` | Cached reference to the currently targeted entity for harassment behavior. Set when `ShouldAttack` returns `false` (i.e., when the current target has `shadowdominance`). Cleared otherwise. |

## Main functions

### `ShouldAttack(self)`
* **Description:** Determines whether the creature should attack its current combat target. If the target has the `"shadowdominance"` tag (checked via `shadowsubmissive:ShouldSubmitToTarget`), submission occurs and `_harasstarget` is set to that target; otherwise, the target is treated as valid for attack.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `true` if the target is not shadow-dominant (i.e., attack proceed); `false` otherwise (submission/harassment path).
* **Error states:** None. Relies on `combat.target` validity, which is handled by the `combat` component.

### `ShouldHarass(self)`
* **Description:** Checks if the creature should enter the harassment sub-tree, which involves playing a battle cry and possibly facing the harassment target.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `true` if `_harasstarget` is set and the `nextbattlecrytime` cooldown has expired (or is `nil`). Otherwise `false`.
* **Error states:** Returns `nil` if `nextbattlecrytime` comparison is evaluated before `GetTime()` returns (rare), but logic is protected by `or` short-circuit evaluation.

### `ShouldChaseAndHarass(self)`
* **Description:** Determines whether the creature should actively chase the harassment target or loiter while engaging harassment behaviors.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `true` if `walkspeed < 5` (i.e., slower than standard), or if the harassment target is not within `HARASS_MED` (4) units and is valid. Otherwise `false`.
* **Error states:** Returns `false` if `_harasstarget` is `nil` or invalid, or if distance check is not met.

### `GetHarassWanderDir(self)`
* **Description:** Calculates a randomized angular direction offset ±60 degrees from the angle to the harassment target, used during loiter/harass movement.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** Angle in radians (`math.deg` to `rad` conversion is implicit via `* DEGREES`).
* **Error states:** None. Requires `_harasstarget` to be valid at call time; if `nil`, behavior will not use this function (due to `WhileNode` guard condition).

### `NightmareCreatureBrain:OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) by constructing a priority-weighted root node. This is called automatically when the entity is spawned and the brain component starts.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None. Assumes required components (`combat`, `knownlocations`, `locomotor`, `shadowsubmissive`) are attached to `self.inst`. Behavior tree construction may fail if dependencies are missing.

## Events & listeners

None. This brain component does not register or push any events directly.

---