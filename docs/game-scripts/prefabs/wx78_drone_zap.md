---
id: wx78_drone_zap
title: Wx78 Drone Zap
description: Prefab file defining the WX-78 zap drone entity and its remote controller item, enabling skill-based ranged combat with camera focus control and battery charging.
tags: [prefab, wx78, combat, drone, skill]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: d96d994f
system_scope: combat
---

# Wx78 Drone Zap

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_drone_zap.lua` registers two spawnable prefabs: `wx78_drone_zap` (the flying drone entity) and `wx78_drone_zap_remote` (the inventory remote controller). The drone prefab handles flight physics, camera focus, and ranged attack projection. The remote prefab manages equip/unequip behavior, finite uses, battery charging, and skill tree integration. Both prefabs are tied to WX-78's skill tree system for range and damage upgrades.

## Usage example
```lua
-- Spawn the drone directly (typically done via remote OnUse):
local drone = SpawnPrefab("wx78_drone_zap")
drone.Transform:SetPosition(x, 1.5, z)
drone:SetOwner(player)

-- Spawn the remote controller (inventory item):
local remote = SpawnPrefab("wx78_drone_zap_remote")
remote.components.finiteuses:SetUses(10)

-- Check if player has required skill:
if player.components.skilltreeupdater:IsActivated("wx78_zapdrone_1") then
    -- Player can use the drone
