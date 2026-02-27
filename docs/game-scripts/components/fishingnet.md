---
id: fishingnet
title: Fishingnet
description: This component enables an entity to cast a fishing net at a specified location using a visualizer.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6eadc3b0
---

# Fishingnet

## Overview
The `fishingnet` component allows its associated entity to initiate a fishing net cast at a given world position. It does not manage the full fishing logic itself but delegates visual and behavioral coordination to a spawned `fishingnetvisualizer` prefab.

## Dependencies & Tags
- **Requires:** `fishingnetvisualizer` component in the spawned `fishingnetvisualizer` prefab (used via `components.fishingnetvisualizer`).
- No components are added to `self.inst`.
- No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GameObject` | (passed into constructor) | Reference to the entity instance the component is attached to. |
| `visualizer` | `GameObject?` | `nil` | Stores the spawned `fishingnetvisualizer` instance after `CastNet` is called; `nil` before first use. |

## Main Functions
### `CastNet(pos_x, pos_z, doer)`
* **Description:** Spawns a `fishingnetvisualizer` prefab and instructs its `fishingnetvisualizer` component to begin a cast animation/sequence at the specified world coordinates. Stores the visualizer reference and returns `true`.
* **Parameters:**
  - `pos_x` (number): X-coordinate of the cast location.
  - `pos_z` (number): Z-coordinate of the cast location.
  - `doer` (GameObject): The entity performing the cast (e.g., the player or character).

## Events & Listeners
None.