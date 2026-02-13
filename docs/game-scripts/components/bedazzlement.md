---
id: bedazzlement
title: Bedazzlement
description: Manages the "bedazzled" state of an entity, typically a spider den, which pacifies nearby spiders periodically.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Bedazzlement

## Overview
The Bedazzlement component manages the "bedazzled" state for an entity, which is primarily used for Spider Dens. When active, it stops the den's growth, changes its appearance and minimap icon, and periodically emits a pacifying effect on nearby spiders. The component also handles saving and loading this state.

## Dependencies & Tags
**Dependencies:**
- `growable`: Used to stop and start the entity's growth cycle.

**Tags:**
- `bedazzled`: Added to the entity when `Start()` is called and removed when `Stop()` is called. This tag signifies the active bedazzled state.

## Properties

| Property        | Type   | Default Value | Description                                                                                |
| --------------- | ------ | ------------- | ------------------------------------------------------------------------------------------ |
| `inst`          | Entity | `inst`        | A reference to the entity instance this component is attached to.                          |
| `bedazzle_task` | Task   | `nil`         | A handle for the periodic task that pacifies spiders. It is created in `Start()` and canceled in `Stop()`. |

## Main Functions

### `Start()`
* **Description:** Activates the bedazzled state on the entity. It adds the `bedazzled` tag, plays the bedazzle animation and sound, shows a flare effect, and stops the `growable` component. It also updates the minimap icon and ground creep radius and begins a periodic task to pacify nearby spiders.
* **Parameters:** None.

### `Stop()`
* **Description:** Deactivates the bedazzled state. It removes the `bedazzled` tag, hides the flare effect, plays a sound, and resumes the `growable` component. It also restores the original minimap icon and ground creep radius and cancels the spider pacification task.
* **Parameters:** None.

### `PacifySpiders()`
* **Description:** Finds all eligible spiders within a radius determined by `TUNING.BEDAZZLEMENT_RADIUS` and the den's tier. It then applies the `bedazzle_buff` debuff to each spider found, pacifying them.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component's state for saving. It returns a data table indicating whether the entity is currently bedazzled.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the component's state from loaded data. If the data indicates the entity was bedazzled, it calls `Start()` to reactivate the state.
* **Parameters:**
    * `data` (table): The data table returned by `OnSave`.