---
id: autoterraformer
title: Autoterraformer
description: Manages the logic for an entity that automatically terraforms the ground tile it is currently over.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: 023a45b3
---

# Autoterraformer

## Overview
The Autoterraformer component is responsible for the logic of items that automatically change ground turf, such as the Terra Firma Tamper. It continuously checks the tile beneath the entity and, if a change is needed, it will either place a turf item from its associated container component or dig up the existing turf to reveal the layer underneath or default dirt.

## Dependencies & Tags
**Dependencies:**
- `container`: This component is required, as asserted in its constructor. It uses the container to hold and consume turf items.

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `inst` | The entity instance this component is attached to. |
| `repeat_tile_delay` | `number` | `TUNING.AUTOTERRAFORMER_REPEAT_DELAY` | The time in seconds before the same tile can be terraformed again. |
| `onfinishterraformingfn` | `function` | `nil` | An optional callback function that is executed after a terraforming action is completed. |
| `container` | `Component` | `inst.components.container` | A direct reference to the entity's `container` component. |

## Main Functions
### `FinishTerraforming(x, y, z)`
* **Description:** Finalizes a terraforming action. It pushes the `onterraform` event, consumes a use from the `finiteuses` component if present, and executes the `onfinishterraformingfn` callback.
* **Parameters:**
    * `x, y, z`: The world coordinates where the terraforming finished.

### `DoTerraform(px, py, pz, x, y)`
* **Description:** This is the core function that executes the terraforming logic. It determines whether to place a new turf from its container or dig up the existing one based on world rules and available items. It handles consuming the turf item and updating the world map tile.
* **Parameters:**
    * `px, py, pz`: The precise world position of the entity.
    * `x, y`: The tile coordinates corresponding to the world position.

### `StartTerraforming()`
* **Description:** Begins the continuous terraforming process by enabling the component's `OnUpdate` function.
* **Parameters:** None.

### `StopTerraforming()`
* **Description:** Halts the continuous terraforming process by disabling the component's `OnUpdate` function.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called every frame when the component is active. It tracks the entity's position and triggers `DoTerraform` when the entity moves to a new tile or when a repeat delay on the current tile has expired.
* **Parameters:**
    * `dt`: The time delta since the last update.

## Events & Listeners
*   `inst:PushEvent("onterraform")`: Pushed on the component's owner entity after successfully completing a terraform action.
*   Pushes the `"collapsesoil"` event on any entities with the `soil` tag that are on the affected tile during a dig-up action.