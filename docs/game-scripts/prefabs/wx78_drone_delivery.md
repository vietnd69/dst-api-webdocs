---
id: wx78_drone_delivery
title: Wx78 Drone Delivery
description: Spawnable delivery drone structure for WX-78 that transports items between map locations, with flying animations, shadow effects, and skill-gated usage.
tags: [prefab, wx78, delivery, structure]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 645b1dc3
system_scope: entity
---

# Wx78 Drone Delivery

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_drone_delivery.lua` registers a deployable delivery drone structure and related prefabs for the WX-78 character. The prefab uses a factory function `MakeDrone()` to create multiple drone variants with different inventory sizes. The drone attaches `mapdeliverable` for point-to-point item transport, `container` for storage, and `globaltrackingicon` for map visibility. Client-side logic handles shadow rendering and network state synchronization via netvars; master-side logic manages delivery progression, animations, and component callbacks. The file returns 5 prefabs per drone variant: the drone itself, global icon, revealable icon, deployable kit item, and placer.

## Usage example
```lua
-- Spawn the drone directly:
local inst = SpawnPrefab("wx78_drone_delivery")
inst.Transform:SetPosition(10, 0, 10)

-- Or deploy via kit item (typical player workflow):
-- Kit item is deployed via player inventory right-click (deployable component configured in MakeDeployableKitItem)
local kit = SpawnPrefab("wx78_drone_delivery_item")
-- Player right-clicks kit in inventory to deploy at target location

-- Check delivery state:
if inst.components.mapdeliverable:IsDelivering() then
    -- Drone is in transit
end

-- Access container slots (3x2 for standard, 3x1 for small):
local container = inst.components.container
```

## Dependencies & tags
**External dependencies:**
- `easing` -- animation interpolation for shadow sizing and movement lerping
- `IsFlyingPermittedFromPointToPoint` -- validates flight path between two points; stops delivery if path is blocked
- `MakeGlobalTrackingIcons` -- creates map tracking icon prefabs
- `MakeDeployableKitItem` -- creates the deployable kit item prefab
- `MakePlacer` -- creates the placement preview prefab
- `MakeInventoryFloatable` -- applies floating physics for inventory form

**Components used:**
- `container` -- item storage with open/close animations and widget setup
- `mapdeliverable` -- handles delivery timing, progress, and map action routing
- `globaltrackingicon` -- shows drone location on map for the sender
- `workable` -- enables hammering to dismantle or hit reactions
- `portablestructure` -- enables dismantling back to kit item form
- `spawnfader` -- fade in/out during takeoff and landing
- `inspectable` -- allows player inspection text
- `updatelooper` -- drives shadow animation updates during flight
- `floater` -- tracks landed/floating state for splash effects
- `inventoryitem` -- inherits wetness when converted to kit form

**Tags:**
- `structure` -- added when landed/interactable; removed when flying
- `chest` -- marks as container-type structure
- `staysthroughvirtualrooms` -- persists through room transitions
- `CLASSIFIED` -- added when flying; hides from other players
- `NOCLICK` -- prevents interaction during flight or fade
- `flying` -- indicates airborne state for targeting exclusion
- `outofreach` -- prevents player interaction during delivery

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `showflyingshadow` | net_bool | `false` | Dirty event: `showflyingshadowdirty`. Controls whether flying shadow entity is spawned. Synced to clients. |
| `isempty` | net_bool | `true` | Tracks whether container has any items. No dirty event (2-param net_bool declaration). Checked via :value() for client-safe action validation. |
| `candismantle` | function | `CanDismantle` | Client-safe check for dismantle action availability. Requires empty container and `batteryuser` tag. |
| `canmapdeliver` | function | `CanMapDeliver` | Client-safe check for map delivery action availability. Requires non-empty container and `batteryuser` tag. |
| `bufferedmapaction_icondata` | table | `{icon = name.."_selected"}` | Icon data for buffered map action UI display. |
| `_sender` | entity | `nil` | (master only) Player entity who initiated the current delivery. Cleared on landing. |
| `_senderid` | string | `nil` | (master only) User ID of sender for save/load persistence. Resolved to entity on load. |
| `_lockedforuser` | entity | `nil` | (master only) Player currently locked to this drone (prevents others from using). |
| `_nointeract` | boolean | `nil` | (master only) When set, blocks all interaction (used during delivery). |
| `_skipcloseanim` | boolean | `nil` | (master only) Skips close animation when true (used during forced close on lock). |
| `_onremovelockedforuser` | function | `nil` | (master only) Callback registered on locked user's onremove event; auto-unlocks drone if user disconnects. |
| `_splashtask` | task | `nil` | (master only) Scheduled task for splash effect on container close. |
| `shadow` | entity | `nil` | (master only) Shadow entity spawned during flight for visual ground marker. |
| `TUNING.SKILLS.WX78.DELIVERYDRONE_SPEED` | constant | --- | Speed constant used in `CalcDeliveryTime` for delivery duration calculation. |
| `LIFTOFF_TIME` | constant (local) | `2.5` | Seconds spent in takeoff animation before horizontal movement begins. |
| `FADE_TIME` | constant (local) | `1` | Duration of spawnfader fade during takeoff/landing transitions. |

## Main functions
### `fn()`
* **Description:** Client-side prefab constructor. Creates the entity, attaches core components (transform, anim, sound, minimap, network), sets initial animation and tags, declares netvars, and branches to master-only initialization. On client, registers dirty event listener for `showflyingshadowdirty` and returns early. On master, attaches gameplay components and event listeners.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — engine guarantees valid entity creation.



### `OnSave(inst, data)`
* **Description:** Persists the sender's user ID to save data if a delivery is in progress. Allows delivery state to resume after world reload.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table to populate with save state
* **Returns:** None
* **Error states:** None — gracefully handles nil sender.

### `OnLoad(inst, data)`
* **Description:** Restores sender ID from save data and attempts to resolve to active player entity. If sender cannot be found, clears sender reference. Only runs if delivery is still in progress.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- saved state table
* **Returns:** None
* **Error states:** None — gracefully handles missing data or invalid sender.

### `OnLoadPostPass(inst)`
* **Description:** Called after all entities are loaded. If drone is not currently delivering, pushes `on_landed` event to ensure proper state initialization (interactable, tracking stopped).
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnShowFlyingShadowDirty(inst)` (local)
* **Description:** Property watcher callback for `showflyingshadow` netvar dirty event. Spawns shadow entity when value is true; removes shadow when false. Runs on client to sync visual state.
* **Parameters:** `inst` -- entity instance (shadow parent)
* **Returns:** None
* **Error states:** None.

