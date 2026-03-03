---
id: moistureabsorberuser
title: Moistureabsorberuser
description: Manages active moisture-absorbing items equipped or held by an entity and computes their combined drying effect.
tags: [moisture, inventory, drying, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6d542b1e
system_scope: entity
---

# Moistureabsorberuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoistureAbsorberUser` tracks and manages moisture-absorbing items attached to an entity (e.g., equipped items in inventory or held tools) that can reduce moisture over time. It uses a `SourceModifierList` to track active sources and selects the most effective one when applying drying. It automatically cleans itself up when no active sources remain.

This component is typically added to characters or entities that can use or carry drying items (like Drying Rack or wet gear on Wilson), and it collaborates directly with the `moistureabsorbersource` component on those items and the `inventory` component to locate and utilize them.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moistureabsorberuser")

-- Attach a moisture-absorbing item (e.g., a wet umbrella)
local item = MakeItem("wet_umbrella", 1)
inst.components.inventory:Equip(item, "HAND")

-- Manually add/remove sources if not tied to inventory
inst.components.moistureabsorberuser:AddSource(item, "umbrella_handle")

-- Compute and apply the best drying effect over a time step
local rate = 1.0
local dt = 1/60
local best_rate = inst.components.moistureabsorberuser:GetBestAbsorberRate(rate, dt)
```

## Dependencies & tags
**Components used:** `inventory`, `moistureabsorbersource`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | — | The entity instance that owns this component. |
| `_sources` | `SourceModifierList` | — | Internal list tracking active moisture-absorbing sources and their modifier states. |

## Main functions
### `AddSource(src, key)`
*   **Description:** Registers a moisture-absorbing item or source with this user. The source must have a `moistureabsorbersource` component. The item becomes eligible for drying calculations.
*   **Parameters:**  
    * `src` (`GObject`) — Entity instance providing moisture absorption (must have `moistureabsorbersource` component).  
    * `key` (string or any hashable value) — Unique identifier for this source (used to avoid duplicate registration).
*   **Returns:** Nothing.
*   **Error states:** No error handling for missing `moistureabsorbersource`; silently ignores sources without it.

### `RemoveSource(src, key)`
*   **Description:** Deregisters a previously added source. If this was the last active source, the component self-removes from the entity.
*   **Parameters:**  
    * `src` (`GObject`) — The same source object passed to `AddSource`.  
    * `key` (string or any hashable value) — The corresponding key used during registration.
*   **Returns:** Nothing.
*   **Error states:** No-op if source/key pair was never added.

### `GetBestAbsorberRate(rate, dt)`
*   **Description:** Scans the owner's inventory for all items with `moistureabsorbersource`, selects the one with the highest effective drying rate, applies its drying effect, and returns that rate. Used to update entity moisture.
*   **Parameters:**  
    * `rate` (number) — Base drying rate multiplier (e.g., environmental conditions like rain).  
    * `dt` (number) — Delta time in seconds (typically `1/60` per frame).
*   **Returns:** `number` — The highest effective drying rate among all equipped/owned moisture absorbers, or `0` if no absorbers found or `inventory` component missing.
*   **Error states:** Returns `0` if the `inventory` component is absent. Does not emit events on failure; silently falls back to `0`.

## Events & listeners
None.