end
```

## Dependencies & tags
**External dependencies:**
- `easing` -- used for camera offset dampening during drone hover
- `MakeFlyingCharacterPhysics` -- applies flying physics for drone entity
- `MakeInventoryPhysics` -- applies inventory physics for remote item
- `MakeInventoryFloatable` -- adds floatable behavior for inventory item
- `MakeHauntableLaunch` -- registers hauntable behavior for remote item
- `FocalPoint_CalcBaseOffset` -- calculates base camera offset for focal point tracking
- `Lerp` -- linear interpolation helper for camera position transitions
- `SpawnElectricHitSparks` -- spawns electric hit visual effects
- `IsFlyingPermittedFromPoint` -- checks if flying is permitted from given position

**Components used (drone):**
- `spawnfader` -- fade out animation on death
- `inspectable` -- allows player inspection
- `weapon` -- dummy component for projectile reference
- `updatelooper` -- periodic camera gain updates during drone vision

**Components used (remote):**
- `inspectable` -- shows usage status based on skill activation
- `inventoryitem` -- allows carrying in inventory
- `equippable` -- equip to hand slot with restricted tag
- `finiteuses` -- tracks number of drone deployments
- `batteryuser` -- allows recharging with batteries

**Tags (drone):**
- `rangedweapon` -- added in fn() for combat targeting
- `staysthroughvirtualrooms` -- allows drone to persist through room transitions
- `CLASSIFIED` -- added on kill to hide from certain systems
- `FX` -- marks as visual effect entity
- `NOCLICK` -- prevents player interaction after death

**Tags (remote):**
- `donotautopick` -- prevents automatic pickup
- `wx_remotecontroller` -- identifies as WX-78 remote type
- `batteryuser` -- added to pristine state for optimization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Animation and sound assets for drone and remote prefabs. |
| `assets_remote` | table | --- | Animation and inventory image assets for remote controller prefab (ANIM: wx78_drone_zap.zip, swap_wx78_drone_zap_remote.zip; INV_IMAGE: wx78_drone_zap_remote_held). |
| `prefabs` | table | `{ "wx78_drone_zap_projectile_fx" }` | Dependent prefabs loaded with drone entity. |
| `prefabs_remote` | table | `{ "wx78_drone_zap" }` | Dependent prefabs loaded with remote item. |
| `owner` | net_entity | `nil` | (drone only) Mirrors the owning player entity. Dirty event: `ownerdirty`. |
| `range` | number | `TUNING.SKILLS.WX78.ZAPDRONE_RANGE_1` | (drone only) Current effective attack range, updated via skills. |
| `GetDroneRange` | function | --- | (drone, master only) Public method exposed on drone entity for external range queries. Used by zapdroneover system. |
| `SetOwner` | function | --- | (drone, master only) Public method exposed on drone entity to set the owner. Used by remote OnUse to assign player as drone owner. |
| `Kill` | function | --- | (drone, master only) Public method exposed on drone entity to trigger death sequence. Called by remote OnStopUse and OnRemoveEntity. |
| `scrapbook_damage` | number | `TUNING.SKILLS.WX78.ZAPDRONE_DAMAGE * ELECTRIC_DAMAGE_MULT` | (drone, master only) Display damage value for scrapbook. |
| `scrapbook_nodamage` | boolean | `true` | (drone, master only) Disables weapon damage display while showing scrapbook_damage. |
| `reskin_tool_cannot_target_this` | boolean | `true` | (drone, master only) Prevents reskin tool from targeting the drone (the remote must be reskinned instead). |
| `persists` | boolean | `false` | (drone only) Entity does not persist through save/load. |
| `MAXIMUM_ZAPDRONE_RANGE` | constant (local) | `40` | Hard cap on drone range to prevent entity pop-in issues. |
| `drone` | entity | `nil` | (remote only) Reference to spawned drone entity. Set in OnUse, cleared in OnStopUse and OnRemoveEntity. |
| `_onskillrefresh` | function | --- | (remote only) Local callback for skill activation/deactivation events. Updates useable state and drone range. |
| `_oncircuitrefresh` | function | --- | (remote only) Local callback for radar circuit range updates. Updates drone range when modules change. |
| `OnDroneZapSkinChanged` | function | --- | (remote only) Public method called when remote skin changes. Reskins drone and updates inventory icon. |
| `OnRemoveEntity` | function | --- | (remote only) Cleanup handler called when remote is removed from world. Kills spawned drone if exists. |

## Main functions

### `fn()` (drone prefab)
* **Description:** Client-side drone entity constructor. Creates the flying drone with anim state, light emitter, mini-map icon, and flying physics. Attaches spawnfader component and sets up net_entity for owner replication. On client, registers `ownerdirty` listener and returns early. On master, adds inspectable, weapon (dummy), stategraph, and sets up master-only properties.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — master-only logic is guarded by `TheWorld.ismastersim` check.

### `remotefn()` (remote prefab)
* **Description:** Remote controller item constructor. Creates inventory item with inventory physics, anim state, and network replication. On client, returns early after pristine setup. On master, attaches inspectable, inventoryitem, equippable, finiteuses, batteryuser components and sets up skill refresh listeners. Returns `inst` for framework completion.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — master-only logic is guarded by `TheWorld.ismastersim` check.

### `GetInventorySkinImage(skin_build)` (local)
* **Description:** Converts drone skin build name to remote skin build name for inventory icon display. Replaces `wx78_dronezap_` prefix with `wx78_dronezapremote_`.
* **Parameters:**
  - `skin_build` -- string skin build name
* **Returns:** Modified skin build string for remote inventory icon
* **Error states:** Errors if `skin_build` is nil (string.gsub does not handle nil — no guard present).

### `OnUpdate(inst, dt)` (local)
* **Description:** Called by updatelooper component during drone vision mode. Checks if deploy animation is still playing (frames < 10), then adjusts camera gains and pushes `dronevision` event to owner. Removes updatelooper component after execution (one-shot update).
* **Parameters:**
  - `inst` -- drone entity
  - `dt` -- delta time
* **Returns:** None
* **Error states:** None — owner access is guarded by `if owner then` block before owner:PushEvent call.

### `OnOwnerDirty(inst)` (local)
* **Description:** Client-only dirty event listener for `ownerdirty` netvar change. When owner exists and has HUD, starts focal point camera tracking with custom offset calculation (dampens hover bobbing between 6.7-7.13 height). Sets camera gains to 60 for smooth drone vision. Adds updatelooper component if not present. When owner is nil, stops focal point and pushes `dronevision` disable event to ThePlayer.
* **Parameters:** `inst` -- drone entity
* **Returns:** None
* **Error states:** Errors if `TheFocalPoint.components.focalpoint` is nil (no guard present).

### `GetDroneRange(inst, owner)` (local)
* **Description:** Calculates effective drone attack range based on owner's skill tree activation. Base range from `ZAPDRONE_RANGE_1`, upgraded to `ZAPDRONE_RANGE_2` if `wx78_zapdrone_2` skill is active. Additional range bonus from radar modules if `wx78_circuitry_betabuffs_1` skill is active. Clamped to `MAXIMUM_ZAPDRONE_RANGE` (40) to prevent rendering issues.
* **Parameters:**
  - `inst` -- drone entity
  - `owner` -- player entity or nil
* **Returns:** Number representing effective range (clamped to 40 max)
* **Error states:** None — all component accesses are nil-checked via `if owner and owner.components...`.

### `UpdateDroneRange(inst, owner)` (local)
* **Description:** Updates `inst.range` property by calling GetDroneRange. Called when owner skills or modules change.
* **Parameters:**
  - `inst` -- drone entity
  - `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None.

