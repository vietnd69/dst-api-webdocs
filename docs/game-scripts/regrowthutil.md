---
id: regrowthutil
title: Regrowthutil
description: Provides utilities for calculating regrowth search radii based on world topology and entity density.
tags: [worldgen, util]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 55ef4a20
system_scope: world
---

# Regrowthutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`regrowthutil` is a standalone utility module containing functions for calculating entity regrowth search radii. It uses world topology data and area-specific entity densities to determine how far to search when regrowing entities, adjusting for clumping behavior by using a per-five-entities density model instead of per-entity.

## Usage example
```lua
local radius = GetFiveRadius(0, 0, "tree")
if radius then
    -- Use radius for search logic (e.g., in a regrowth task)
    print("Regrowth search radius:", radius)
else
    print("Regrowth radius unavailable for this location.")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `CalculateFiveRadius(density)`
* **Description:** Computes the radius of a circular search area that contains five entities, given a density value (entities per tile area). Used to account for clumping by scaling density per five entities.
* **Parameters:** `density` (number) – expected number of entities per unit area (scaled to account for 5 entities).
* **Returns:** number – radius of the search circle.
* **Error states:** None.

### `GetFiveRadius(x, z, prefab)`
* **Description:** Determines the regrowth search radius for a given prefab at world coordinates `(x, z)`, using topology-based area identification and precomputed density data.
* **Parameters:**  
  * `x` (number) – world X coordinate  
  * `z` (number) – world Z coordinate  
  * `prefab` (string) – prefab name for which to retrieve density data  
* **Returns:** number or `nil` – the computed five-entity radius, or `nil` if area data is unavailable (e.g., invalid area, missing world generation data, or no density defined for the prefab).
* **Error states:** Returns `nil` if:
  * The coordinates do not fall inside any topology node polygon.
  * `TheWorld.generated` is `nil` (e.g., old savegames).
  * The area ID or density entry for the prefab is missing.

## Events & listeners
None identified