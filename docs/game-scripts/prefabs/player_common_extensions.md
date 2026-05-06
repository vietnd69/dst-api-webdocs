---
id: player_common_extensions
title: Player Common Extensions
description: A utility module providing shared helper functions for player entity lifecycle management, including death, resurrection, locomotion configuration, and network synchronization.
tags: [player, lifecycle, network, utility]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 4e987437
system_scope: player
---

# Player Common Extensions

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`player_common_extensions` is a utility module that consolidates shared logic for player entities to prevent the main `player_common` prefab file from becoming too large. It exports a table of functions used to configure player behavior, manage death and resurrection sequences, handle ghost transitions, synchronize network state (such as skill trees), and manage cosmetic or audio overrides. These functions are typically attached to player instances during initialization or registered as event callbacks.

## Usage example
```lua
local PlayerExtensions = require("prefabs.player_common_extensions")

-- During player initialization
local inst = CreateEntity()
PlayerExtensions.ConfigurePlayerLocomotor(inst)
PlayerExtensions.SetupBaseSymbolVisibility(inst)

-- Registering event handlers
inst:ListenForEvent("respawnfromghost", function(inst, data)
    PlayerExtensions.OnRespawnFromGhost(inst, data)
end)

-- Managing death sequence
PlayerExtensions.OnPlayerDeath(inst, { cause = "starvation" })
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- access to game balance constants (speeds, health values, thresholds)
- `STRINGS` -- localization strings for announcements
- `TheNet` -- network announcements and session management
- `TheSim` -- entity spawning and skeleton checks
- `TheWorld` -- world state and event pushing
- `TheSkillTree` -- skill tree backup and initialization
- `TheScrapbookPartitions` -- codex/scrapbook state management
- `RPC` -- remote procedure calls for client-server sync

**Components used:**
- `locomotor` -- configures walk/run speeds, path caps, and hopping
- `playeractionpicker` -- manages action filters (ghost/paused states)
- `inventory` -- manages item dropping, equipping, and visibility
- `health` -- handles invincibility, healing, and current health values
- `age` -- pauses/resumes aging during death states
- `skilltreeupdater` -- synchronizes skill tree data
- `revivablecorpse` -- manages corpse state and revive percentages
- `leader` -- manages followers during death cleanup
- `socketholder` -- unsockets items on death
- `container` -- drops container contents on death
- `talker` -- suppresses speech during death/revive
- `burnable` -- configures burn time and charring
- `freezable` -- resets freeze state and sets resistance
- `grogginess` -- configures knockout tests and resistance
- `moisture` -- forces dry state on death/revive
- `sheltered` -- starts/stops shelter status
- `debuffable` -- enables/disables debuffs
- `sanity` -- sets percent and ignore flags
- `hunger` -- pauses/resumes and sets percent
- `temperature` -- sets temperature and resumes updates
- `frostybreather` -- enables/disables breath effects
- `skinner` -- switches skin modes (ghost/normal)
- `bloomer` -- applies ghost bloom effects
- `playercontroller` -- enables/disables input
- `commander` -- shares targets with soldiers
- `follower` -- stops followers on death
- `petleash` -- checks pet status for death attribution
- `maprevealable` -- updates map exploration state
- `cookbookupdater` -- learns recipes on eat
- `plantregistryupdater` -- learns plant stages and fertilizer data
- `upgrademoduleowner` -- checks charge status for WX-78 revive
- `slipperyfeet` -- added on resurrection

**Tags:**
- `playerghost` -- added when becoming a ghost, removed on respawn
- `corpse` -- added/removed by `revivablecorpse` component
- `reviving` -- added during resurrection sequence
- `NOCLICK` -- added during Lava Arena intermission respawn
- `spook_protection` -- checked to prevent sanity drain
- `spiderwhisperer` -- check -- determines creep interaction in locomotor configuration

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. This module returns a table of functions. |

## Main functions
### `ShouldKnockout(inst)`
*   **Description:** Tests if player should be knocked out using DefaultKnockoutTest and checks for yawn state tag.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst.sg` is nil (calls HasStateTag without guard).

