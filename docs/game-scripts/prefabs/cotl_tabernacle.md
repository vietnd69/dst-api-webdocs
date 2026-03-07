---
id: cotl_tabernacle
title: Cotl Tabernacle
description: Manages the lifecycle, fueling, burning, and upgrade progression of the Cotl Tabernacle campfire entity across three tiers.
tags: [campfire, fuel, upgrade, fire, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abe6dd26
system_scope: entity
---

# Cotl Tabernacle

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cotl_tabernacle` prefab defines a tiered, upgradeable campfire with three distinct levels (level1 → level2 → level3). It combines fire mechanics (via `burnable` and `fueled` components), workability (via `workable`), and construction-site logic (via `constructionsite`) to support iterative building. It also integrates with `hauntable`, `inspectable`, `lootdropper`, `cooker`, and `sanityaura` components. Each level has configurable tunings (fuel capacity, sections, bonus multiplier, rain impact), animations, sounds, and minor sanity effects.

The prefab uses a shared `fn(data)` constructor, invoked three times with different `data` entries corresponding to each tier. The progression from one level to the next is handled internally when the construction is completed.

## Usage example
The `cotl_tabernacle` is not instantiated directly via component; it is a full prefab with three defined levels. Modders extend it by referencing `cotl_tabernacle_level1`, `cotl_tabernacle_level2`, and `cotl_tabernacle_level3` prefabs. Example usage in a mod to add a custom fuel source:
```lua
local function oncustomfuel(inst, doer)
    inst.components.fueled:DoDelta(TUNING.FUEL_LARGE, doer)
end

AddPrefabPostInit("cotl_tabernacle_level1", function(inst)
    if inst.components.fueled then
        inst.components.fueled:SetTakeFuelFn(oncustomfuel)
    end
end)
```

## Dependencies & tags
**Components used:** `burnable`, `constructionsite`, `fueled`, `hauntable`, `inspectable`, `lootdropper`, `workable`, `cooker`, `storytellingprop`, `rainimmunity`, `sanityaura`.  
**Tags added:** `campfire`, `structure`, `wildfireprotected`, `cooker`.  
**Tags conditionally added:** `constructionsite` (only for tiers that support building up).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `data` | table | `nil` | Configuration object with keys: `construction_product`, `minimap`, `tunings`, `anims`, `sounds`, `sanity_arua`, `disable_charcoal`, `scrapbook_proxy`, and `scannable_recipename`. Populated at construction time. |
| `disable_charcoal` | boolean | `false` | If true, prevents charcoal from being produced when the fire reaches max fuel (level 3 only). |
| `queued_charcoal` | boolean or `nil` | `nil` | Internal flag indicating charcoal should be dropped on extinguish (level 3 only). Preserved in save/load. |
| `scrapbook_adddeps` | table | `{"rocks", "log", "cutstone", "goldnugget"}` | List of prefabs to list as dependencies in the scrapbook for this entity. |
| `scrapbook_proxy` | string or `nil` | `"cotl_tabernacle_level3"` (or `nil` for final tier) | Prefab name used as the scrapbook proxy entry. |
| `_construction_product` | string or `nil` | `nil` | Prefab to replace this entity with upon successful construction (e.g., `"cotl_tabernacle_level2"`). |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles the hammering of the tabernacle. Drops default loot (via `lootdropper`), spawns an ash prefab and a small collapse FX at the location, then removes the entity. Typically called when the workable’s work count reaches zero.
*   **Parameters:** `inst` (Entity) — the tabernacle instance; `worker` (Entity) — the entity performing the hammering.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Plays the hit animation for the current tabernacle level, then pushes the idle animation.
*   **Parameters:** `inst` (Entity); `worker` (Entity).
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Resets the fuel level to zero and clears internal state when the fire is extinguished.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ontakefuel(inst)`
*   **Description:** Plays the “add fuel” sound when fuel is added.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `updatefuelrate(inst)`
*   **Description:** Dynamically adjusts the fuel consumption rate based on precipitation. If it is raining and the entity lacks `rainimmunity`, the rate increases proportionally by `1 + RAIN_RATE * precipitationrate`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onupdatefueled(inst)`
*   **Description:** Updates the fire’s visual FX level (stage and opacity) to match the current fuel section and percentage.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst, doer)`
*   **Description:** Responds to fuel section transitions. Extinguishes when fuel hits 0 (and drops queued charcoal if applicable); lights the fire and adds `sanityaura` when fuel becomes non-zero; enables charcoal queueing only at max fuel for non-disabled levels.
*   **Parameters:** `newsection` (number) — new fuel section (1-based); `oldsection` (number) — previous section; `inst` (Entity); `doer` (Entity, optional) — the entity adding fuel.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns `"LIT"` if the tabernacle currently has fuel; otherwise `nil`. Used by the `inspectable` component to report status.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `"LIT"` or `nil`.

### `onbuilt(inst)`
*   **Description:** Plays the place and fuel sounds and the place animation upon construction completion.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles haunts from hostile entities. With low probability (`HAUNT_CHANCE_RARE`) and if the fire has fuel, adds medium fuel (`MED_FUEL`) and sets a small haunt value. Returns `true` on successful haunt.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if haunt succeeded; `false` otherwise.

### `OnInit(inst)`
*   **Description:** Ensures fire FX are correctly attached after construction. Called once after the entity is fully constructed.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves the `queued_charcoal` flag to the save file.
*   **Parameters:** `inst` (Entity); `data` (table) — save table to populate.
*   **Returns:** Nothing.

### `OnPreLoad(inst)`
*   **Description:** Clears the `queued_charcoal` flag during load initialization to avoid duplicated charcoal drops from saved state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the `queued_charcoal` flag from saved data if present.
*   **Parameters:** `inst` (Entity); `data` (table) — loaded save data.
*   **Returns:** Nothing.

### `OnConstructed(inst, doer)`
*   **Description:** Converts the current tabernacle to its next tier (if defined) when construction is complete. Plays the new tier’s place and fuel sounds, and starts the appropriate animation.
*   **Parameters:** `inst` (Entity); `doer` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — fires `onbuilt(inst)` after the tabernacle is placed.
- **Pushes:** `onignite`, `onextinguish`, `percentusedchange`, `onfueldsectionchanged` (via `burnable` and `fueled`); `loot_prefab_spawned`, `entity_droploot` (via `lootdropper`).