### `ShowFlyingShadow(inst, show)` (local)
* **Description:** Sets the `showflyingshadow` netvar and triggers immediate update on non-dedicated servers. Ensures shadow visibility matches flight state.
* **Parameters:**
  - `inst` -- entity instance
  - `show` -- boolean to show or hide shadow
* **Returns:** None
* **Error states:** None.

### `SetFlying(inst, flying)` (local)
* **Description:** Toggles flight-related tags on the drone. When flying: removes `structure`, adds `CLASSIFIED`, `NOCLICK`, `flying`, `outofreach`. When landed: reverses these changes. Controls interaction availability and targeting.
* **Parameters:**
  - `inst` -- entity instance
  - `flying` -- boolean flight state
* **Returns:** None
* **Error states:** None.

### `SetInteractable(inst, enable)` (local)
* **Description:** Enables or disables player interaction with the drone. When disabled: closes container, sets `canbeopened` to false, marks workable as false. When enabled: sets workable with 2 work left, allows container open.
* **Parameters:**
  - `inst` -- entity instance
  - `enable` -- boolean interaction state
* **Returns:** None
* **Error states:** Errors if `container` or `workable` component is missing (not guarded in source).

### `SetLockedForUser(inst, user)` (local)
* **Description:** Locks the drone to a specific player, preventing others from using it. Cancels any pending map action. Registers `onremove` event on the user to auto-unlock if they disconnect. Closes container if locking.
* **Parameters:**
  - `inst` -- entity instance
  - `user` -- player entity or nil to unlock
* **Returns:** None
* **Error states:** Errors if `mapdeliverable` or `container` component is missing (not guarded in source).

### `CalcDeliveryTime(inst, dest, doer)` (local)
* **Description:** Calculates total delivery duration based on distance to destination. Includes `LIFTOFF_TIME` (2.5s) plus travel time. Travel uses acceleration/deceleration distance threshold from `TUNING.SKILLS.WX78.DELIVERYDRONE_SPEED`.
* **Parameters:**
  - `inst` -- entity instance
  - `dest` -- table with `x`, `z` destination coordinates
  - `doer` -- player entity (unused in calculation)
* **Returns:** number -- total delivery time in seconds
* **Error states:** Errors if `inst.Transform` is nil (not guarded in source).

### `OnStartDelivery(inst, dest, doer)` (local)
* **Description:** Called when delivery begins. Sets flying state, disables interaction, shows flying shadow, starts global tracking, plays takeoff animation and sound. Returns false if interaction is blocked.
* **Parameters:**
  - `inst` -- entity instance
  - `dest` -- destination coordinates (unused)
  - `doer` -- player who initiated delivery
* **Returns:** boolean -- `true` if delivery started, `false` if blocked
* **Error states:** Errors if any component (globaltrackingicon, spawnfader, SoundEmitter) is missing (not guarded in source).