### `ConfigurePlayerLocomotor(inst)`
*   **Description:** Configures movement parameters for a living player, including speeds, path caps, and creep interaction. Calls `ExtraConfigurePlayerLocomotor` if defined on the instance.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks a `locomotor` component.

### `ConfigureGhostLocomotor(inst)`
*   **Description:** Configures movement parameters for a ghost player (slower, no road bonus, no platform hopping).
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks a `locomotor` component.

### `ConfigurePlayerActions(inst)`
*   **Description:** Removes the ghost action filter, restoring normal action availability.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks for `playeractionpicker` existence).

### `ConfigureGhostActions(inst)`
*   **Description:** Pushes the ghost action filter, restricting actions to ghost-valid ones.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks for `playeractionpicker` existence).

### `OnPlayerDeath(inst, data)`
*   **Description:** Initiates the death sequence. Handles inventory hiding, aging pause, death cause recording, and morgue records. Triggers `ms_closepopups`.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `cause` and `afflicter` info.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `inventory`, `age`, `skilltreeupdater`, or `health` components.

### `OnPlayerDied(inst, data)`
*   **Description:** Callback after death is confirmed. Schedules the fade-out and removal sequence.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- optional data table (checks for `skeleton` flag).
*   **Returns:** None.
*   **Error states:** None.

### `OnWorldPaused(inst)`
*   **Description:** Pauses or unpauses player actions based on server pause state.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks `TheNet:IsServerPaused`).

### `OnMakePlayerGhost(inst, data)`
*   **Description:** Transforms the player into a ghost. Switches stategraph, applies ghost visuals, configures ghost locomotion, and pushes `ms_becameghost`.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- optional table (checks for `loading` and `skeleton` flags).
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `skinner`, `bloomer`, `health`, or `playercontroller` components.

### `OnMakePlayerCorpse(inst, data)`
*   **Description:** Transforms the player into a corpse (revivable). Removes physics, sets `revivablecorpse` state, and pushes `ms_becameghost`.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- optional table (checks for `loading` flag).
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `revivablecorpse` component.

### `OnRespawnFromGhost(inst, data)`
*   **Description:** Handles the resurrection process from ghost state. Manages camera, movement to source, and triggers `DoActualRez` or `DoMoveToRezSource` based on the resurrection item.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `source` (resurrector item/entity) and `user`.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `playercontroller`, `talker`, or `sg` (stategraph).

### `OnRespawnFromPlayerCorpse(inst, data)`
*   **Description:** Handles resurrection specifically from a player corpse entity. Triggers `DoActualRezFromCorpse`.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `source`.
*   **Returns:** None.
*   **Error states:** None (checks for `corpse` tag).

### `OnDeathTriggerVineSave(inst)`
*   **Description:** Handles death logic for Winona's Charlie vine save mechanic. Records morgue entry and serializes session.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None.

### `OnRespawnFromVineSave(inst)`
*   **Description:** Handles resurrection logic for Winona's Charlie vine save. Restores health, sanity, hunger, and clears death flags.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `inventory`, `burnable`, `freezable`, `grogginess`, `moisture`, `temperature`, `debuffable`, `sanity`, `hunger`, or `health` components.

### `OnSpooked(inst)`
*   **Description:** Applies sanity drain when spooked, unless protected by equipment or game mode.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `inventory` or `sanity` components.

### `OnLearnCookbookRecipe(inst, data)`
*   **Description:** Updates cookbook knowledge when a recipe is learned.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `product` and `ingredients`.
*   **Returns:** None.
*   **Error states:** None (checks for `cookbookupdater`).

### `OnLearnCookbookStats(inst, product)`
*   **Description:** Updates cookbook food stats knowledge when eating prepared food.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `product` -- food prefab name or basename.
*   **Returns:** None.
*   **Error states:** None (checks for `cookbookupdater` component).

