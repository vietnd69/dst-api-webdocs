---
id: inventoryitem
title: Inventoryitem
description: Manages item ownership, inventory state, moisture, and physics for entities that can be picked up and carried.
tags: [inventory, item, ownership, moisture, physics]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 59031b6a
system_scope: inventory
---

# Inventoryitem

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`InventoryItem` is a core component that manages whether an entity can be picked up, carried, and stored in containers. It tracks ownership state, handles moisture/wetness propagation, manages drop physics, and coordinates lifecycle events when items enter or leave inventory. This component works closely with `inventory`, `container`, and `inventoryitemmoisture` to maintain consistent item state across the game's entity component system.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst.components.inventoryitem:SetOwner(player)
inst.components.inventoryitem:SetOnPickupFn(function(item, picker) 
    print("Item picked up by " .. picker.prefab)
end)
inst.components.inventoryitem:EnableMoisture(true)
```

## Dependencies & tags
**Components used:**
- `inventoryitemmoisture` -- added/removed via EnableMoisture(), handles wetness state
- `waterproofer` -- checked in constructor to determine if moisture should be enabled
- `container` -- accessed for slot queries and item removal
- `inventory` -- accessed for slot queries and item removal
- `brain` -- hibernated/woken when item enters/leaves inventory
- `burnable` -- checked in OnPickup() to stop smoldering
- `health` -- accessed in OnPickup() to apply fire damage
- `propagator` -- delayed in OnDropped() for fire spread timing
- `replica.inventoryitem` -- network replication for owner and property changes

**Tags:**
- `heavy` -- checked in DoDropPhysics() to modify drop velocity
- `player` -- checked in OnPickup() for profile stats tracking

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity currently holding this item. |
| `canbepickedup` | boolean | `true` | Whether this item can be picked up by entities. |
| `canbepickedupalive` | boolean | `false` | Allows pickup even when alive (used for minions like eyeplants). |
| `onpickupfn` | function | `nil` | Callback function called when item is picked up. |
| `isnew` | boolean | `true` | Tracks if item is newly collected for profile stats. |
| `nobounce` | boolean | `false` | If true, item lands instantly without bounce physics. |
| `cangoincontainer` | boolean | `true` | Whether item can be placed in containers. |
| `canonlygoinpocket` | boolean | `false` | Mutually exclusive with canonlygoinpocketorpocketcontainers. |
| `canonlygoinpocketorpocketcontainers` | boolean | `false` | Allows item in pocket or pocket-only containers. |
| `islockedinslot` | boolean | `false` | Whether item is locked in its current inventory slot. |
| `keepondeath` | boolean | `false` | Whether item persists when owner dies. |
| `atlasname` | string | `nil` | Atlas name for item icon replication. |
| `imagename` | string | `nil` | Image name for item icon replication. |
| `trappable` | boolean | `true` | Whether item can be trapped. |
| `sinks` | boolean | `false` | Whether item sinks in water when landed. |
| `droprandomdir` | boolean | `false` | Whether item drops with random direction velocity. |
| `isacidsizzling` | boolean | `false` | Whether item is affected by acid sizzling. |
| `grabbableoverridetag` | string | `nil` | Tag override for grabbability checks. |
| `pushlandedevents` | boolean | `true` | Whether to push on_landed/on_no_longer_landed events. |
| `is_landed` | boolean | `false` | Whether item is currently on the ground. |
| `ondropfn` | function | `nil` | Callback function called when item is dropped. |
| `onputininventoryfn` | function | `nil` | Callback function called when item is put in inventory. |
| `onactiveitemfn` | function | `nil` | Deprecated callback for active item changes. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Called when component is removed from entity. Disables moisture and removes event callbacks.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EnableMoisture(enable)`
* **Description:** Enables or disables the inventoryitemmoisture component on this entity.
* **Parameters:** `enable` -- boolean to enable or disable moisture tracking
* **Returns:** None
* **Error states:** None

### `GetMoisture()`
* **Description:** Returns the current moisture value of this item.
* **Parameters:** None
* **Returns:** number -- moisture value, or `0` if moisture component is not present
* **Error states:** None

### `GetMoisturePercent()`
* **Description:** Returns moisture as a percentage of maximum wetness.
* **Parameters:** None
* **Returns:** number -- moisture divided by TUNING.MAX_WETNESS, or `nil` if moisture component is not present
* **Error states:** None

