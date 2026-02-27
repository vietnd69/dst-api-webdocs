---
id: inventoryitem
title: Inventoryitem
description: Manages an item's behavior within the inventory system, including ownership, placement, pickup/drop physics, moisture handling, and state synchronization to the client.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 3321113f
---

# Inventoryitem

## Overview
This component implements core inventory logic for entities, enabling them to be held, stored in containers, dropped, and tracked within inventories. It handles physics on drop, moisture inheritance and state (via the `inventoryitemmoisture` component), owner tracking, animation/sprite updates (via replica sync), and integration with other systems like waterproofer, burnable, and container logic. It also manages landing detection and sinking behavior.

## Dependencies & Tags
- Adds component `inventoryitemmoisture` automatically unless a `waterproofer` component is present.
- Listens to events: `stacksizechange`, `enterlimbo`, `exitlimbo`.
- Adds property callbacks for: `atlasname`, `imagename`, `owner`, `canbepickedup`, `cangoincontainer`, `canonlygoinpocket`, `canonlygoinpocketorpocketcontainers`, `isacidsizzling`, `grabbableoverridetag`.
- Uses `Physics` component for drop physics.
- Uses `Transform` component for position updates and landed checks.
- Interacts with `container`, `inventory`, `brain`, `burnable`, `waterproofer`, `rainimmunity`, `propagator`, and `health` components conditionally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` or `nil` | `nil` | Entity that currently holds this item (e.g., player or container). |
| `canbepickedup` | `boolean` | `true` | Whether the item can be picked up by any entity. |
| `canbepickedupalive` | `boolean` | `false` | Special flag for living/minion pickup (e.g., eyeplants). |
| `onpickupfn` | `function` or `nil` | `nil` | Custom callback invoked when item is picked up. |
| `isnew` | `boolean` | `true` | True if the item has never been collected by a player. |
| `nobounce` | `boolean` | `false` | If true, item lands immediately without bounce animation. |
| `cangoincontainer` | `boolean` | `true` | Whether the item can be placed in containers. |
| `canonlygoinpocket` | `boolean` | `false` | Restricts the item to pockets only; mutually exclusive with `canonlygoinpocketorpocketcontainers`. |
| `canonlygoinpocketorpocketcontainers` | `boolean` | `false` | Restricts to pockets *and* containers that also enforce pocket-only; mutually exclusive with `canonlygoinpocket`. |
| `keepondeath` | `boolean` | `false` | Whether the item remains on the ground after player death (not settable via constructor but used in logic). |
| `atlasname` | `string` or `nil` | `nil` | Name of the sprite atlas used for rendering. |
| `imagename` | `string` or `nil` | `nil` | Name of the image within the atlas. |
| `trappable` | `boolean` | `true` | Whether the item can be trapped (e.g., by trapdoor). |
| `sinks` | `boolean` | `false` | Whether the item sinks in deep water. |
| `droprandomdir` | `boolean` | `false` | If true, item is dropped with a random directional velocity. |
| `isacidsizzling` | `boolean` | `false` | Whether the item is currently sizzling due to acid. |
| `grabbableoverridetag` | `string` or `nil` | `nil` | Custom tag override for grabbability. |
| `pushlandedevents` | `boolean` | `true` | Controls whether `on_landed` and `on_no_longer_landed` events are pushed. |
| `is_landed` | `boolean` | `false` (initially) | Internal state tracking whether the item is physically resting on the ground. |

## Main Functions

### `InventoryItem:SetOwner(owner)`
* **Description:** Assigns an entity as the owner of this item. Updates the replica to sync the owner to clients.
* **Parameters:**  
  `owner` (`Entity` or `nil`) — The entity taking ownership; `nil` clears ownership.

### `InventoryItem:ClearOwner()`
* **Description:** Clears the current owner, effectively unlinking the item from its container or holder.
* **Parameters:** None.

### `InventoryItem:OnPickup(pickupguy, src_pos)`
* **Description:** Handles item pickup logic, including health damage if smoldering, stat tracking for new items, and calling custom pickup callbacks. Returns a value indicating if the item should be given to the picker-upper.
* **Parameters:**  
  `pickupguy` (`Entity`) — The entity performing the pickup.  
  `src_pos` (`table`, optional) — Position data (used by container logic).

### `InventoryItem:OnDropped(randomdir, speedmult)`
* **Description:** Drops the item from its current owner, triggers physics (bounce, velocity), calls `ondropfn`, pushes events, and handles child containers' events.
* **Parameters:**  
  `randomdir` (`boolean`) — Whether to apply random direction to velocity.  
  `speedmult` (`number`, optional) — Multiplier for drop speed.

### `InventoryItem:DoDropPhysics(x, y, z, randomdir, speedmult)`
* **Description:** Applies physics velocity and position for item drop based on parameters and `nobounce`/`sinks` settings.
* **Parameters:**  
  `x`, `y`, `z` (`number`) — World position to start the drop from.  
  `randomdir` (`boolean`) — Whether to randomize horizontal velocity.  
  `speedmult` (`number`, optional) — Speed multiplier.

### `InventoryItem:OnPutInInventory(owner)`
* **Description:** Moves the item into a new owner’s inventory or container (e.g., from world to player or chest). Removes from scene, localizes transform,Hibernate living item, and pushes `onputininventory`.
* **Parameters:**  
  `owner` (`Entity`) — The entity receiving the item.

### `InventoryItem:OnRemoved()`
* **Description:** Called when item leaves an owner’s inventory/container. Returns the item to the scene and wakes living items.

### `InventoryItem:RemoveFromOwner(wholestack, keepoverstacked)`
* **Description:** Removes this item from its owner’s inventory or container. Delegates to the appropriate container’s remove function.
* **Parameters:**  
  `wholestack` (`boolean`) — Whether to remove the whole stack.  
  `keepoverstacked` (`boolean`) — Whether to keep the item even if it exceeds capacity.

### `InventoryItem:ChangeImageName(newname)`
* **Description:** Updates the item’s image name, updates the replica, and pushes `imagechange` event.
* **Parameters:**  
  `newname` (`string`) — New image identifier.

### `InventoryItem:SetSinks(should_sink)`
* **Description:** Updates the `sinks` flag and re-evaluates if the item should sink *now* if landed.
* **Parameters:**  
  `should_sink` (`boolean`) — New sinking behavior.

### `InventoryItem:GetSlotNum()`
* **Description:** Returns the slot index the item occupies in its owner’s inventory or container, or `nil` if not in one.
* **Parameters:** None.

### `InventoryItem:GetContainer()`
* **Description:** Returns the owner’s `container` or `inventory` component if owned, otherwise `nil`.
* **Parameters:** None.

### `InventoryItem:GetGrandOwner()`
* **Description:** Recursively finds the top-level owner (e.g., player) even if the item is inside nested containers (e.g., chest inside player inventory).
* **Parameters:** None.

### `InventoryItem:IsSheltered()`
* **Description:** Returns `true` if the item is held *and* protected from rain (inside container or waterproof inventory).
* **Parameters:** None.

### `InventoryItem:SetLanded(is_landed, should_poll_for_landing)`
* **Description:** Updates landed state, starts/stops physics polling, and optionally pushes `on_landed`/`on_no_longer_landed` events.
* **Parameters:**  
  `is_landed` (`boolean`) — Whether item is on the ground.  
  `should_poll_for_landing` (`boolean`) — Whether to start `OnUpdate` polling to detect landing.

### `InventoryItem:OnUpdate(dt)`
* **Description:** Physics polling function used during flight/drop to detect when the item lands (via position and velocity checks).
* **Parameters:**  
  `dt` (`number`) — Delta time.

### `InventoryItem:TryToSink()`
* **Description:** Checks if the item should sink and, if so, calls `SinkEntity` with a 0-tick delay.
* **Parameters:** None.

### `InventoryItem:ShouldSink()`
* **Description:** Returns `true` if the item is on the ground, not held, and on an impassable tile.
* **Parameters:** None.

### `InventoryItem:EnableMoisture(enable)`
* **Description:** Creates or removes the `inventoryitemmoisture` component based on whether the item should track moisture.
* **Parameters:**  
  `enable` (`boolean`) — If `true`, ensure `inventoryitemmoisture` exists; if `false`, remove it.

### `InventoryItem:GetMoisture()`
* **Description:** Returns current moisture value (0 if no moisture component).
* **Parameters:** None.

### `InventoryItem:GetMoisturePercent()`
* **Description:** Returns moisture as a fraction of `TUNING.MAX_WETNESS`.
* **Parameters:** None.

### `InventoryItem:IsWet()`
* **Description:** Returns `true` if moisture component reports the item is wet.
* **Parameters:** None.

### `InventoryItem:InheritMoisture(moisture, iswet)`
* **Description:** Copies moisture and wetness state from a reference item/source.
* **Parameters:**  
  `moisture` (`number`) — Moisture value to copy.  
  `iswet` (`boolean`) — Wetness state to copy.

### `InventoryItem:InheritWorldWetnessAtXZ(x, z)`
* **Description:** Sets item’s moisture to current world state *only if* not under a rain dome.
* **Parameters:**  
  `x`, `z` (`number`) — World coordinates to check.

### `InventoryItem:InheritWorldWetnessAtTarget(target)`
* **Description:** Sets item’s moisture to world state if the target has no rain immunity.
* **Parameters:**  
  `target` (`Entity`) — The target entity (e.g., player), used to check rain immunity.

### `InventoryItem:DiluteMoisture(item, count)`
* **Description:** Dilutes item’s moisture by mixing with `count` copies of another item (used for bucket-like interactions).
* **Parameters:**  
  `item` (`Entity`) — The item used for dilution.  
  `count` (`number`) — Number of dilution units.

### `InventoryItem:AddMoisture(delta)`
* **Description:** Adds/subtracts moisture using the moisture component.
* **Parameters:**  
  `delta` (`number`) — Change in moisture amount.

### `InventoryItem:MakeMoistureAtLeast(min)`
* **Description:** Increases item moisture if current moisture is below `min`.
* **Parameters:**  
  `min` (`number`) — Minimum moisture threshold.

### `InventoryItem:DryMoisture()`
* **Description:** Sets item moisture to zero (dry).
* **Parameters:** None.

### `InventoryItem:HibernateLivingItem()`
* **Description:** Hibernate the item’s brain and kill all sounds if it has them.
* **Parameters:** None.

### `InventoryItem:WakeLivingItem()`
* **Description:** Wake the item’s brain.
* **Parameters:** None.

## Events & Listeners
- Listens to `stacksizechange` → triggers `stacksizechange` event on owner (with item, positions, and stack sizes).
- Listens to `enterlimbo` → calls `SetLanded(false, false)`.
- Listens to `exitlimbo` → calls `SetLanded(false, true)`.
- Pushes events:
  - `on_landed`
  - `on_no_longer_landed`
  - `onpickup` (when picked up)
  - `ondropped` (when dropped)
  - `onputininventory` (when placed in inventory/container)
  - `stacksizechange` (when stack size changes in owner’s inventory)
  - `imagechange` (when image name changes)
  - `onownerputininventory`, `onownerdropped` (for items in nested containers)
  - `forgetinventoryitem` (via `TheWorld` on removal from entity)
  - `burnt` (if pickup causes smoldering damage)
  - `onremovedfrominventory` (indirect via `OnRemoved`)
  - `onputininventory` (for child items when parent container is put in inventory)
  - `onownerdropped` (for child items when parent container is dropped)
  - `onownerputininventory` (for child items when parent container is put in inventory)