### `OnEat(inst, data)`
*   **Description:** Triggers cookbook stat learning when eating prepared food.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `food` entity.
*   **Returns:** None.
*   **Error states:** None.

### `OnLearnPlantStage(inst, data)`
*   **Description:** Updates plant registry when a plant stage is observed.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `plant` and `stage`.
*   **Returns:** None.
*   **Error states:** None (checks for `plantregistryupdater`).

### `OnLearnFertilizer(inst, data)`
*   **Description:** Updates plant registry when fertilizer is learned.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `fertilizer`.
*   **Returns:** None.
*   **Error states:** None (checks for `plantregistryupdater` component).

### `OnTakeOversizedPicture(inst, data)`
*   **Description:** Records oversized plant picture in plant registry.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `plant`, `weight`, `beardskin`, `beardlength`.
*   **Returns:** None.
*   **Error states:** None (checks for `plantregistryupdater` component).

### `GivePlayerStartingItems(inst, items, starting_item_skins)`
*   **Description:** Equips or gives initial inventory items to the player. Handles equippables vs. non-equippables.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `items` -- array of prefab names.
    - `starting_item_skins` -- optional table mapping prefab to skin name.
*   **Returns:** None.
*   **Error states:** None

### `CanSeeTileOnMiniMap(inst, tx, ty)`
*   **Description:** Checks if a specific map tile is visible to the player.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `tx` -- tile X coordinate.
    - `ty` -- tile Y coordinate.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst` lacks `player_classified.MapExplorer`.

### `CanSeePointOnMiniMap(inst, px, py, pz)`
*   **Description:** Checks if a world position is visible on the minimap by converting to tile coordinates.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `px` -- world position X coordinate.
    - `py` -- world position Y coordinate.
    - `pz` -- world position Z coordinate.
*   **Returns:** Boolean.
*   **Error states:** Errors if `TheWorld.Map` or `inst.player_classified.MapExplorer` is unavailable.

### `GetSeeableTilePercent(inst)`
*   **Description:** Calculates the percentage of the map tiles seen by the player.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** Number (0 `<=` percent `<=` 1).
*   **Error states:** Errors if `TheWorld.Map` or `inst.player_classified.MapExplorer` is unavailable.

### `MakeGenericCommander(inst)`
*   **Description:** Adds the `commander` component if missing and sets up target sharing on attack.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None.

### `OnMurderCheckForFishRepel(inst, data)`
*   **Description:** Checks if killing a fish causes merm followers to disapprove and stop following.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `data` -- table containing `victim` and `negligent` flag.
*   **Returns:** None.
*   **Error states:** Errors if `inst` lacks `leader` or `health` components.

### `OnOnStageEvent(inst, duration)`
*   **Description:** Marks the player as acting/on-stage for a specific duration.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `duration` -- time in ticks (default `FRAMES`).
*   **Returns:** None.
*   **Error states:** None.

### `IsActing(inst)`
*   **Description:** Checks if the player is currently acting or on-stage.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst.sg` is nil.

### `StartStageActing(inst)`
*   **Description:** Hides action hints while acting.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks for `ShowActions`).

### `StopStageActing(inst)`
*   **Description:** Shows action hints after acting ends.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks for `ShowActions`).

### `SetClientAuthoritativeSetting(inst, variable, value)`
*   **Description:** Stores a client-authoritative setting on the player entity (e.g., platform hop delay). Validates input.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `variable` -- setting ID (uint).
    - `value` -- setting value.
*   **Returns:** None.
*   **Error states:** None (returns early on invalid input).

### `SynchronizeOneClientAuthoritativeSetting(inst, variable, value)`
*   **Description:** Sets a client-authoritative setting on the player entity and syncs to server if on client.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `variable` -- CLIENTAUTHORITATIVESETTINGS enum.
    - `value` -- setting value.
*   **Returns:** None.
*   **Error states:** None (sends RPC to server if `TheWorld.ismastersim` is false).



