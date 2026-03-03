---
id: inventoryitem
title: Inventoryitem
description: Manages item properties and behavior related to inventory interaction, moisture, physics, and owner relationships.
tags: [inventory, physics, moisture, pickup, components]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3321113f
system_scope: inventory
---

# Inventoryitem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Inventoryitem` provides core functionality for items that can be held, dropped, stored in containers, or wielded by entities. It handles physics for dropping, moisture state management (via integration with `inventoryitemmoisture`), owner tracking, animation state updates, and event callbacks for inventory lifecycle events such as pickup, drop, and storage placement. It works closely with `inventory`, `container`, `burnable`, `health`, `propagator`, `rainimmunity`, and `waterproofer` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst.components.inventoryitem:SetOwner(someowner)
inst.components.inventoryitem:SetSinks(false)
inst.components.inventoryitem:AddMoisture(0.5)
inst.components.inventoryitem:OnPickup(player, 1)
```

## Dependencies & tags
**Components used:** `inventory`, `container`, `burnable`, `health`, `inventoryitemmoisture`, `propagator`, `rainimmunity`, `waterproofer`, `brain`  
**Tags:** No tags are added, removed, or checked directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The entity currently holding or containing this item. |
| `canbepickedup` | boolean | `true` | Whether the item can be picked up by players or entities. |
| `canbepickedupalive` | boolean | `false` | Flag for minion pickup behavior (e.g., eyeplants); rarely used. |
| `onpickupfn` | function or `nil` | `nil` | Custom callback invoked when the item is picked up. |
| `isnew` | boolean | `true` | Indicates whether the item has been collected for the first time by a player. |
| `nobounce` | boolean | `false` | If true, the item lands immediately without bouncing. |
| `cangoincontainer` | boolean | `true` | Whether the item can be placed in containers. |
| `canonlygoinpocket` | boolean | `false` | If true, the item can only go into pocket-sized containers. Mutually exclusive with `canonlygoinpocketorpocketcontainers`. |
| `canonlygoinpocketorpocketcontainers` | boolean | `false` | If true, the item can only go into pockets or containers that also support only-pockets. Mutually exclusive with `canonlygoinpocket`. |
| `keepondeath` | boolean | `false` | (Declared but not used in current codebase.) |
| `atlasname` | string or `nil` | `nil` | Custom texture atlas name for rendering. |
| `imagename` | string or `nil` | `nil` | Custom image name for rendering. |
| `trappable` | boolean | `true` | Whether the item can be trapped (e.g., by tentacles or vines). |
| `sinks` | boolean | `false` | Whether the item sinks in water or mud. |
| `droprandomdir` | boolean | `false` | Whether the item drops in a random horizontal direction. |
| `isacidsizzling` | boolean | `false` | Whether the item is currently being damaged by acid rain. |
| `grabbableoverridetag` | string or `nil` | `nil` | Override tag used for item grab logic. |
| `pushlandedevents` | boolean | `true` | Controls whether `on_landed` and `on_no_longer_landed` events are pushed. |
| `is_landed` | boolean | `false` | Internal state indicating whether the item is on the ground. |

## Main functions
### `EnableMoisture(enable)`
*   **Description:** Enables or disables moisture tracking for the item by adding or removing the `inventoryitemmoisture` component.
*   **Parameters:** `enable` (boolean) – `true` to enable moisture tracking, `false` to remove the component.
*   **Returns:** Nothing.

### `GetMoisture()`
*   **Description:** Returns the item's current moisture value.
*   **Parameters:** None.
*   **Returns:** number – moisture level between `0` and `TUNING.MAX_WETNESS`, or `0` if `inventoryitemmoisture` component is not present.

### `GetMoisturePercent()`
*   **Description:** Returns the item’s moisture as a normalized percentage (`0.0` to `1.0`).
*   **Parameters:** None.
*   **Returns:** number – moisture percentage, or `0` if `inventoryitemmoisture` is not present.

### `IsWet()`
*   **Description:** Returns whether the item is considered "wet" based on thresholds defined in `TUNING`.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if `iswet` is set, otherwise `false`.

### `IsAcidSizzling()`
*   **Description:** Returns whether the item is currently sizzling from acid rain, via the network-replica.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if acid sizzling is active.

### `InheritMoisture(moisture, iswet)`
*   **Description:** Sets the item's moisture state to match the provided moisture level and wetness flag. Uses `TUNING` thresholds to determine `iswet`.
*   **Parameters:** `moisture` (number) – target moisture value; `iswet` (boolean) – whether the source is considered wet.
*   **Returns:** Nothing.

### `InheritWorldWetnessAtXZ(x, z)`
*   **Description:** Inherits world moisture state at a world XZ coordinate if the item is not under a rain dome.
*   **Parameters:** `x` (number) – world X coordinate; `z` (number) – world Z coordinate.
*   **Returns:** Nothing.

### `InheritWorldWetnessAtTarget(target)`
*   **Description:** Inherits world moisture state from `TheWorld.state` to the item if the target entity does not have rain immunity.
*   **Parameters:** `target` (entity) – entity to check for `rainimmunity`.
*   **Returns:** Nothing.

### `DiluteMoisture(item, count)`
*   **Description:** Dilutes this item's moisture by mixing in moisture from another item (e.g., when combining wet items in a stack).
*   **Parameters:** `item` (entity) – item to borrow moisture from; `count` (number) – number of items to dilute.
*   **Returns:** Nothing.

### `AddMoisture(delta)`
*   **Description:** Increases or decreases moisture by the specified delta.
*   **Parameters:** `delta` (number) – amount to change moisture by (positive = wetter, negative = drier).
*   **Returns:** Nothing.

### `MakeMoistureAtLeast(min)`
*   **Description:** Ensures this item has at least `min` moisture.
*   **Parameters:** `min` (number) – minimum moisture level to enforce.
*   **Returns:** Nothing.

### `DryMoisture()`
*   **Description:** Sets the item's moisture to `0`, effectively drying it.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOwner(owner)`
*   **Description:** Sets the item’s owner (entity holding or containing it).
*   **Parameters:** `owner` (entity or `nil`) – the new owner.
*   **Returns:** Nothing.

