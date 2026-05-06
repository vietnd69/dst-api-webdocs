---
id: wx78_common
title: WX78 Common
description: Utility module providing shared functions for WX-78 character systems including upgrade modules, dizzy effects, socket handling, and visual modifications.
tags: [wx78, utility, character]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: utilities
source_hash: 1bfcdc75
system_scope: player
---

# WX78 Common

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_common.lua` is a utility module that provides shared functions for WX-78 character systems. It is not a component or prefab file — instead, it exports a `WX78Common` table containing helper functions for upgrade module management, dizzy visual effects, heat/steam effects, socket handling, and visual modifications (mimic eyes, heart veins, trapper). The module is required by WX-78 prefab files and called during initialization to set up character-specific systems. Functions handle both master and client logic with appropriate `TheWorld.ismastersim` guards.

## Usage example
```lua
local WX78Common = require("prefabs/wx78_common")

-- In prefab master_postinit:
WX78Common.Initialize_Master(inst)
WX78Common.SetupUpgradeModuleOwnerInstanceFunctions(inst)

-- In prefab common_postinit (client + master):
WX78Common.Initialize_Common(inst)
WX78Common.AddDizzyFx_Common(inst)
WX78Common.AddHeatSteamFx_Common(inst)

-- Query module count:
local spinModules = inst:GetModuleTypeCount("spin")

-- Set visual state:
WX78Common.SetMimicEyes(inst, true, doer)
WX78Common.SetHeartVeins(inst, true)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- global balance constants for WX-78 values (max charge, dizzy thresholds, perish rates)
- `CIRCUIT_BARS` -- circuit bar type definitions for module slots
- `SOCKETQUALITY` -- socket quality tier constants (LOW, MEDIUM, HIGH)
- `ACTIONS` -- action enum for upgrade module action validation
- `PRNG_Uniform` -- seeded random number generator for mimic eye placement
- `MakeItemSocketable_Server` -- server-side socketable item setup
- `MakeInstSocketHolder_Client` -- client-side socket holder setup

**Components used:**
- `upgrademoduleowner` -- module slot management and charge level tracking
- `wx78_classified` -- backup body classified data fallback
- `timer` -- heat steam effect tick scheduling
- `heater` -- thermic temperature control
- `preserver` -- perish rate multiplier based on temperature
- `frostybreather` -- breath control for cold modules
- `socketholder` -- socket position management
- `socketable` -- socket item name and quality queries
- `socket_shadow_harvester` -- shadow socket low quality effect
- `socket_shadow_heart` -- shadow socket medium quality effect
- `socket_shadow_mimicry` -- shadow socket high quality effect
- `useabletargeteditem` -- socket item targeting configuration
- `linkeditem` -- owner user ID verification for socket permissions
- `updatelooper` -- dizzy effect update loop registration
- `SoundEmitter` -- dizzy sound playback and parameter control
- `AnimState` -- visual symbol show/hide for mimic eyes, veins, trapper

