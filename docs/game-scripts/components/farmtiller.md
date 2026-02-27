---
id: farmtiller
title: Farmtiller
description: This component allows an entity to till eligible soil tiles, converting raw ground into tilled farm soil.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a9f30aa2
---

# Farmtiller

## Overview
The `FarmTiller` component enables an entity to transform untilled soil tiles into tilled farm soil by collapsing the current ground tile and spawning a `farm_soil` asset at the target location. It implements the core logic for soil tilling actions in the game’s farming system.

## Dependencies & Tags
* **Components:** None identified  
* **Tags:** None added or removed by this component

## Properties
No public instance properties are explicitly initialized in the constructor or elsewhere; only `self.inst` is set to the owning entity reference.

## Main Functions
### `Till(pt, doer)`
* **Description:** Attempts to till the soil tile at the given world point. If successful, collapses the current soil tile, spawns a `farm_soil` prefab at that location, and optionally fires a `"tilling"` event on the `doer` entity.
* **Parameters:**
  * `pt`: A `Vector3`-like point (x, y=0, z) specifying the location to till.
  * `doer`: The entity performing the tilling (e.g., a player or mob); may be `nil`. If non-`nil`, triggers the `"tilling"` event on this entity.

## Events & Listeners
* Listens for no events (does not register any `inst:ListenForEvent` calls).
* Triggers events:
  * If `doer` is non-`nil`: pushes `"tilling"` event on `doer`.