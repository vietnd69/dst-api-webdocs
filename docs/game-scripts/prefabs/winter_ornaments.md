---
id: winter_ornaments
title: Winter Ornaments
description: Defines and instantiates all winter ornament prefabs as consumable inventory items with optional lighting, timer, and fuel mechanics.
tags: [inventory, lighting, fuel, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e47c448b
system_scope: inventory
---

# Winter Ornaments

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines a factory function `MakeOrnament` that creates multiple distinct winter ornament prefabs for use in Winter events and cosmetic customization. Each ornament is an inventory item that may optionally include fuel, lighting, and timer functionality. Decorative prefabs like basic, fancy, and light ornaments are generated programmatically, while boss and event-specific variants are instantiated explicitly. The component integrates tightly with `inventoryitem`, `tradable`, `fueled`, and `timer` components to manage state, fuel consumption, and visual updates across server/client boundaries.

## Usage example
```lua
-- Retrieve a random basic ornament prefab
local prefab = GetRandomBasicWinterOrnament()

-- Spawn the entity and access its components
local inst = Prefab(preprefab)
inst:AddComponent("winter_ornament") -- Not used directly; the function returns a Prefab

-- To actually use it:
local ornament = SpawnPrefab(prefab)
ornament.components.inventoryitem:SetOnDroppedFn(function() print("Dropped!") end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `tradable`, `fueled`, `timer`, `fuel`, `stackable`, `inspectable`.  
**Tags added:** `winter_ornament`, `molebait`, `cattoy`, `lightbattery` (only for light-type ornaments).

## Properties
No public properties defined at the component level (this is a prefab generator, not a reusable component class). The generated prefabs each expose instance-level properties such as `ornamentlighton`, `winter_ornamentid`, and `winter_ornament_build`.

## Main functions
### `MakeOrnament(ornamentid, overridename, lightdata, build, float_scale)`
*   **Description:** Factory function that creates and returns a `Prefab` object for a winter ornament. Conditional logic adds lighting/fuel/timer functionality if `lightdata` is provided.
*   **Parameters:**
    *   `ornamentid` (string) – Unique identifier and animation bank suffix (e.g., `"plain1"`, `"light3"`).
    *   `overridename` (string, optional) – Prefab name override for assets.
    *   `lightdata` (table, optional) – If present, enables lighting and fuel behavior with entry `colour = Vector3(...)`.
    *   `build` (string, optional) – Asset directory override; defaults to `"winter_ornaments"`.
    *   `float_scale` (number, optional) – Scaling factor for floating animation.
*   **Returns:** `Prefab` – A fully configured prefab function and assets.
*   **Error states:** None; defaults are applied for optional parameters.

### `GetAllWinterOrnamentPrefabs()`
*   **Description:** Returns the global list of all registered ornament prefab names.
*   **Parameters:** None.
*   **Returns:** `table` – List of strings containing all ornament prefabs.

### `GetRandomBasicWinterOrnament()`, `GetRandomFancyWinterOrnament()`, `GetRandomLightWinterOrnament()`, `GetRandomFestivalEventWinterOrnament()`
*   **Description:** Convenience functions returning random prefab strings from pre-specified ranges.
*   **Parameters:** None.
*   **Returns:** `string` – A randomly selected ornament prefab name (e.g., `"winter_ornament_plain3"`).

### `updatelight(inst, data)`
*   **Description:** Callback triggered by the `blink` timer event; toggles the ornament’s light on/off and updates animations and networked state.
*   **Parameters:**
    *   `inst` (Entity) – The ornament entity instance.
    *   `data` (table) – Event data; must contain `name = "blink"` to trigger.
*   **Returns:** Nothing.
*   **Error states:** If the owner is `nil`, falls back to local light and animation updates.

### `ondepleted(inst)`
*   **Description:** Depleted fuel handler: turns off light, stops all timers, removes fuel/timer components, and cleans up event listeners.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ondropped(inst)`
*   **Description:** Dropped handler: resets light state and starts fuel consumption.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onpickup(inst, by)`
*   **Description:** Pick-up handler: behavior varies by holder — starts/stops light and fuel based on whether the holder has `winter_tree` or `lamp` tags.
*   **Parameters:** `inst` (Entity), `by` (Entity or `nil`).
*   **Returns:** Nothing.

### `onentitysleep(inst)`
*   **Description:** Pauses the `blink` timer when the entity goes to sleep.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onentitywake(inst)`
*   **Description:** Resumes `blink` timer if paused or refreshes light state if consuming fuel.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves current light state (`ornamentlighton`) to save data.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Loads saved light state or handles depleted state on restore.
*   **Parameters:** `inst` (Entity), `data` (table or `nil`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `updatelight` to toggle light state periodically.
- **Pushes:** `updatelight` (on light toggle when held by a valid owner), `onfueldsectionchanged` (via `fueled` component), `fuel_depleted` (via `fueled` component).
- **Listens to client-side hooks:** `OnEntitySleep`, `OnEntityWake`, `OnSave`, `OnLoad` — used for network synchronization and persistence.