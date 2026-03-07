---
id: amulet
title: Amulet
description: Manages amulet-specific behaviors when equipped or unequipped, including healing, freezing, sanity effects, building discounts, pickup ability, and light emission, depending on the amulet color variant.
tags: [equipment, magic, effects]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8ee685e
system_scope: entity
---

# Amulet

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `amulet` prefab implements color-specific passive effects and visual behaviors when equipped. It is not a reusable component class but rather a collection of prefabs (`red`, `blue`, `purple`, `green`, `orange`, `yellow`) that configure an entity with different combinations of components and equip/unequip callbacks. Each variant modifies owner properties via component interactions (e.g., `health`, `hunger`, `freezable`, `sanity`, `builder`, `fueled`, `bloomer`) and uses periodic tasks or event listeners to manage active behaviors.

## Usage example
```lua
-- Example: Creating and equipping a blue amulet
local inst = SpawnPrefab("blueamulet")
if inst ~= nil and owner ~= nil then
    owner.components.inventory:GiveItem(inst)
    if owner.components.inventory ~= nil then
        owner.components.inventory:Equip(inst)
    end
end
```

## Dependencies & tags
**Components used:** `equippable`, `inventoryitem`, `inspectable`, `shadowlevel`, `finiteuses`, `heater`, `fueled`, `hauntable`, `repairable`, `bloomer`, `freezable`, `sanity`, `builder`, `minigame_participator`, `trap`, `stackable`, `health`, `hunger`, `soundemitter`, `transform`, `animstate`, `network`, `light`.  
**Tags added (per variant):** `resurrector` (red), `HASHEATER` (blue), `shadowlevel` (common), `repairshortaction` (orange), `FX` (yellow light).

## Properties
No public properties are defined in the `amulet` logic itself. Properties such as `dapperness`, `equipslot`, and `walkspeedmult` are set on the `equippable` component during construction. Internal state is stored in `inst`-scoped variables (e.g., `inst.task`, `inst.freezefn`, `inst._light`), not as component properties.

## Main functions
### `commonfn(anim, tag, should_sink, can_refuel)`
*   **Description:** Shared constructor logic used by all amulet variants to set up core entity properties (transform, animstate, network, sound, physics, tags, common components). It conditionally adds the `playfuelsound` net_event and handles lighting/bloom initialization for client/server.
*   **Parameters:**  
    - `anim` (string) - Animation bank/build animation name (e.g., `"redamulet"`).  
    - `tag` (string or `nil`) - Optional tag to add (e.g., `"resurrector"`).  
    - `should_sink` (boolean or `nil`) - If true, enables sinking in water via `MakeInventoryPhysics`.  
    - `can_refuel` (boolean) - If true, sets up `playfuelsound` net event.
*   **Returns:** The initialized entity instance (`inst`).
*   **Error states:** None documented. Returns early on client if `TheWorld.ismastersim` is `false`.

### `red()`, `blue()`, `purple()`, `green()`, `orange()`, `yellow()`
*   **Description:** Variant-specific constructors. Each calls `commonfn`, then adds and configures unique components and equip callbacks (e.g., `onequip_red`, `onequip_blue`) to implement the amulet’s effect. Also sets haunt values and reactions where applicable.
*   **Parameters:** None (functions take no arguments; configuration uses tunings like `TUNING.REDAMULET_USES`).
*   **Returns:** Fully configured entity instance for the variant.
*   **Error states:** Returns early on client (non-master sim) with only base entity setup.

### `onequip_<color>(inst, owner)`
*   **Description:** Equip callback for a specific amulet variant. Applies visual overrides (skin or symbol), starts periodic or event-driven effects, and manages resources (e.g., starts fuel consumption, sanity induction, periodic tasks).
*   **Parameters:**  
    - `inst` (Entity) - The amulet instance.  
    - `owner` (Entity) - The entity that equipped the amulet.
*   **Returns:** Nothing.

### `onunequip_<color>(inst, owner)`
*   **Description:** Unequip callback. Reverses changes made during equip: clears visual overrides, cancels tasks, removes event listeners, stops fuel consumption, and removes sanity/insanity states.
*   **Parameters:**  
    - `inst` (Entity) - The amulet instance.  
    - `owner` (Entity) - The entity that unequipped the amulet.
*   **Returns:** Nothing.

### `onequiptomodel_<color>(inst, owner, from_ground)`
*   **Description:** Model-equip callback (when item is first placed in model/preview context). Stops any running tasks or events that should not run in preview mode.
*   **Parameters:**  
    - `inst` (Entity) - The amulet instance.  
    - `owner` (Entity) - Model entity (may not be a real player).  
    - `from_ground` (boolean) - Indicates if equip came from ground.
*   **Returns:** Nothing.

### `turnoff_yellow(inst)`
*   **Description:** Cleans up the `yellowamuletlight` entity and clears bloom effect. Used during unequip, model unequip, and on-drop.
*   **Parameters:**  
    - `inst` (Entity) - The amulet instance.
*   **Returns:** Nothing.

### `SERVER_PlayFuelSound(inst)`
*   **Description:** Server-side function to play the fuel-add sound, handling different contexts: equipped by owner, opened container, or held in hand. Triggers client sound via net event if needed.
*   **Parameters:**  
    - `inst` (Entity) - The amulet instance (typically orange or yellow variant).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` (on equipped blue amulet, to trigger freeze on attacker), `consumeingredients` (on equipped green amulet, to charge for crafting), `amulet.playfuelsound` (client, to play fuel sound on remote instances), `onremove` (via `PushBloom` in `bloomer`, to clean up bloom listeners).
- **Pushes:** `equipskinneditem`, `unequipskinneditem`, `healthdelta`, `inducedinsanity`, `harvesttrap`, `pickupcheat` (from `orangeamulet`), `onfueldsectionchanged`, `percentusedchange` (via `finiteuses`, `fueled`, `health`, `hunger`, `sanity`).
