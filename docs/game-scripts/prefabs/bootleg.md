---
id: bootleg
title: Bootleg
description: A throwable item that creates a two-way ocean whirl portal teleporter when tossed into ocean water.
tags: [combat, inventory, teleport, item]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8e2152e0
system_scope: inventory
---

# Bootleg

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bootleg` prefab is a throwable inventory item that functions as a portable teleportation device. When tossed from a boat onto ocean water, it creates a pair of linked `oceanwhirlportal` prefabs: one at the throw location and one at the throw destination, forming a two-way teleport link. On land or non-ocean terrain, it deactivates and reverts to a standard throwable item. It is intended as a temporary or testing item, as indicated by the commented-out usage of `MakeDeployableKitItem`.

## Usage example
```lua
-- Create and spawn the bootleg item
local bootleg = SpawnPrefab("bootleg")
bootleg.Transform:SetPosition(0, 0, 0)

-- Equip the bootleg to give it special throw behavior
local player = TheWorld.entitylist[0]
if player and player.components.inventory then
    player.components.inventory:Equip(bootleg)
end

-- Toss the bootleg (requires boat context for portal creation)
-- In-game: use TOSS action while on a boat platform
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `stackable`, `complexprojectile`  
**Tags added by component:** `NOCLICK`, `allow_action_on_impassable`, `complexprojectile_showoceanaction`, `action_pulls_up_map`  
**Tags checked/removed:** `NOCLICK` is conditionally removed on hit (if not in ocean)

## Properties
No public properties exposed beyond standard prefab state.

## Main functions
The component itself does not define public methods beyond prefab initialization and callback functions used by attached components.

### `CreateOceanWhirlportal(enter_pt, exit_pt)`
*   **Description:** Spawns two `oceanwhirlportal` prefabs and links them as a two-way teleporter. Called internally by the `onhit` callback when the bootleg hits ocean water.
*   **Parameters:**  
    * `enter_pt` (Vector3) – Position of the entry portal.  
    * `exit_pt` (Vector3) – Position of the exit portal.  
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `onequip(inst, owner)`
*   **Description:** Modifies the owner’s animation state to show the bootleg while held.
*   **Parameters:**  
    * `inst` (Entity) – The bootleg item instance.  
    * `owner` (Entity) – The entity equipping the item.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores the owner’s animation state after unequipping.
*   **Parameters:** Same as `onequip`.  
*   **Returns:** Nothing.

### `onthrown(inst, attacker, targetpos)
*   **Description:** Initializes physics and state for the thrown item. Prepares for portal creation upon water impact.
*   **Parameters:**  
    * `inst` (Entity) – The bootleg item instance.  
    * `attacker` (Entity) – Entity throwing the item.  
    * `targetpos` (Vector3) – Destination position of the throw.  
*   **Returns:** Nothing.

### `onhit(inst, attacker, target)`
*   **Description:** Handles item impact after throw. If in ocean, spawns linked portals and removes the item. If on land, deactivates portal behavior and drops item.
*   **Parameters:** Same as `onthrown`.  
*   **Returns:** Nothing.

### `CanTossOnMap(_, doer)`
*   **Description:** Predicate used to determine if the item can be tossed via map UI. Returns `true` only if `doer` is on a platform with the `boat` tag.
*   **Parameters:**  
    * `doer` (Entity) – The entity attempting to toss.  
*   **Returns:** Boolean – `true` if tossed from a boat.

### `InitMapDecorations(inst)`
*   **Description:** Provides minimap icon definitions for both the item and the portal it spawns.
*   **Parameters:**  
    * `inst` (Entity) – The bootleg item instance.  
*   **Returns:** Table – Array of minimap icon configurations.

### `CalculateMapDecorations(inst, rmbents, px, pz, rmbx, rmbz)`
*   **Description:** Computes world positions for map-based UI decorations when tossing.
*   **Parameters:**  
    * `inst` (Entity) – The bootleg item instance.  
    * `rmbents` (Array) – UI event entries for minimap placement.  
    * `px`, `pz` (numbers) – Source position (player map coordinates).  
    * `rmbx`, `rmbz` (numbers) – Target click position on map.  
*   **Returns:** Modifies `rmbents[1]` and `rmbents[2]` in place.

## Events & listeners
- **Listens to:** `animqueueover` – fires `Remove()` on the bootleg after its animation completes post-portal creation.
- **Pushes:** None identified.