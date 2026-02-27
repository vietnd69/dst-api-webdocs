---
id: plantable
title: Plantable
description: Provides basic growth timing and product data for entities that can be planted and grown in the world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 166b1cdf
---

# Plantable

## Overview
The `Plantable` component stores foundational data for entities that can be planted and later grow into a new entity or produce a harvestable item. It defines the growth duration and identifies the resulting product entity, but does not implement the actual planting, growing, or harvesting logic—those responsibilities are handled by other components (e.g., `grower`, `harvestable`, or `producer`).

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `growtime` | `number` | `120` | The default time (in seconds) required for the entity to mature after planting. |
| `product` | `string?` | `nil` | The name of the prefab to spawn when this plantable grows; if `nil`, no product is automatically generated. |

## Main Functions
### `Plantable(inst)`
* **Description:** Constructor for the component. Initializes the component instance with the given entity (`inst`) and sets up default growth time and product values.
* **Parameters:**  
  - `inst`: The `Entity` to attach this component to.

## Events & Listeners
None identified.