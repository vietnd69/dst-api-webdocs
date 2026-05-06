---
id: equippable
title: Equippable
description: Manages equipment state, slot assignment, and equip/unequip callbacks for wearable items.
tags: [inventory, equipment, player]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 93beffe9
system_scope: inventory
---

# Equippable

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`Equippable` tracks whether an item is currently equipped, which equipment slot it occupies, and manages callbacks for equip/unequip events. It integrates with `inventoryitem` for owner tracking and `burnable` to stop smoldering when equipped. The component also handles walk speed modifiers, dapperness calculations, moisture accumulation, and equipment restriction tags for player-gated items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("equippable")
inst:AddComponent("inventoryitem")

inst.components.equippable:SetOnEquip(function(item, owner)
    print("Item equipped by", owner.prefab)
end)

inst.components.equippable:SetOnUnequip(function(item, owner)
    print("Item unequipped by", owner.prefab)
end)

inst.components.equippable:Equip(player, false)
print("Is equipped:", inst.components.equippable:IsEquipped())
```

## Dependencies & tags
**External dependencies:**
- `EQUIPSLOTS` -- global enum for equipment slot constants (HANDS, HEAD, BODY, etc.)
- `TUNING.WET_ITEM_DAPPERNESS` -- dapperness penalty when item is wet
- `SKILLTREE_EQUIPPABLE_RESTRICTED_TAGS` -- skill tree restriction mapping

**Components used:**
- `burnable` -- calls `StopSmoldering()` when item is equipped
- `inventoryitem` -- accesses `owner` property for walk speed and restriction checks
- `linkeditem` -- checks `IsEquippableRestrictedToOwner()` and `GetOwnerUserID()` for ownership restrictions
- `replica.equippable` -- syncs equip slot and prevent unequipping state to clients
- `replica.inventoryitem` -- syncs walk speed multiplier and equip restriction tags to clients

**Tags:**
- `player` -- checked in `IsRestricted()` to apply restrictions only to players
- `possessedbody` -- checked alongside `player` in `IsRestricted()`
- `equipmentmodel` -- checked before calling `onequiptomodelfn` callback
- `merm` -- checked in GetDapperness() but flipdapperonmerms property is never initialized in source, making this check non-functional
- `vigorbuff` -- grants walk speed bonus when speed < 1 and owner has this tag

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isequipped` | boolean | `false` | Whether the item is currently equipped. |
| `equipslot` | EQUIPSLOTS | `EQUIPSLOTS.HANDS` | The equipment slot this item occupies. |
| `onequipfn` | function | `nil` | Callback fired when item is equipped. Signature: `fn(inst, owner, from_ground)`. |
| `onunequipfn` | function | `nil` | Callback fired when item is unequipped. Signature: `fn(inst, owner)`. |
| `onpocketfn` | function | `nil` | Callback fired when item is moved to pocket. Signature: `fn(inst, owner)`. |
| `onequiptomodelfn` | function | `nil` | Callback for equipment model changes. Signature: `fn(inst, owner, from_ground)`. |
| `equipstack` | boolean | `false` | Whether the item can be stacked when equipped. |
| `walkspeedmult` | number | `nil` | Walk speed multiplier applied when item is equipped. |
| `dapperness` | number | `0` | Base dapperness value granted by this item. |
| `dapperfn` | function | `nil` | Custom function to calculate dapperness. Signature: `fn(inst, owner)`. |
| `insulated` | boolean | `false` | Whether the item provides electrical insulation. |
| `equippedmoisture` | number | `0` | Current moisture accumulation while equipped. |
| `maxequippedmoisture` | number | `0` | Maximum moisture capacity while equipped. |
| `preventunequipping` | boolean | `nil` | If `true`, blocks unequipping via `onremove` event listener. |
| `restrictedtag` | string | `nil` | Tag required on target to equip this item. Only players with this tag can equip. |
| `flipdapperonmerms` | boolean | `nil` | If true, flips dapperness sign for merm entities. Set externally by prefabs; never initialized in constructor (see Tags section note on merm tag). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when component is removed from entity. Resets prevent unequipping state and clears walk speed multiplier and restriction tags on replica.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `IsInsulated()`
* **Description:** Returns whether the item provides electrical insulation (not temperature insulation).
* **Parameters:** None
* **Returns:** boolean -- `true` if insulated, `false` otherwise
* **Error states:** None

### `SetOnEquip(fn)`
* **Description:** Sets the callback function fired when the item is equipped.
* **Parameters:** `fn` -- function with signature `fn(inst, owner, from_ground)`
* **Returns:** nil
* **Error states:** None

### `SetOnPocket(fn)`
* **Description:** Sets the callback function fired when the item is moved to pocket.
* **Parameters:** `fn` -- function with signature `fn(inst, owner)`
* **Returns:** nil
* **Error states:** None