### `SetOwner(inst, owner)` (local)
* **Description:** Sets the drone's owner via net_entity. Updates range and triggers OnOwnerDirty callback. Skips if drone is already killed and owner is being set (prevents re-ownership after death).
* **Parameters:**
  - `inst` -- drone entity
  - `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None — guards against killed state.

### `Kill(inst)` (local)
* **Description:** Marks drone as killed, adds classification tags (CLASSIFIED, FX, NOCLICK), clears owner, triggers collapse stategraph state, and fades out via spawnfader. Listens for `spawnfaderout` event to remove entity after fade completes.
* **Parameters:** `inst` -- drone entity
* **Returns:** None
* **Error states:** None — guards against double-kill via `if not inst.killed`.

### `WatchSkillRefresh(inst, owner)` (local)
* **Description:** Sets up event listeners on owner for skill activation/deactivation and circuit range updates. Removes old listeners if owner changed. Calls `_onskillrefresh` and `_oncircuitrefresh` immediately to sync current state. Used by remote to update useable state and drone range when skills change.
* **Parameters:**
  - `inst` -- remote entity
  - `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None — inst._onskillrefresh is assigned in remotefn() before WatchSkillRefresh is called.

### `OnEquip(inst, owner)` (local)
* **Description:** Called when remote is equipped. Pushes `equipskinneditem` event, overrides owner's anim symbols for skin display, changes inventory icon based on skin, shows carry arm animation. Calls WatchSkillRefresh to enable skill-based useable state.
* **Parameters:**
  - `inst` -- remote entity
  - `owner` -- player entity
* **Returns:** None
* **Error states:** None — owner is guaranteed by equippable component callback contract.

### `OnUnequip(inst, owner)` (local)
* **Description:** Called when remote is unequipped. Clears anim symbol overrides, hides carry arm, shows normal arm. Stops drone usage if currently active. Changes inventory icon back to default. Calls WatchSkillRefresh with nil to disable skill listeners.
* **Parameters:**
  - `inst` -- remote entity
  - `owner` -- player entity
* **Returns:** None
* **Error states:** None — component existence is guarded before method access.

### `OnUse(inst, doer)` (local)
* **Description:** Called when remote is activated (useableequippeditem). Checks if flying is permitted from current position. Spawns drone prefab at doer's position (1.5 height offset). Listens for `ms_drone_zap_fired` event from drone to decrement finiteuses based on skill activation (uses `ZAPDRONE_USE_PER_ATTACK_2` if skill active, else `ZAPDRONE_USE_PER_ATTACK_1`). Sets drone owner to doer.
* **Parameters:**
  - `inst` -- remote entity
  - `doer` -- player entity using the remote
* **Returns:** `false, "BADPOSITION"` if flying not permitted; `nil` on success
* **Error states:** Errors if `doer` is nil (no guard before `doer.Transform:GetWorldPosition()` access).