### `ChangeSender(inst, sender)` (local)
* **Description:** Updates the sender reference and restarts global tracking for the new sender. Used when sender reconnects or changes during load.
* **Parameters:**
  - `inst` -- entity instance
  - `sender` -- new player entity or nil
* **Returns:** None
* **Error states:** Errors if `globaltrackingicon` component is missing (not guarded in source).

### `CheckSender(inst)` (local)
* **Description:** Attempts to resolve `_senderid` to an active player entity from `AllPlayers`. If found, clears `_senderid` and calls `ChangeSender`. Returns true if sender was resolved.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean -- true if sender was found and updated
* **Error states:** None — gracefully handles missing sender ID.

### `OnDeliveryProgress(inst, t, len, origin, dest)` (local)
* **Description:** Called every frame during delivery by mapdeliverable component. Handles takeoff phase (hiding entity, fading out), horizontal movement phase (lerping position with easing), and landing preparation. Checks flight path validity; stops delivery if path is blocked. Calls `CheckSender` each frame to maintain sender reference.
* **Parameters:**
  - `inst` -- entity instance
  - `t` -- current delivery time in seconds
  - `len` -- total delivery duration in seconds
  - `origin` -- table with `x`, `z` starting coordinates
  - `dest` -- table with `x`, `z` destination coordinates
* **Returns:** None
* **Error states:** Errors if any component (floater, spawnfader, mapdeliverable, Transform) is missing (not guarded in source). Uses `IsFlyingPermittedFromPointToPoint` which may fail silently if world state is invalid.

### `OnSpawnFaderIn(inst)` (local)
* **Description:** Event callback for `spawnfaderin`. Re-adds `NOCLICK` tag if entity is classified (flying), since spawnfader removes it after fade completes.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnLanded(inst)` (local)
* **Description:** Event callback for `animover` or `entitysleep` during landing. Plays post-landing animation, sets landed state, hides shadow, pushes `on_landed` event, plays sound. If animation is not "land", transitions to idle, stops tracking, reveals entity to sender's map, and clears sender reference.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if any component (globaltrackingicon, SoundEmitter, AnimState) is missing (not guarded in source).

### `OnStopDelivery(inst)` (local)
* **Description:** Called when delivery is cancelled or interrupted. Shows shadow, reveals entity, fades in, plays landing animation, registers landing event listeners, plays pre-landing sound.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if any component (spawnfader, AnimState, SoundEmitter) is missing (not guarded in source).

### `CancelQueuedSplash(inst)` (local)
* **Description:** Cancels any pending splash effect task. Prevents duplicate splash spawns.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `TrySplash(inst)` (local)
* **Description:** Spawns a splash prefab at the drone's position if not asleep and floating. Used for visual feedback on water during container interactions.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.floater` is nil (no nil guard before IsFloating() call).

### `QueueSplash(inst, delay)` (local)
* **Description:** Schedules a splash effect after the specified delay. Cancels any existing queued splash first.
* **Parameters:**
  - `inst` -- entity instance
  - `delay` -- time in seconds before splash spawns
* **Returns:** None
* **Error states:** None.

### `OnOpen(inst)` (local)
* **Description:** Container open callback. Plays open animation, plays sound, triggers immediate splash effect.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `AnimState` or `SoundEmitter` is missing (not guarded in source).

### `OnClose(inst)` (local)
* **Description:** Container close callback. Plays close sound. If skip animation flag is set, cancels splash and returns early. Otherwise plays close animation and queues splash after 10 frames.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `SoundEmitter` or `AnimState` is missing (not guarded in source).

### `OnBuilt2(inst)` (local)
* **Description:** Secondary build callback. Removes itself from `animover` event, enables interaction, plays idle animation. Called after initial deploy animation completes.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnBuilt(inst)` (local)
* **Description:** Initial build callback. Disables interaction, plays deploy animation, plays sound, schedules `on_landed` event after 8 frames, registers for `animover` to call `OnBuilt2`.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `AnimState` or `SoundEmitter` is missing (not guarded in source).

### `ChangeToItem(inst, fast)` (local)
* **Description:** Converts the drone structure back to a kit item prefab. Drops all container contents, spawns the item prefab at the same position, plays collapse animation, inherits wetness, sets landed state, spawns splash, removes the drone entity. If `fast` is true, skips to frame 8 of collapse animation.
* **Parameters:**
  - `inst` -- entity instance
  - `fast` -- boolean to skip animation frames
* **Returns:** None
* **Error states:** Errors if `container`, `inventoryitem`, or `Transform` components are missing (not guarded in source).

### `OnDismantle(inst)` (local)
* **Description:** Portablestructure dismantle callback. Calls `ChangeToItem` with `fast = false` for normal dismantle speed.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnHit(inst, worker, workleft, numworks)` (local)
* **Description:** Workable work callback (hammer hit). If not marked `NOCLICK`, closes container, drops contents, plays hit animation, queues splash.
* **Parameters:**
  - `inst` -- entity instance
  - `worker` -- player entity performing the work
  - `workleft` -- remaining work units
  - `numworks` -- work done in this hit
