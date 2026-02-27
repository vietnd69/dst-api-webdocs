---
id: decay
title: Decay
description: Manages an entity's internal resource that depletes over time, such as fuel or durability, and triggers events based on its state.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 0978132f
---

# Decay

## Overview
The Decay component provides a versatile system for managing an entity's internal, quantifiable resource, akin to fuel, durability, or a charge level. It allows this resource to be increased or decreased programmatically and over time. The component automatically handles clamping the resource at zero and can trigger specific events when the resource is fully depleted or overfilled, making it suitable for entities that consume a resource as part of their functionality.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `inst` | Reference to the parent entity this component is attached to. |
| `maxhealth` | `number` | `100` | The maximum value the internal resource (e.g., fuel) can reach. |
| `decayrate` | `number` | `1` | A rate modifier for consumption. Its primary explicit use in the provided code is within the internal `delta` helper function to decrement a given `num`. |
| `currenthealth` | `number` | `self.maxhealth` | The current value of the internal resource. |
| `deltatask` | `thread` \| `nil` | `nil` | Stores the currently running thread responsible for time-based decay, allowing it to be stopped and replaced. |

## Main Functions
### `DoDelta(amount)`
*   **Description:** Modifies the component's `currenthealth` by the specified `amount`. It ensures `currenthealth` does not drop below zero. If the health drops to zero from a positive value, it triggers a "spentfuel" event. If `currenthealth` exceeds `maxhealth`, it triggers an "addfuel" event.
*   **Parameters:**
    *   `amount` (`number`): The numerical value to add to (`amount > 0`) or subtract from (`amount < 0`) the `currenthealth`.

### `SetTimeDelta(amount, pause, num)`
*   **Description:** Establishes or updates a recurring decay process. It first stops any existing timed decay thread before starting a new one. The new thread will repeatedly call `DoDelta(amount)` after a `pause` duration. If `num` is provided, the process will run for approximately `num / self.decayrate` iterations (if `num` is decremented by `self.decayrate` per iteration). The thread only starts if `pause` is greater than 0.
*   **Parameters:**
    *   `amount` (`number`): The delta value to apply to `currenthealth` in each interval.
    *   `pause` (`number`): The time in seconds to wait between applying the `amount` delta. If `pause` is 0 or less, no timed decay thread will be started.
    *   `num` (`number`, optional): An optional parameter that, if provided, is decremented by `self.decayrate` in each iteration of the internal decay loop. The timed decay stops when `num` reaches 0 or less.

## Events & Listeners
*   `inst:PushEvent("spentfuel")`: Triggered when `currenthealth` drops to 0 or below, specifically if `currenthealth` was positive before the `DoDelta` call.
*   `inst:PushEvent("addfuel")`: Triggered when `currenthealth` exceeds `maxhealth` after a `DoDelta` call.