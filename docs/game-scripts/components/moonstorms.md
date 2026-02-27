---
id: moonstorms
title: Moonstorms
description: Manages the state and logic of moonstorms in the game world, including tracking active storm nodes, computing storm intensity for entities, and updating map markers.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 6a8353bb
---

# Moonstorms

## Overview
This component manages the lifecycle and spatial behavior of moonstorms in the game world. It tracks which topology nodes are currently under storm influence, calculates the storm intensity for entities based on their proximity to storm boundaries, and synchronizes storm state across the network via `net_ushortarray`. It also manages visual map markers for storm onset and cessation.

## Dependencies & Tags
- Uses `TheWorld.topology.nodes`, `TheWorld.topology.edges`, and `TheWorld.topology.flattenedPoints` (implicit world topology access).
- Adds a networked property: `self._moonstorm_nodes` (a `net_ushortarray` named `"moonstorm_nodes"`), synchronized on dirtiness.
- Listens to and relays the `"moonstorm_nodes_dirty"` event internally to propagate updates.
- Relies on `ent.components.areaaware` (present on players) to determine area/zone membership.
- No explicit component additions (e.g., `AddComponent`) are made on `inst`.
- No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component is attached to (typically the `TheWorld` root entity). |
| `_moonstorm_nodes` | `net_ushortarray` | `nil` | Networked array of active moonstorm node indices; triggers `"moonstorm_nodes_dirty"` event on change. |
| `_active_moonstorm_nodes` | `table` (set) | `{}` | Local, non-networked set of node indices currently under moonstorm influence. |
| `_mapmarkers` | `table` of `Prefab` | `{}` | List of spawned `"moonstormmarker_big"` entities visualizing storm nodes on the map. |

## Main Functions

### `CalcMoonstormLevel(ent)`
* **Description:** Computes a normalized storm intensity value (0–1) for the given entity, based on how deeply it is embedded within a storm. The calculation uses the distance to the nearest *non*-active node's boundary (i.e., the storm edge) and scales it relative to `TUNING.SANDSTORM_FULLY_ENTERED_DEPTH`.
* **Parameters:**
  * `ent` (`Entity?`): The entity to evaluate. Must have an `areaaware` component and be non-nil.

### `IsInMoonstorm(ent)`
* **Description:** Returns `true` if the entity is currently inside an active moonstorm zone (i.e., its current area node is marked as active in `_active_moonstorm_nodes`).
* **Parameters:**
  * `ent` (`Entity`): The entity to check.

### `IsXZInMoonstorm(x, z)`
* **Description:** Returns `true` if the given world position `(x, z)` lies within an active moonstorm node.
* **Parameters:**
  * `x` (`number`): World X coordinate.
  * `z` (`number`): World Z coordinate.

### `IsPointInMoonstorm(pt)`
* **Description:** Same as `IsXZInMoonstorm`, but accepts a `Point` object instead of separate coordinates.
* **Parameters:**
  * `pt` (`Point`): World position with `.x` and `.z` fields.

### `GetMoonstormLevel(ent)`
* **Description:** Returns the clamped storm intensity (0–1) for an entity if it is inside a moonstorm; otherwise returns `0`.
* **Parameters:**
  * `ent` (`Entity`): The entity to query.

### `AddMoonstormNodes(node_indices, firstnode)`
* **Description:** Marks a list of topology nodes as active moonstorm zones, spawns visual map markers, and broadcasts `"ms_stormchanged"` and `"ms_moonstormwindowover"` events. Network update is triggered via `self._moonstorm_nodes:set(...)`.
* **Parameters:**
  * `node_indices` (`number` or `table` of `number`): One or more node indices to activate.
  * `firstnode` (`number`): Unused in current logic (intended for original marker positioning but overridden).

### `StopMoonstorm(is_relocating)`
* **Description:** Ends the current moonstorm by clearing all active nodes and broadcasting the `"ms_stormchanged"` event with `setting = (is_relocating == true)`.
* **Parameters:**
  * `is_relocating` (`boolean?`): If `true`, signals a temporary intermission before a new storm begins.

### `ClearMoonstormNodes()`
* **Description:** Resets the internal state: clears `_active_moonstorm_nodes`, removes all map markers, and updates the networked array. Does not fire events—use `StopMoonstorm` instead for full closure.
* **Parameters:** None.

### `GetMoonstormNodes()`
* **Description:** Returns the set of currently active moonstorm node indices (`_active_moonstorm_nodes`).
* **Parameters:** None.

### `GetMoonstormCenter()`
* **Description:** Computes the geometric center (as a `Point`) of all active moonstorm nodes.
* **Parameters:** None.

## Events & Listeners
- **Listeners:**
  - `self.inst:ListenForEvent("moonstorm_nodes_dirty", ...)`  
    → Relays the event as `"moonstorm_nodes_dirty_relay"` on `TheWorld` with the original data.
- **Events Pushed (Triggered):**
  - `"ms_stormchanged"` — with payload `{stormtype = STORM_TYPES.MOONSTORM, setting = ...}`  
    Sent by `AddMoonstormNodes` (on storm start) and `StopMoonstorm` (on storm end/relocation).
  - `"ms_moonstormwindowover"` — sent once per storm activation in `AddMoonstormNodes`.
  - `"moonstorm_nodes_dirty"` — internal signal to trigger network sync (not directly triggered by this component, but used for relaying).