---
id: inventoryitem_replica
title: InventoryItem Replica
description: Master component that manages inventory item state. Declares netvars for network synchronization, creates classified entity on master for UI state, attaches existing classified on client. Handles pickup restrictions, deploy logic, moisture, wetness, and image overrides.
tags: [inventory, network, component]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: component
source_hash: e8fc3023
system_scope: network
---

# InventoryItem

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`InventoryItem` is the master component that manages inventory item state. Declares netvars for network synchronization, creates classified entity on master for UI state, attaches existing classified on client. Handles pickup restrictions, deploy logic, moisture, wetness, and image overrides. Uses classified entity pattern for network optimization - item UI state is stored in a separate classified entity parented to the item, reducing bandwidth by only syncing relevant fields. Constructor behavior differs based on `TheWorld.ismastersim` - master spawns classified entity and registers listeners, client attaches existing classified.

## Usage example
```lua
-- Read item state (safe on both client and master):
if inst.components.inventoryitem ~= nil then
    local isWet = inst.components.inventoryitem:IsWet()
    local deployMode = inst.components.inventoryitem:GetDeployMode()
    local attackRange = inst.components.inventoryitem:AttackRange()
end

-- Modify item state (netvar setters work on both sides):
inst.components.inventoryitem:SetIsWet(true)
inst.components.inventoryitem:SetDeployMode(DEPLOYMODE.DEFAULT)
inst.components.inventoryitem:SetAttackRange(2)
inst.components.inventoryitem:CanBePickedUp(doer)
```

## Dependencies & tags
**External dependencies:**
- `TheWorld.ismastersim` -- gates master-only initialization and logic
- `SpawnPrefab` -- creates classified entity on master
- `DEPLOYMODE` -- deploy mode constants
- `DEPLOYSPACING_RADIUS` -- spacing radius lookup table
- `TUNING.MAX_WETNESS` -- moisture percentage calculation

**Components used:**
- `deployable` -- reads mode, spacing, restrictedtag on master; mirrors to classified
- `weapon` -- reads attackrange on master; mirrors to classified
- `equippable` -- reads walkspeedmult, restrictedtag on master; mirrors to classified
- `saddler` -- reads speedmult on master (alternative to equippable)
- `armor` -- reads GetPercent() for usage serialization
- `finiteuses` -- reads GetPercent() for usage serialization
- `fueled` -- reads GetPercent() for usage serialization
- `perishable` -- reads GetPercent() for perish serialization
- `rechargeable` -- reads GetPercent()/GetRechargeTime() for recharge serialization
- `inventoryitemmoisture` -- reads moisture value on master
- `container` -- reads opencount, openlist for owner determination
- `replica.inventory` -- accessed via deployer.replica.inventory on client for holding checks (not inst.components)
- `replica.rider` -- accessed via deployer.replica.rider on client for riding checks (not inst.components)
- `replica.equippable` -- accessed via deployer.replica.equippable on client for equip checks (not inst.components)

