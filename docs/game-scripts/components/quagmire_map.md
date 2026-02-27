---
id: quagmire_map
title: Quagmire Map
description: This component extends the Map system to provide Quagmire-specific tile and terrain validation logic, specifically for identifying and checking cultivatable Quagmire soil.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d7470f44
---

# Quagmire Map

## Overview
This component adds Quagmire-specific tile checks to the `Map` class, enabling validation of Quagmire soil as a cultivatable tile type and verifying terrain readiness for tilling (e.g., checking for blocking entities). Note that the actual implementation resides within the shared `map.lua` file, and this file (`quagmire_map.lua`) serves solely as a wrapper or extension point.

## Dependencies & Tags
- Depends on: `Map` class (inherited from core engine), `TheWorld.Map`, `TheSim`, and `WORLD_TILES` constants.
- Uses tag: `"plantedsoil"` as a blocking entity tag during tilling checks.
- Adds no new components or tags to entities.

## Properties
No public properties are initialized in this file. All logic is implemented via methods on the `Map` class.

## Main Functions
### `Map:IsFarmableSoilAtPoint(x, y, z)`
* **Description:** Returns whether the tile at the specified world coordinates is Quagmire soil, which is considered cultivatable in the Quagmire biome.
* **Parameters:**
  - `x`, `y`, `z`: World coordinates (numbers). Note: `y` is typically ignored for 2D tile lookups.

### `Map:CanTillSoilAtPoint(pt)`
* **Description:** Returns whether Quagmire soil at the given point can be tilled. It verifies two conditions: (1) the tile is valid Quagmire soil, and (2) no entities with the `"plantedsoil"` tag occupy the location (which would block tilling).
* **Parameters:**
  - `pt`: A `Vector3`-like object with `.x`, `.z` fields (and `.y`, though unused); used to query location and pass to `TheSim:FindEntities`.

## Events & Listeners
None identified.