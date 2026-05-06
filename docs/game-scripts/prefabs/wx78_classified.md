---
id: wx78_classified
title: Wx78 Classified
description: Classified data container prefab for WX-78 character that manages upgrade modules, backup bodies, shield state, and energy levels with network replication.
tags: [prefab, wx78, character, network]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 30842337
system_scope: player
---

# Wx78 Classified

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_classified.lua` registers a hidden entity prefab that serves as the networked data container for WX-78's upgrade system. The prefab is attached to WX-78 player entities and manages upgrade module slots, backup body count, shield state, and energy levels. Server-side logic handles body attachment/detachment while client-side logic manages UI updates and module activation states. The entity is created hidden (`inst.entity:Hide()`) and tagged `CLASSIFIED` to prevent normal entity interaction.

## Usage example
```lua
-- Access from WX-78 player instance:
local wx78_classified = player.wx78_classified
if wx78_classified ~= nil then
    -- Query energy state:
    local energy = wx78_classified:GetEnergyLevel()
    local max_energy = wx78_classified:GetMaxEnergy()
    
    -- Query backup body capacity:
    local max_bodies = wx78_classified:GetMaxBackupBodies()
    local free_bodies = wx78_classified:GetNumFreeBackupBodies()
    
    -- Client-side: get module configuration
    local moddata = wx78_classified:GetModulesData()
end

-- Server-side: add/remove backup bodies
if TheWorld.ismastersim then
    wx78_classified:TryToAddBackupBody(body_inst)
    wx78_classified:TryToRemoveBackupBody(body_inst)
end
```

## Dependencies & tags
**External dependencies:**
- `wx78_moduledefs` -- provides `GetModuleDefinitionFromNetID()` for resolving module netvar IDs to definitions
- `prefabs/skilltree_defs` -- provides `SKILLTREE_DEFS` for computing max body count from skill tree

**Components used:**
- `linkeditem` -- accessed on backup body entities to link/unlink from owner user ID
- `skilltreeupdater` -- accessed on owner player to check if body-count skills are activated

**Tags:**
- `CLASSIFIED` -- added in `fn()` to mark entity as hidden data container

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_BODY_COUNT` | constant (local) | computed | Total number of skills tagged `wx78_maxbody` in `SKILLTREE_DEFS.wx78`. Determines max backup body capacity. |
| `MAX_BODY_COUNT_SKILLS` | table (local) | `{...}` | Array of skill names that contribute to max body count. Iterated by `GetMaxBackupBodies()`. |
| `currentenergylevel` | net_smallbyte | `0` | Current energy charge level. Dirty event: `upgrademoduleenergyupdate`. |
| `maxenergylevel` | net_smallbyte | `TUNING.WX78_INITIAL_MAXCHARGELEVEL` | Maximum energy capacity. Dirty event: `upgrademoduleenergyupdate`. |
| `upgrademodulebars` | table | `{}` | Nested table of net_smallbyte arrays per circuit bar type. Each slot holds a module net ID. Dirty event: `upgrademoduleslistdirty`. |
| `_activatedmods` | table | `{}` | Tracks which module slots are currently active (true/false) per bar type and index. |
| `inspectupgrademodulebars` | net_bool | `false` | Controls visibility of upgrade module widget. Dirty event: `inspectupgrademodulebarsdirty`. |
| `performedspinaction` | net_bool | `false` | Tracks whether spin action was an attack. Dirty event: `performedspinactiondirty`. |
| `currentshield` | net_ushortint | `0` | Current shield value. Dirty event: `shielddirty`. |
| `canshieldcharge` | net_bool | `false` | Whether shield can currently charge. Dirty event: `canshieldchargedirty`. |
| `maxshield` | net_ushortint | `1` | Maximum shield capacity. Dirty event: `shielddirty`. |
| `shieldpenetrationthreshold` | net_ushortint | `15` | Damage threshold for shield penetration. Dirty event: `shielddirty`. |
| `numactivebodies` | net_enum | `0` | Count of currently attached backup bodies. Dirty event: `numactivebodiesdirty`. |
| `numdronescouts` | net_enum | `0` | Count of active scout drones. Dirty event: `numdronescoutsdirty`. |
| `poweroffoverlay` | net_bool | `false` | Controls power-off overlay visibility. Dirty event: `poweroffoverlaydirty`. |
| `uirobotsparksevent` | net_event | --- | Fires robot spark visual effect. No value storage; triggered via `:push()`. |
| `backupbodies` | table | `{}` | (master only) Map of body entity to `true` for tracking attached backup bodies. |
| `_oldupgrademodulebars` | table | `{}` | Cached module data for detecting changes between dirty events. |
| `_oldcurrentenergylevel` | number | `0` | Cached previous energy level for delta computation in events. |
| `_oldmaxenergylevel` | number | `0` | Cached previous max energy for delta computation in events. |
| `_oldshieldpercent` | number | `0` | Cached previous shield percentage for delta computation in events. |

