---
id: repairer
title: Repairer
description: Adds repair capability to an entity by exposing material-specific repair properties and managing associated tags.
tags: [repair, tags, inventory, crafting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 353aa4ba
system_scope: entity
---

# Repairer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Repairer` enables an entity to be repaired using specific materials. It tracks repair values for various repair types (work, health, perish, finite uses) and maintains dynamic tags indicating which materials can be used for each repair type. Tags follow the format `work_<material>`, `health_<material>`, `freshen_<material>`, and `finiteuses_<material>`. The component is typically added to items that can be repaired (e.g., tools, clothing, weapons).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("repairer")
inst.components.repairer.workrepairvalue = 100
inst.components.repairer.healthrepairvalue = 20
inst.components.repairer.repairmaterial = "stone"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `repairer`; dynamically adds/removes `work_<material>`, `health_<material>`, `freshen_<material>`, `finiteuses_<material>` based on repair values and material.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `workrepairvalue` | number | `0` | Amount of work (durability) restored by repair. |
| `healthrepairvalue` | number | `0` | Absolute health points restored by repair. |
| `healthrepairpercent` | number | `0` | Percentage of max health restored by repair. |
| `perishrepairpercent` | number | `0` | Percentage of perish (rot) reversed by repair. |
| `finiteusesrepairvalue` | number | `0` | Number of finite uses restored by repair. |
| `repairmaterial` | string? | `nil` | Name of the material this entity can be repaired with (e.g., `"stone"`, `"cutgrass"`). |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up all material-specific tags when the component is removed from the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
*   None identified — the component uses table metamethods (`__newindex`) on its public properties to trigger automatic tag updates. Setting any tracked property invokes its associated listener function (`onrepairvalue` or `onrepairmaterial`).
