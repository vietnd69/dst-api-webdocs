---
id: bedroll
title: Bedroll
description: "Provides sleep functionality for players, with two variants: a disposable straw bedroll and a reusable furry bedroll that regulates sleeper temperature."
tags: [sleep, inventory, temperature, consumable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9dc717c
system_scope: player
---

# Bedroll

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bedroll` prefab implements two distinct sleep items — `bedroll_straw` and `bedroll_furry` — that allow players to sleep in the world. These prefabs utilize several components: `sleepingbag` for core sleep logic (health/sanity recovery), `fuel` and burnable properties for campfire compatibility, `finiteuses` (furry variant only) for durability tracking, and `stackable` (straw variant only) for stacking support. The furry variant additionally includes temperature regulation to help maintain the sleeper's comfort within a target range.

## Usage example
```lua
local bedroll = Prefab("bedroll_straw", bedroll_straw, straw_assets)
local inst = SpawnPrefab("bedroll_straw")
inst.Transform:SetPosition(x, y, z)

-- For the furry variant:
local bedroll_furry = SpawnPrefab("bedroll_furry")
bedroll_furry.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `fuel`, `sleepingbag`, `stackable` (straw only), `finiteuses` (furry only), `burnable`, `propagator`, `hauntable`.
**Tags:** None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"STRAWROLL"` or `"FURROLL"` | Internal identifier used by the scrapbook system. |
| `onuse` | function | `onuse_straw` or `onuse_furry` | Callback invoked when a player begins sleeping in this bedroll. |

## Main functions
### `onwake(inst, sleeper, nostatechange)`
*   **Description:** Cleanup function called when the sleeper wakes up. Consumes the straw bedroll entirely or decrements uses on the furry variant; removes the item from the world if uses reach zero.
*   **Parameters:**  
    `inst` (Entity) — the bedroll instance.  
    `sleeper` (Entity) — the sleeping player entity.  
    `nostatechange` (boolean) — indicates whether the sleeper's state should skip transition updates.  
*   **Returns:** Nothing.  
*   **Error states:** None. Will silently skip removal if `finiteuses` is missing or still has uses remaining.

### `onuse_straw(inst, sleeper)`
*   **Description:** Applies visual override to the sleeper's animation to show the straw bedroll texture.
*   **Parameters:**  
    `inst` (Entity) — the bedroll instance.  
    `sleeper` (Entity) — the sleeping player entity.  
*   **Returns:** Nothing.

### `onuse_furry(inst, sleeper)`
*   **Description:** Applies visual skin override to the sleeper’s animation to show the furry bedroll texture, respecting bedroll skins.
*   **Parameters:**  
    `inst` (Entity) — the bedroll instance.  
    `sleeper` (Entity) — the sleeping player entity.  
*   **Returns:** Nothing.
*   **Error states:** Falls back to generic symbol override if `inst:GetSkinBuild()` returns `nil`.

### `temperaturetick(inst, sleeper)`
*   **Description:** Tick function used by the furry bedroll to gradually adjust the sleeper’s temperature toward a comfortable range while sleeping.
*   **Parameters:**  
    `inst` (Entity) — the bedroll instance.  
    `sleeper` (Entity) — the sleeping player entity.  
*   **Returns:** Nothing.  
*   **Error states:** Skips if `sleeper.components.temperature` is missing.

## Events & listeners
- **Listens to:** None directly (relies on external systems like `sleepingbag` for state triggers).
- **Pushes:** None directly (relies on `sleepingbag` and `finiteuses` components to push related events).