**Tags:**
- `possessable_chassis` -- added when gestalt trapper socket is active
- `DECOR` -- added to dizzy and steam effect entities
- `NOCLICK` -- added to effect entities to prevent interaction

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DEPENDENCIES` | table | --- | Table containing `assets` and `prefabs` arrays for WX-78 related entities. |
| `WX78_UPGRADE_MODULE_ACTIONS` | table | --- | Action validation table for `TOGGLEWXSCREECH` and `TOGGLEWXSHIELDING` actions. |
| `DEFAULT_ZEROS_MODULEDATA` | table | --- | Pre-initialized module data table with zeros for all circuit bars and slots. |
| `HEATSTEAM_TIMERNAME` | constant (local) | `"heatsteam_tick"` | Timer name for heat steam effect periodic triggers. |
| `HEATSTEAM_TICKRATE` | constant (local) | `5` | Seconds between heat steam effect ticks. |

## Main functions
### `GetMaxEnergy(inst)` (local)
* **Description:** Returns the maximum energy charge level for the WX-78 instance. Checks `upgrademoduleowner` first, then `wx78_classified` fallback, then returns `TUNING.WX78_INITIAL_MAXCHARGELEVEL` default.
* **Parameters:** `inst` -- entity instance
* **Returns:** number maximum charge level
* **Error states:** None — gracefully falls back through all checks.

### `GetEnergyLevel(inst)` (local)
* **Description:** Returns the current energy charge level. Checks `upgrademoduleowner.charge_level`, then `wx78_classified.currentenergylevel`, then returns `0` default.
* **Parameters:** `inst` -- entity instance
* **Returns:** number current charge level
* **Error states:** None — gracefully falls back through all checks.

### `GetModulesData(inst)` (local)
* **Description:** Returns module data table for all circuit bars. Populates with module `_netid` values from `upgrademoduleowner`, or calls `wx78_classified:GetModulesData()`, or returns `DEFAULT_ZEROS_MODULEDATA` fallback. Fills remaining slots with `0` to match `MAX_CIRCUIT_SLOTS`.
* **Parameters:** `inst` -- entity instance
* **Returns:** table module data indexed by bar type
* **Error states:** None — gracefully falls back through all checks.

### `CanUpgradeWithModule(inst, moduleent)` (local)
* **Description:** Validates whether a module can be installed. Counts existing slots in use for the module's bar type and checks if `max_charge - slots_inuse >= 0`. Falls back to `wx78_classified:CanUpgradeWithModule()` if available.
* **Parameters:**
  - `inst` -- entity instance
  - `moduleent` -- module entity or nil
* **Returns:** boolean `true` if module can be installed
* **Error states:** Returns `false` if `moduleent` is nil.

### `GetModuleTypeCount(inst, ...)` (local)
* **Description:** Counts installed modules of specified type(s). Accepts variable arguments — if first arg is a table, iterates through it; otherwise treats first arg as module name and remaining args as additional names. Sums counts from `GetModuleTypeCount_Internal`.
* **Parameters:**
  - `inst` -- entity instance
  - `...` -- module type name(s) as string args or single table arg
* **Returns:** number total count of matching modules
* **Error states:** None — handles nil module names gracefully via internal check.

### `UnplugModule(inst, moduletype, moduleindex)` (local)
* **Description:** Removes a module from the specified bar type and slot index. Pushes `unplugmodule` event with the module entity on master. Falls back to `wx78_classified:UnplugModule()` if available.
* **Parameters:**
  - `inst` -- entity instance
  - `moduletype` -- string bar type name
  - `moduleindex` -- integer slot index
* **Returns:** None
* **Error states:** None — silently returns if module not found.

### `CollectUpgradeModuleActions(inst, actions)` (local)
* **Description:** Collects valid WX-78 upgrade module actions into the actions table. Checks `wx78_classified.inherentactions` and validates each action via `WX78_UPGRADE_MODULE_ACTIONS` validfn. Used by entity action system.
* **Parameters:**
  - `inst` -- entity instance
  - `actions` -- table to insert valid actions into
* **Returns:** None (modifies actions table in-place)
* **Error states:** None — silently returns if `wx78_classified` or `inherentactions` is nil.

### `SetupUpgradeModuleOwnerInstanceFunctions(inst)` (local)
* **Description:** Attaches upgrade module helper functions directly to the instance. Sets `inst.GetMaxEnergy`, `inst.GetEnergyLevel`, `inst.GetModulesData`, `inst.CanUpgradeWithModule`, `inst.GetModuleTypeCount`, `inst.UnplugModule`, `inst.CollectUpgradeModuleActions`. Called during prefab initialization.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `CreateDizzyFx()` (local)
* **Description:** Creates a non-persistent dizzy visual effect entity. Adds `DECOR` and `NOCLICK` tags, sets up Transform, AnimState, and Follower components. Plays `dizzy_meter` animation from `player_wx78_actions` build.
* **Parameters:** None
* **Returns:** entity instance for dizzy effect
* **Error states:** None.

### `RemoveDizzyFx(inst)` (local)
* **Description:** Removes the dizzy effect entity and clears the removal task reference. Called after dizzy level returns to 0 with a 60 tick delay.
* **Parameters:** `inst` -- entity with `_dizzyfx` and `_dizzyfxremovaltask`
* **Returns:** None
* **Error states:** Errors if `inst._dizzyfx` is nil when called (should be guarded by caller).

### `OnDizzyLevel(inst)` (local)
* **Description:** Updates dizzy visual effect based on `dizzylevel` netvar. Shows/hides individual `dizzy1` through `dizzy6` symbols based on level. Creates effect entity if nil, or schedules removal task if level drops to 0. Client-only visual sync.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `SetDizzyLevel(inst, level)` (local)
* **Description:** Sets the dizzy level netvar and triggers visual update on non-dedicated clients. Only updates if value differs from current. Master sets function, client listens for dirty event.
* **Parameters:**
  - `inst` -- entity instance
  - `level` -- integer dizzy level (0-6)
* **Returns:** None
* **Error states:** None.

### `CalcMaxDizzy(inst)` (local)
* **Description:** Calculates maximum dizzy threshold based on spin module count. Returns `TUNING.WX78_SPIN_TIME_TO_DIZZY_2` if more than 1 spin module, otherwise `TUNING.WX78_SPIN_TIME_TO_DIZZY`.
* **Parameters:** `inst` -- entity instance
* **Returns:** number max dizzy threshold from TUNING
* **Error states:** None.

### `CalcRecoveredDizzy(inst)` (local)
* **Description:** Calculates recovered dizzy amount based on time elapsed since last spin. Uses quadratic decay formula: `dizzy - k * k * max` where `k = (GetTime() - wx_spin_last) / TUNING.WX78_SPIN_DIZZY_RECOVER_TIME`. Returns current dizzy and max values.
* **Parameters:** `inst` -- entity instance
* **Returns:** number dizzy, number max
* **Error states:** None — returns nil if `wx_spin_buildup` not set.

### `SetDizzySound(inst, level, recovering)` (local)
* **Description:** Controls dizzy sound loop playback and FMOD parameter. Remaps level to 0-0.6 range for `dizziness` parameter. Plays `WX_rework/dizzy/loop` if not already playing. Kills sound when level is 0.
* **Parameters:**
  - `inst` -- entity instance
  - `level` -- number remapped sound level
  - `recovering` -- boolean whether dizzy is recovering
* **Returns:** None
* **Error states:** None.

### `DizzyUpdate(inst)` (local)
* **Description:** Periodic update function for dizzy effects. Registered via updatelooper component. If in dizzy state, sets max level. Otherwise calculates recovered dizzy and updates visuals/sound. Removes itself from updatelooper when dizzy reaches 0.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `StartDizzyFx(inst)` (local)
* **Description:** Starts the dizzy effect update loop. Adds `updatelooper` component if missing, registers `DizzyUpdate` callback, and triggers initial update.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `AddDizzyFx_Common(inst)` (local)
* **Description:** Initializes dizzy effect system. Creates `dizzylevel` net_tinybyte netvar. On master, sets `SetDizzyLevel`, `StartDizzyFx`, `CalcMaxDizzy`, `CalcRecoveredDizzy` functions. On client, listens for `dizzyleveldirty` event.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnSteamFxTimeOut(inst)` (local)
* **Description:** Removes steam effect entity from scene and pool after timeout. Clears from `_steam_fx_pool` and nils pool if empty.
* **Parameters:** `inst` -- steam effect entity
* **Returns:** None
* **Error states:** None.

