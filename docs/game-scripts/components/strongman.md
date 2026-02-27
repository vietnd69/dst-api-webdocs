---
id: strongman
title: Strongman
description: Manages a player's gym workout session by tagging them and pausing/resuming the Mightiness component.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: cbd0b9e1
---

# Strongman

## Overview
The Strongman component coordinates the player's gym workout activity. It is responsible for tagging the player while in the gym (`"ingym"`), storing the reference to the current gym instance, and pausing or resuming the Mightiness component to reflect active workout state transitions.

## Dependencies & Tags
- **Component dependency:** `mightiness` (assumed to be present on the entity)
- **Tag added:** `"ingym"` (during workout)
- **Tag removed:** `"ingym"` (when workout ends)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gym` | `Entity?` | `nil` | Reference to the gym structure the player is currently working out at. Set in `DoWorkout`, cleared in `StopWorkout`. |

> **Note:** The constructor `Class(function(self, inst) self.inst = inst end)` initializes only `self.inst`. The `gym` property is assigned later on first use.

## Main Functions

### `DoWorkout(gym)`
* **Description:** Begins a gym workout session for the player. Pauses the Mightiness component and adds the `"ingym"` tag to the entity.
* **Parameters:**  
  `gym` (`Entity`) — The gym structure entity the player is entering to train.

### `StopWorkout()`
* **Description:** Ends the current gym workout session. Removes the `"ingym"` tag, resumes the Mightiness component, and clears the stored `gym` reference.
* **Parameters:**  
  None.

## Events & Listeners
None identified.