---
id: deerclopsspawner
title: Deerclopsspawner
description: Manages Deerclops boss spawning, timing, and attack cycles on the server.
tags: [boss, spawning, seasonal, server]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 0860486c
system_scope: entity
---

# Deerclopsspawner

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Deerclopsspawner` controls the seasonal spawning and attack patterns of the Deerclops boss entity. It tracks active players, manages warning periods before attacks, and coordinates spawn timing through the world settings timer system. This component only operates on the master server simulation and will error if instantiated on a client.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deerclopsspawner")
inst.components.deerclopsspawner:OnPostInit()

-- Debug summon (server only)
if TheWorld.ismastersim then
    inst.components.deerclopsspawner:SummonMonster(ThePlayer)
end

-- Get debug status
print(inst.components.deerclopsspawner:GetDebugString())
```

## Dependencies & tags
**External dependencies:**
- `easing` -- imported but unused in this file

**Components used:**
- `worldsettingstimer` -- manages attack timer via `TheWorld.components.worldsettingstimer`
- `areaaware` -- checked on players to verify valid spawn areas
- `talker` -- used for warning speech announcements to players
- `knownlocations` -- stores target base location for spawned Deerclops

**Tags:**
- `structure` -- checked when selecting attack targets
- `deerclops` -- checked to prevent duplicate spawns
- `nohasslers` -- area tag checked to exclude players from targeting

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component. |

## Main functions
### `SetAttacksPerWinter(attacks)`
* **Description:** Deprecated function. Previously set the number of Deerclops attacks per winter season.
* **Parameters:** `attacks` -- number of attacks (ignored in current implementation).
* **Returns:** None.
* **Error states:** None.

### `OverrideAttacksPerSeason(name, num)`
* **Description:** Deprecated function. Previously allowed overriding attack count per season.
* **Parameters:**
  - `name` -- string identifier (ignored).
  - `num` -- number of attacks (ignored).
* **Returns:** None.
* **Error states:** None.

### `OverrideAttackDuringOffSeason(name, bool)`
* **Description:** Deprecated function. Previously allowed enabling attacks outside winter season.
* **Parameters:**
  - `name` -- string identifier (ignored).
  - `bool` -- boolean to enable off-season attacks (ignored).
* **Returns:** None.
* **Error states:** None.

### `OnPostInit()`
* **Description:** Initializes the attack timer and calculates attack delay based on winter length. Registers the Deerclops timer with the world settings timer system.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if `TheWorld.components.worldsettingstimer` is nil when calling `AddTimer()`.

### `DoWarningSpeech(_targetplayer)`
* **Description:** Triggers warning announcement speech for the target player and nearby players within twice the hassler spawn distance.
* **Parameters:** `_targetplayer` -- player entity to target for warnings.
* **Returns:** None.
* **Error states:** Errors if any active player near the target lacks a `talker` component when `Say()` is called.

### `DoWarningSound(_targetplayer)`
* **Description:** Spawns a warning sound prefab at the target player's position. Sound level varies based on time remaining until attack.
* **Parameters:** `_targetplayer` -- player entity to spawn sound near.
* **Returns:** None.
* **Error states:** Errors if `_targetplayer.Transform` is nil when getting world position.

### `OnUpdate(dt)`
* **Description:** Main update loop that checks timer status, manages warning state, and triggers warning speech/sounds during the warning period before attack.
* **Parameters:** `dt` -- delta time in seconds.
* **Returns:** None.
* **Error states:** None.

### `LongUpdate(dt)`
* **Description:** Calls `OnUpdate(dt)`. Provided for compatibility with component update systems that distinguish short and long updates.
* **Parameters:** `dt` -- delta time in seconds.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Returns save data including warning state, stored hassler record, and active hassler GUID.
* **Parameters:** None.
* **Returns:** `data` (table) containing `warning`, `storedhassler`, `activehassler`; `ents` (array) of entity GUIDs.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores component state from save data including warning flag and stored hassler record. Handles legacy `timetoattack` field migration.
* **Parameters:** `data` -- table containing saved component state.
* **Returns:** None.
* **Error states:** None.

### `LoadPostPass(newents, savedata)`
* **Description:** Resolves active hassler entity reference after all entities are loaded. Maps saved GUID to actual entity instance.
* **Parameters:**
  - `newents` -- table mapping GUIDs to loaded entities.
  - `savedata` -- saved component data containing `activehassler` GUID.
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current spawner state including timer status, warning state, target player, and active/stored hassler info.
* **Parameters:** None.
* **Returns:** String containing debug information.
* **Error states:** None.

### `SummonMonster(player)`
* **Description:** Debug function that forces Deerclops to spawn in 10 seconds. Sets or resumes the attack timer and starts component updating.
* **Parameters:** `player` -- player entity (used for context, not strictly required).
* **Returns:** None.
* **Error states:** Errors if `TheWorld.components.worldsettingstimer` is nil when accessing timer methods.

## Events & listeners
- **Listens to:** `ms_playerjoined` -- adds player to active players list and checks attack conditions.
- **Listens to:** `ms_playerleft` -- removes player from active list; triggers target loss if leaving player was the target.
- **Listens to:** `hasslerremoved` -- clears active hassler reference and checks for next attack.
- **Listens to:** `hasslerkilled` -- clears active hassler and triggers next attack with killed delay multiplier.
- **Listens to:** `storehassler` -- saves hassler entity record for persistence.
- **Listens to:** `megaflare_detonated` -- chance to spawn Deerclops during megaflare event if conditions allow.
- **Watches world state:** `season` -- triggers attack check on season change.
- **Watches world state:** `cycles` -- watches until `NO_BOSS_TIME` cycle threshold is passed.