## Main functions
### `fn()`
* **Description:** Prefab constructor. Creates hidden entity, adds `CLASSIFIED` tag, initializes all netvars for energy, modules, shield, bodies, and drones. Attaches common interface methods to `inst`. On client, attaches client-only methods and `OnEntityReplicated`. On master, attaches server-only methods for body management. Returns `inst` for framework to complete initialization.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server).

### `SetValue(inst, name, value)` (local)
* **Description:** Server-side helper to set a netvar value with range validation. Asserts if value is outside `0–65535` range. Uses `:set()` to update netvar and fire dirty event.
* **Parameters:**
  - `inst` -- entity instance
  - `name` -- string netvar property name on `inst`
  - `value` -- number to set (must be `0 <= value <= 65535`)
* **Returns:** None
* **Error states:** Asserts if `value` is outside valid range. Errors if `inst[name]` is not a netvar with `:set()` method.

### `TryToAddBackupBody(inst, body)` (local)
* **Description:** Server-side. Attempts to attach a backup body entity. Returns `false` if body is already tracked or no free body slots available. On success, adds body to `backupbodies` table, increments `numactivebodies`, and pushes `refreshcrafting` event to owner HUD.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `body` -- backup body entity instance
* **Returns:** `true` on success, `false` on failure (already exists or no free slots)
* **Error states:** None — gracefully returns `false` on failure conditions.

### `TryToRemoveBackupBody(inst, body)` (local)
* **Description:** Server-side. Attempts to detach a backup body entity. Returns `false` if body is not tracked. On success, removes from `backupbodies`, decrements `numactivebodies`, and pushes `refreshcrafting` event to owner HUD.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `body` -- backup body entity instance
* **Returns:** `true` on success, `false` if body was not tracked
* **Error states:** None — gracefully returns `false` if body not found.

### `DetachBodiesToMaximumCount(inst, maxbodies)` (local)
* **Description:** Server-side. Forces detachment of backup bodies if `numactivebodies` exceeds `maxbodies`. Iterates through `backupbodies` table and calls `TryToRemoveBackupBody()` until count matches threshold. Unlinks each removed body via `linkeditem:LinkToOwnerUserID(nil)`. Asserts if unable to remove enough bodies.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `maxbodies` -- maximum allowed active body count
* **Returns:** None
* **Error states:** Asserts if `toremovecount > 0` after exhausting all backup bodies (indicates data corruption).

### `GetOwningPlayer(inst)` (local)
* **Description:** Common interface. Resolves the player entity that owns this classified data. Checks `inst._parent.isplayer` first, then falls back to `linkeditem:GetOwnerInst()` if parent has linkeditem component.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Player entity instance or `nil` if owner cannot be resolved
* **Error states:** None — returns `nil` gracefully if no owner found.

### `GetOwningWX78_Classified(inst)` (local)
* **Description:** Common interface. Returns the wx78_classified entity for the owning player. If `inst` is already the classified entity, returns `inst`. Otherwise resolves owner player and returns `owner.wx78_classified`.
* **Parameters:** `inst` -- wx78_classified entity or child entity
* **Returns:** wx78_classified entity instance
* **Error states:** None — returns `inst` as fallback if owner lookup fails.

### `GetMaxBackupBodies(inst)` (local)
* **Description:** Common interface. Computes maximum backup body capacity by iterating `MAX_BODY_COUNT_SKILLS` and checking if each skill is activated via `skilltreeupdater:IsActivated()`. Requires owner player with `skilltreeupdater` component.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Integer max body count (0 if no skilltreeupdater or owner)
* **Error states:** None — returns `0` if prerequisites not met.

### `GetNumFreeBackupBodies(inst)` (local)
* **Description:** Common interface. Returns available backup body slots by computing `maxbodies - numactivebodies`. Clamps result to minimum `0`.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Integer free body count (minimum `0`)
* **Error states:** None.