### `SetOnUnequip(fn)`
* **Description:** Sets the callback function fired when the item is unequipped.
* **Parameters:** `fn` -- function with signature `fn(inst, owner)`
* **Returns:** nil
* **Error states:** None

### `SetDappernessFn(fn)`
* **Description:** Sets a custom function to calculate dapperness instead of using the base `dapperness` value.
* **Parameters:** `fn` -- function with signature `fn(inst, owner)`
* **Returns:** nil
* **Error states:** None

### `SetOnEquipToModel(fn)`
* **Description:** Sets the callback function for equipment model changes. Only called if owner has `equipmentmodel` tag.
* **Parameters:** `fn` -- function with signature `fn(inst, owner, from_ground)`
* **Returns:** nil
* **Error states:** None

### `IsEquipped()`
* **Description:** Returns whether the item is currently equipped.
* **Parameters:** None
* **Returns:** boolean -- `true` if equipped, `false` otherwise
* **Error states:** None

### `Equip(owner, from_ground)`
* **Description:** Marks the item as equipped, stops smoldering if burnable, fires the equip callback, and pushes the `equipped` event. Calls `onequiptomodelfn` if owner has `equipmentmodel` tag.
* **Parameters:**
  - `owner` -- entity that is equipping the item
  - `from_ground` -- boolean indicating if item was picked up from ground
* **Returns:** nil
* **Error states:** Errors if owner is nil (no nil guard before passing to onequipfn, PushEvent, and onequiptomodelfn).

### `ToPocket(owner)`
* **Description:** Fires the pocket callback when item is moved to pocket slot.
* **Parameters:** `owner` -- entity that owns the item
* **Returns:** nil
* **Error states:** Errors if owner is nil and onpocketfn callback accesses owner (no nil guard before callback invocation).

### `Unequip(owner)`
* **Description:** Marks the item as unequipped, fires the unequip callback, and pushes the `unequipped` event.
* **Parameters:** `owner` -- entity that is unequipping the item
* **Returns:** nil
* **Error states:** Errors if owner is nil (no nil guard before passing to onunequipfn and PushEvent).

### `GetWalkSpeedMult()`
* **Description:** Calculates the effective walk speed multiplier. Applies a +0.25 bonus (capped at 1.0) if speed < 1 and owner has `vigorbuff` tag. Calls `inventory_EquippableWalkSpeedMultModifier` function on owner if present for further modification.
* **Parameters:** None
* **Returns:** number -- walk speed multiplier (default 1.0 if not set)
* **Error states:** None

### `IsRestricted(target)`
* **Description:** Checks if the target is restricted from equipping this item. Returns `false` for non-player/non-possessedbody targets. Checks `linkeditem` ownership restrictions first, then checks if target lacks the required `restrictedtag`.
* **Parameters:** `target` -- entity to check restrictions against
* **Returns:** boolean -- `true` if restricted, `false` if allowed
* **Error states:** Errors if `target` is nil (calls `HasAnyTag()` without nil guard).

### `IsRestricted_FromLoad(target)`
* **Description:** Restriction check used during snapshot load. Returns `false` if the restricted tag matches a skill tree entry for the target prefab (assumes player has the tag on load). Otherwise delegates to `IsRestricted()`.
* **Parameters:** `target` -- entity to check restrictions against
* **Returns:** boolean -- `true` if restricted, `false` if allowed
* **Error states:** Errors if `target` is nil or `target.prefab` is nil.

### `ShouldPreventUnequipping()`
* **Description:** Returns whether unequipping is currently blocked.
* **Parameters:** None
* **Returns:** boolean -- `true` if unequipping is prevented, `false` otherwise
* **Error states:** None

### `SetPreventUnequipping(shouldprevent)`
* **Description:** Enables or disables unequipping prevention. When enabled, listens for `onremove` event to block removal. When disabled, removes the event listener.
* **Parameters:** `shouldprevent` -- boolean to enable or disable prevention
* **Returns:** nil
* **Error states:** None

### `GetDapperness(owner, ignore_wetness)`
* **Description:** Calculates the total dapperness value. Flips sign if `flipdapperonmerms` is set and owner has `merm` tag. Calls `dapperfn` if set. Adds `TUNING.WET_ITEM_DAPPERNESS` penalty if item is wet and `ignore_wetness` is false.
* **Parameters:**
  - `owner` -- entity wearing the item
  - `ignore_wetness` -- boolean to skip wetness penalty
* **Returns:** number -- total dapperness value
* **Error states:** None

### `GetEquippedMoisture()`
* **Description:** Returns the current and maximum moisture accumulation while equipped.
* **Parameters:** None
* **Returns:** table -- `{ moisture = number, max = number }`
* **Error states:** None

## Events & listeners
- **Listens to:** `onremove` - registered when `preventunequipping` is enabled to block item removal
- **Pushes:** `equipped` - fired in `Equip()` with `{ owner = owner }` data
- **Pushes:** `unequipped` - fired in `Unequip()` with `{ owner = owner }` data