### `ClearOwner()`
*   **Description:** Clears the item’s owner reference.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOnDroppedFn(fn)`
*   **Description:** Registers a callback function to be invoked when the item is dropped.
*   **Parameters:** `fn` (function) – callback with signature `fn(item)`.
*   **Returns:** Nothing.

### `SetOnPickupFn(fn)`
*   **Description:** Registers a callback function to be invoked when the item is picked up.
*   **Parameters:** `fn` (function) – callback with signature `fn(item, pickupguy, src_pos)`.
*   **Returns:** Nothing.

### `SetSinks(should_sink)`
*   **Description:** Sets whether the item should sink in water/mud. May re-check immediate sinking if already landed.
*   **Parameters:** `should_sink` (boolean) – sink behavior flag.
*   **Returns:** Nothing.

### `GetSlotNum()`
*   **Description:** Returns the slot index of this item in its owner’s container or inventory.
*   **Parameters:** None.
*   **Returns:** number or `nil` – slot number, or `nil` if not in container/inventory or owner missing.

### `GetContainer()`
*   **Description:** Returns the container or inventory component that owns this item.
*   **Parameters:** None.
*   **Returns:** container or inventory component, or `nil` if no owner.

### `HibernateLivingItem()`
*   **Description:** Deactivates the item’s brain (if present) and stops all sounds to save resources while stored.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `WakeLivingItem()`
*   **Description:** Reactivates the item’s brain (if present) when removed from storage.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnPutInInventory(owner)`
*   **Description:** Called when the item is placed into an inventory or container. Handles ownership, scene removal, and local transform resetting.
*   **Parameters:** `owner` (entity) – entity receiving the item.
*   **Returns:** Nothing.

