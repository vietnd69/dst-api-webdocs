---
id: klausbrain
title: Klausbrain
description: Brain component for Klaus that manages combat behavior including enraged states, chomp attacks, chasing, and wandering, coordinated via a Behavior Tree.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 31f4d457
---

# Klausbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Klausbrain` is a brain component that defines the decision-making logic for the Klaus character. It orchestrates high-level behavior using a Behavior Tree (BT) with priority-based node sequencing. Core behaviors include engaging the nearest target via `ChaseAndAttack`, entering an "enraged" state when troop numbers drop below two, triggering a chomp attack under specific conditions, and periodically resetting combat engagement while wandering toward the remembered spawn point.

The brain integrates closely with the `combat`, `commander`, `knownlocations`, and `timer` components to make state-aware decisions.

## Dependencies & Tags
- **Components used:** `combat`, `commander`, `knownlocations`, `timer`
- **Tags:** None identified.

## Properties
No public instance properties are explicitly initialized in the constructor or module scope.

## Main Functions
### `KlausBrain:OnStart()`
* **Description:** Initializes and assigns the Behavior Tree root node for Klaus. The BT handles priority-based execution of enrage checks, chomp attempts, chasing/attacking, combat reset, and wandering.
* **Parameters:** None.
* **Returns:** None.

### `KlausBrain:OnInitializationComplete()`
* **Description:** Records Klaus's current position (with `y` clamped to `0`) as the "spawnpoint" location using `KnownLocations.RememberLocation`. The `dont_overwrite=true` flag ensures this location is only set once.
* **Parameters:** None.
* **Returns:** None.

### `GetHomePos(inst)` (local function)
* **Description:** Helper function that retrieves the remembered "spawnpoint" location. Used as the target position for wandering.
* **Parameters:** `inst` — Entity instance.
* **Returns:** Vector3 position of the spawnpoint, or `nil` if not yet set.

### `ShouldEnrage(inst)` (local function)
* **Description:** Determines whether Klaus should enter an enraged state. Conditions are: Klaus is not currently enraged AND has fewer than 2 soldiers under command.
* **Parameters:** `inst` — Entity instance.
* **Returns:** Boolean — `true` if enrage conditions are met.

### `ShouldChomp(inst)` (local function)
* **Description:** Determines whether Klaus should perform a chomp attack. Conditions are: Klaus is unchained, has an active combat target, and the chomp cooldown timer does not exist.
* **Parameters:** `inst` — Entity instance.
* **Returns:** Boolean — `true` if chomp conditions are met.

## Events & Listeners
- **Listens to:** None explicitly defined in this module.
- **Pushes:** `enrage`, `chomp` — triggered by behavior tree nodes when their respective conditions become true.

## Behavior Tree Structure Summary
The Behavior Tree root (defined in `OnStart`) evaluates nodes in this priority order:
1. **Enrage** — Triggers `inst:PushEvent("enrage")` if `ShouldEnrage(inst)` is true.
2. **Chomp** — Triggers `inst:PushEvent("chomp")` if `ShouldChomp(inst)` is true.
3. **ChaseAndAttack** — Continuously pursue and attack the current target.
4. **Parallel node:**
   - Sequence: After waiting `RESET_COMBAT_DELAY` seconds, calls `self.inst:SetEngaged(false)`.
   - Wander: Moves toward home (`GetHomePos`) within a radius of `5` units.

The `.5` tolerance parameter allows for minor behavior overlap when priorities conflict.