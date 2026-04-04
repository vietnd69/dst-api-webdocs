---
id: bedroll
title: Bedroll
description: Defines the straw and furry bedroll prefabs for sleeping and temperature regulation.
tags: [sleep, inventory, survival]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9dc717c
system_scope: inventory
---

# Bedroll

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
This script registers two prefabs: `bedroll_straw` and `bedroll_furry`. Both function as sleeping bags that allow players to recover health and sanity while regulating body temperature. The straw variant is stackable and durable, while the furry variant has limited durability managed by the `finiteuses` component. Both prefabs configure the `sleepingbag` component to handle sleep logic and temperature adjustments.

## Usage example
```lua
-- Spawn a straw bedroll
local straw_bedroll = SpawnPrefab("bedroll_straw")

-- Spawn a furry bedroll
local furry_bedroll = SpawnPrefab("bedroll_furry")

-- Add to inventory
local player = ThePlayer
player.components.inventory:GiveItem(straw_bedroll)
```

## Dependencies & tags
**Components used:** `sleepingbag`, `finiteuses` (furry), `stackable` (straw), `fuel`, `inventoryitem`, `inspectable`, `temperature` (accessed on sleeper).
**Tags:** None identified directly on the inst; logic checks `usesdepleted` tag via `finiteuses` component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sleepingbag.health_tick` | number | `TUNING.SLEEP_HEALTH_PER_TICK * 0.5` (straw) | Health restored per tick while sleeping. |
| `sleepingbag.sanity_tick` | number | `TUNING.SLEEP_SANITY_PER_TICK * 2/3` (straw) | Sanity restored per tick while sleeping. |
| `sleepingbag.sleep_temp_min` | number | `TUNING.SLEEP_TARGET_TEMP_BEDROLL_FURRY` (furry) | Minimum temperature threshold for adjustment. |
| `sleepingbag.sleep_temp_max` | number | `TUNING.SLEEP_TARGET_TEMP_BEDROLL_FURRY_MAX` (furry) | Maximum temperature threshold for adjustment. |
| `finiteuses.max_uses` | number | `TUNING.BEDROLL_FURRY_USES` (furry) | Total durability uses for the furry bedroll. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` (straw) | Maximum stack size for the straw bedroll. |

## Main functions
### `onwake(inst, sleeper, nostatechange)`
*   **Description:** Callback executed when a player wakes up from sleeping in the bedroll. Removes the bedroll if durability is depleted.
*   **Parameters:** `inst` (entity) - the bedroll instance; `sleeper` (entity) - the player waking up; `nostatechange` (boolean) - state change flag.
*   **Returns:** Nothing.
*   **Error states:** If `finiteuses` is missing or `GetUses()` returns `<= 0`, the item is removed from the world.

### `temperaturetick(inst, sleeper)`
*   **Description:** Periodic function that adjusts the sleeper's temperature towards the bedroll's target range.
*   **Parameters:** `inst` (entity) - the bedroll instance; `sleeper` (entity) - the sleeping player.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the sleeper does not have a `temperature` component.

### `onuse_straw(inst, sleeper)`
*   **Description:** Overrides the sleeper's animation symbol to display the straw bedroll visual.
*   **Parameters:** `inst` (entity) - the bedroll instance; `sleeper` (entity) - the player using the item.
*   **Returns:** Nothing.

### `onuse_furry(inst, sleeper)`
*   **Description:** Overrides the sleeper's animation symbol to display the furry bedroll visual, respecting skin builds.
*   **Parameters:** `inst` (entity) - the bedroll instance; `sleeper` (entity) - the player using the item.
*   **Returns:** Nothing.

## Events & listeners
-   **Listens to:** `onwake` (assigned via `sleepingbag.onwake`) - triggers cleanup logic when sleep ends.
-   **Pushes:** None identified directly in this script; relies on `sleepingbag` component to fire sleep events.