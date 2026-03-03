---
id: oceanfishingtackle
title: Oceanfishingtackle
description: Manages casting data and lure configuration for ocean fishing mechanics.
tags: [fishing, ocean, equipment, loot]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e48bcd05
system_scope: entity
---

# Oceanfishingtackle

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`OceanFishingTackle` stores and manages configuration data for ocean fishing lures and casting mechanics. It is typically attached to fishing tackle entities (e.g., lures) to define their behavior during casting and interaction with the ocean fishing system. The component holds casting parameters and lure-specific setup information but does not implement logic directly—consumers (e.g., fishing components or actions) query this component for data.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanfishingtackle")

local casting_data = {
    dist_max = 10,
    max_dist_offset = 2,
    max_angle_offset = 15,
}
inst.components.oceanfishingtackle:SetCastingData(casting_data, "tackle_fishing_lure")

local lure_setup = {
    single_use = true,
    lure_data = { type = "small_fish", rarity = 0.7 },
}
inst.components.oceanfishingtackle:SetupLure(lure_setup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `casting_data` | table | `nil` | Table containing casting parameters (`dist_max`, `max_dist_offset`, `max_angle_offset`) and potentially others. Set via `SetCastingData()`. |
| `projectile_prefab` | string | `nil` | Name of the prefab used as the projectile when casting with this tackle. Set via `SetCastingData()`. |
| `lure_data` | table | `nil` | Lure-specific data provided in `SetSetupLure()` (e.g., bait type, rarity modifiers). |
| `lure_setup` | table | `nil` | Full setup data for the lure, including `single_use` flag and `lure_data`. |

## Main functions
### `SetCastingData(data, projectile_prefab)`
*   **Description:** Sets the casting parameters and projectile prefab used when this tackle is cast in ocean fishing.
*   **Parameters:**  
    `data` (table) — Table containing casting configuration, expected to include at least `dist_max`, `max_dist_offset`, and `max_angle_offset`.  
    `projectile_prefab` (string) — Name of the prefab to instantiate as the projectile.
*   **Returns:** Nothing.

### `SetupLure(data)`
*   **Description:** Configures the lure-specific data for this tackle, including whether it is single-use and any additional metadata.
*   **Parameters:**  
    `data` (table) — Table expected to contain `lure_data` (table) and optionally `single_use` (boolean).
*   **Returns:** Nothing.

### `IsSingleUse()`
*   **Description:** Indicates whether this tackle can only be used once (i.e., is consumed on cast).
*   **Parameters:** None.
*   **Returns:**  
    `true` if `lure_setup` is non-nil and `lure_setup.single_use` is truthy; otherwise `false`.
*   **Error states:** Returns `false` if `lure_setup` is not set.

## Events & listeners
None identified