* **Returns:** None
* **Error states:** Errors if `container` or `AnimState` is missing (not guarded in source).

### `OnHammered(inst, worker)` (local)
* **Description:** Workable finish callback (hammer destroy). If not marked `NOCLICK`, calls `ChangeToItem` with `fast = true` for instant conversion.
* **Parameters:**
  - `inst` -- entity instance
  - `worker` -- player entity performing the work
* **Returns:** None
* **Error states:** None.

### `CheckEmpty(inst)` (local)
* **Description:** Event callback for `itemget` and `itemlose`. Updates the `isempty` netvar based on container state.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `container` component is missing (not guarded in source).

### `CanDismantle(inst, doer)` (local)
* **Description:** Client-safe action availability check for dismantling. Returns false if container is not empty or doer lacks `batteryuser` tag. Checks replica container for openable state.
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- player entity attempting the action
* **Returns:** boolean -- true if dismantle is allowed
* **Error states:** None — gracefully handles missing components via replica check.

### `CanMapDeliver(inst, doer)` (local)
* **Description:** Client-safe action availability check for map delivery. Returns true if container is not empty and doer has `batteryuser` tag. Does not check if drone is busy (allows fail strings to trigger).
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- player entity attempting the action
* **Returns:** boolean -- true if delivery action is available
* **Error states:** None.

### `OnCancelMapAction(inst, doer)` (local)
* **Description:** Mapdeliverable cancel callback. Pushes `interruptcontinuousaction` event to the doer if present.
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- player entity who cancelled
* **Returns:** None
* **Error states:** None.

### `OnStopContinuousAction(inst, doer)` (local)
* **Description:** Event callback for `stopcontinuousaction`. Unlocks the drone if the stopping player is the locked user.
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- player entity who stopped the action
* **Returns:** None
* **Error states:** None.

### `OnStartMapAction(inst, doer)` (local)
* **Description:** Mapdeliverable start callback. Validates skill requirement, lock state, container state, and empty state. Locks drone to user if all checks pass. Returns false with error string on failure.
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- player entity attempting the action
* **Returns:** boolean or tuple -- `true` on success; `false` alone when doer nil or `_nointeract` set; `false, "NOSKILL_DRONE"` when skill missing; `false, "INUSE"` when locked or opened by others; `false, "EMPTY"` when container empty
* **Error states:** Errors if `skilltreeupdater` or `container` component is missing (not guarded in source).

### `MakeDrone(name, numcols, numrows, required_skill)` (local)
* **Description:** Factory function that creates a drone prefab and related prefabs (globalicon, revealableicon, kit item, placer). Inserts all into the `ret` table for final return. Called twice at file scope for standard and small variants.
* **Parameters:**
  - `name` -- string prefab name
  - `numcols` -- number of container columns
  - `numrows` -- number of container rows
  - `required_skill` -- string skill ID required to use this drone
* **Returns:** None (populates `ret` table)
* **Error states:** Errors if any prefab factory function fails (engine guarantees availability).

## Events & listeners
**Listens to:**
- `itemget` -- triggers `CheckEmpty`; updates `isempty` netvar when item added to container
- `itemlose` -- triggers `CheckEmpty`; updates `isempty` netvar when item removed from container
- `onbuilt` -- triggers `OnBuilt`; starts deploy animation sequence
- `spawnfaderin` -- triggers `OnSpawnFaderIn`; re-adds `NOCLICK` tag after fade completes
- `spawnfaderout` -- triggers `inst.Hide`; hides entity during takeoff fade
- `stopcontinuousaction` -- triggers `OnStopContinuousAction`; unlocks drone if action stopped by locked user
- `animover` -- triggers `OnLanded` or `OnBuilt2`; completes animation transitions
- `entitysleep` -- triggers `OnLanded`; handles landing when entity goes to sleep
- `onremove` -- triggers `_onremovelockedforuser`; unlocks drone if locked user disconnects
- `showflyingshadowdirty` (client only) -- triggers `OnShowFlyingShadowDirty`; syncs shadow visibility

**Pushes:**
- `on_no_longer_landed` -- fired during takeoff when drone leaves ground; used by floater component
- `on_landed` -- fired when delivery completes; transitions to interactable state
- `interruptcontinuousaction` -- pushed to doer when map action is cancelled

**World state watchers:**
- None identified