### `GetNumFreeScoutingDrones(inst)` (local)
* **Description:** Common interface. Returns available scout drone slots. Max count is `TUNING.SKILLS.WX78.SCOUTDRONE_MAX_COUNT` if `wx78_scoutdrone_1` skill is activated, otherwise `0`. Subtracts `numdronescouts` from max.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Integer free drone count (minimum `0`)
* **Error states:** None.

### `OnPowerOffOverlayDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when `poweroffoverlay` netvar changes. Calls `inst._parent.HUD.wxpowerover:PowerOff()` if true, or `Clear()` if false. Requires parent with HUD.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None — guards against missing `_parent` or `HUD`.

### `OnUnsocketShadowSlot(parent, socketposition)` (local)
* **Description:** Client-side. Sends `RPC.UnplugModule` to server when a module is unsocketed from the shadow slot.
* **Parameters:**
  - `parent` -- parent entity (WX-78 player)
  - `socketposition` -- integer slot index
* **Returns:** None
* **Error states:** None.

### `OnEntityReplicated(inst)` (local)
* **Description:** Client-side replication handler. Called when entity is replicated on client. Resolves `inst._parent` from entity parent, registers `socketholder_unsocket` listener, and calls `inst._parent:AttachClassified_wx78(inst)` to complete attachment.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** Prints error if `inst._parent` is nil (should not occur in normal operation).

### `TryActivateModule(inst, definition, bartype, moduleindex)` (local)
* **Description:** Client-side. Activates a module slot if not already active. Sets `_activatedmods` flag and calls `definition.client_activatefn()` if defined.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `definition` -- module definition table from `wx78_moduledefs`
  - `bartype` -- circuit bar type key
  - `moduleindex` -- integer slot index
* **Returns:** None
* **Error states:** None — guards against already-active modules.

### `TryDeactivateModule(inst, definition, bartype, moduleindex)` (local)
* **Description:** Client-side. Deactivates a module slot if active. Clears `_activatedmods` flag and calls `definition.client_deactivatefn()` if defined.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `definition` -- module definition table from `wx78_moduledefs`
  - `bartype` -- circuit bar type key
  - `moduleindex` -- integer slot index
* **Returns:** None
* **Error states:** None — guards against already-inactive modules.

### `UpdateActivatedModules(inst)` (local)
* **Description:** Client-side. Recomputes active module states based on current energy level. Iterates all module slots, subtracts slot costs from remaining charge, and activates/deactivates modules accordingly. Modules beyond energy budget are deactivated.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `GetModulesData(inst)` (local)
* **Description:** Client-side. Returns a table of current module net IDs organized by bar type. Used for caching and change detection.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Table `{bartype = {netid, netid, ...}, ...}`
* **Error states:** None.

### `CanUpgradeWithModule(inst, moduleent)` (local)
* **Description:** Client-side. Checks if a module can be added without exceeding max energy. Sums current slot usage from `upgrademodulebars` and compares against `maxenergylevel`.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `moduleent` -- module entity to check
* **Returns:** `true` if module fits, `false` otherwise
* **Error states:** None.

### `GetModuleTypeCount(inst, module_name)` (local)
* **Description:** Client-side. Counts how many modules of a specific name are currently active within energy budget. Iterates bars in order, tracking remaining charge, and increments count when matching module name is found before energy depletion.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `module_name` -- string module definition name
* **Returns:** Integer count of active modules with matching name
* **Error states:** None.

### `UnplugModule(inst, moduletype, moduleindex)` (local)
* **Description:** Client-side. Sends `RPC.UnplugModule` to server to remove a module from a slot.
* **Parameters:**
  - `inst` -- wx78_classified entity
  - `moduletype` -- circuit bar type key
  - `moduleindex` -- integer slot index
* **Returns:** None
* **Error states:** None.

### `GetMaxEnergy(inst)` (local)
* **Description:** Client-side. Returns the maximum energy capacity from `maxenergylevel` netvar.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Integer max energy value
* **Error states:** None.

### `GetEnergyLevel(inst)` (local)
* **Description:** Client-side. Returns the current energy level from `currentenergylevel` netvar.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** Integer current energy value
* **Error states:** None.

### `OnEnergyLevelDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when energy level changes. Computes delta data (old/new level, old/max level), calls `UpdateActivatedModules()`, caches new values, and pushes `energylevelupdate` event to parent with delta data.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None — guards against missing `_parent`.

