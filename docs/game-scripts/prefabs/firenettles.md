---
id: firenettles
title: Firenettles
description: A consumable vegetable item that applies a temporary temperature-based debuff to non-plantkin eaters, which can be dried to produce a longer-lasting fuel source.
tags: [consumable, debuff, drying, fuel, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6da16bc6
system_scope: environment
---

# Firenettles

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`firenettles` is a renewable plant-based food item that serves multiple gameplay purposes: as a perishable consumable that inflicts a temporary debuff (temperature increase and periodic announcements) on non-plantkin eaters, and as a candidate for drying into `firenettles_dried` for use as fuel. The debuff is implemented as a separate lightweight entity (`firenettle_toxin`) that tracks the target and applies periodic effects.

## Usage example
```lua
-- Creating a firenettles item instance
local inst = Prefab("firenettles", fn)

-- Consuming it (triggers edible.onEaten logic)
inst.components.edible:OnEaten(eater)

-- Drying it (handled by dryable component on server)
if inst.components.dryable ~= nil then
    inst.components.dryable:StartDrying()
end
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `inspectable`, `inventoryitem`, `edible`, `perishable`, `fuel`, `dryable`, `health`, `talker`, `temperature`, `debuff`  
**Tags:** Adds `dryable` (pristine only); `CLASSIFIED` (on `firenettle_toxin` only); checks `plantkin` on eater, `idle` on target

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `edible.healthvalue` | number | `-TUNING.HEALING_SMALL` | Health change on consumption (negative). |
| `edible.hungervalue` | number | `0` | Hunger change on consumption. |
| `edible.sanityvalue` | number | `-TUNING.SANITY_TINY` | Sanity change on consumption (negative). |
| `edible.foodtype` | FOODTYPE enum | `FOODTYPE.VEGGIE` | Food classification for cooking and compatibility. |
| `perishable.perishtime` | number | `TUNING.PERISH_SUPERFAST` | Time in seconds before the item spoils. |
| `perishable.onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn upon spoiling. |
| `fuel.fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel value for campfires/canoes. |
| `dryable.product` | string | `"firenettles_dried"` | Result prefab name after drying. |
| `dryable.drytime` | number | `TUNING.DRY_FAST` | Time in seconds to dry. |

## Main functions
### `oneaten(inst, eater)`
* **Description:** Callback invoked when the firenettles item is eaten. Applies the `firenettle_toxin` debuff to non-plantkin eaters.
* **Parameters:**  
  - `inst`: The firenettles entity instance.  
  - `eater`: The entity consuming the item.  
* **Returns:** Nothing.
* **Error states:** Does nothing if the eater has the `plantkin` tag.

### `buff_OnAttached(inst, target)`
* **Description:** Triggered when the `firenettle_toxin` debuff entity is attached to a target. Sets parent transform, subscribes to target's `death` event, adds temperature modifier, and starts a periodic task to announce the debuff.
* **Parameters:**  
  - `inst`: The `firenettle_toxin` debuff entity.  
  - `target`: The entity afflicted by the debuff.  
* **Returns:** Nothing.

### `buff_OnDetached(inst, target)`
* **Description:** Triggered when the debuff is removed. Removes temperature modifier, announces completion if target is alive, and destroys the debuff entity.
* **Parameters:**  
  - `inst`: The `firenettle_toxin` debuff entity.  
  - `target`: The entity that had the debuff.  
* **Returns:** Nothing.

### `DoT_OnTick(inst, target)`
* **Description:** Periodic callback (every 10s) that announces the debuff duration to the afflicted entity if it is idle and alive.
* **Parameters:**  
  - `inst`: The debuff entity.  
  - `target`: The afflicted entity.  
* **Returns:** Nothing.
* **Error states:** No effect if target is dead, missing `talker` or `health` component, or lacks the `idle` tag.

### `buff_OnExtended(inst)`
* **Description:** Extends the debuff duration by scheduling `expire` to run after `TUNING.FIRE_NETTLE_TOXIN_DURATION`. Cancels and reschedules existing task if present.
* **Parameters:**  
  - `inst`: The debuff entity.  
* **Returns:** Nothing.

### `expire(inst)`
* **Description:** Stops the debuff by calling `debuff:Stop()` if the component exists.
* **Parameters:**  
  - `inst`: The debuff entity.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves the remaining time on the expiration task to `data.remaining`.
* **Parameters:**  
  - `inst`: The debuff entity.  
  - `data`: Table for persistent save data.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the expiration task using the saved remaining time (`data.remaining`) if present.
* **Parameters:**  
  - `inst`: The debuff entity.  
  - `data`: Table containing saved state (may be `nil`).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — on the `firenettle_toxin` entity, to stop the debuff when the host dies.
- **Pushes:** None — uses component callbacks (`debuffs` API handles public dispatch internally).
