---
id: molebrain
title: Molebrain
description: Controls the decision-making logic for mole entities, determining behaviors such as seeking home, taking bait, making molehills, and fleeing during danger or daylight.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 4ef3d5be
---

# Molebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`MoleBrain` is a behavior tree implementation that governs the decision-making process of mole entities. It orchestrates high-priority responses (e.g., panic, acid rain, daylight exposure), maintains routine behaviors (e.g., wandering, peeking), and manages resource interactions (e.g., stealing bait, depositing items). The brain uses a priority-based behavior tree structure defined in `OnStart()` and integrates with external components like `homeseeker`, `inventory`, `burnable`, `bait`, and `knownlocations` to make context-aware decisions.

## Dependencies & Tags
- **Components used:**
  - `homeseeker`: accessed to check and interact with the mole's home location.
  - `inventory`: used to check if the mole's inventory is full (`:IsFull()`) and manage item carrying.
  - `burnable`: queried via `:IsBurning()` to avoid taking burning bait.
  - `bait`: implicitly checked via presence of `components.bait` on entities for bait identification.
  - `knownlocations`: used to retrieve the `"home"` location via `:GetLocation("home")`.
  - `inventoryitem`: used via `:IsHeld()` to verify bait is not currently held by another entity.
- **Tags:** None added or removed directly by this brain. Relies on the presence or absence of tags (`"molebait"`, `"outofreach"`, `"INLIMBO"`, `"fire"`) defined on potential targets.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in constructor) | The entity instance this brain controls. |
| `bt` | `BT` | `nil` (set in `OnStart()`) | The behavior tree instance constructed in `OnStart()`. |
| `SEE_PLAYER_DIST` | `number` | `5` | Distance threshold for player visibility (unused in current implementation). |
| `STOP_RUN_DIST` | `number` | `10` | Unused in current logic. |
| `AVOID_PLAYER_DIST` | `number` | `0` | Distance threshold for flee behavior start (always active when fleeing). |
| `AVOID_PLAYER_STOP` | `number` | `6` | Distance threshold for flee behavior termination. |
| `SEE_BAIT_DIST` | `number` | `20` | Maximum distance to scan for bait. |
| `MAX_WANDER_DIST` | `number` | `20` | Maximum wandering distance from home. |

## Main Functions

### `HasHome(inst)`
* **Description:** Helper function to determine if the mole has a valid home location registered.
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `boolean` — `true` if `inst.components.homeseeker.home` exists and is valid; otherwise `false`.

### `GoHomeAction(inst)`
* **Description:** Constructs a buffered action to move the mole to its home location. Only valid if a home exists and the mole is not currently in a `"trapped"` state.
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `BufferedAction` or `nil` — Action to execute `ACTIONS.GOHOME` at the home location, or `nil` if conditions are not met.

### `ShouldMakeHome(inst)`
* **Description:** Determines whether the mole should generate a new home (e.g., after the original home has been removed).
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `boolean` — `true` if the mole lacks a home and enough time has passed since `inst.needs_home_time`; otherwise `false`.

### `NoHolesNoInvisibleTiles(pt)`
* **Description:** Predicate function used to validate new home positions—ensures the target point is not on an invisible tile or near a hole.
* **Parameters:** 
  - `pt` (`GVector3`): The world position candidate for the new home.
* **Returns:** `boolean` — `true` if the point is safe (not invisible and not near a hole); otherwise `false`.

### `MakeNewHomeAction(inst)`
* **Description:** Constructs a buffered action to create a new molehill at a valid nearby location.
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `BufferedAction` or `nil` — Action to execute `ACTIONS.MAKEMOLEHILL` at the generated position, or `nil` if no valid offset is found.

### `IsMoleBait(item)`
* **Description:** Predicate function to identify valid bait items for mole theft.
* **Parameters:** 
  - `item` (`Entity`): The potential bait entity.
* **Returns:** `boolean` — `true` if the item has a `bait` component or has the `"bell"` tag; otherwise `false`.

### `SelectedTargetTimeout(target)`
* **Description:** Callback to clear the `"selectedasmoletarget"` flag on a bait entity after 5 seconds.
* **Parameters:** 
  - `target` (`Entity`): The bait entity previously selected by the mole.
* **Returns:** `void`.

### `TakeBaitAction(inst)`
* **Description:** Searches for valid bait within range and creates a theft action. Skips if the mole is newly spawned, busy, needs to make a home, or has a full inventory. Ensures bait is not held and not burning via `validfn`.
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `BufferedAction` or `nil` — Action to steal the selected bait (`ACTIONS.STEALMOLEBAIT`), or `nil` if no valid bait found or conditions unmet.

### `PeekAction(inst)`
* **Description:** Constructs a buffered action for the mole to briefly surface and scan the surroundings (`ACTIONS.MOLEPEEK`).
* **Parameters:** 
  - `inst` (`Entity`): The mole entity instance.
* **Returns:** `BufferedAction` — Action to perform the peek.

### `MoleBrain:OnStart()`
* **Description:** Initializes the behavior tree with a priority-ordered list of behaviors. The tree is evaluated cyclically and selects the first valid, highest-priority branch to execute.
* **Parameters:** None.
* **Returns:** `void`. Sets `self.bt` to a constructed `BT` instance using a `PriorityNode` containing the following behaviors (in order of priority):
  1. `PanicTrigger` — Immediate flee if triggered.
  2. `ElectricFencePanicTrigger` — Immediate flee near electric fences.
  3. `"Home Dug Up"` — Make new home if needed.
  4. `"Flee"` — Flee when `self.inst.flee == true`.
  5. `"Acid Raining"` — Return to home during acid rain.
  6. `"Should Peek"` — Surface to peek if interval elapsed and not busy.
  7. `"Deposit Inventory"` — Return to home if inventory is full.
  8. `"gohome"` event handler — Immediate response to `gohome` event.
  9. `"Take Bait"` — Seek and steal bait.
  10. `"Is Day"` — Return to home during daylight.
  11. `"Wander"` — Wander near home when idle.

## Events & Listeners
- **Listens to:**
  - `"gohome"` — Triggers immediate `GoHomeAction` via `EventNode`.
- **Pushes:** None. This brain does not directly fire events.