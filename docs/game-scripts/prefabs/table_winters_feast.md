---
id: table_winters_feast
title: Table Winters Feast
description: Manages festive table functionality including food放置, seasonal feast registration, lighting effects, and interaction with the Winters Feast event system.
tags: [crafting, event, inventory, light, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 26eb19c6
system_scope: crafting
---

# Table Winters Feast

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`table_winters_feast` is a prefabricated structure component used in the *Winters Feast* seasonal event. It serves as a dedicated surface for placing festive foods to trigger feasting effects. The entity integrates with the `wintersfeasttable`, `inventory`, `shelf`, `trader`, and `lootdropper` components to manage food placement, trade, destruction, and lighting. It registers with the global `feasts` component during initialization and cleans up registrations on removal or destruction. Non-master simulation clients receive a lightweight instance without logic components.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddMiniMapEntity()
inst.entity:AddNetwork()

inst:AddTag("structure")
inst:AddTag("wintersfeasttable")

inst:AddComponent("wintersfeasttable")
inst:AddComponent("inventory")
inst.components.inventory.maxslots = 1

inst:AddComponent("shelf")
inst:AddComponent("trader")

-- Later, place a festive food on the table
inst.components.trader:Disable()
inst.components.shelf:PutItemOnShelf(festive_food_item)
-- This triggers internal handlers that set canfeast = true and enable feasting
```

## Dependencies & tags
**Components used:** `wintersfeasttable`, `inventory`, `shelf`, `trader`, `lootdropper`, `workable`, `hauntable`, `burnable`, `propagator`, `inspectable`, `deployhelper`, `placer`, `updatelooper`, `finiteuses` (indirect), `stackable` (indirect).  
**Tags added:** `structure`, `wintersfeasttable`.  
**Tags checked:** `burnt`, `fire`, `takeshelfitem`, `wintersfeastcookedfood`, `preparedfood`, `readyforfeast`, `monster`, `animal`, `creaturecorpse`, `hive`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `helper` | entity or nil | `nil` | Non-networked visual helper ring used during placement for range/structure group highlighting. |
| `_eject_task` | Task or nil | `nil` | Delayed task used to eject wrongly placed food after bump animation completes. |
| `scrapbook_specialinfo` | string | `"TABLEWINTERSFEAST"` | Reference key for scrapbook display. |

## Main functions
### `SetFoodSymbol(inst, foodname, override_build)`
*   **Description:** Applies or clears a visual food symbol overlay on the table via `AnimState:OverrideSymbol`. Used to reflect the currently placed food item.
*   **Parameters:** `foodname` (string or nil) — prefab name of the food; `nil` clears the symbol. `override_build` (string or nil) — optional animation build name override.
*   **Returns:** Nothing.

### `ItemTradeTest(inst, item)`
*   **Description:** Validation function for the `trader` component that determines if an item can be placed on the table.
*   **Parameters:** `inst` (entity), `item` (entity or nil).
*   **Returns:** Boolean — `true` if item is valid (e.g., tagged `wintersfeastcookedfood` or `preparedfood`, table is not `burnt`/`fire`, and `takeshelfitem` tag absent), else `false`.

### `DropFoodFromShelf(inst)`
*   **Description:** Safely removes and returns the current shelf item (without giving it to an entity) for ejection or cleanup.
*   **Parameters:** `inst` (entity).
*   **Returns:** The dropped item entity or `nil`.

### `EjectFood(inst)`
*   **Description:** Removes food from the shelf and physically launches it away from the table using physics.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `RefuseFood(inst)`
*   **Description:** Plays the “bump” animation and schedules `EjectFood` for items placed that do not meet feast criteria.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnGetShelfItem(inst, item)`
*   **Description:** Callback invoked when an item is placed on the shelf. Handles visual symbology, feasting readiness (`canfeast`), and food-type-specific logic (e.g., refusal of non-festive food, rot handling).
*   **Parameters:** `inst` (entity), `item` (entity).
*   **Returns:** Nothing.

### `OnLoseShelfItem(inst, taker, item)`
*   **Description:** Callback invoked when an item is taken from the shelf. Clears symbology and resets `canfeast` to `false`.
*   **Parameters:** `inst` (entity), `taker` (entity or nil), `item` (entity).
*   **Returns:** Nothing.

### `OnFinishFood(inst)`
*   **Description:** Called after a food item has finished being feasted upon. Removes the item, disables `canfeast`, and spawns a depleted food FX prefab.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnDepleteFood(inst)`
*   **Description:** Spawns depletion FX particles when food on the table is consumed, proportional to the number of feasters in the same table group.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Handles table state when burnt: ejects food, disables trading and feasting, unregisters the table from the `feasts` component.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onhaunt(inst)`
*   **Description:** Handles haunting; if the table is `readyforfeast`, it refuses food by playing the bump animation and ejecting.
*   **Parameters:** `inst` (entity).
*   **Returns:** Boolean — `true` if haunt succeeded (i.e., food was refused), else `nil`.

### `placer_postinit_fn(inst)`
*   **Description:** Sets up visual placement helpers: inner and outer radius rings, and links them via `placer:LinkEntity`. Adjusts scales for range indication and structure group highlighting.
*   **Parameters:** `inst` (entity) — the placer entity being initialized.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt`, `onburnt`, `onignite`, `onextinguish`, `onremove`, `ruffle`, `animover`, `perished` (on shelf item).
- **Pushes:** `feastinterrupted` (on feasters when canceling feasting), `onburnt`, `entity_droploot` (via `lootdropper`).
- **Component event callbacks:**
  - `wintersfeasttable`: `ondepletefoodfn`, `onfinishfoodfn`
  - `shelf`: `onshelfitemfn` (set to `OnGetShelfItem`), `ontakeitemfn` (set to `OnLoseShelfItem`)
  - `trader`: `abletoaccepttest` (set to `ItemTradeTest`), `onaccept` (set to `OnItemGiven`), `deleteitemonaccept = false`
  - `workable`: `onfinish` (set to `onhammered`), `onwork` (set to `onhit`)
  - `hauntable`: `onhaunt` (set to `onhaunt`)