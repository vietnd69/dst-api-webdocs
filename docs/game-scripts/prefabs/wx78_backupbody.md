---
id: wx78_backupbody
title: Wx78 Backupbody
description: WX-78 character backup body prefab that stores inventory, upgrade modules, and skins for body transfer and resurrection mechanics.
tags: [wx78, character, prefab, storage, resurrection]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 6d403ae5
system_scope: player
---

# Wx78 Backupbody

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_backupbody.lua` registers five spawnable prefabs: the main backup body entity (`wx78_backupbody`), its inventory child (`wx78_backupbody_inventory`), a placer for construction preview (`wx78_backupbody_placer`), and two map tracking icons (`wx78_backupbody_globalicon`, `wx78_backupbody_revealableicon`). The backup body serves as a storage vessel for WX-78 players, holding inventory items, upgrade modules, socketed items, and skin data that can be exchanged with the player during body transfer or used for ghost resurrection. The prefab integrates with WX78Common systems for upgrade modules, socket handling, and skill tree dependencies.

## Usage example
```lua
-- Spawn a backup body at world origin:
local inst = SpawnPrefab("wx78_backupbody")
inst.Transform:SetPosition(0, 0, 0)

-- Attach to a WX-78 player:
if player.wx78_classified then
    inst:TryToAttachToOwner(player)
end

-- Activate to transfer body (exchange positions and inventory):
if inst.components.activatable:CanActivate(player) then
    inst.components.activatable:DoActivate(player)
end

