---
id: caveins
title: Caveins
description: Manages the visual and gameplay effects of cave-ins on non-master shards, including player-targeted warnings and boulder attacks.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: af60a26b
---

# Caveins

## Overview
This server-side component is responsible for executing cave-in events, specifically within cave shards (i.e., not the master shard/surface world). It listens for data from the master shard to track players, generate warning effects like camera shake and falling debris, and ultimately trigger the main boulder attack by creating a localized earthquake. This component effectively acts as the receiver and executor for Antlion-induced cave-ins in the caves.

## Dependencies & Tags
None identified.

## Properties

| Property | Type   | Default Value | Description                                  |
|----------|--------|---------------|----------------------------------------------|
| `inst`   | entity | `inst`        | A reference to the entity instance this component is attached to. |

## Main Functions
### `OnUpdate(dt)`
* **Description:** Called every frame to update the state of tracked cave-in targets. It updates the last known position of any targeted players and ticks down the warning cooldown timer for each target. If there are no active targets, the component stops updating.
* **Parameters:**
    * `dt` (number): The time elapsed since the last update (delta time).

### `OnSave()`
* **Description:** Serializes the current state of active cave-in targets for persistence. It saves the last known position of each target.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Deserializes saved cave-in target data. Upon loading, it immediately schedules a cave-in attack at each of the saved target locations.
* **Parameters:**
    * `data` (table): The saved data table from `OnSave`.

### `GetDebugString()`
* **Description:** Generates a formatted string listing all current cave-in targets and their positions for debugging purposes.
* **Parameters:** None.

## Events & Listeners
*   **Listens for `secondary_sinkholesupdate`:** On non-master shards, this event listener is the primary driver for the component. It receives a data payload containing information about which players to target for warnings or full-scale cave-in attacks.
*   **Pushes `ms_miniquake`:** This world event is triggered to create the main cave-in attack. It generates a localized earthquake that spawns falling boulders (`cavein_boulder`) at the target's position.