**Tags:**
- `spider` -- checked in CanBePickedUp(); blocks pickup unless doer has "spiderwhisperer"
- `spiderwhisperer` -- allows spider-tagged entities to be picked up
- `complexprojectile` -- required for deploy while riding
- `boatbuilder` -- required for deploy while floating

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cannotbepickedup` | net_bool | --- | Mirrors pickup restriction state. Read via `CanBePickedUp()`. |
| `_iswet` | net_bool | --- | Mirrors wet status. Dirty event: `iswetdirty`. Pushes `wetnesschange` on change. |
| `_isacidsizzling` | net_bool | --- | Mirrors acid sizzling status. Dirty event: `isacidsizzlingdirty`. Pushes `acidsizzlingchange` on change. |
| `_grabbableoverridetag` | net_hash | --- | Override tag for grab restrictions. Read in `CanBePickedUp()`. |
| `classified` | entity | `nil` | Classified entity for networked state. Created on master via SpawnPrefab. On client, attached via AttachClassified() from inst.inventoryitem_classified. |
| `overrideimage` | string | `nil` | Local image override (not networked). Set via `OverrideImage()`. |
| `ondetachclassified` | function | `nil` | Callback registered when classified is attached. Fires on classified removal. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches an existing classified entity on the client side. Registers `ondetachclassified` callback and listens for "onremove" event on the classified entity.
* **Parameters:** `classified` -- entity instance to attach
* **Returns:** nil
* **Error states:** None.

### `DetachClassified()`
* **Description:** Detaches the classified entity reference and clears the `ondetachclassified` callback.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnRemoveEntity()`
* **Description:** Cleanup handler called when the entity is removed. Removes the classified entity on master (guarded by `if self.classified and TheWorld.ismastersim`).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetCanBePickedUp(canbepickedup)`
* **Description:** Sets the `_cannotbepickedup` netvar (inverted logic: `true` means can be picked up). Netvar :set() works on both sides (queues network update).
* **Parameters:** `canbepickedup` -- boolean
* **Returns:** nil
* **Error states:** None.

### `CanBePickedUp(doer)`
* **Description:** Checks if the item can be picked up by `doer`. Returns `true` if doer has the grabbable override tag, `false` if doer lacks "spiderwhisperer" tag and item has "spider" tag, otherwise returns inverted `_cannotbepickedup` value.
* **Parameters:** `doer` -- entity attempting pickup
* **Returns:** boolean
* **Error states:** None.

### `SetCanGoInContainer(cangoincontainer)`
* **Description:** Sets the `cangoincontainer` field on the classified entity.
* **Parameters:** `cangoincontainer` -- boolean
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.cangoincontainer:set access).

### `CanGoInContainer()`
* **Description:** Returns whether the item can go in a container.
* **Parameters:** None
* **Returns:** boolean or `nil` if classified is nil
* **Error states:** None.

### `SetCanOnlyGoInPocket(canonlygoinpocket)`
* **Description:** Sets the `canonlygoinpocket` field on the classified entity.
* **Parameters:** `canonlygoinpocket` -- boolean
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.canonlygoinpocket:set access).

### `SetCanOnlyGoInPocketOrPocketContainers(canonlygoinpocketorpocketcontainers)`
* **Description:** Sets the `canonlygoinpocketorpocketcontainers` field on the classified entity.
* **Parameters:** `canonlygoinpocketorpocketcontainers` -- boolean
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.canonlygoinpocketorpocketcontainers:set access).

### `CanOnlyGoInPocket()`
* **Description:** Returns whether the item can only go in a pocket.
* **Parameters:** None
* **Returns:** boolean or `nil` if classified is nil
* **Error states:** None.

### `CanOnlyGoInPocketOrPocketContainers()`
* **Description:** Returns whether the item can only go in a pocket or pocket containers.
* **Parameters:** None
* **Returns:** boolean or `nil` if classified is nil
* **Error states:** None.

### `SetIsLockedInSlot(locked)`
* **Description:** Sets the `islockedinslot` field on the classified entity.
* **Parameters:** `locked` -- boolean
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.islockedinslot:set access).

### `IsLockedInSlot()`
* **Description:** Returns whether the item is locked in its inventory slot.
* **Parameters:** None
* **Returns:** boolean or `nil` if classified is nil
* **Error states:** None.

### `SetImage(imagename)`
* **Description:** Sets the image texture on the classified entity. Appends ".tex" extension if not nil.
* **Parameters:** `imagename` -- string or nil
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.image:set access).

### `OverrideImage(imagename)`
* **Description:** Sets a local (non-networked) image override. Pushes "imagechange" event. Does not sync to clients.
* **Parameters:** `imagename` -- string or nil
* **Returns:** nil
* **Error states:** None.

### `GetImage()`
* **Description:** Returns the current image texture path. Checks client-side overrides first, then local override, then classified value, then defaults to prefab name.
* **Parameters:** None
* **Returns:** string texture path
* **Error states:** None.

### `SetAtlas(atlasname)`
* **Description:** Sets the atlas path on the classified entity. Resolves file path if not nil.
* **Parameters:** `atlasname` -- string or nil
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.atlas:set access).

### `GetClientSideInventoryImageOverride(self)` (local)
* **Description:** Local helper function that checks for client-side inventory image overrides. Returns override data table with `image` and `atlas` fields, or nil if no override exists.
* **Parameters:** `self` -- InventoryItem component instance
* **Returns:** Table with `image` and `atlas` fields, or nil
* **Error states:** None.

### `GetAtlas()`
* **Description:** Returns the current atlas path. Checks client-side overrides first, then classified value, then defaults via `GetInventoryItemAtlas()`.
* **Parameters:** None
* **Returns:** string atlas path
* **Error states:** None.

### `SetOwner(owner)`
* **Description:** Sets the owner and updates classified target. Handles multi-slot container edge cases by forcing out of limbo and clearing classified target if `opencount > 1`.
* **Parameters:** `owner` -- entity or nil
* **Returns:** nil
* **Error states:** None (nil guards present for owner and owner.components.container access: `owner ~= nil and owner.components.container ~= nil and owner.components.container.opencount or 0`).

### `IsHeld()`
* **Description:** Returns whether the item is currently held. Checks master `inventoryitem` component first, then falls back to classified existence on client.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `IsHeldBy(guy)`
* **Description:** Returns whether the item is held by `guy`. On client, checks if `guy` is `ThePlayer` and uses `replica.inventory:IsHolding()`.
* **Parameters:** `guy` -- entity to check
* **Returns:** boolean
* **Error states:** None.

### `IsGrandOwner(guy)`
* **Description:** Returns whether `guy` is the grand owner (owner of owner). On client, checks if `guy` is `ThePlayer` and uses `replica.inventory:IsHolding(..., true)`.
* **Parameters:** `guy` -- entity to check
* **Returns:** boolean
* **Error states:** None.

### `SetPickupPos(pos)`
* **Description:** Sets the pickup position on the classified entity's `src_pos` netvars. Marks position as valid or invalid.
* **Parameters:** `pos` -- Vector3 or nil
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.src_pos access).

### `GetPickupPos()`
* **Description:** Returns the stored pickup position as a Vector3, or nil if position is invalid.
* **Parameters:** None
* **Returns:** Vector3 or nil
* **Error states:** None.

### `SerializeUsage()`
* **Description:** Serializes usage stats (percent used, perish, recharge) to the classified entity. Reads from `armor`, `finiteuses`, `fueled`, `perishable`, and `rechargeable` components.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified:SerializePercentUsed access).

### `DeserializeUsage()`
* **Description:** Deserializes usage stats from the classified entity on the client.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None (guarded by `if self.classified ~= nil`).

### `SetChargeTime(t)`
* **Description:** Sets the recharge time and pushes "rechargetimechange" event.
* **Parameters:** `t` -- number (time in seconds)
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified:SerializeRechargeTime access).

### `SetDeployMode(deploymode)`
* **Description:** Sets the deploy mode on the classified entity.
* **Parameters:** `deploymode` -- DEPLOYMODE constant
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.deploymode:set access).

### `GetDeployMode()`
* **Description:** Returns the deploy mode. Checks master `deployable` component first, then classified value, then defaults to `DEPLOYMODE.NONE`.
* **Parameters:** None
* **Returns:** DEPLOYMODE constant
* **Error states:** None.

### `IsDeployable(deployer)`
* **Description:** Checks if the item can be deployed by `deployer`. On client, checks restricted tag, riding state (requires "complexprojectile" tag), and floating state (requires "boatbuilder" tag).
* **Parameters:** `deployer` -- entity attempting deploy
* **Returns:** boolean
* **Error states:** None.

### `SetDeploySpacing(deployspacing)`
* **Description:** Sets the deploy spacing on the classified entity.
* **Parameters:** `deployspacing` -- DEPLOYSPACING constant
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.deployspacing:set access).

### `DeploySpacingRadius()`
* **Description:** Returns the deploy spacing radius. Checks master `deployable` component first, then looks up classified value in `DEPLOYSPACING_RADIUS`, then defaults.
* **Parameters:** None
* **Returns:** number (radius)
* **Error states:** None.

### `SetDeployRestrictedTag(restrictedtag)`
* **Description:** Sets the deploy restricted tag on the classified entity.
* **Parameters:** `restrictedtag` -- string or nil (converted to 0 if nil)
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.deployrestrictedtag:set access).

### `CanDeploy(pt, mouseover, deployer, rot)`
* **Description:** Checks if the item can be deployed at point `pt`. Delegates to master `deployable` component if present, otherwise uses classified deploy mode to check map passability, turf placement, plant/wall deployment, water deployment, or custom deployment logic.
* **Parameters:**
  - `pt` -- Vector3 deployment point
  - `mouseover` -- entity under mouse
  - `deployer` -- entity attempting deploy
  - `rot` -- rotation for deployment
* **Returns:** boolean
* **Error states:** None.

### `SetUseGridPlacer(usegridplacer)`
* **Description:** Sets the grid placer flag on the classified entity.
* **Parameters:** `usegridplacer` -- boolean
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.usegridplacer:set access).

### `GetDeployPlacerName()`
* **Description:** Returns the placer prefab name. Returns "gridplacer" if grid placer is enabled, otherwise returns `overridedeployplacername` or prefab-based default.
* **Parameters:** None
* **Returns:** string placer name
* **Error states:** None.

### `SetAttackRange(attackrange)`
* **Description:** Sets the attack range on the classified entity.
* **Parameters:** `attackrange` -- number
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.attackrange:set access).

### `AttackRange()`
* **Description:** Returns the attack range. Checks master `weapon` component first, then classified value (if `> -99`), then defaults to 0.
* **Parameters:** None
* **Returns:** number
* **Error states:** None.

### `IsWeapon()`
* **Description:** Returns whether the item is a weapon. Checks for master `weapon` component or classified attack range `> -99`.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `SetWalkSpeedMult(walkspeedmult)`
* **Description:** Sets the walk speed multiplier on the classified entity. Uses string conversion to avoid floating-point precision errors. Asserts value is in range `0-255` and has at most 0.01 precision.
* **Parameters:** `walkspeedmult` -- number or nil
* **Returns:** nil
* **Error states:** Asserts if value is out of range or has too much precision. Errors if `classified` is nil (no nil guard before classified.walkspeedmult:set access).

### `GetWalkSpeedMult()`
* **Description:** Returns the walk speed multiplier. Checks master `equippable` component first, then calculates from classified value (divided by 100). Applies "vigorbuff" bonus and `inventory_EquippableWalkSpeedMultModifier` callback on client if equipped.
* **Parameters:** None
* **Returns:** number (multiplier)
* **Error states:** None.

### `SetEquipRestrictedTag(restrictedtag)`
* **Description:** Sets the equip restricted tag on the classified entity.
* **Parameters:** `restrictedtag` -- string or nil (converted to 0 if nil)
* **Returns:** nil
* **Error states:** Errors if `classified` is nil (no nil guard before classified.equiprestrictedtag:set access).

### `GetEquipRestrictedTag()`
* **Description:** Returns the equip restricted tag. Checks master `equippable` component first, then classified value.
* **Parameters:** None
* **Returns:** string or nil
* **Error states:** None.

### `SetMoistureLevel(moisture)`
* **Description:** Sets the moisture level on the classified entity.
* **Parameters:** `moisture` -- number
* **Returns:** nil
* **Error states:** None (guarded by `if self.classified ~= nil`).

### `GetMoisture()`
* **Description:** Returns the moisture value. Checks master `inventoryitemmoisture` component first, then classified value, then defaults to 0.
* **Parameters:** None
* **Returns:** number
* **Error states:** None.

### `GetMoisturePercent()`
* **Description:** Returns the moisture as a percentage of `TUNING.MAX_WETNESS`.
* **Parameters:** None
* **Returns:** number (0-1 range)
* **Error states:** None.

### `SetIsWet(iswet)`
* **Description:** Sets the wet status. Only updates and pushes "wetnesschange" event if value changed.
* **Parameters:** `iswet` -- boolean
* **Returns:** nil
* **Error states:** None.

### `IsWet()`
* **Description:** Returns the wet status from the `_iswet` netvar.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `SetIsAcidSizzling(isacidsizzling)`
* **Description:** Sets the acid sizzling status. Only updates and pushes "acidsizzlingchange" event if value changed.
* **Parameters:** `isacidsizzling` -- boolean
* **Returns:** nil
* **Error states:** None.

### `IsAcidSizzling()`
* **Description:** Returns the acid sizzling status from the `_isacidsizzling` netvar.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `SetGrabbableOverrideTag(tag)`
* **Description:** Sets the grabbable override tag. Converted to 0 if nil.
* **Parameters:** `tag` -- string or nil
* **Returns:** nil
* **Error states:** None.

## Events & listeners
- **Listens to (registered on master):**
  - `percentusedchange` -- serializes percent used to classified entity. Data: `{percent = number}`
  - `perishchange` -- serializes perish percent to classified entity. Data: `{percent = number}`
  - `forceperishchange` -- forces perish dirty on classified entity. Data: none
  - `rechargechange` -- serializes recharge percent and overtime to classified entity. Data: `{percent = number, overtime = number}`
  - `onremove` (on classified) -- triggers `DetachClassified()` on client. Data: none

- **Pushes:**
  - `imagechange` -- fired when `OverrideImage()` is called. Data: none
  - `wetnesschange` -- fired when wet status changes. Data: boolean (new wet status)
  - `acidsizzlingchange` -- fired when acid sizzling status changes. Data: boolean (new sizzling status)
  - `rechargetimechange` -- fired when charge time is set. Data: `{t = number}`