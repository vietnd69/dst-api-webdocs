---
id: spicepack
title: Spicepack
description: A wearable backpack item that provides inventory storage, functions as a food preserver, and responds to fire ignition and extinguishing by locking/unlocking its contents.
tags: [inventory, equipment, fire, storage]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 52042bc6
system_scope: inventory
---

# Spicepack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spicepack` prefab is a wearable inventory item that grants a character a 2×3 storage container. It functions as a food preserver (prevents spoilage of stored food) and includes fire safety logic that prevents opening when ignited. When equipped, it overrides the character's visual model for the backpack and body slots, opens its container for the wearer, and handles skinning overrides. Upon burning, it extinguishes and drops all contents as items before disappearing, leaving behind an `ash` prefab.

## Usage example
```lua
-- Typical use inside a player's inventory or hotbar
local inst = SpawnPrefab("spicepack")
player.components.inventory:GiveItem(inst)

-- Fire behavior is automatic: ignite event triggers container lock
inst.components.burnable:Ignite()
-- container.canbeopened becomes false until extinguished

-- Unequip closes the container for the player
player:PushEvent("doaction", { action = "unequip", target = inst })
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `container`, `burnable`, `propagator`, `inspectable`, `mini map entity`
**Tags:** `backpack`, `foodpreserver`, `nocool`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/backpack"` | Sound played during movement while equipped. |
| `inst.components.inventoryitem.cangoincontainer` | boolean | `false` | Prevents the spicepack from being placed inside other containers. |
| `inst.components.equippable.equipslot` | EQUIPSLOTS | `EQUIPSLOTS.BODY` | Equipment slot where the item is worn. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the spicepack is equipped. Overrides visual symbols for the backpack and body slots using either skin-specific or default animations, opens the container for the owner, and emits a `equipskinneditem` event if skinned.
*   **Parameters:** `inst` (entity) - the spicepack instance; `owner` (entity) - the character equipping the item.
*   **Returns:** Nothing.
*   **Error states:** May silently skip skin overrides if `GetSkinBuild()` returns `nil`.

### `onunequip(inst, owner)`
*   **Description:** Called when unequipped. Clears visual overrides, closes the container for the owner, and emits `unequipskinneditem` if skinned.
*   **Parameters:** `inst` (entity); `owner` (entity).
*   **Returns:** Nothing.
*   **Error states:** May silently skip skin event if not skinned.

### `onequiptomodel(inst, owner)`
*   **Description:** Called when equipping to preview/draft state (e.g., in crafting UI). Closes the container immediately to prevent accidental access during UI interactions.
*   **Parameters:** `inst` (entity); `owner` (entity).
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Triggered when the item is fully burned. Drops all container contents, closes the container, spawns an ash prefab at the item's position, and removes the item instance.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Triggered when the item catches fire. Sets `container.canbeopened = false`, locking the container to prevent access while burning.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Triggered when fire is extinguished. Restores `container.canbeopened = true`, allowing the container to be opened again.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** N/A (no direct event listeners; responds to component callbacks like `burnable` events)
- **Pushes:** `equipskinneditem`, `unequipskinneditem` (via `owner:PushEvent(...)` during equip/unequip)
