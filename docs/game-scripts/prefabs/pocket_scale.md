---
id: pocket_scale
title: Pocket Scale
description: A consumable item that weighs fish and degrades with use, eventually destroying itself.
tags: [consumable, inventory, weigh]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d91984bd
system_scope: inventory
---

# Pocket Scale

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pocket_scale` prefab represents a handheld item used to weigh fish in DST. It implements the `finiteuses`, `itemweigher`, and `fuel` components, making it a consumable tool with limited durability. When used on a fish, it consumes one use and provides a weight reading; once depleted, the item is automatically removed from the world. It also functions as a small fuel source and can be ignited or used as a Hauntable launch target.

## Usage example
```lua
local inst = SpawnPrefab("pocket_scale")
if inst and inst.components.finiteuses then
    -- Check remaining uses
    print("Remaining uses:", inst.components.finiteuses:GetPercent())
    -- Perform a weighing action (typically triggered by the itemweigher component)
    inst.components.itemweigher:DoWeighIn(some_fish, player)
end
```

## Dependencies & tags
**Components used:** `finiteuses`, `itemweigher`, `fuel`, `inventoryitem`, `inspectable`, `burnable`, `propagator`, `hauntable`
**Tags:** Adds `trophyscale_fish` and `donotautopick`; removes itself upon `finiteuses` depletion (via `SetOnFinished` calling `inst.Remove`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.finiteuses.total` | number | `TUNING.POCKETSCALE_USES` | Maximum number of uses before depletion. |
| `inst.components.finiteuses.current` | number | `TUNING.POCKETSCALE_USES` | Current remaining uses (starts full). |
| `inst.components.itemweigher.type` | string | `TROPHYSCALE_TYPES.FISH` | Indicates this scale is designated for weighing fish. |
| `inst.components.fuel.fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value for burning mechanics. |
| `scrapbook_specialinfo` | string | `"POCKETSCALE"` | Metadata used by scrapbook entry logic. |

## Main functions
### `doweight(inst, target, doer)`
* **Description:** Callback function assigned to `itemweigher:SetOnDoWeighInFn`. Consumes one use of the scale when triggered and returns success.
* **Parameters:** 
  * `inst` (Entity) — the pocket scale instance.
  * `target` (Entity) — the fish being weighed (unused in logic but passed by caller).
  * `doer` (Entity) — the entity performing the weighing action (e.g., player; unused).
* **Returns:** `true` — indicates weighing was successful.
* **Error states:** None; uses `nil` checks to avoid errors if `finiteuses` component is missing.

## Events & listeners
- **Pushes:** `percentusedchange` — fired by `finiteuses:SetUses` to update client-side visual state (e.g., wear progress).
- **Listens to:** None explicitly (via `ListenForEvent`); relies on `finiteuses` internal event handling for deactivation logic.