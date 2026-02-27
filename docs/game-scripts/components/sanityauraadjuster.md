---
id: sanityauraadjuster
title: Sanityauraadjuster
description: A lightweight component that periodically executes a customizable function to adjust sanity aura parameters for entities based on nearby players.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 04aa37e5
---

# Sanityauraadjuster

## Overview
The `SanityAuraAdjuster` component provides a mechanism to dynamically modify sanity aura behavior (e.g., aura strength, radius, or effect) by invoking a user-defined function every second. It is typically attached to entities that need to respond to changes in nearby player presence or other dynamic conditions, updating their sanity aura characteristics in real time.

## Dependencies & Tags
- **Dependencies:** None (does not require other components to function).
- **Tags:** None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity the component is attached to. |
| `adjustmentfn` | `function?` | `nil` | Optional callback function that performs sanity aura adjustments; must accept `(entity, current_players_table)` and return an updated `players_table`. |
| `players` | `table` | `{}` | Internal list of players currently considered by the adjustment function. |

## Main Functions

### `StartTask()`
* **Description:** Begins a periodic task (running once per second) that calls the `adjustmentfn` (if set), allowing ongoing dynamic updates to sanity aura behavior.
* **Parameters:** None.

### `StopTask()`
* **Description:** Cancels and clears the periodic task, halting all future sanity aura adjustment updates.
* **Parameters:** None.

### `SetAdjustmentFn(fn)`
* **Description:** Assigns the callback function responsible for computing and returning updated sanity aura parameters based on the entity and current player list.
* **Parameters:**  
  `fn` (`function`) — A function with signature `fn(inst, players)` that returns a `table` of players (typically for tracking purposes); the function is expected to apply side effects (e.g., modifying `inst.components.sanityAura` or similar) internally.

## Events & Listeners
None.