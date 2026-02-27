---
id: brightmare_gestaltguardbrain
title: Brightmare Gestaltguardbrain
description: Controls the behavior tree logic for the Brightmare Gestalt Guard entity, managing state transitions between aggressive pursuit, player-avoidance relocation, target-facing, and wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7af630bc
---

# Brightmare Gestaltguardbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the decision-making logic for the Brightmare Gestalt Guard entity. It extends the base `Brain` class and defines a hierarchical behavior tree (BT) that governs movement and combat actions based on `behaviour_level`, proximity to players, and presence of a combat target. When active, it coordinates interactions with the `combat` and `knownlocations` components to handle aggression, relocation, and navigation.

## Dependencies & Tags
- **Components used:**
  - `inst.components.combat`: Used to read `combat.target` during target-facing logic.
  - `inst.components.knownlocations`: Used to remember the entity's spawn point on initialization.
- **Tags:** None directly added/removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed) | Reference to the entity instance owned by this brain component. |
| `bt` | `BT` | `nil` | Behavior tree instance set in `OnStart()`. |

## Main Functions

### `GestaltGuardBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node for the entity. Constructs a priority-based tree that evaluates high-priority conditions first: aggressive state (`behaviour_level == 3`), player proximity (relocation trigger), target-facing, and finally default wandering.
* **Parameters:** None.
* **Returns:** None.

### `GestaltGuardBrain:OnInitializationComplete()`
* **Description:** Registers the entity's current position as its `spawnpoint` in the `knownlocations` component. Prevents overwriting if a `spawnpoint` already exists (`dont_overwrite = true`).
* **Parameters:** None.
* **Returns:** None.

## Behavior Tree Structure

The root behavior tree is built as follows:
1. **Relocation Priority**
   - Condition: `IsPlayerTooClose(self.inst)` returns true (player within `RELOCATED_DISTSQ = 9` units squared).
   - Actions: Triggers `"relocate"` state via `Relocate()` and then executes `StandStill`.
2. **Target-Facing Priority**
   - Uses `FaceEntity` with `GetFacingTarget` and `KeepFacingTarget` helpers.
   - `GetFacingTarget` returns `combat.target` only if:
     - `behaviour_level == 2`, and
     - Target is valid, and
     - Distance squared to target is `<= GETFACINGTARGET_DISTSQ` (i.e., within `TUNING.GESTALTGUARD_WATCHING_RANGE`).
3. **Aggression (behaviour_level == 3)**
   - Uses `ChaseAndAttack` with `ATTACK_CHASE_TIME = 5`.
4. **Default State**
   - `Wander(self.inst, nil, nil, WANDER_TIMES)` with fixed timing parameters.

## Events & Listeners
None identified — this component does not register or push any events.