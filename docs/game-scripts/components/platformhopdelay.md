---
id: platformhopdelay
title: Platformhopdelay
description: Manages a delay timer (in ticks) that controls how soon an entity can perform a platform hop action after a previous one.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e8f51f0c
---

# Platformhopdelay

## Overview
This component provides a delay mechanism for platform-hopping behavior, storing the number of ticks that must elapse before an entity (typically a player or creature) can hop to another platform again. It is used to enforce a cooldown period between successive platform hops, likely to prevent spamming of the action or to ensure realistic movement timing.

## Dependencies & Tags
The component relies on the `FRAMES` global constant (used to convert time-in-seconds to ticks). It does not add or remove any entity tags, nor does it require other components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owner entity, set during construction. |
| `delayticks` | `number` (integer) | `8` | Number of ticks to wait before allowing another platform hop. |

## Main Functions
### `SetDelay(time)`
* **Description:** Sets the hop delay based on a time duration in seconds. Internally converts seconds to ticks by dividing by `FRAMES` and rounding up.
* **Parameters:**  
  `time` (`number`): Duration in seconds for the delay.

### `SetDelayTicks(ticks)`
* **Description:** Directly sets the hop delay in ticks.
* **Parameters:**  
  `ticks` (`number`): Number of ticks to wait.

### `GetDelayTicks()`
* **Description:** Returns the current hop delay in ticks.
* **Parameters:** None.

## Events & Listeners
None.