### `IsWet()`
* **Description:** Checks if the item is currently wet.
* **Parameters:** None
* **Returns:** boolean -- true if wet, false otherwise or if moisture component is not present
* **Error states:** None

### `IsAcidSizzling()`
* **Description:** Checks if the item is affected by acid sizzling via replica.
* **Parameters:** None
* **Returns:** boolean -- result from replica inventory item
* **Error states:** None (replica is guaranteed when component exists)

### `InheritMoisture(moisture, iswet)`
* **Description:** Inherits moisture values from another source.
* **Parameters:**
  - `moisture` -- number moisture value to inherit
  - `iswet` -- boolean wetness state to inherit
* **Returns:** None
* **Error states:** None

### `InheritWorldWetnessAtXZ(x, z)`
* **Description:** Inherits world wetness at specific coordinates if not under rain dome.
* **Parameters:**
  - `x` -- number world x coordinate
  - `z` -- number world z coordinate
* **Returns:** None
* **Error states:** None

### `InheritWorldWetnessAtTarget(target)`
* **Description:** Inherits world wetness from target if target has no rain immunity.
* **Parameters:** `target` -- entity to check for rain immunity
* **Returns:** None
* **Error states:** None

### `DiluteMoisture(item, count)`
* **Description:** Dilutes moisture when stacking with another item.
* **Parameters:**
  - `item` -- entity item to dilute with
  - `count` -- number stack count to dilute
* **Returns:** None
* **Error states:** None

### `AddMoisture(delta)`
* **Description:** Adds moisture delta to current moisture value.
* **Parameters:** `delta` -- number amount to add (can be negative)
* **Returns:** None
* **Error states:** None

### `MakeMoistureAtLeast(min)`
* **Description:** Ensures moisture is at least the specified minimum value.
* **Parameters:** `min` -- number minimum moisture value
* **Returns:** None
* **Error states:** None

### `DryMoisture()`
* **Description:** Sets moisture to zero, drying the item completely.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetOwner(owner)`
* **Description:** Sets the owner entity for this item.
* **Parameters:** `owner` -- entity or nil to clear owner
* **Returns:** None
* **Error states:** None

### `ClearOwner()`
* **Description:** Clears the owner reference to nil.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetOnDroppedFn(fn)`
* **Description:** Sets callback function to be called when item is dropped.
* **Parameters:** `fn` -- function callback
* **Returns:** None
* **Error states:** None

### `SetOnActiveItemFn(fn)`
* **Description:** Deprecated. Sets callback for active item changes.
* **Parameters:** `fn` -- function callback
* **Returns:** None
* **Error states:** None

### `SetOnPickupFn(fn)`
* **Description:** Sets callback function to be called when item is picked up.
* **Parameters:** `fn` -- function callback
* **Returns:** None
* **Error states:** None

### `SetOnPutInInventoryFn(fn)`
* **Description:** Sets callback function to be called when item is put in inventory.
* **Parameters:** `fn` -- function callback
* **Returns:** None
* **Error states:** None

### `SetSinks(should_sink)`
* **Description:** Sets whether item should sink in water and triggers sink check if already landed.
* **Parameters:** `should_sink` -- boolean whether item should sink
* **Returns:** None
* **Error states:** None

### `GetSlotNum()`
* **Description:** Returns the slot number this item occupies in owner's inventory or container.
* **Parameters:** None
* **Returns:** number slot index, or `nil` if no owner or container/inventory component
* **Error states:** None (returns nil if owner lacks required components - guarded by 'ct ~= nil' check)

### `GetContainer()`
* **Description:** Returns the container or inventory component that owns this item.
* **Parameters:** None
* **Returns:** container or inventory component, or `nil` if no owner
* **Error states:** None (returns nil if owner lacks required components - safe OR expression)

### `HibernateLivingItem()`
* **Description:** Hibernates brain and kills sounds when item enters inventory.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `WakeLivingItem()`
* **Description:** Wakes brain when item leaves inventory.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnPutInInventory(owner)`
* **Description:** Called when item is placed in an owner's inventory. Sets owner, removes from scene, and pushes event.
* **Parameters:** `owner` -- entity that now owns this item
* **Returns:** None
* **Error states:** None

### `OnRemoved()`
* **Description:** Called when item is removed from owner. Clears owner and returns item to scene.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnDropped(randomdir, speedmult)`
* **Description:** Called when item is dropped. Handles physics, events, and propagator delay.
* **Parameters:**
  - `randomdir` -- boolean whether to drop with random direction
  - `speedmult` -- number speed multiplier for drop velocity
