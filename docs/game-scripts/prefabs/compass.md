---
id: compass
title: Compass
description: A consumable item that reveals map terrain and depletes over time when equipped, while also functioning as a basic melee weapon.
tags: [inventory, combat, map, consumable, tool]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f0d02b44
system_scope: inventory
---

# Compass

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `compass` prefab is a wearable tool that serves dual purposes: revealing the map around the bearer and functioning as a lightweight melee weapon. When equipped, it consumes fuel over time and grants the bearer the `compassbearer` tag. It interacts with the `fueled`, `equippable`, `weapon`, `inventoryitem`, `inspectable`, and `maprevealable` components to manage state, gameplay effects, and networking.

## Usage example
```lua
local inst = SpawnPrefab("compass")
inst.components.equippable:Equip()
inst.components.fueled:DoDelta(-TUNING.COMPASS_FUEL) -- Simulate full depletion
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `equippable`, `fueled`, `weapon`, `hauntable`, `maprevealable`  
**Tags added:** `compass`, `weapon`, `compassbearer` (dynamically added/removed based on equipment state)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_subcat` | string | `"tool"` | Category in the scrapbook UI |
| ` prefab` | string | `"compass"` | Prefab identifier (inherited) |

## Main functions
### `ondepleted(inst)`
*   **Description:** Cleanup callback invoked when the compass runs out of fuel. Removes the item and notifies the owner via the `itemranout` event.
*   **Parameters:** `inst` (Entity) — the compass instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inventoryitem` or `owner` is missing.

### `onequip(inst, owner)`
*   **Description:** Called when the compass is equipped. Activates fuel consumption, updates animation layers on the owner, and registers the compass as a map-reveal source.
*   **Parameters:**  
    * `inst` (Entity) — the compass instance.  
    * `owner` (Entity) — the entity equipping the compass.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when the compass is unequipped. Stops fuel consumption, restores normal animation layers, and removes map-reveal registration.
*   **Parameters:**  
    * `inst` (Entity) — the compass instance.  
    * `owner` (Entity) — the entity unequipping the compass.  
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when the compass is placed into the owner's model slot (e.g., during pickup from ground). Stops fuel consumption and removes map-reveal registration.
*   **Parameters:**  
    * `inst` (Entity) — the compass instance.  
    * `owner` (Entity) — the entity picking up the compass.  
    * `from_ground` (boolean) — not used in this implementation.  
*   **Returns:** Nothing.

### `onattack(inst, attacker, target)`
*   **Description:** Weapon attack handler. Deducts a percentage of the compass's total fuel when used in combat.
*   **Parameters:**  
    * `inst` (Entity) — the compass instance.  
    * `attacker` (Entity) — the entity performing the attack.  
    * `target` (Entity) — the entity being attacked.  
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `itemranout` — fired via `owner:PushEvent("itemranout", data)` when fuel depletes; includes `prefab`, `equipslot`, and `"ANNOUNCE_COMPASS_OUT"`.
- **Listens to:** None directly (external listeners are added by `fueled`, `equippable`, and `maprevealable` components as needed).

*(Note: The commented-out `GetStatus` function and related `hauntable` custom reaction logic are not active in this implementation and omitted from the public API.)*