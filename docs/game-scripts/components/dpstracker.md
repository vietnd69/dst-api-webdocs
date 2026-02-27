---
id: dpstracker
title: Dpstracker
description: This component tracks and calculates an entity's damage per second based on its health changes over a defined time window.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: c3996e98
---

# Dpstracker

## Overview
The Dpstracker component is responsible for monitoring an entity's health changes over time to compute and maintain its current Damage Per Second (DPS) value. It uses a ring buffer to store health snapshots within a configurable time window, allowing for dynamic and real-time DPS calculations. This component is essential for providing combat feedback or for AI systems that react to damage taken.

## Dependencies & Tags
This component relies on the `health` component being present on the same entity to access its `currenthealth` property and listen for `healthdelta` events.
None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `n/a` | The entity this component is attached to. |
| `tbl` | `table` | `{}` | A ring buffer used to store historical health and timestamp entries. |
| `i0` | `number` | `1` | The head index (oldest entry) within the `tbl` ring buffer. |
| `sz` | `number` | `0` | The current number of active entries in the `tbl` ring buffer. |
| `max_size` | `number` | `100` | The maximum capacity of the `tbl` ring buffer, limiting how many historical entries are kept. |
| `max_window` | `number` | `2` | The maximum time window (in seconds) over which DPS is calculated. Entries older than this window are discarded. |
| `dps` | `number` | `0` | The currently calculated Damage Per Second value. |
| `ondpsupdatefn` | `function` | `nil` | An optional callback function that is invoked when the DPS value is updated, passing the entity and the new DPS value. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** This function is called when the component is removed from its entity. It ensures that the `healthdelta` event callback is properly unregistered to prevent memory leaks or errors.
*   **Parameters:** None.

### `SetOnDpsUpdateFn(fn)`
*   **Description:** Sets an optional callback function to be executed whenever the DPS value is updated. This allows other systems to react to changes in the entity's damage intake.
*   **Parameters:**
    *   `fn`: A function that will be called with two arguments: `(inst, dps)`, where `inst` is the entity this component is attached to, and `dps` is the newly calculated Damage Per Second.

### `GetDps()`
*   **Description:** Returns the last calculated Damage Per Second value for the entity.
*   **Parameters:** None.

### `DoUpdate()`
*   **Description:** This is the core logic function that calculates and updates the entity's DPS. It manages a ring buffer of health snapshots, discards entries older than `max_window`, and then computes the DPS based on the health difference and time elapsed between the oldest and newest relevant entries. If an `ondpsupdatefn` is set, it will be called with the updated DPS.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:**
    *   `healthdelta`: Triggered by the `health` component whenever the entity's health changes. This event calls `DoUpdate()` to recalculate the DPS.