* **Returns:** None
* **Error states:** None

### `DoDropPhysics(x, y, z, randomdir, speedmult)`
* **Description:** Applies physics velocity to dropped item based on weight and bounce settings.
* **Parameters:**
  - `x` -- number world x position
  - `y` -- number world y position
  - `z` -- number world z position
  - `randomdir` -- boolean whether to use random direction
  - `speedmult` -- number speed multiplier
* **Returns:** None
* **Error states:** None

### `OnPickup(pickupguy, src_pos)`
* **Description:** Called when item is picked up. Handles smoldering damage, events, and profile stats.
* **Parameters:**
  - `pickupguy` -- entity picking up the item
  - `src_pos` -- position where pickup occurred
* **Returns:** result of onpickupfn callback, or `nil`
* **Error states:** None (health component access is guarded by 'if pickupguy.components.health ~= nil' check before DoFireDamage call)

### `IsHeld()`
* **Description:** Checks if item currently has an owner.
* **Parameters:** None
* **Returns:** boolean -- true if owner is not nil
* **Error states:** None

### `IsHeldBy(guy)`
* **Description:** Checks if item is held by a specific entity.
* **Parameters:** `guy` -- entity to check against owner
* **Returns:** boolean -- true if owner matches guy
* **Error states:** None

### `ChangeImageName(newname)`
* **Description:** Changes the item's image name and pushes imagechange event.
* **Parameters:** `newname` -- string new image name
* **Returns:** None
* **Error states:** None

### `RemoveFromOwner(wholestack, keepoverstacked)`
* **Description:** Removes item from owner's inventory or container.
* **Parameters:**
  - `wholestack` -- boolean whether to remove entire stack
  - `keepoverstacked` -- boolean whether to keep overstacked items
* **Returns:** removed item entity, or `nil` if no owner
* **Error states:** None (returns nil if owner lacks required components - guarded by conditional checks)

### `OnRemoveEntity()`
* **Description:** Called when entity is being removed. Cleans up owner references and pushes forget event.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetGrandOwner()`
* **Description:** Recursively finds the ultimate owner of nested inventory items.
* **Parameters:** None
* **Returns:** entity -- the grand owner, or `nil` if no owner chain
* **Error states:** None (returns owner if no inventoryitem component - guarded by conditional check)

### `IsSheltered()`
* **Description:** Checks if item is protected from rain by being held in waterproof inventory.
* **Parameters:** None
* **Returns:** boolean -- true if held and in waterproof container/inventory
* **Error states:** None (returns false if owner lacks required components - safe OR/AND expression)

### `SetLanded(is_landed, should_poll_for_landing)`
* **Description:** Sets landed state and manages update polling. Pushes landed events when state changes.
* **Parameters:**
  - `is_landed` -- boolean whether item is on ground
  - `should_poll_for_landing` -- boolean whether to poll for landing state
* **Returns:** None
* **Error states:** None

### `ShouldSink()`
* **Description:** Checks if item should sink based on position and sink setting.
* **Parameters:** None
* **Returns:** boolean -- true if not held, not in limbo, and position is not passable
* **Error states:** None

### `TryToSink()`
* **Description:** Triggers sink task if entity should sink.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Update loop that checks velocity and position to determine landed state.
* **Parameters:** `dt` -- number delta time since last update
* **Returns:** None
* **Error states:** None

## Events & listeners
**Listens to:**
- `stacksizechange` -- triggers OnStackSizeChange to push stacksizechange event to owner
- `enterlimbo` -- triggers OnEnterLimbo to set landed state to false
- `exitlimbo` -- triggers OnExitLimbo to set landed state with scene return

**Pushes:**
- `onputininventory` -- fired in OnPutInInventory() with owner as data
- `ondropped` -- fired in OnDropped() with no data
- `onpickup` -- fired in OnPickup() with owner in data table
- `imagechange` -- fired in ChangeImageName() with no data
- `on_landed` -- fired in SetLanded() when transitioning to landed state
- `on_no_longer_landed` -- fired in SetLanded() when transitioning from landed state
- `stacksizechange` -- pushed to owner in OnStackSizeChange() with item and stack data
- `onownerputininventory` -- pushed to items in owner's container slots
- `onownerdropped` -- pushed to items in owner's container slots