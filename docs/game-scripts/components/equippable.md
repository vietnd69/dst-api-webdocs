---
id: equippable
title: Equippable
description: Manages item equipping behavior, including slot assignment, unequip prevention, movement speed modifiers, dapperness, moisture, and equip/unequip callbacks for entities in DST.
tags: [inventory, equipment, networking, player]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 751f922e
system_scope: inventory
---

# Equippable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Equippable` component defines how an item behaves when equipped or unequipped on a player or entity. It handles equip slot assignment, network replication of equippable state, walk speed modifiers, restricted equipping logic (e.g., skill tree items), moisture retention when equipped, and dapperness calculations. It works closely with `InventoryItem` (for owner tracking and network sync) and `Burnable` (to stop smoldering when equipped).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("equippable")
inst.components.equippable:SetEquipSlot(EQUIPSLOTS.HANDS)
inst.components.equippable:SetOnEquip(function(item, owner) print("Equipped!") end)
inst.components.equippable:SetOnUnequip(function(item, owner) print("Unequipped!") end)
inst.components.equippable:SetPreventUnequipping(true)
```

## Dependencies & tags
**Components used:** `burnable`, `inventoryitem`, `linkeditem`  
**Tags:** Checks `player`, `equipmentmodel`, `merm`, `vigorbuff`; does not add or remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isequipped` | boolean | `false` | Whether the item is currently equipped. |
| `equipslot` | `EQUIPSLOTS.*` | `EQUIPSLOTS.HANDS` | The equipment slot this item occupies. |
| `onequipfn` | function \| nil | `nil` | Callback invoked when item is equipped: `function(item, owner, from_ground)`. |
| `onunequipfn` | function \| nil | `nil` | Callback invoked when item is unequipped: `function(item, owner)`. |
| `onpocketfn` | function \| nil | `nil` | Callback invoked when item is pocketed: `function(item, owner)`. |
| `onequiptomodelfn` | function \| nil | `nil` | Callback invoked when item is equipped to an `equipmentmodel` entity. |
| `equipstack` | boolean | `false` | Reserved; unused in current code. |
| `walkspeedmult` | number \| nil | `nil` | Multiplier applied to owner's walk speed while equipped. |
| `restrictedtag` | string \| nil | `nil` | If set, only players with this tag may equip the item. |
| `dapperness` | number | `0` | Base dapperness value contributed by this item. |
| `dapperfn` | function \| nil | `nil` | Optional custom dapperness calculation callback. |
| `insulated` | boolean | `false` | Whether the item insulates the owner from electricity (not temperature). |
| `equippedmoisture` | number | `0` | Moisture level the item contributes while equipped (e.g., umbrella). |
| `maxequippedmoisture` | number | `0` | Maximum moisture capacity while equipped. |
| `preventunequipping` | boolean \| nil | `nil` | When `true`, blocks unequipping until manually disabled. |
| `flipdapperonmerms` | boolean \| nil | `nil` | If `true`, negates `dapperness` for merm owners. |

## Main functions
### `SetEquipSlot(slot)`
* **Description:** Sets the equip slot for this item and replicates it to clients.
* **Parameters:** `slot` (`EQUIPSLOTS.*`) — the slot to assign (e.g., `EQUIPSLOTS.HANDS`, `EQUIPSLOTS.BODY`).
* **Returns:** Nothing.
* **Notes:** Implicitly updates the `equipslot` property and calls the network setter via `inst.replica.equippable:SetEquipSlot`.

### `Equip(owner, from_ground)`
* **Description:** Marks the item as equipped, stops smoldering if applicable, invokes `onequipfn`, and fires the `"equipped"` event.
* **Parameters:**  
  * `owner` (`GEntity`) — the entity equipping the item.  
  * `from_ground` (`boolean`) — whether the item was picked up from the ground.
* **Returns:** Nothing.

### `Unequip(owner)`
* **Description:** Marks the item as unequipped, invokes `onunequipfn`, and fires the `"unequipped"` event.
* **Parameters:** `owner` (`GEntity`) — the entity unequipping the item.
* **Returns:** Nothing.

### `ToPocket(owner)`
* **Description:** Invokes `onpocketfn` to handle logic when an item is moved to the pocket slot.
* **Parameters:** `owner` (`GEntity`) — the entity pocketing the item.
* **Returns:** Nothing.

### `GetWalkSpeedMult()`
* **Description:** Returns the effective walk speed multiplier while equipped, applying the `vigorbuff` boost if applicable.
* **Parameters:** None.
* **Returns:** `number` — speed multiplier (e.g., `1.0`, `0.9`, `1.25`).
* **Error states:** Returns `1.0` if `walkspeedmult` is `nil`.

### `IsRestricted(target)`
* **Description:** Checks whether the given target entity is allowed to equip this item.
* **Parameters:** `target` (`GEntity`) — the entity attempting to equip the item.
* **Returns:** `boolean` — `true` if equipping is restricted, `false` otherwise.
* **Notes:** Applies `restrictedtag` checks and `linkeditem` owner restrictions (only for players). Non-player entities are never restricted.

### `IsRestricted_FromLoad(target)`
* **Description:** Specialized version of `IsRestricted` used when resolving items from saved snapshots. Allows skill-tree-tagged items to be unequipped if the player previously had the tag.
* **Parameters:** `target` (`GEntity`) — the entity attempting to equip the item.
* **Returns:** `boolean` — `true` if equipping is restricted, `false` otherwise.

### `SetPreventUnequipping(shouldprevent)`
* **Description:** Enables or disables unequip prevention. When enabled, listens for `"onremove"` to auto-reset the flag.
* **Parameters:** `shouldprevent` (`boolean`) — if `true`, blocks unequipping.
* **Returns:** Nothing.

### `IsEquipped()`
* **Description:** Returns whether the item is currently equipped.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if equipped.

### `IsInsulated()`
* **Description:** Indicates whether this item provides electrical insulation (not thermal insulation).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if insulated.

### `GetDapperness(owner, ignore_wetness)`
* **Description:** Calculates the item’s dapperness contribution for an owner.
* **Parameters:**  
  * `owner` (`GEntity` \| nil) — the player wearing the item.  
  * `ignore_wetness` (`boolean`) — if `true`, skips wetness dapperness penalty.
* **Returns:** `number` — dapperness value (positive or negative).

### `GetEquippedMoisture()`
* **Description:** Returns moisture stats while equipped.
* **Parameters:** None.
* **Returns:** `{ moisture = number, max = number }` — current and maximum moisture.

## Events & listeners
- **Listens to:**  
  * `"onremove"` — resets `preventunequipping` to `false` via `OnRemove` handler when the item is removed.  
- **Pushes:**  
  * `"equipped"` — fired during `Equip`, with `{ owner = owner }`.  
  * `"unequipped"` — fired during `Unequip`, with `{ owner = owner }`.