### `OnSteamFxAnimOver(inst)` (local)
* **Description:** Handles steam effect animation completion. Stops following, removes from scene, adds to `_steam_fx_pool` for reuse, and schedules 30 second timeout task.
* **Parameters:** `inst` -- steam effect entity
* **Returns:** None
* **Error states:** None.

### `CreateSteamFx(frame)` (local)
* **Description:** Creates or reuses a steam visual effect entity. Pulls from `_steam_fx_pool` if available, otherwise creates new entity with `wx_fx` anim bank/build. Plays `steam_<frame>` animation and listens for `animover` event.
* **Parameters:** `frame` -- integer animation frame number (1 or 2)
* **Returns:** entity instance for steam effect
* **Error states:** None.

### `OnSteamFx_NoFaced(inst)` (local)
* **Description:** Creates single steam effect for non-facing variant. Follows `headbase` symbol.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnSteamFx(inst)` (local)
* **Description:** Creates three steam effects with different offsets for standard variant. All follow `headbase` symbol with varying z-offsets.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `AddHeatSteamFx_Common(inst, nofacings)` (local)
* **Description:** Initializes heat steam effect system. Creates `steamfx` net_event. On non-dedicated clients, listens for `wx78_common.steamfx` event and calls appropriate handler based on `nofacings` flag.
* **Parameters:**
  - `inst` -- entity instance
  - `nofacings` -- boolean whether to use single or triple effect
* **Returns:** None
* **Error states:** None.

### `do_steam_fx(inst)` (local)
* **Description:** Pushes steamfx net_event and starts/restarts heat steam timer. Uses event listener pattern to support `wx78_backupbody` references.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnTimerFinished(inst, data)` (local)
* **Description:** Timer completion handler. Calls `do_steam_fx` when `HEATSTEAM_TIMERNAME` timer completes.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table with `name` field
* **Returns:** None
* **Error states:** None.