### `OnRemoved()`
*   **Description:** Called when the item is removed from its owner (but not yet dropped). Restores scene presence and reactivates brain/sounds.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDropped(randomdir, speedmult)`
*   **Description:** Initiates physics-based drop, triggers cleanup, and fires drop events. If item is in a container, it propagates drop events to nested items.
*   **Parameters:** `randomdir` (boolean) – whether to randomize drop direction; `speedmult` (number) – velocity multiplier.
*   **Returns:** Nothing.

### `DoDropPhysics(x, y, z, randomdir, speedmult)`
*   **Description:** Applies physics or transform updates to simulate dropping the item.
*   **Parameters:** `x`, `y`, `z` (numbers) – world position of drop origin; `randomdir` (boolean) – randomize direction; `speedmult` (number) – velocity scale.
*   **Returns:** Nothing.

### `OnPickup(pickupguy, src_pos)`
*   **Description:** Handles pickup logic: clears landing, checks for smoldering, applies fire damage on pickup if applicable, and triggers callbacks. Returns early result if `onpickupfn` returns `true`.
*   **Parameters:** `pickupguy` (entity) – entity picking up the item; `src_pos` (number or table) – source position data.
*   **Returns:** boolean or `nil` – `true` if pickup should be canceled (e.g., by custom logic), otherwise `nil`.

### `IsHeld()`
*   **Description:** Returns whether the item has an owner (i.e., is held or stored).
*   **Parameters:** None.
*   **Returns:** boolean – `true` if `owner ~= nil`.

### `IsHeldBy(guy)`
*   **Description:** Returns whether the item is held by a specific entity.
*   **Parameters:** `guy` (entity) – entity to compare against owner.
*   **Returns:** boolean – `true` if `owner == guy`.

### `ChangeImageName(newname)`
*   **Description:** Updates the item’s image name and fires an `imagechange` event.
*   **Parameters:** `newname` (string) – new image name.
*   **Returns:** Nothing.

### `RemoveFromOwner(wholestack, keepoverstacked)`
*   **Description:** Removes the item from its owner’s inventory or container.
*   **Parameters:** `wholestack` (boolean) – remove entire stack; `keepoverstacked` (boolean) – allow overstacking.
*   **Returns:** item (the removed entity) or `nil`.

### `GetGrandOwner()`
*   **Description:** Traverses nested item owners (e.g., an item inside a container inside a backpack) to find the top-level owner.
*   **Parameters:** None.
*   **Returns:** entity – top-level owner, or `nil` if no owner.

### `IsSheltered()`
*   **Description:** Returns whether the item is protected from weather (i.e., held by an entity with waterproof inventory or stored inside a container).
*   **Parameters:** None.
*   **Returns:** boolean – `true` if sheltered.

### `SetLanded(is_landed, should_poll_for_landing)`
*   **Description:** Updates the `is_landed` state and toggles physics polling accordingly. Pushes `on_landed` or `on_no_longer_landed` events if `pushlandedevents` is true.
*   **Parameters:** `is_landed` (boolean) – new landed state; `should_poll_for_landing` (boolean) – whether to start/stop physics polling.
*   **Returns:** Nothing.

### `ShouldSink()`
*   **Description:** Checks if the item should sink based on its position and `sinks` flag.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if sink conditions are met.

### `TryToSink()`
*   **Description:** Attempts to sink the item if `ShouldEntitySink` returns true.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Physics polling callback used to detect when a dropped item has landed and update the `is_landed` state accordingly.
*   **Parameters:** `dt` (number) – time since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `stacksizechange` – notifies owner when stack size changes.  
  - `enterlimbo` – clears landed state when item enters limbo.  
  - `exitlimbo` – clears landed state on exit (but not fully landed).
- **Pushes:**  
  - `on_no_longer_landed` – fired when item transitions from landed to airborne.  
  - `on_landed` – fired when item transitions from airborne to landed.  
  - `ondropped` – fired after drop logic completes.  
  - `onpickup` – fired after pickup logic begins.  
  - `onputininventory` – fired after placing item in inventory/container.  
  - `imagechange` – fired when image name is updated.  
  - `stacksizechange` – propagated to owner when stack size changes (via `OnStackSizeChange`).  
  - `onownerdropped`, `onownerputininventory` – propagated to child items in containers.
