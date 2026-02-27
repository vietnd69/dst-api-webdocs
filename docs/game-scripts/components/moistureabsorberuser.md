---
id: moistureabsorberuser
title: Moistureabsorberuser
description: This component manages a collection of moisture absorption sources and selects the most effective one to dry the entity's items.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 6d542b1e
---

# Moistureabsorberuser

## Overview
The `MoistureAbsorberUser` component tracks active moisture absorption sources (typically via items in the entity's inventory) and enables the entity to apply drying effects to its contents by selecting and using the most efficient absorber available.

## Dependencies & Tags
* `inst.components.inventory` — Required for identifying and accessing items that may provide moisture absorption (checked dynamically, not strictly required at instantiation).
* `SourceModifierList` — Internal utility used to manage additive boolean-like source contributions.

No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `_sources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Internal list tracking active moisture absorption sources (Boolean-style modifier list). |

## Main Functions

### `AddSource(src, key)`
* **Description:** Registers a new moisture absorption source with the component. Typically called when an item with a `moistureabsorbersource` component enters the entity’s inventory.
* **Parameters:**
  * `src` — The source object (e.g., an item) providing the absorption effect.
  * `key` — A unique identifier string for this source, used for later removal.

### `RemoveSource(src, key)`
* **Description:** Removes a previously registered absorption source. If no sources remain after removal, the component automatically detaches itself from the entity.
* **Parameters:**
  * `src` — The source object to remove.
  * `key` — The key originally used to register the source.

### `GetBestAbsorberRate(rate, dt)`
* **Description:** Scans items in the entity’s inventory to find the one with the highest drying rate, applies the drying effect for the given time step (`dt`), and returns that rate. Returns `0` if no inventory or no absorber is found.
* **Parameters:**
  * `rate` — Base drying rate factor (e.g., environmental context).
  * `dt` — Delta time (time step) over which to apply the drying effect.

## Events & Listeners
None identified.