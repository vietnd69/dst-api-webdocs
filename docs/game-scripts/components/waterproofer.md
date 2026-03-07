---
id: waterproofer
title: Waterproofer
description: Prevents an entity's inventory item from accumulating moisture and adds the `waterproofer` tag.
tags: [inventory, moisture, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 372be258
system_scope: inventory
---

# Waterproofer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WaterProofer` is a passive component that marks an entity as water-resistant by removing the `waterproofer` tag when detached and ensuring moisture tracking is disabled for inventory items. It is typically attached to items (e.g., Rain Coat, Umbrella base) to prevent them from becoming wet and degrading in wet environments. It relies on `inventoryitem` to toggle moisture handling via `EnableMoisture(false)`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag(" wearable")
inst:AddComponent("inventoryitem")
inst:AddComponent("waterproofer")

-- Optionally adjust effectiveness (used by some systems)
inst.components.waterproofer:SetEffectiveness(0.5)
```

## Dependencies & tags
**Components used:** `inventoryitem` (via `EnableMoisture`)
**Tags:** Adds `waterproofer` on construction; removes it on `OnRemoveFromEntity`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `effectiveness` | number | `1` | Multiplier used by external systems to determine how strongly the water resistance applies (e.g., how much rain exposure is reduced). |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component's effects when removed from the entity — removes the `waterproofer` tag and re-enables moisture tracking on the item.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetEffectiveness()`
*   **Description:** Returns the current effectiveness multiplier for water resistance.
*   **Parameters:** None.
*   **Returns:** `number` — the effectiveness value (e.g., `1` for full resistance, `0.5` for partial).

### `SetEffectiveness(val)`
*   **Description:** Sets the water resistance effectiveness multiplier.
*   **Parameters:** `val` (number) — the new effectiveness value.
*   **Returns:** Nothing.

## Events & listeners
*   None identified.
