---
id: carnival_gametoken
title: Carnival Gametoken
description: A consumable and tradable game token used as bait in DST, featuring periodic visual sparkle effects.
tags: [consumable, inventory, bait, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39dc13e6
system_scope: inventory
---

# Carnival Gametoken

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnival_gametoken` prefab represents an in-game item that functions as both a consumable and tradable resource, primarily used as bait (e.g., for moles). It is implemented as a `Prefab` definition with multiple components attached during instantiation, including `edible`, `tradable`, `inventoryitem`, `stackable`, `bait`, and `inspectable`. It is non-sinking by default but configured to sink (`SetSinks(true)`), and includes a recursive sparkle animation effect.

## Usage example
```lua
local token = Prefab("carnival_gametoken", fn)
-- Typically spawned via worldgen or crafting, not instantiated directly
-- When added to a player inventory, it inherits:
-- - edible properties (FOODTYPE.ELEMENTAL, hunger value = 2)
-- - stackable capacity (stack size = TUNING.STACK_SIZE_SMALLITEM)
-- - tradability (gold value set via tuning)
```

## Dependencies & tags
**Components used:** `edible`, `inventoryitem`, `stackable`, `tradable`, `inspectable`, `bait`, `hauntablelaunch`  
**Tags:** Adds `molebait` on entity instantiation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` enum | `FOODTYPE.ELEMENTAL` | Type of food; determines compatibility with certain feeders. |
| `hungervalue` | number | `2` | Amount of hunger restored when consumed. |
| `goldvalue` | number | *(commented out)* | Gold value used in trading; defaults to `0` if not set. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `sinks` | boolean | `true` | Whether the item sinks in water (via `inventoryitem:SetSinks(true)`). |

## Main functions
### `shine(inst)`
*   **Description:** Triggers a sparkle animation on the token and schedules the next sparkle after a random delay (4–9 seconds). This creates a recurring visual effect.
*   **Parameters:** `inst` (entity instance) — the token instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if animation `"sparkle"` is already playing; otherwise overwrites any pending animation queue with `"sparkle"` followed by `"idle"`.

## Events & listeners
- **Pushes:** `shine` recursively schedules itself via `inst:DoTaskInTime(...)`, but does not push any named events.