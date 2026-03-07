---
id: playerfloater
title: Playerfloater
description: Manages equipping and deployment behavior for player-held floating items, such as the Cloud In A Bottle.
tags: [inventory, equippable, player, deployment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4675dcd6
system_scope: inventory
---

# Playerfloater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playerfloater` is a specialized component that enables an entity to function as a player-held floating item—typically used for tools or consumables that float above the player's head when equipped (e.g., Cloud In A Bottle). It manages the item's transition between inventory slots and active floating state, ensuring proper equipping, unequipping, and persistence logic. It integrates closely with the `inventory` and `equippable` components, and adds the `playerfloater` tag to the entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerfloater")

-- Configure equip behavior
inst.components.playerfloater:SetOnEquip(function(inst, owner)
    -- Custom logic on equip
end)

-- Equip the item to a player (e.g., via player action)
inst.components.playerfloater:AutoDeploy(player)

-- Later, let go or reset
inst.components.playerfloater:LetGo(player)
-- or
inst.components.playerfloater:Reset(player)
```

## Dependencies & tags
**Components used:** `equippable`, `inventory`, `container`  
**Tags:** Adds `playerfloater`; removes `equippable` during save/load reconciliation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onequipfn` | function or `nil` | `nil` | Callback executed when the item is equipped. |
| `onunequipfn` | function or `nil` | `nil` | Callback executed when the item is unequipped. |

## Main functions
### `SetOnEquip(fn)`
* **Description:** Assigns a callback function to run when the item is equipped. Also syncs this handler to the underlying `equippable` component.
* **Parameters:** `fn` (function) — the function to execute on equip; receives `(inst, owner)` arguments.
* **Returns:** Nothing.

### `SetOnUnequip(fn)`
* **Description:** Assigns a callback function to run when the item is unequipped.
* **Parameters:** `fn` (function) — the function to execute on unequip; receives `(inst, owner)` arguments.
* **Returns:** Nothing.

### `AutoDeploy(player)`
* **Description:** Equips the item to the `HANDS` slot of `player`, first dropping any existing item in that slot and closing any equipped backpack. Designed for one-click deployment of floating items.
* **Parameters:** `player` (entity) — the player entity to equip the item on.
* **Returns:** Nothing.

### `LetGo(player, randomdir, pos)`
* **Description:** Unequips and drops the item into the world, allowing the player to "let go" of the floating item.
* **Parameters:**  
  - `player` (entity) — the player holding the item.  
  - `randomdir` (boolean) — whether to drop with a random velocity.  
  - `pos` (Vector3 or `nil`) — explicit world position for the drop; if `nil`, defaults to player position.
* **Returns:** Nothing.

### `Reset(player)`
* **Description:** Unequips the item and returns it to the player's inventory (e.g., for re-equipping later without dropping).
* **Parameters:** `player` (entity) — the player holding the item.
* **Returns:** Nothing.

### `MakeEquippable_Internal()`
* **Description:** Internal helper that adds the `equippable` component, configures equip/unequip callbacks, and marks the item as prevent-unequipping.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Saves state when the item is equipped—used for network and save-file persistence.
* **Parameters:** None.
* **Returns:** `{ equipped = true }` if the item is currently equipped; `nil` otherwise.

### `OnLoad(data, ents)`
* **Description:** Restores the `equippable` component if the item was saved as equipped.
* **Parameters:**  
  - `data` (table) — save data containing `data.equipped`.  
  - `ents` (table) — entity mapping (unused).
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** Ensures the `equippable` component is removed after load—this component only re-adds it when needed (`OnLoad`), and this final pass cleans up stale state.
* **Parameters:**  
  - `ents` (table) — entity mapping.  
  - `data` (table) — save data (unused).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — internal handling via `SetPreventUnequipping(true)` ensures the `equippable` component removes itself on forced removal.
- **Pushes:** None directly; relies on events from `equippable` and `inventory` (e.g., `equip`, `unequip`, `dropitem`).

### Additional Notes
- The `equippable` component is added lazily and conditionally—only when needed (e.g., during deployment) and removed during `LoadPostPass` to avoid stale state after world loading.
- The `playerfloater` tag is added on construction and removed when detached from the entity via `OnRemoveFromEntity`.
