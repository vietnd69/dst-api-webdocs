---
id: w_radio
title: W Radio
description: A decorative radio prefab that plays music when activated, can be placed on furniture, and drops loot when hammered.
tags: [furniture, machine, inventory, decorative, skin]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: c73f7c3b
system_scope: entity
---

# W Radio

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`w_radio` is a decorative inventory item prefab that functions as a music-playing machine. It can be placed on furniture surfaces, turned on to play ambient radio music, and destroyed with a hammer to drop loot. The radio supports skin customization with multiple interchangeable parts (antenna, face, plate, left side, right side) that are synchronized across clients via network variables. It integrates with the furniture, machine, workable, and lootdropper components to provide interactive gameplay functionality.

## Usage example
```lua
-- Spawn a w_radio prefab
local radio = SpawnPrefab("w_radio")

-- Turn on the radio music
radio.components.machine:TurnOn()  -- Start playing music

-- Check if radio is currently playing
if radio.components.machine:IsOn() then
    radio.components.machine:TurnOff()  -- Stop music
end

-- Hammer the radio (3 hits to destroy)
radio.components.workable:SetWorkable(true)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `furnituredecor`, `machine`, `workable`, `lootdropper`, `inspectable`, `hauntable`
**Tags:** Adds `furnituredecor`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parts` | net_ushortint | `0` | Network-synchronized value encoding the 5 skin part variations as a hex value. |
| `_iconlayers` | table | `nil` | Cached layered inventory image configuration for the item icon. |
| `_icondirty` | boolean | `true` | Flag indicating whether the inventory icon needs to be regenerated. |
| `layeredinvimagefn` | function | `LayeredInvImageFn` | Function that returns the layered inventory image data for the radio. |

## Main functions
### `OnWRadioSkinChanged(skin_build, skin_custom)`
*   **Description:** Callback triggered when the radio's skin changes. Applies custom part data or removes the entity if no skin is present.
*   **Parameters:** `skin_build` (string) - skin build name; `skin_custom` (string) - JSON-encoded custom skin data.
*   **Returns:** Nothing.
*   **Error states:** If `skin_build` is `nil`, the entity is scheduled for removal.
*   **Usage:** `inst:OnWRadioSkinChanged(skin_build, skin_custom)`

### `ReskinToolCustomDataDiffers(skin_custom)`
*   **Description:** Determines if the reskin tool's custom data differs from the current radio parts configuration.
*   **Parameters:** `skin_custom` (string) - JSON-encoded custom skin data.
*   **Returns:** `boolean` - `true` if data differs, `false` otherwise.
*   **Usage:** `inst:ReskinToolCustomDataDiffers(skin_custom)`

### `ReskinToolUpdateCustomData(skin_custom)`
*   **Description:** Updates the radio's parts configuration from reskin tool custom data.
*   **Parameters:** `skin_custom` (string) - JSON-encoded custom skin data.
*   **Returns:** Nothing.
*   **Usage:** `inst:ReskinToolUpdateCustomData(skin_custom)`

## Internal Callbacks
These functions are assigned to component callbacks and should not be called directly by modders.

### `TurnOn(inst)`
*   **Description:** Internal callback. Starts playing the radio music loop if not already playing. Assigned to `machine.turnonfn`.
*   **Parameters:** `inst` (entity) - the radio instance.
*   **Returns:** Nothing.
*   **Note:** Modders should use `inst.components.machine:TurnOn()` instead.

### `TurnOff(inst)`
*   **Description:** Internal callback. Stops the radio music loop and plays the gramaphone end sound. Assigned to `machine.turnofffn`.
*   **Parameters:** `inst` (entity) - the radio instance.
*   **Returns:** Nothing.
*   **Note:** Modders should use `inst.components.machine:TurnOff()` instead.

### `ToPocket(inst, owner)`
*   **Description:** Internal callback. Called when the radio is put into a player's inventory via `inventoryitem.onputininventoryfn`. Stops music and plays end sound if the radio was on.
*   **Parameters:** `inst` (entity) - the radio instance; `owner` (entity) - the player receiving the item.
*   **Returns:** Nothing.

### `OnHammered(inst)`
*   **Description:** Internal callback. Called when the workable component finishes (after 3 hammer hits). Spawns collapse FX, drops loot, and removes the entity.
*   **Parameters:** `inst` (entity) - the radio instance.
*   **Returns:** Nothing.

### `OnPutOnFurniture(inst)`
*   **Description:** Internal callback. Called when the radio is placed on furniture via `furnituredecor.onputonfurniture`. Disables workable and applies furniture shadow.
*   **Parameters:** `inst` (entity) - the radio instance.
*   **Returns:** Nothing.

### `OnTakeOffFurniture(inst)`
*   **Description:** Internal callback. Called when the radio is removed from furniture via `furnituredecor.ontakeofffurniture`. Re-enables workable and removes furniture shadow.
*   **Parameters:** `inst` (entity) - the radio instance.
*   **Returns:** Nothing.

## Lifecycle Callbacks
These functions are assigned to the entity instance to handle saving, loading, and lifecycle events.

### `OnSave(data)`
*   **Description:** Saves the radio's parts configuration. Stores the `parts` value as a hex string if non-zero.
*   **Parameters:** `data` (table) - save data table.
*   **Returns:** Nothing.

### `OnLoad(data, ents)`
*   **Description:** Loads the radio's parts configuration from save data. Checks skin validity.
*   **Parameters:** `data` (table) - save data table; `ents` (table) - entity reference table.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Called when the entity wakes up. Checks if skin build exists, removes entity if missing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntitySleep()`
*   **Description:** Called when the entity goes to sleep. Checks if skin build exists, removes entity if missing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `partsdirty` - triggers icon regeneration when parts network variable changes (client-side only).
- **Pushes:** `imagechange` - fired when parts are updated to notify the inventory system to refresh the item icon.