### `OnPerformedSpinActionDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when `performedspinaction` netvar changes. Pushes `wx_performedspinaction` event to parent with the new value.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `OnPerformedSpinAction_Server(parent, isattack)` (local)
* **Description:** Server-side event handler. Sets `performedspinaction` netvar on the classified entity when parent triggers spin action. Uses `:set_local()` then `:set()` to ensure both local and networked update.
* **Parameters:**
  - `parent` -- WX-78 player entity
  - `isattack` -- boolean indicating if spin was an attack
* **Returns:** None
* **Error states:** None — guards against missing `parent.wx78_classified`.

### `OnShieldDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when shield state changes. Computes shield percentage, caches old value, and pushes `wxshielddelta` event to parent with old/new percent, max shield, and penetration threshold.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None — initializes `_oldshieldpercent` to `0` if no parent.

### `OnCanShieldChargeDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when `canshieldcharge` netvar changes. Pushes `wx_canshieldcharge` event to parent with the new value.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `OnUIRobotSparks(inst)` (local)
* **Description:** Event listener callback. Triggered by `uirobotsparksevent`. Pushes `do_robot_spark` event to parent to trigger visual effect.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `OnUpgradeModulesListDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when module slot configuration changes. Compares old vs new net IDs, deactivates modules that were removed, updates `_oldupgrademodulebars` cache, calls `UpdateActivatedModules()`, and pushes either `upgrademoduleowner_popallmodules` (if all empty) or `upgrademodulesdirty` (with new data) to parent.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `OnInspectUpgradeModuleBarsDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when `inspectupgrademodulebars` changes. Shows or hides the upgrade module widget on `ThePlayer.HUD` based on the netvar value.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None — guards against missing `ThePlayer` or `HUD`.

### `OnCraftingNetVarDirty(inst)` (local)
* **Description:** Event listener callback. Triggered when `numactivebodies` or `numdronescouts` changes. Pushes `refreshcrafting` event to parent HUD to update crafting UI.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** None
* **Error states:** None.

### `GetDebugString(inst)` (local)
* **Description:** Returns debug information about body counts from both owner and body perspectives. Calls `AddDebugString()` for relevant classified entities and appends `:_GetDebugString()` output.
* **Parameters:** `inst` -- wx78_classified entity
* **Returns:** String debug output
* **Error states:** None.

## Events & listeners
**Listens to:**
- `socketholder_unsocket` -- triggers `OnUnsocketShadowSlot()` to unplug module from shadow slot (client only)
- `wx_performedspinaction` -- triggers `OnPerformedSpinAction_Server()` to update spin action state (master only)
- `uirobotsparksevent` -- triggers `OnUIRobotSparks()` to fire robot spark visual (client only)
- `upgrademoduleenergyupdate` -- triggers `OnEnergyLevelDirty()` to update module activation and notify parent (client only)
- `upgrademoduleslistdirty` -- triggers `OnUpgradeModulesListDirty()` to sync module configuration (client only)
- `inspectupgrademodulebarsdirty` -- triggers `OnInspectUpgradeModuleBarsDirty()` to show/hide module widget (client only)
- `numactivebodiesdirty` -- triggers `OnCraftingNetVarDirty()` to refresh crafting UI (client only)
- `numdronescoutsdirty` -- triggers `OnCraftingNetVarDirty()` to refresh crafting UI (client only)
- `performedspinactiondirty` -- triggers `OnPerformedSpinActionDirty()` to notify parent of spin action (client only)
- `shielddirty` -- triggers `OnShieldDirty()` to compute and notify shield delta (client only)
- `canshieldchargedirty` -- triggers `OnCanShieldChargeDirty()` to notify shield charge state (client only)
- `poweroffoverlaydirty` -- triggers `OnPowerOffOverlayDirty()` to update power-off overlay (common)

**Pushes:**
- `energylevelupdate` -- Data: `{old_level, new_level, old_max_level, new_max_level}`. Fired when energy level changes.
- `wxshielddelta` -- Data: `{oldpercent, newpercent, maxshield, penetrationthreshold}`. Fired when shield state changes.
- `wx_canshieldcharge` -- Data: boolean value. Fired when shield charge capability changes.
- `do_robot_spark` -- Data: none. Fired to trigger robot spark visual effect.
- `upgrademoduleowner_popallmodules` -- Data: none. Fired when all module slots become empty.
- `upgrademodulesdirty` -- Data: `{bartype = {netid, ...}, ...}`. Fired when module configuration changes (not empty).
- `refreshcrafting` -- Data: none. Fired when body or drone count changes to update crafting UI.
- `wx_performedspinaction` -- Data: boolean isattack value. Fired when spin action state changes.