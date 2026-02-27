---
id: mapspotrevealer
title: Mapspotrevealer
description: This component enables an entity to reveal map spots on the player's minimap by triggering area revelations at specified coordinates, optionally opening the map UI upon reveal.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: dcf858ae
---

# Mapspotrevealer

## Overview
The `Mapspotrevealer` component allows an entity to programmatically reveal map areas on the minimap. It integrates with the player's `MapExplorer` system to reveal terrain around a specified world position, and can optionally open the full map UI when a reveal occurs. It supports custom logic for target determination and pre-reveal validation via callback functions.

## Dependencies & Tags
- Adds the `"mapspotrevealer"` tag to the entity on construction.
- Removes the `"mapspotrevealer"` tag when the component is removed from the entity.
- Requires the entity's associated player to have the `player_classified` component and a `MapExplorer` sub-component for map revelation to succeed.
- Relies on the `FRAMES` constant (used for static task scheduling).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gettargetfn` | function | `nil` | A callback function that returns the target `(x, y, z)` position to reveal. Expected signature: `function(inst, doer) --> position, reason`. |
| `prerevealfn` | function | `nil` | A callback function run before revealing; if it returns `false`, the reveal is aborted. Expected signature: `function(inst, doer) --> allow_mapreveal`. |
| `open_map_on_reveal` | boolean | `true` | Determines whether the full map UI should be opened upon successful revelation. |

## Main Functions
### `SetGetTargetFn(fn)`
* **Description:** Assigns a callback function used to determine the world position to reveal. This function is invoked during `RevealMap`.
* **Parameters:**  
  - `fn` *(function)*: A callable that accepts `(inst, doer)` and returns a table `{x, y, z}` (or `nil` + reason string on failure).

### `SetPreRevealFn(fn)`
* **Description:** Assigns a pre-reveal validation callback. If the callback returns `false`, the reveal is cancelled.
* **Parameters:**  
  - `fn` *(function)*: A callable that accepts `(inst, doer)` and returns a boolean indicating whether to proceed.

### `RevealMap(doer)`
* **Description:** Executes the map reveal logic. Validates preconditions, runs the pre-reveal callback, retrieves the target position, fires events, and reveals the map area. Optionally opens the map UI.
* **Parameters:**  
  - `doer` *(Entity)*: The entity performing the reveal, typically a player. Must have the `player_classified` component and a `MapExplorer` member.  
* **Returns:**  
  - `true` on success.  
  - `false, reason` on failure, where `reason` is an error string (e.g., `"NO_TARGET"`, `"NO_MAP"`).  
* **Notes:**  
  - Fires `"on_reveal_map_spot_pre"` and `"on_reveal_map_spot_pst"` events.  
  - Uses a 4-frame delay (via `DoStaticTaskInTime`) to reveal the area, ensuring UI responsiveness.

## Events & Listeners
- **Listens for:** None (no `inst:ListenForEvent` calls).
- **Emits:**
  - `"on_reveal_map_spot_pre", targetpos`: Fired immediately before the area reveal begins (passed to listeners as an event argument).
  - `"on_reveal_map_spot_pst", targetpos`: Fired after the area reveal logic completes (passed to listeners as an event argument).