### `AddTemperatureModuleLeaning(inst, leaning_change)` (local)
* **Description:** Adjusts temperature module leaning value and updates heater, timer, and frostybreather components. Positive values enable exothermic heating with steam effects. Zero disables all. Negative values enable endothermic cooling with breath effects.
* **Parameters:**
  - `inst` -- entity instance
  - `leaning_change` -- number positive for warmer, negative for colder
* **Returns:** None
* **Error states:** None — assumes components exist (set during initialization).

### `ModuleBasedPreserverRateFn(inst, item)` (local)
* **Description:** Perish rate multiplier function for preserver component. Returns `TUNING.WX78_PERISH_HOTRATE` if leaning > 0, `TUNING.WX78_PERISH_COLDRATE` if leaning < 0, or `1` default.
* **Parameters:**
  - `inst` -- entity instance
  - `item` -- item entity (unused)
* **Returns:** number perish rate multiplier
* **Error states:** None.

### `GetThermicTemperatureFn(inst, observer)` (local)
* **Description:** Temperature function for heater component. Returns `inst._temperature_modulelean * TUNING.WX78_HEATERTEMPPERMODULE`.
* **Parameters:**
  - `inst` -- entity instance
  - `observer` -- observer entity (unused)
* **Returns:** number temperature offset
* **Error states:** None.

### `MakeItemSocketable(inst)` (local)
* **Description:** Sets up socketable item behavior. Calls `MakeItemSocketable_Server` and configures `useabletargeteditem` to allow self-targeting without toggling useability.
* **Parameters:** `inst` -- item entity instance
* **Returns:** None
* **Error states:** Errors if `useabletargeteditem` component is missing.

### `ShouldAllowSocketable_CLIENT(inst, item, doer)` (local)
* **Description:** Client-side socket permission check. Allows if `inst == doer` or if `linkeditem` owner user ID matches doer's user ID.
* **Parameters:**
  - `inst` -- socket holder entity
  - `item` -- socketable item
  - `doer` -- player attempting to socket
* **Returns:** boolean `true` if socketing is allowed
* **Error states:** None.

