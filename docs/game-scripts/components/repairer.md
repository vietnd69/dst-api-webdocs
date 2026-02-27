---
id: repairer
title: Repairer
description: Manages the repair capabilities of an entity by tracking repair values and applying/removing corresponding tags based on the configured repair material.

sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 353aa4ba
---

# Repairer

## Overview
The `Repairer` component enables an entity to define and dynamically update its repair behavior by specifying values for different repair types (e.g., work, health, perish, finite uses). It manages associated tags on the entity to signal compatibility with various repair materials and actions. When repair values change or the repair material is updated, it automatically updates the relevant tags.

## Dependencies & Tags
- **Tags added:** `"repairer"` (always added on construction)
- **Dynamic tags added/removed based on repair material and values:**
  - `"work_" .. material`
  - `"health_" .. material`
  - `"freshen_" .. material`
  - `"finiteuses_" .. material`
- **Dependencies:** None explicitly added via `AddComponent`. Relies on standard `inst` functionality for tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `workrepairvalue` | `number` | `0` | Amount of work damage (e.g., tool durability) this entity repairs when using the configured material. |
| `healthrepairvalue` | `number` | `0` | Absolute health restored when using the configured material. |
| `healthrepairpercent` | `number` | `0` | Percentage of max health restored when using the configured material. |
| `perishrepairpercent` | `number` | `0` | Percentage of perish (rot) reversed when using the configured material. |
| `finiteusesrepairvalue` | `number` | `0` | Number of finite uses restored (e.g., for items like lanterns). |
| `repairmaterial` | `string or nil` | `nil` | Name of the material used to perform repairs; e.g., `"stone"`, `"gold"`. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from an entity. Removes all repair-related tags associated with the current repair material to prevent stale tags from persisting.
* **Parameters:** None.

## Events & Listeners
- The component uses the `Class` framework’s automatic property watchers. When any of the following properties are modified externally, the corresponding callback functions are invoked:
  - `workrepairvalue`, `healthrepairvalue`, `healthrepairpercent`, `perishrepairpercent`, `finiteusesrepairvalue` → triggers `onrepairvalue`
  - `repairmaterial` → triggers `onrepairmaterial`
- No manual `inst:ListenForEvent` or `inst:PushEvent` usage is present in this component.