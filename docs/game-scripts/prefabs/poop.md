---
id: poop
title: Poop
description: A consumable and deployable item that acts as a fertilizer, fuel, and ignitable object, spawning flies when dropped and releasing a cloud upon fueling.
tags: [fertilizer, fuel, inventory, environment, ai]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 01ba4c82
system_scope: world
---

# Poop

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `poop` prefab represents a versatile in-game item that functions as a fertilizer, fuel source, and ignitable object. It integrates with multiple components to support gameplay mechanics: it can be planted as fertilizer, burned as fuel (releasing a `poopcloud`), or dropped (spawning `flies`). The prefab registers helper methods for fertilizer key retrieval and research functionality, and handles entity lifecycle events such as inventory placement, dropping, and ignition.

## Usage example
```lua
local inst = SpawnPrefab("poop")
-- By default, all component setup is handled by the prefab factory function.
-- Use it as a deployable fertilizer or fuel:
inst.components.fertilizer:SetNutrients(...)  -- if modifying nutrients
inst.components.fuel.fuelvalue = 10           -- adjust fuel value
inst.components.burnable:SetOnIgniteFn(myfn)  -- customize ignition behavior
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fertilizerresearchable`, `fertilizer`, `smotherer`, `fuel`, `burnable`, `propagator`, `deployablefertilizer`, `hauntablelaunchandignite`  
**Tags:** Adds `fertilizerresearchable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flies` | entity or nil | `nil` | Child entity (flies) spawned when dropped; removed on pickup. |
| `GetFertilizerKey` | function | `GetFertilizerKey` (local) | Returns the prefab name used for fertilizer research. |
| `scrapbook_anim` | string | `"idle"` | Animation used in scrapbook view. |

## Main functions
### `GetFertilizerKey(inst)`
*   **Description:** Returns the key used for fertilizer research, based on the prefab name.
*   **Parameters:** `inst` (entity) — the instance whose key is requested.
*   **Returns:** string — `inst.prefab` (e.g., `"poop"`).
*   **Error states:** None.

### `fuelresearchfn(inst)`
*   **Description:** Internal research function for `fertilizerresearchable` component; delegates to `GetFertilizerKey`.
*   **Parameters:** `inst` (entity) — the fertilizer instance.
*   **Returns:** string — the research key.

## Events & listeners
- **Listens to:** None explicitly (relies on component events like `onputininventory`, `ondropped`, `onignite`, `ontaken` registered via component setters).
- **Pushes:** None explicitly — events are handled via callback registration (e.g., `SetOnIgniteFn`, `SetOnTakenFn`).