### `OnStopUse(inst, doer)` (local)
* **Description:** Called when remote usage stops. Kills the spawned drone and clears drone reference.
* **Parameters:**
  - `inst` -- remote entity
  - `doer` -- player entity
* **Returns:** None
* **Error states:** None — guards via `if inst.drone`.

### `SetUseable(inst, useable)` (local)
* **Description:** Adds or removes useableequippeditem component based on skill activation state. When enabling, sets OnUse and OnStopUse callbacks. When disabling, stops current usage if active and removes component.
* **Parameters:**
  - `inst` -- remote entity
  - `useable` -- boolean
* **Returns:** None
* **Error states:** None — logic branches prevent calling IsInUse() after component removal.

### `CalcBatteryChargeMult(inst, battery)` (local)
* **Description:** Calculates battery charge multiplier based on current finiteuses percentage. Returns `1 - pct` clamped to 0-1 range, so depleted drones charge faster.
* **Parameters:**
  - `inst` -- remote entity
  - `battery` -- battery entity (unused in calculation)
* **Returns:** Number between 0 and 1
* **Error states:** Errors if `inst.components.finiteuses` is nil (no guard present).

### `OnBatteryUsed(inst, battery, mult)` (local)
* **Description:** Called when battery is used on remote. Checks if charge is full or mult `is <= 0` (rejects). Calculates new percentage, clamps to 0-1, sets finiteuses percent, and spawns electric hit sparks. Returns success status.
* **Parameters:**
  - `inst` -- remote entity
  - `battery` -- battery entity
  - `mult` -- charge multiplier
* **Returns:** `true` on success; `false, "CHARGE_FULL"` if already full or mult invalid
* **Error states:** Errors if `inst.components.finiteuses` is nil (no guard before GetPercent/SetPercent).

### `OnDroneZapSkinChanged(inst, skin_build)` (local)
* **Description:** Called when remote skin changes. Reskins the spawned drone entity if it exists. Updates remote's inventory icon based on equip state and skin build.
* **Parameters:**
  - `inst` -- remote entity
  - `skin_build` -- string skin build name or nil
* **Returns:** None
* **Error states:** Errors if `inst.components.equippable` or `inst.components.inventoryitem` is nil (no nil guard before component access — these components only exist on master, function may be called on client via skin system).

### `OnRemoveEntity(inst)` (local)
* **Description:** Cleanup handler called when remote is removed from world. Kills spawned drone if it exists and clears reference.
* **Parameters:** `inst` -- remote entity
* **Returns:** None
* **Error states:** None — guards via `if inst.drone`.

### `GetStatus(inst, viewer)` (local)
* **Description:** Returns inspection status string for remote. Returns `"CANUSE"` if viewer has `wx78_zapdrone_1` skill activated; returns `nil` otherwise.
* **Parameters:**
  - `inst` -- remote entity
  - `viewer` -- player entity inspecting
* **Returns:** `"CANUSE"` or `nil`
* **Error states:** None — all component accesses are nil-checked via chained `and` conditions.

## Events & listeners
**Listens to (drone, client):**
- `ownerdirty` -- triggers OnOwnerDirty; sets up camera focal point when owner netvar changes

**Listens to (drone, master):**
- `spawnfaderout` -- triggers inst.Remove; removes entity after fade animation completes

**Listens to (remote, master):**
- `onactivateskill_server` -- triggers _onskillrefresh; updates useable state when WX-78 skills activate
- `ondeactivateskill_server` -- triggers _onskillrefresh; updates useable state when WX-78 skills deactivate
- `rangecircuitupdate` -- triggers _oncircuitrefresh; updates drone range when radar modules change
- `ms_drone_zap_fired` -- (on drone) triggers finiteuses decrement; consumes uses per attack

**Pushes (drone):**
- `dronevision` -- Data: `{ enable = boolean, source = entity }` -- enables/disables drone vision mode on owner

**Pushes (remote):**
- `equipskinneditem` -- Data: skin name string -- notifies owner when skinned remote is equipped
- `unequipskinneditem` -- Data: skin name string -- notifies owner when skinned remote is unequipped