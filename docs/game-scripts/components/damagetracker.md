---
id: damagetracker
title: Damagetracker
description: This component monitors and accumulates the total absolute health changes (both damage taken and healing received) for its owner, triggering a callback if a specified threshold is met.
last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: b6c7025b
---

# Damagetracker

## Overview
This component's primary responsibility is to monitor its parent entity's health changes. It accumulates the absolute value of all health modifications (damage taken or healing received) occurring on the entity while the component is enabled. If this cumulative value reaches or exceeds a predefined threshold, it will execute a specified callback function, providing a mechanism to react to significant health-related activity on the entity.

## Dependencies & Tags
None identified.

## Properties
| Property            | Type      | Default Value | Description                                                                                                                              |
| :------------------ | :-------- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `damage_done`       | `number`  | `0`           | The cumulative absolute amount of health change (damage taken + healing received) tracked since the component was enabled or reset.        |
| `damage_threshold`  | `number`  | `2500`        | The accumulated health change amount that, when reached or exceeded, will trigger the `damage_threshold_fn` callback.                    |
| `damage_threshold_fn` | `function` or `nil` | `nil`         | A callback function to be executed when `damage_done` reaches `damage_threshold`. It receives the component's `inst` as its only argument. |
| `enabled`           | `boolean` | `false`       | Controls whether the component is actively tracking health changes.                                                                      |

## Main Functions
### `Start()`
*   **Description:** Enables the component to begin tracking health changes. When enabled, the `OnHealthDelta` listener will process subsequent `healthdelta` events.
*   **Parameters:** None.

### `Stop()`
*   **Description:** Disables the component, pausing the tracking of health changes. While stopped, the `OnHealthDelta` listener will ignore `healthdelta` events.
*   **Parameters:** None.

### `OnHealthDelta(data)`
*   **Description:** This is the event handler for the `healthdelta` event. When triggered and the component is enabled, it adds the absolute value of the health change to `damage_done`. If the new `damage_done` value meets or exceeds `damage_threshold` and it was previously below the threshold, it calls the `damage_threshold_fn` if one is set.
*   **Parameters:**
    *   `data` (table): A table containing information about the health change. It is expected to contain an `amount` field, representing the raw change in health (negative for damage, positive for healing).

## Events & Listeners
*   **Listens For:**
    *   `healthdelta`: Listened to on the component's `inst`. This event triggers the `OnHealthDelta` method whenever the entity's health changes.