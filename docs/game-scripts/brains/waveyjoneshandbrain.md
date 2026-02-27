---
id: waveyjoneshandbrain
title: Waveyjoneshandbrain
description: Controls the behavior of Wavey Jones' hand entity by selecting and performing repair-related actions on boat components based on current conditions and player sanity.
tags: [ai, boat, repair, boss, sanity]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9abbd84b
---

# Waveyjoneshandbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component governs the decision-making logic for Wavey Jones' hand, a boss-level entity in Don't Starve Together. Its primary responsibility is to scan the current platform (boat) for active components (such as lowered sails, anchors, leaks, fires, fuel sources, and rotators), and prioritize appropriate repair or interference actions—such as unpatching leaks, raising anchors, lowering sails, extinguishing fires, or rotating the boat—while considering the sanity level of nearby players. It uses a behavior tree to sequence these decisions and falls back to idle wandering when no suitable actions are available.

The component interacts with multiple boat-related systems including boat rotation, sail deployment, anchor state, leak status, fire presence, and fuel levels. It also periodically coordinates with `TheWorld` to avoid conflicting assignments of targets.

## Usage example
This brain is typically assigned to an entity (e.g., a boss hand) during entity construction and does not require further manual interaction:

```lua
inst:AddBrain("waveyjoneshandbrain")
inst.Transform:Set Rotation(0)
inst.arm = CreateEntity()
inst.arm.Transform:SetRotation(0)
```

## Dependencies & tags
**Components used:**  
- `anchor` (state: `anchor_lowered`, `anchor_transitioning`)  
- `boatleak` (state: `boat_repaired_patch`)  
- `boatrotator` (state: `sg.mem.direction == 0`)  
- `fueled` (requires `GetPercent() > 0` and `canbespecialextinguished == true`)  
- `hull` (requires `GetRadius()`)  
- `mast` (state: `saillowered`, `sail_transitioning`)  
- `sanity` (requires `GetPercent()`)  
- `timer` (checks `TimerExists("reactiondelay")`)

**Tags checked:**  
- `saillowered`  
- `sail_transitioning`  
- `anchor_lowered`  
- `anchor_transitioning`  
- `boat_repaired_patch`  
- `fire`  
- `structure`  

**Tags added:** None.

## Properties
No public instance properties are initialized directly in the constructor. The `inst.waveyjonestarget` field is assigned at runtime during action selection but is not part of the class definition.

## Main functions
### `WaveyJonesHand:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node, which evaluates whether the hand is untrapped, attempts to perform a tinker action via `Dotinker`, then falls back to `StandStill`.  
* **Parameters:** None.  
* **Returns:** None.  
* **Error states:** None.

### `Dotinker(inst)`
* **Description:** Computes a suitable action for the hand to perform on the current boat platform by scanning nearby entities with tags `boat_repaired_patch` and `structure`, and evaluating component states (e.g., lowered anchor, fire, leak). Returns a `BufferedAction` toward the selected target or `nil` if no valid target exists or the reaction delay timer is active.  
* **Parameters:**  
  - `inst` (`Entity`): The hand entity calling this function.  
* **Returns:**  
  - `BufferedAction` or `nil`. The action is chosen based on priority: `UNPATCH`, `RAISE_ANCHOR`, `ROTATE_BOAT`, `RAISE_SAIL`, or `EXTINGUISH`.  
* **Error states:**  
  - Returns `nil` if `reactiondelay` timer exists.  
  - Returns `nil` if no valid targets are found or no action conditions match.  
  - Uses `GetDistanceSqToInst` for closest target selection; if `inst.arm` is missing, `getdirectionFn` may fail silently (no guard present).

### `getboatsanity(boat)`
* **Description:** Calculates the lowest sanity percentage among all players within the boat’s hull radius. Used to conditionally enable sanity-dependent actions like `UNPATCH` (requires `sanity <= 0.25`) or `EXTINGUISH` (requires `sanity <= 0.5`).  
* **Parameters:**  
  - `boat` (`Entity`): The boat platform entity.  
* **Returns:**  
  - `number` (0 to 1): Minimum sanity of nearby players.  
* **Error states:** None.

### `mastcheck(ent)`, `anchorcheck(ent)`, `patchcheck(ent)`, `firecheck(ent)`, `fuelcheck(ent)`, `rotatorcheck(ent)`
* **Description:** Helper predicate functions that return `true` if the entity `ent` meets the respective component condition (e.g., mast is lowered and not transitioning).  
* **Parameters:**  
  - `ent` (`Entity`): Target entity to inspect.  
* **Returns:** `boolean`.  
* **Error states:** None.

## Events & listeners
This component does not register any `inst:ListenForEvent` listeners. It also does not fire any events via `inst:PushEvent`.