### `PostActivateHandshake(inst, state)`
*   **Description:** Manages the handshake state machine for skill tree synchronization between client and server.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `state` -- `POSTACTIVATEHANDSHAKE` enum value.
*   **Returns:** None.
*   **Error states:** None.

### `OnClosePopups(inst)`
*   **Description:** Forces specific UI popups (like Player Info) to close.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None.

### `UpdateScrapbook(inst)`
*   **Description:** Updates scrapbook/codex entries for entities found near the player.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `TheSim` or `TheScrapbookPartitions` is unavailable.

### `MapRevealable_OnIconCreatedFn(inst)`
*   **Description:** Sets the display name on a globalmapiconnamed icon when created for maprevealable component.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** None (checks for `maprevealable` component and icon prefab).

### `EnableTargetLocking(inst, enable)`
*   **Description:** Toggles controller target locking availability.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `enable` -- boolean.
*   **Returns:** None.
*   **Error states:** None (checks for `playercontroller`).

### `CommandWheelAllowsGameplay(inst, enable)`
*   **Description:** Toggles whether the command wheel blocks other gameplay inputs.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `enable` -- boolean.
*   **Returns:** None.
*   **Error states:** None (checks for `playercontroller` and `HUD`).

### `OnStartJoust(inst)`
*   **Description:** Starts the jousting trail effect task.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** Boolean (`true`).
*   **Error states:** Errors if `inst.sg` is nil (no guard before accessing `inst.sg.mem.jousttrailtask`).

### `OnEndJoust(inst)`
*   **Description:** Cancels the jousting trail effect task.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst.sg` is nil (no guard before accessing `inst.sg.mem.jousttrailtask`).

### `CalcGallopSpeedMult(inst, time_moving)`
*   **Description:** Calculates speed multiplier based on gallop duration for YotC knightstick.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `time_moving` -- number of seconds moving.
*   **Returns:** Number (speed multiplier).
*   **Error states:** Errors if `inst.sg` is nil (no guard before accessing `inst.sg.statemem`).

### `TryGallopTripUpdate(inst)`
*   **Description:** Tracks rotation stress to determine if the player should trip while galloping.
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** Boolean (`true` if trip condition met).
*   **Error states:** Errors if `inst.sg` is nil (no guard before accessing `inst.sg.statemem`).

### `FootstepOverrideFn(inst, volume, ispredicted)`
*   **Description:** Plays custom footstep sounds based on clothing skins. Returns `true` to block default sounds.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `volume` -- sound volume.
    - `ispredicted` -- boolean for prediction state.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil (no guard before member access).

### `FoleyOverrideFn(inst, volume, ispredicted)`
*   **Description:** Plays custom foley sounds based on clothing skins. Returns `true` to block default sounds.
*   **Parameters:**
    - `inst` -- player entity instance.
    - `volume` -- sound volume.
    - `ispredicted` -- boolean for prediction state.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst.SoundEmitter` is nil (no guard before member access).

### `SetupBaseSymbolVisibility(inst)`
*   **Description:** Configures default animation symbol visibility (hides hats, shows hair/head).
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst.AnimState` is nil.

### `SetupOverrideBuilds(inst)`
*   **Description:** Adds override builds for various player actions (fishing, farming, combat, etc.).
*   **Parameters:** `inst` -- player entity instance.
*   **Returns:** None.
*   **Error states:** Errors if `inst.AnimState` is nil.

## Events & listeners
- **Listens to:**
  - `onattackother` -- registered in `MakeGenericCommander` to share targets.
- **Pushes:**
  - `ms_closepopups` -- fired during death sequence.
  - `ms_becameghost` -- fired when transitioning to ghost or corpse.
  - `ms_respawnedfromghost` -- fired when resurrecting from ghost or corpse.
  - `skilltreeinitialized_client` -- fired when client skill tree handshake completes.
  - `ms_skilltreeinitialized` -- fired when server skill tree handshake completes.