### `OnGetSocketable(inst, item, doer)` (local)
* **Description:** Handles socket item insertion. For `socket_shadow`, adds `socket_shadow_harvester` at LOW quality, `socket_shadow_heart` at MEDIUM, `socket_shadow_mimicry` at HIGH. For `socket_gestalttrapper`, adds `possessable_chassis` tag. Calls WX78Common visual setup functions.
* **Parameters:**
  - `inst` -- socket holder entity
  - `item` -- socketable item
  - `doer` -- player who socketed (can be nil)
* **Returns:** None
* **Error states:** None — checks component existence before access.

### `OnRemoveSocketable(inst, item)` (local)
* **Description:** Handles socket item removal. Removes shadow components in reverse quality order (HIGH to LOW). Removes `possessable_chassis` tag for gestalt trapper. Calls WX78Common visual teardown functions.
* **Parameters:**
  - `inst` -- socket holder entity
  - `item` -- socketable item being removed
* **Returns:** None
* **Error states:** None — checks component existence before removal.

### `ActivateSocketsIn(inst, socketposition, socketname)` (local)
* **Description:** Activates a socket at the specified position by setting the socket name.
* **Parameters:**
  - `inst` -- socket holder entity
  - `socketposition` -- integer position index
  - `socketname` -- string socket name or 0 to deactivate
* **Returns:** None
* **Error states:** None — silently returns if `socketholder` missing.

### `DeactivateSocketsIn(inst, socketposition)` (local)
* **Description:** Deactivates a socket at the specified position by setting socket name to 0.
* **Parameters:**
  - `inst` -- socket holder entity
  - `socketposition` -- integer position index
* **Returns:** None
* **Error states:** None — silently returns if `socketholder` missing.

### `ShowMimicEyes(inst, doer)` (local)
* **Description:** Randomly shows 1-3 mimic eye symbols using seeded PRNG based on world position. Ensures at least one eye is shown if random rolls fail. Uses `wx78_backupbody_inventory` animstate owner if available.
* **Parameters:**
  - `inst` -- entity instance
  - `doer` -- doer entity for position seed (optional)
* **Returns:** None
* **Error states:** None.