-- Check if body is in possessed state:
local is_possessed = inst:GetPossessed()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/player_common_extensions` -- shared player entity logic and symbol visibility setup
- `prefabs/wx78_common` -- WX-78 specific mechanics for upgrade modules, sockets, and visual effects
- `MakeGlobalTrackingIcons` -- creates map icon prefabs for tracking
- `MakePlacer` -- creates construction preview entity

**Components used:**
- `linkeditem` -- tracks owner user ID and handles skill tree/owner lifecycle events
- `workable` -- hammer interaction to dismantle the backup body
- `inspectable` -- custom inspection text based on owner name
- `activatable` -- right-click activation for body exchange
- `lootdropper` -- flings items when body is dismantled
- `timer` -- timing utilities (unused in visible code)
- `hauntable` -- ghost haunt interaction for resurrection
- `container` -- storage UI with 15 slots (wx78_backupbody widget)
- `globaltrackingicon` -- map visibility for all players
- `upgrademoduleowner` -- manages upgrade module charge and socket bars
- `inventory` -- equipment storage on child entity (wx78_backupbody_inventory)
- `skinner` -- skin data storage and transfer
- `placer` -- construction preview with symbol overrides

**Tags:**
- `scarytoprey` -- added in fn() for creature targeting
- `equipmentmodel` -- added in fn() and fn_inventory() for render layer
- `wx78_backupbody` -- added in fn() for entity identification
- `followsthroughvirtualrooms` -- added in fn() for cave/forest transitions
- `upgrademoduleowner` -- added in fn() for optimization
- `FX` -- added in fn_inventory() for visual effects entity

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of Asset entries for scripts, animations (wx_chassis, ui_wx78_backupbody_5x3, wx78_map_marker), and WX78Common dependencies. |
| `prefabs` | table | --- | Array of dependent prefab names including icons, fx, inventory, possessedbody, and socket spawners. |
| `PHYSICS_RADIUS` | constant (local) | `0.5` | Physics collision radius for the backup body entity. |
| `PLAYER_SYMBOLS` | table (local) | `{...}` | Array of 20 symbol names used for placer skin symbol overrides (arm_lower, torso, etc.). |
| `TUNING.SKILLS.WX78.BACKUPBODY_WORK_REQUIRED` | constant | --- | Work left value for hammer dismantling (from skill tree tuning). |
| `TUNING.HAUNT_INSTANT_REZ` | constant | --- | Haunt value for ghost resurrection interaction. |
| `TUNING.WX78_INITIAL_MAXCHARGELEVEL` | constant | --- | Default max charge level when no owner exists. |
| `inst.wx78_classified` | entity | `nil` | Classified child entity for network state replication (master only). |
| `inst.wx78_backupbody_inventory` | entity | `nil` | Child entity holding inventory, skinner, and anim state. |
| `inst._maxcharge` | number | `nil` | Cached max charge level from owner's upgrademoduleowner. |
| `inst.is_possessed` | boolean | `nil` | Flag indicating if this body is in possessed state. |
| `inst.is_planar` | boolean | `nil` | Flag indicating if possessed body is planar (caves). |
| `inst.saved_stats` | table | `nil` | Saved health/hunger/sanity stats for possessed body spawn. |
| `inst._backupbody_transferring` | boolean | `nil` | Temporary flag during body exchange to prevent reentrancy. |
| `inst._hide_body_skinfx` | boolean | `nil` | Flag to suppress skin transfer explosion FX. |
| `inst.highlightchildren` | table | `nil` | Array of child entities for highlight rendering (client only). |
| `inst.displaynamefn` | function | `DisplayNameFn` | Returns owner-formatted display name for this entity. |
| `inst.GetActivateVerb` | function | `GetActivateVerb` | Returns action verb string for activation UI. |

## Main functions
### `fn()`
* **Description:** Main prefab constructor for wx78_backupbody. Creates entity with transform, sound, light, and network components. Sets up physics, tags, and core components (linkeditem, workable, activatable, container, upgrademoduleowner). On master, spawns classified child and inventory child entities. Returns inst for framework to handle master/client branching.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host with ismastersim guard for server-only logic.

### `fn_inventory()`
* **Description:** Constructor for wx78_backupbody_inventory child prefab. Creates entity with anim state, dynamic shadow, and network. Sets up wilson/wx78 animation bank/build, hides default symbols (veins, mimic, trapper), and adds heat/steam FX. On master, adds inventory (0 slots, equipment only) and skinner components. On client, registers OnEntityReplicated for parent linking.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None.

### `PlacerPostinit(inst)`
* **Description:** Post-initialization for wx78_backupbody_placer. Sets up base symbol visibility and registers Placer_OnSetBuilder callback if placer component exists. Called by MakePlacer factory.
* **Parameters:** `inst` -- placer entity instance
* **Returns:** None
* **Error states:** None.

### `Placer_OnSetBuilder(inst)`
* **Description:** Callback when placer builder is set. If builder is WX-78 player with available backup bodies, copies skin build and overrides 20 player symbols (arm, torso, leg, etc.) to match player appearance. Handles both skin builds and regular symbol overrides.
* **Parameters:** `inst` -- placer entity instance
* **Returns:** None
* **Error states:** Errors if inst.components.placer is nil (no guard present).

### `OnWorked(inst, worker)`
* **Description:** Callback when hammer work completes. Spawns collapse_small FX at position, drops all items from backup body inventory and container, unsockets all socketed items, pops all upgrade modules, flings all items via lootdropper, then removes the entity.
* **Parameters:**
  - `inst` -- backup body entity
  - `worker` -- player who hammered
* **Returns:** None
* **Error states:** Errors if any component (inventory, container, socketholder, upgrademoduleowner, lootdropper) is missing (no guards present).

### `OnHit(inst, worker, workleft)`
* **Description:** Callback during hammer work. Plays shock sound if workleft > 0. If inventory anim is idle, plays hit animation then pushes idle animation loop.
* **Parameters:**
  - `inst` -- backup body entity
  - `worker` -- player hammering
  - `workleft` -- remaining work units
* **Returns:** None
* **Error states:** Errors if inst.wx78_backupbody_inventory or AnimState is nil (no guard present).

### `DisplayNameFn(inst)`
* **Description:** Returns formatted display name using owner name from linkeditem component. Uses STRINGS.NAMES.WX78_BACKUPBODY_FMT with owner name substitution. Returns nil if no owner.
* **Parameters:** `inst` -- backup body entity
* **Returns:** string display name or `nil`
* **Error states:** Errors if inst.components.linkeditem is nil (no guard present).

### `GetSpecialDescription(inst, viewer)`
* **Description:** Returns inspection description for non-ghost viewers. Gets owner name from linkeditem, fetches WX78 describe strings for viewer prefab, and formats with owner name. Returns nil for ghosts or if no owner/description exists.
* **Parameters:**
  - `inst` -- backup body entity
  - `viewer` -- inspecting player entity
* **Returns:** string description or `nil`
* **Error states:** Errors if inst.components.linkeditem is nil (no guard present).

### `TryToActivateBetaCircuitStates(inst)`
* **Description:** Activates all beta circuit upgrade modules. Gets modules from CIRCUIT_BARS.BETA bar and calls TryActivate() on each module's upgrademodule component.
* **Parameters:** `inst` -- backup body entity
* **Returns:** None
* **Error states:** Errors if inst.components.upgrademoduleowner is nil (no guard present).

### `TryToDeactivateBetaCircuitStates(inst)`
* **Description:** Deactivates all beta circuit upgrade modules. Gets modules from CIRCUIT_BARS.BETA bar and calls TryDeactivate() on each module's upgrademodule component.
* **Parameters:** `inst` -- backup body entity
* **Returns:** None
* **Error states:** Errors if inst.components.upgrademoduleowner is nil (no guard present).

### `CheckBetaCircuitStatesFrom(inst, owner)`
* **Description:** Checks owner's skill tree for wx78_bodycircuits activation. If activated, calls TryToActivateBetaCircuitStates(); otherwise calls TryToDeactivateBetaCircuitStates().
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if owner.components.skilltreeupdater is nil when owner exists (no guard present).

### `CheckCircuitSlotStatesFrom(inst, owner)`
* **Description:** Sets max charge level based on owner's upgrademoduleowner max charge. Falls back to TUNING.WX78_INITIAL_MAXCHARGELEVEL if no owner. Updates inst._maxcharge cache and calls SetMaxCharge().
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if inst.components.upgrademoduleowner is nil (no guard present).

### `CheckSocketStatesFrom(inst, owner)`
* **Description:** Checks owner's skill tree for allegiance sockets. If wx78_allegiance_shadow activated, activates socket_shadow. If wx78_allegiance_lunar activated, activates socket_gestalttrapper. Otherwise deactivates all sockets. Uses WX78Common helper functions.
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if owner.components.skilltreeupdater is nil when owner exists (no guard present).

### `TryToAttachToOwner(inst, owner)`
* **Description:** Links backup body to owner user ID. Returns false if owner is nil, snapshot session, already linked, or owner has no free backup body slots. On success, links user ID, copies skins from player (with explosion FX unless _hide_body_skinfx), or sets up non-player data. Calls Check*StatesFrom functions.
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** boolean `true` on success, `false` on failure
* **Error states:** Errors if inst.components.linkeditem, inst.wx78_backupbody_inventory, or owner.wx78_classified is nil (no guards present).

### `TryToSpawnPossessedBody(inst, isplanar, fromownerrejoin, stats)`
* **Description:** Spawns wx78_possessedbody at backup body position. Removes this backup body from owner's classified before spawn. Deactivates physics, activates possessed body via activatable component, sets leader to owner, sets planar flag, pushes possessed event. Transfers health/hunger/sanity from stats table. Removes self on success. Returns false and restores backup body if activation fails.
* **Parameters:**
  - `inst` -- backup body entity
  - `isplanar` -- boolean for caves/forest
  - `fromownerrejoin` -- boolean for rejoin context
  - `stats` -- table with health/hunger/sanity values (optional)
* **Returns:** boolean `true` on success, `false` on failure
* **Error states:** Errors if inst.components.linkeditem, inst.components.activatable, inst.Physics, or owner.wx78_classified is nil (no guards present).

### `OnBuiltFn(inst, builder)`
* **Description:** Callback when backup body is built by player. Sets _hide_body_skinfx flag, calls TryToAttachToOwner(), plays chassis clunk sound, and plays place animation then idle loop on inventory child.
* **Parameters:**
  - `inst` -- backup body entity
  - `builder` -- player who built
* **Returns:** None
* **Error states:** Errors if inst.wx78_backupbody_inventory or SoundEmitter is nil (no guard present).

### `CanDoerActivate(inst, doer)`
* **Description:** Validates activation preconditions. Returns false with "NOTAROBOT" if doer is not player or lacks wx78_classified. Returns false with "NOTMYBACKUP" if owner exists and doesn't match doer. Returns false with "TOOMANYBACKUPBODIES" if no owner and TryToAttachToOwner fails. Returns true on success.
* **Parameters:**
  - `inst` -- backup body entity
  - `doer` -- activating player entity
* **Returns:** boolean `true` on success, or `false, error_string` on failure
* **Error states:** Errors if inst.components.linkeditem is nil (no guard present).

### `OnActivateFn(inst, doer)`
* **Description:** Executes body exchange between backup body and player. Sets transferring flags, swaps equipment between inventories, transfers items between container and inventory slots (matching max slots), transfers socketed items, swaps skin data via skinner OnSave/OnLoad, swaps upgrade module charge levels and modules, teleports both entities to each other's positions (swapping rotations), and pushes teleported events. Clears transferring flags.
* **Parameters:**
  - `inst` -- backup body entity
  - `doer` -- activating player entity
* **Returns:** boolean `true` on success
* **Error states:** Errors if any component (activatable, inventory, container, socketholder, skinner, upgrademoduleowner, Transform, Physics) is nil (no guards present for most accesses).

### `GetActivateVerb()`
* **Description:** Returns action verb string for activation UI.
* **Parameters:** None
* **Returns:** string `"EXCHANGEKNOWLEDGE"`
* **Error states:** None.

### `AttachClassified_wx78(inst, classified)`
* **Description:** Attaches classified child entity to backup body. Stores reference in inst.wx78_classified, creates onremove listener to call DetachClassified_wx78.
* **Parameters:**
  - `inst` -- backup body entity
  - `classified` -- classified child entity
* **Returns:** None
* **Error states:** None.

### `DetachClassified_wx78(inst)`
* **Description:** Detaches classified child entity. Clears inst.wx78_classified and ondetach_wx78_classified references.
* **Parameters:** `inst` -- backup body entity
* **Returns:** None
* **Error states:** None.

### `OnOpen(inst, data)`
* **Description:** Callback when container opens. If classified exists, sets classified target to the doer from data. Upgrade module inspect commented out.
* **Parameters:**
  - `inst` -- backup body entity
  - `data` -- event data table with doer field
* **Returns:** None
* **Error states:** None.

### `OnClose(inst, data)`
* **Description:** Callback when container closes. If classified exists, sets classified target back to inst. Upgrade module stop inspecting commented out.
* **Parameters:**
  - `inst` -- backup body entity
  - `data` -- event data table (unused)
* **Returns:** None
* **Error states:** None.

### `OnSkillTreeInitializedFn(inst, owner)`
* **Description:** Callback when owner's skill tree initializes. If owner has no classified or TryToAddBackupBody fails, unlinks backup body and deactivates circuits/sockets. Otherwise checks all states from owner. If wx78_allegiance_lunar activated and is_possessed flag set, schedules TryToSpawnPossessedBody after 0 time. Otherwise calls ConfigurePossessed(false).
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if inst.components.linkeditem or owner.wx78_classified is nil (no guards present).

### `OnOwnerInstCreatedFn(inst, owner)`
* **Description:** Callback when owner entity is created. Starts global tracking icon for owner.
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if inst.components.globaltrackingicon is nil (no guard present).

### `OnOwnerInstRemovedFn(inst, owner)`
* **Description:** Callback when owner entity is removed. Resets global tracking icon to nil owner, deactivates beta circuits, and removes backup body from owner's classified if it exists.
* **Parameters:**
  - `inst` -- backup body entity
  - `owner` -- player owner entity
* **Returns:** None
* **Error states:** Errors if inst.components.globaltrackingicon or owner.wx78_classified is nil (no guards present).

### `OnUpgradeModuleAdded(inst, moduleent)`
* **Description:** Callback when upgrade module is added. Gets module type and index, then sets corresponding netvar in classified upgrademodulebars array to module's netid.
* **Parameters:**
  - `inst` -- backup body entity
  - `moduleent` -- added module entity
* **Returns:** None
* **Error states:** Errors if inst.wx78_classified or moduleent.components.upgrademodule is nil (no guards present).

### `OnUpgradeModuleRemoved(inst, moduleent)`
* **Description:** Callback when upgrade module is removed. Currently empty with TODO comment.
* **Parameters:**
  - `inst` -- backup body entity
  - `moduleent` -- removed module entity
* **Returns:** None
* **Error states:** None.

### `OnOneUpgradeModulePopped(inst, moduleent, was_activated)`
* **Description:** Callback when one module is popped. If module was activated, calculates charge cost (-slots, or -slots+1 with wx78_circuitry_bettercharge skill) and applies DoDeltaCharge. Updates classified netvar at removed index to 0.
* **Parameters:**
  - `inst` -- backup body entity
  - `moduleent` -- popped module entity
  - `was_activated` -- boolean if module was active
* **Returns:** None
* **Error states:** Errors if inst.components.linkeditem, inst.components.upgrademoduleowner, moduleent.components.upgrademodule, or owner.components.skilltreeupdater is nil (no guards present).

### `OnAllUpgradeModulesRemoved(inst)`
* **Description:** Callback when all modules are popped. If workable exists with work left, spawns big spark FX. Pushes upgrademoduleowner_popallmodules event. Clears all classified upgrademodulebars netvars to 0.
* **Parameters:** `inst` -- backup body entity
* **Returns:** None
* **Error states:** Errors if inst.components.workable or inst.wx78_classified is nil (no guards present).

### `ConfigurePossessed(inst, possessed, planar, stats)`
* **Description:** Sets possessed state flags. Stores possessed boolean, planar boolean, and stats table in inst properties for later TryToSpawnPossessedBody use.
* **Parameters:**
  - `inst` -- backup body entity
  - `possessed` -- boolean (default nil)
  - `planar` -- boolean (default nil)
  - `stats` -- table (default nil)
* **Returns:** None
* **Error states:** None.

### `GetPossessed(inst)`
* **Description:** Returns current possessed state flag.
* **Parameters:** `inst` -- backup body entity
* **Returns:** boolean or `nil`
* **Error states:** None.

### `RegisterGhostRezEvents(inst, doer)`
* **Description:** Registers ghost resurrection event listeners. Creates _ghostrez_respawned callback that unregisters events, checks activation, sets charge to 0, activates, and removes backup body. Creates _ghostrez_removed callback that just unregisters. Listens for ms_respawnedfromghost and onremove events on doer.
* **Parameters:**
  - `inst` -- backup body entity
  - `doer` -- ghost player entity
* **Returns:** None
* **Error states:** Errors if inst.components.activatable or inst.components.upgrademoduleowner is nil (no guards present).

### `UnregisterGhostRezEvents(inst, doer)`
* **Description:** Removes ghost resurrection event listeners and clears callback references.
* **Parameters:**
  - `inst` -- backup body entity
  - `doer` -- ghost player entity
* **Returns:** None
* **Error states:** None.

### `OnHaunt(inst, doer)`
* **Description:** Haunt interaction callback. Returns false if activatable check fails or if doer lacks wx78_ghostrevive_1 skill. Otherwise registers ghost rez events and returns true.
* **Parameters:**
  - `inst` -- backup body entity
  - `doer` -- haunting ghost player
* **Returns:** boolean `true` on success, `false` on failure
* **Error states:** Errors if inst.components.activatable or doer.components.skilltreeupdater is nil (no guards present).

### `AnimStateGetterFn(inst)`
* **Description:** Returns anim state from inventory child entity for hauntable component.
* **Parameters:** `inst` -- backup body entity
* **Returns:** AnimState from inst.wx78_backupbody_inventory
* **Error states:** Errors if inst.wx78_backupbody_inventory is nil (no guard present).

### `OnSave(inst, data)`
* **Description:** Save callback. Stores body_inventory save record, maxcharge, is_possessed, is_planar, and saved_stats in data table.
* **Parameters:**
  - `inst` -- backup body entity
  - `data` -- save data table (modified in place)
* **Returns:** None
* **Error states:** Errors if inst.wx78_backupbody_inventory is nil (no guard present).

### `OnLoad(inst, data, newents)`
* **Description:** Load callback. If body_inventory exists in data, removes current inventory child and spawns from save record, reparents, clears position, and adds to highlightchildren on non-dedicated. Restores maxcharge via SetMaxCharge. If is_possessed set, calls ConfigurePossessed with saved data.
* **Parameters:**
  - `inst` -- backup body entity
  - `data` -- load data table
  - `newents` -- entity mapping table
* **Returns:** None
* **Error states:** Errors if inst.wx78_backupbody_inventory or inst.components.upgrademoduleowner is nil (no guards present).

### `OnRemoveEntity(inst)`
* **Description:** Inventory child cleanup callback. Removes self from parent's highlightchildren array and clears array if empty. Called when inventory entity is removed.
* **Parameters:** `inst` -- inventory child entity
* **Returns:** None
* **Error states:** None.

### `OnEntityReplicated(inst)`
* **Description:** Inventory child replication callback. Gets parent entity, adds self to parent's highlightchildren array, stores parent reference, and registers OnRemoveEntity callback. Called on client when entity replicates.
* **Parameters:** `inst` -- inventory child entity
* **Returns:** None
* **Error states:** None.

## Events & listeners
**Listens to:**
- `onremove` (on classified) -- triggers DetachClassified_wx78 when classified child is removed
- `ms_respawnedfromghost` (on doer) -- triggers ghost resurrection completion in RegisterGhostRezEvents
- `onremove` (on doer) -- triggers ghost resurrection cleanup in RegisterGhostRezEvents

**Pushes:**
- `teleported` -- pushed on both inst and doer after body exchange in OnActivateFn
- `upgrademoduleowner_popallmodules` -- pushed when all modules are popped in OnAllUpgradeModulesRemoved
- `possessed` -- pushed on possessedbody entity in TryToSpawnPossessedBody with fromownerrejoin data

**World state watchers:**
- None identified.