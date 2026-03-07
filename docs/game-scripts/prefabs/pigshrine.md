---
id: pigshrine
title: Pigshrine
description: Manages the pig shrine structure's state machine, including empty, offering, burnt, and burnable states, with support for prototyping, trading, and salvage behavior.
tags: [environment, structure, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0c2c59d6
system_scope: environment
---

# Pigshrine

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pigshrine` is a structurally interactive prefab representing the pig shrine building in DST. It supports three core states: **empty** (ready to accept offerings), **offering** (contains a food item and unlocks prototyping), and **burnt** (smouldering or fully burnt with degraded functionality). The shrine uses multiple components to manage prototyping access (`prototyper`), item trading (`trader`), destruction (`workable`), burning (`burnable`), and salvage (`lootdropper`). Its state is stored and restored via save/load hooks and updated via visual and functional callbacks.

## Usage example
This component is not added manually. It is part of the `pigshrine` prefab definition. Typical modding interactions involve extending behavior via component overrides:
```lua
-- Example: override the default offer acceptance logic
local oldAcceptTest = TheWorld.components.trader.abletoaccepttest
TheWorld.components.trader.SetAbleToAcceptTest(
    function(inst, item)
        return oldAcceptTest(inst, item) or item.prefab == "my_custom_meat"
    end
)
```

## Dependencies & tags
**Components used:** `burnable`, `hauntable`, `inspectable`, `lootdropper`, `prototyper`, `trader`, `workable`  
**Tags:** `structure`, `pigshrine`, `prototyper`, `burnt` (added conditionally via tag), `DECOR`, `NOCLICK` (added to FX entity)

## Properties
No public properties are exposed directly on the prefab itself. Internal state is managed via `inst.offering` (a child entity reference) and component state.

## Main functions
### `SetOffering(inst, offering, loading)`
*   **Description:** Sets the given item as the current offering inside the shrine. Updates visual symbols, registers event callbacks, and activates the `prototyper` component.
*   **Parameters:**  
    `offering` (entity) - the item prefab to insert into the shrine.  
    `loading` (boolean) - if true, skips animation and sound playback (used during world load).
*   **Returns:** Nothing.
*   **Error states:** No-op if `offering` is identical to the existing `inst.offering`.

### `MakeEmpty(inst)`
*   **Description:** Clears the shrine's offering, removes the `prototyper` component, and reinstates the `trader` component to accept new offerings.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Called when the shrine fully burns out. Removes the offering (if any), cleans up event callbacks, spawns `charcoal`, hides the meat symbol, and removes the `trader` component.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Called when the shrine begins burning. Spawns charcoal from the offering (if present), clears the offering, disables the trader, and invokes default burn logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnExtinguish(inst)`
*   **Description:** Called when the fire is extinguished before full burnout. Re-enables the `trader` component (if present) and invokes default extinguish logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Handler for hammering the shrine. Extinguishes fire (if burning), drops loot (including any offering), spawns debris FX, and removes the entity.
*   **Parameters:**  
    `worker` (entity or nil) - the entity performing the hammer action; used to fling the offering.
*   **Returns:** Nothing.

### `onhit(inst, worker, workleft)`
*   **Description:** Called on each hammer hit. Drops the offering, empties the shrine (triggering prototyper removal), and plays hit animation if not burnt.
*   **Parameters:**  
    `worker` (entity or nil) - hammerer.  
    `workleft` (number) - remaining work units after this hit.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes the shrine's state. Records if burnt, or saves the offering entity if present.
*   **Parameters:**  
    `data` (table) - the save table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores the shrine's state from saved data: burnt, offering restored, or defaults to empty.
*   **Parameters:**  
    `data` (table or nil) - loaded save data.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns the current status string for inspection UI (`"BURNT"`, `"EMPTY"`, or `nil` if offering present).
*   **Parameters:** None.
*   **Returns:** `"BURNT"`, `"EMPTY"`, or `nil`.

## Events & listeners
- **Listens to:** `onbuilt`, `ondeconstructstructure`, `onremove` (offering), `perished` (offering)  
- **Pushes:** `loot_prefab_spawned`, `entity_droploot` (via `lootdropper`)  
- **Component callbacks:** `burnable.onburnt`, `burnable.onignite`, `burnable.onextinguish`, `workable.onfinish`, `workable.onwork`, `inspectable.getstatus`