### `HideMimicEyes(inst)` (local)
* **Description:** Hides all three mimic eye symbols. Uses `wx78_backupbody_inventory` animstate owner if available.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnMimicEyesUpdated(inst, data)` (local)
* **Description:** Event handler for mimic eyes update. Calls `ShowMimicEyes` or `HideMimicEyes` based on `data.enabled`.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table with `enabled` and `doer` fields
* **Returns:** None
* **Error states:** None.

### `SetMimicEyes(inst, enabled, doer)` (local)
* **Description:** Sets mimic eyes enabled state and pushes `mimiceyes_update` event. Skips event push for player entities (handled in SGwilson). Stores state in `inst._has_mimiceyes`.
* **Parameters:**
  - `inst` -- entity instance
  - `enabled` -- boolean
  - `doer` -- doer entity (optional)
* **Returns:** None
* **Error states:** None.

### `HasMimicEyes(inst)` (local)
* **Description:** Returns whether mimic eyes are currently enabled. Checks `wx78_backupbody_inventory` if available.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean
* **Error states:** None.

### `HideVeins(animstateowner)` (local)
* **Description:** Hides shadow veins and mimic eyes, then removes itself from animover event. Used as event callback.
* **Parameters:** `animstateowner` -- entity with AnimState
* **Returns:** None
* **Error states:** None.

### `OnHeartVeinsChanged(inst, enabled)` (local)
* **Description:** Event handler for heart veins state change. Shows/hides `shad_veins` symbol and plays pre/post animations if in idle state. Shows mimic eyes if enabled.
* **Parameters:**
  - `inst` -- entity instance
  - `enabled` -- boolean
* **Returns:** None
* **Error states:** None.

### `SetHeartVeins(inst, enabled)` (local)
* **Description:** Sets heart veins enabled state and pushes `heartveins_changed` event. Skips event push for player entities. Stores state in `inst._has_heartveins`.
* **Parameters:**
  - `inst` -- entity instance
  - `enabled` -- boolean
* **Returns:** None
* **Error states:** None.

### `HasHeartVeins(inst)` (local)
* **Description:** Returns whether heart veins are currently enabled. Checks `wx78_backupbody_inventory` if available.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean
* **Error states:** None.

### `HideTrapper(animstateowner)` (local)
* **Description:** Hides trapper symbol and removes itself from animover event. Used as event callback.
* **Parameters:** `animstateowner` -- entity with AnimState
* **Returns:** None
* **Error states:** None.

### `OnTrapperChanged(inst, enabled)` (local)
* **Description:** Event handler for trapper state change. Shows/hides `trapper` symbol and plays pre/post animations with ratchet sound if in idle state.
* **Parameters:**
  - `inst` -- entity instance
  - `enabled` -- boolean
* **Returns:** None
* **Error states:** None.

### `SetTrapper(inst, enabled)` (local)
* **Description:** Sets trapper enabled state and pushes `trapper_changed` event. Skips event push for player entities. Stores state in `inst._has_trapper`.
* **Returns:** None
* **Error states:** None.

### `HasTrapper(inst)` (local)
* **Description:** Returns whether trapper is currently enabled. Checks `wx78_backupbody_inventory` if available.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean
* **Error states:** None.

### `OnWxSpinActions(inst, actionsdata)` (local)
* **Description:** Event handler for spin actions. Prioritizes ATTACK action from actionsdata array and stores action, target, and time in instance memory for spin tracking.
* **Parameters:**
  - `inst` -- entity instance
  - `actionsdata` -- array of action data tables
* **Returns:** None
* **Error states:** None.

### `CanSpinUsingItem(item)` (local)
* **Description:** Validates whether an item can be used for spinning. On master, checks `tool` component for CHOP or MINE actions. On client, checks for `CHOP_tool` or `MINE_tool` tags. Assigns appropriate function to `WX78Common.CanSpinUsingItem` on first call.
* **Parameters:** `item` -- item entity or nil
* **Returns:** boolean
* **Error states:** None.

### `Initialize_Common(inst)` (local)
* **Description:** Client-side initialization (runs on both client and master). Sets up socket holder client functions and hides all WX-78 visual symbols (veins, mimic eyes, trapper, gestalt states).
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `Initialize_Master(inst)` (local)
* **Description:** Master-only initialization. Sets `_temperature_modulelean` to 0, adds and configures `heater` and `preserver` components, listens for `timerdone` event, sets socket holder callbacks, and listens for visual state events (mimiceyes, heartveins, trapper) or spin actions for players.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — assumes components are added by calling prefab.

## Events & listeners
**Listens to:**
- `dizzyleveldirty` (client only) — triggers OnDizzyLevel; updates dizzy visual effect symbols
- `wx78_common.steamfx` (client only) — triggers OnSteamFx or OnSteamFx_NoFaced; creates steam visual effects
- `timerdone` (master only) — triggers OnTimerFinished; continues heat steam effect ticks
- `mimiceyes_update` (master only, non-player) — triggers OnMimicEyesUpdated; shows/hides mimic eye symbols
- `heartveins_changed` (master only, non-player) — triggers OnHeartVeinsChanged; shows/hides shadow veins
- `trapper_changed` (master only, non-player) — triggers OnTrapperChanged; shows/hides trapper symbol
- `ms_wx_spinactions` (master only, player) — triggers OnWxSpinActions; tracks spin attack actions
- `animover` (effect entities) — triggers HideVeins, HideTrapper, OnSteamFxAnimOver; cleanup after animations

**Pushes:**
- `unplugmodule` — data: module entity; fired when module is unplugged
- `mimiceyes_update` — data: `{enabled = boolean, doer = entity}`; fired when mimic eyes state changes
- `heartveins_changed` — data: boolean enabled; fired when heart veins state changes
- `trapper_changed` — data: boolean enabled; fired when trapper state changes