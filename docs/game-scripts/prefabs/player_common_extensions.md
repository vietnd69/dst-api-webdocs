---
id: player_common_extensions
title: Player Common Extensions
description: Provides shared logic for player lifecycle management including death, resurrection, locomotion, actions, mini-map visibility, and commander/leader behaviors.
tags: [player, lifecycle, animation, leadership, networking]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9933ac7
system_scope: player
---

# Player Common Extensions

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This component defines core player behavior shared across game modes and character variants. It manages player death and resurrection sequences (including ghost conversion, corpse handling, vine saves, and item-based revivals), locomotor configuration (walk/run speeds, platform hopping, creep behavior), action filtering (ghost/paused states), mini-map visibility, stage acting, client-authoritative settings synchronization, and leader/field commander interactions (e.g., fish repel). It integrates deeply with components like health, hunger, sanity, inventory, and locomotor, and interacts with systems like the map explorer, scrapbook, and skill tree.

## Usage example
```lua
-- Configure a new player's locomotion and actions
local player = TheWorld:SpawnPrefab("wilson")
player:AddComponent("player_common_extensions")

ConfigurePlayerLocomotor(player)
ConfigurePlayerActions(player)

-- Trigger respawn from ghost using amulet
player:PushEvent("respawnfromghost", { source = amulet_entity })

-- Handle spook event to reduce sanity
player:PushEvent("spooked")
```

## Dependencies & tags
**Components used:**
`health`, `hunger`, `temperature`, `sanity`, `burnable`, `freezable`, `grogginess`, `slipperyfeet`, `debuffable`, `sheltered`, `moisture`, `inventory`, `age`, `revivablecorpse`, `skinner`, `boomer`, `playercontroller`, `talker`, `cookbookupdater`, `plantregistryupdater`, `follower`, `leader`, `commander`, `container`, `frostybreather`, `propagator`, `light`, `playeractionpicker`, `MapExplorer`, `scrapbook`, `globalmapiconnamed`

**Tags:**
`yawn`, `spiderwhisperer`, `playerghost`, `corpse`, `reviving`, `NOCLICK`, `player`, `reviver`, `multiplayer_portal`, `playerskeleton`, `spook_protection`, `preparedfood`, `wereplayer`, `winona_charlie_2`, `ghost`, `fish`, `merm`, `mermking`, `FX`, `INLIMBO`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._is_onstage_task` | Task | `nil` | Reference to active "acting" timer task. |
| `inst.rotation_tracker` | Table | `{}` | History of rotation changes for gallop tripping logic. |
| `inst.jousttrailtask` | Task | `nil` | Task spawned during joust for foot-dig FX. |
| `inst.rezsource` | Entity | `nil` | Source used for resurrection (amulet, stone, etc.). |
| `inst.remoterezsource` | Boolean | `false` | Indicates remote resurrection (e.g., from portal). |
| `inst.last_death_position` | Vector3 | `nil` | Position where player died (used for respawn). |
| `inst.last_death_shardid` | String/nil | `nil` | Shard ID at time of death (cross-shard respawn support). |
| `inst.skeleton_prefab` | String/nil | `nil` | Prefab name for spawned skeleton. |
| `inst._horseshoe_sound` | String/nil | `nil` | Track current horseshoe sound to avoid double-play. |

## Main functions
### `ShouldKnockout(inst)`
* **Description:** Determines if the player should be knocked out by combining the default knockout test with a check that the player is not currently in a yawn state.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `true` if knockout should occur, `false` otherwise.

### `GetHopDistance(inst, speed_mult)`
* **Description:** Returns the hop distance multiplier based on speed multiplier thresholds (0.8 and 1.2), selecting between short, normal, or far hop distances defined in `TUNING`.
* **Parameters:** `inst` — entity instance (unused), `speed_mult` — multiplier for speed (e.g., 1.0 for normal).
* **Returns:** One of `TUNING.WILSON_HOP_DISTANCE_SHORT`, `TUNING.WILSON_HOP_DISTANCE`, or `TUNING.WILSON_HOP_DISTANCE_FAR`.

### `ConfigurePlayerLocomotor(inst)`
* **Description:** Configures the player’s locomotor component with standard walk/run speeds, platform hopping enabled, hop delay, and creep sensitivity based on the `spiderwhisperer` tag.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `ConfigureGhostLocomotor(inst)`
* **Description:** Configures the player’s locomotor for ghost state: slower speeds, no platform hopping, and no creep triggering.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `GhostActionFilter(inst, action)`
* **Description:** Filters actions available to ghosts, only allowing those marked `ghost_valid`.
* **Parameters:** `inst` — entity instance (unused), `action` — action table.
* **Returns:** `action.ghost_valid`.

### `ConfigurePlayerActions(inst)`
* **Description:** Removes the ghost action filter if present, restoring full action set.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `ConfigureGhostActions(inst)`
* **Description:** Pushes the `GhostActionFilter` with `ACTION_FILTER_PRIORITIES.ghost` to restrict available actions for ghosts.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `PausedActionFilter(inst, action)`
* **Description:** Filters actions available during game pause, only allowing those marked `paused_valid`.
* **Parameters:** `inst` — entity instance (unused), `action` — action table.
* **Returns:** `action.paused_valid`.

### `UnpausePlayerActions(inst)`
* **Description:** Removes the paused action filter when resuming gameplay.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `PausePlayerActions(inst)`
* **Description:** Removes any existing paused filter and reapplies `PausedActionFilter` with `ACTION_FILTER_PRIORITIES.paused`.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `OnWorldPaused(inst)`
* **Description:** Detects whether the world/server is paused and synchronizes player action state accordingly (pause/unpause).
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `SpawnDeathProduct(inst)`
* **Description:** Spawns an appropriate death product (corpse, skeleton, or shallow grave) based on game mode, settings, and entity properties.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** One of `DEATH_PRODUCTS.CORPSE`, `DEATH_PRODUCTS.SKELETON`, or `DEATH_PRODUCTS.SHALLOW_GRAVE`.

### `RemoveDeadPlayer(inst, spawnskeleton)`
* **Description:** Performs final cleanup after death: drops follower items, deserializes user session, and removes the entity.
* **Parameters:** `inst` — the player entity instance, `spawnskeleton` — boolean indicating whether skeleton should be spawned.
* **Returns:** `nil`.

### `FadeOutDeadPlayer(inst, spawnskeleton)`
* **Description:** Initiates screen fade-out and schedules `RemoveDeadPlayer` after a fixed delay.
* **Parameters:** `inst` — the player entity instance, `spawnskeleton` — passed through to `RemoveDeadPlayer`.
* **Returns:** `nil`.

### `OnPlayerDied(inst, data)`
* **Description:** Begins death sequence: schedules fade-out (3-second delay), handles death metadata and Charlie vine save logic.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `skeleton` flag.
* **Returns:** `nil`.

### `IsCharlieRose(item)`
* **Description:** Checks if the given item is a `"charlierose"`.
* **Parameters:** `item` — the item entity instance.
* **Returns:** `true` if `item.prefab == "charlierose"`, else `false`.

### `OnPlayerDeath(inst, data)`
* **Description:** Initiates death handling: hides inventory, saves death metadata, handles Charlie vine save logic, suppresses announcements when appropriate.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `cause`, `afflicter`.
* **Returns:** `nil`.

### `CommonActualRez(inst)`
* **Description:** Shared resurrection logic: re-enables health/hunger/temperature/sanity/etc., configures locomotor and actions, and announces resurrection if multiplayer.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `DoActualRez(inst, source, item)`
* **Description:** Resurrects the player from ghost state using a resurrection source or item (e.g., amulet, pocketwatch, telltale heart).
* **Parameters:** `inst` — the player entity instance, `source` — optional resurrection source entity (e.g., `"amulet"`), `item` — optional resurrection item (e.g., `"pocketwatch_revive"`).
* **Returns:** `nil`.

### `DoActualRezFromCorpse(inst, source)`
* **Description:** Resurrects the player directly from their own corpse, applying revived health percent and optional `corpsereviver` bonuses.
* **Parameters:** `inst` — the corpse entity instance (must have `"corpse"` tag), `source` — optional reviver entity.
* **Returns:** `nil`.

### `DoRezDelay(inst, source, delay)`
* **Description:** Implements retry logic with countdown before resurrection, used for smooth transition timing. Recursively decrements delay.
* **Parameters:** `inst` — the player entity instance, `source` — resurrection source entity, `delay` — remaining time (in frames).
* **Returns:** `nil`.

### `DoMoveToRezSource(inst, source, delay)`
* **Description:** Moves the player to the resurrection source before resuming resurrection logic.
* **Parameters:** `inst` — the player entity instance, `source` — resurrection source entity, `delay` — delay before `DoRezDelay`.
* **Returns:** `nil`.

### `DoMoveToRezPosition(inst, item, delay, fade_in)`
* **Description:** Moves the player to their last death position (or resurrects immediately if position unavailable). Handles cross-shard migration.
* **Parameters:** `inst` — the player entity instance, `item` — resurrection item (for logging), `delay` — delay before `DoActualRez`, `fade_in` — whether to fade screen in.
* **Returns:** `nil`.

### `OnRespawnFromGhost(inst, data)`
* **Description:** Main entry point for ghost-to-player resurrection. Handles source detection, movement, and scheduling of resurrection steps.
* **Parameters:** `inst` — the ghost entity instance, `data` — optional table containing `source`, `user`, `from_haunt`.
* **Returns:** `nil`.

### `CommonPlayerDeath(inst)`
* **Description:** Shared cleanup logic during death/ghost conversion: disables damage-related components, pauses aging, sets health invincible, and respects game mode restrictions.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `OnMakePlayerGhost(inst, data)`
* **Description:** Converts the player entity into a ghost: updates state graph, physics, components, and fires `"ms_becameghost"`.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `loading`, `skeleton`.
* **Returns:** `nil`.

### `OnRespawnFromPlayerCorpse(inst, data)`
* **Description:** Resurrects the player from a valid corpse (must have `"corpse"` tag). Calls `DoActualRezFromCorpse`.
* **Parameters:** `inst` — the corpse entity instance, `data` — optional table containing `source`.
* **Returns:** `nil`.

### `OnMakePlayerCorpse(inst, data)`
* **Description:** Converts the player entity into a corpse: removes physics colliders, sets ghost mode, and fires `"ms_becameghost"` with `{ corpse = true }`.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `loading`.
* **Returns:** `nil`.

### `OnDeathTriggerVineSave(inst)`
* **Description:** Handles Charlie vine save event: always announces death and saves user session.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `OnRespawnFromVineSave(inst)`
* **Description:** Handles resurrection after Charlie vine save: restores health/sanity/hunger, extinguishes fire, resets debuffs.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `GivePlayerStartingItems(inst, items, starting_item_skins)`
* **Description:** Equips starting inventory items (with optional skins) to the player.
* **Parameters:** `inst` — the player entity instance, `items` — array of prefab names, `starting_item_skins` — optional table mapping prefab → skin.
* **Returns:** `nil`.

### `DoSpookedSanity(inst)`
* **Description:** Reduces sanity by `TUNING.SANITY_SMALL`.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `OnSpooked(inst)`
* **Description:** Schedules delayed sanity drain after spooked event (unless sanity disabled or spook protection equipped).
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `nil`.

### `OnLearnCookbookRecipe(inst, data)`
* **Description:** Teaches a recipe to the player’s cookbook.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `product`, `ingredients`.
* **Returns:** `nil`.

### `OnLearnCookbookStats(inst, product)`
* **Description:** Teaches food stats for a product to the cookbook.
* **Parameters:** `inst` — the player entity instance, `product` — optional prefab name.
* **Returns:** `nil`.

### `OnEat(inst, data)`
* **Description:** Handles post-eat logic, including learning stats for prepared foods.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `food`.
* **Returns:** `nil`.

### `OnLearnPlantStage(inst, data)`
* **Description:** Teaches a plant growth stage to the registry.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `plant`, `stage`.
* **Returns:** `nil`.

### `OnLearnFertilizer(inst, data)`
* **Description:** Teaches fertilizer properties to the registry.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `fertilizer`.
* **Returns:** `nil`.

### `OnTakeOversizedPicture(inst, data)`
* **Description:** Records oversized plant picture data for registry.
* **Parameters:** `inst` — the player entity instance, `data` — optional table containing `plant`, `weight`, `beardskin`, `beardlength`.
* **Returns:** `nil`.

### `CanSeeTileOnMiniMap(inst, tx, ty)`
* **Description:** Checks if a given map tile (by tile coordinates) is visible on the minimap.
* **Parameters:** `inst` — the player entity instance, `tx`, `ty` — world tile coordinates (integers).
* **Returns:** `true` if visible, `false` otherwise.

### `CanSeePointOnMiniMap(inst, px, py, pz)`
* **Description:** Convenience wrapper: converts world coordinates to tile and checks minimap visibility.
* **Parameters:** `inst` — the player entity instance, `px`, `py`, `pz` — world coordinates.
* **Returns:** Boolean indicating if the tile at the point is visible.

### `GetSeeableTilePercent(inst)`
* **Description:** Returns the percentage of seeable tiles (relative to total seeable tiles), clamped to ≤1 and scaled by a tuning factor.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** Float between `0` and `1`.

### `GenericCommander_OnAttackOther(inst, data)`
* **Description:** If attacked target is valid and not self, shares target with soldiers via commander component.
* **Parameters:** `inst` — the entity instance, `data` — event data containing `target`.
* **Returns:** `nil`.

### `MakeGenericCommander(inst)`
* **Description:** Adds the `commander` component if missing and registers `onattackother` listener.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `OnMurderCheckForFishRepel(inst, data)`
* **Description:** If a fish is killed non-negligently by an alive leader, all non-king merm followers disapprove and stop following.
* **Parameters:** `inst` — the entity instance, `data` — event data containing `victim`, `negligent`.
* **Returns:** `nil`.

### `clear_onstage(inst)`
* **Description:** Cancels and nullifies the `inst._is_onstage_task`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `OnOnStageEvent(inst, duration)`
* **Description:** Schedules `clear_onstage` after a duration (default `FRAMES`), canceling any prior task.
* **Parameters:** `inst` — the entity instance, `duration` — optional time in frames.
* **Returns:** `nil`.

### `IsActing(inst)`
* **Description:** Checks if the entity is currently "acting" (via stategraph tag or active onstage task).
* **Parameters:** `inst` — the entity instance.
* **Returns:** Boolean.

### `StartStageActing(inst)`
* **Description:** Hides actions UI if `inst.ShowActions` exists.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `StopStageActing(inst)`
* **Description:** Shows actions UI if `inst.ShowActions` exists.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `SynchronizeOneClientAuthoritativeSetting(inst, variable, value)`
* **Description:** Sets client-authoritative setting locally and syncs to server (non-server only).
* **Parameters:** `inst` — the entity instance, `variable` — setting identifier (uint), `value` — setting value (uint).
* **Returns:** `nil`.

### `SynchronizeAllClientAuthoritativeSettings(inst)`
* **Description:** Syncs all known client-authoritative settings (currently only `PLATFORMHOPDELAY`).
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `SetClientAuthoritativeSetting(inst, variable, value)`
* **Description:** Stores client-authoritative settings with validation (special-case: `forced_platformhopdelay`).
* **Parameters:** `inst` — the entity instance, `variable` — uint identifier, `value` — uint value.
* **Returns:** `nil`.

### `OnPostActivateHandshake_Client(inst, state)`
* **Description:** Handles client-side post-activation handshake: triggers skill tree actions, fires `skilltreeinitialized_client` at `READY`.
* **Parameters:** `inst` — the entity instance, `state` — numeric handshake state.
* **Returns:** `nil`.

### `OnPostActivateHandshake_Server(inst, state)`
* **Description:** Handles server-side post-activation handshake: sends state data and fires `ms_skilltreeinitialized` at `READY`.
* **Parameters:** `inst` — the entity instance, `state` — numeric handshake state.
* **Returns:** `nil`.

### `PostActivateHandshake(inst, state)`
* **Description:** Orchestrates client/server handshake flow depending on context.
* **Parameters:** `inst` — the entity instance, `state` — numeric handshake state.
* **Returns:** `nil`.

### `OnClosePopups(inst)`
* **Description:** Closes the `PLAYERINFO` popup.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `UpdateScrapbook(inst)`
* **Description:** Scans nearby entities and marks them as seen/inspected in scrapbook.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `MapRevealable_OnIconCreatedFn(inst)`
* **Description:** Sets display name on map icon if `globalmapiconnamed` icon exists.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `EnableTargetLocking(inst, enable)`
* **Description:** Enables/disables target locking in `playercontroller`.
* **Parameters:** `inst` — the entity instance, `enable` — boolean.
* **Returns:** `nil`.

### `CommandWheelAllowsGameplay(inst, enable)`
* **Description:** Enables/disables command wheel gameplay and optionally disables left-stick input in HUD.
* **Parameters:** `inst` — the entity instance, `enable` — boolean.
* **Returns:** `nil`.

### `OnStartJoust(inst)`
* **Description:** Starts a periodic task to spawn plant-dug FX trail. Returns `true`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true`.

### `OnEndJoust(inst)`
* **Description:** Cancels `jousttrailtask`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil`.

### `CalcGallopSpeedMult(inst, time_moving)`
* **Description:** Computes gallop speed multiplier from movement time.
* **Parameters:** `inst` — the entity instance (unused), `time_moving` — numeric duration in frames.
* **Returns:** Float speed multiplier.

### `TryGallopTripUpdate(inst)`
* **Description:** Tracks recent rotation changes to determine if gallop trip condition is met.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Boolean: `true` if `stressrotation > max_stress`.

### `_can_use_sound(inst, soundpath)`
* **Description:** Helper to prevent double-playing horseshoe sounds.
* **Parameters:** `inst` — the entity instance, `soundpath` — sound path or `nil`.
* **Returns:** Boolean: `true` if sound allowed, `false` if double-play prevented.

### `FootstepOverrideFn(inst, volume, ispredicted)`
* **Description:** Plays footstep sounds based on clothing skin overrides. Suppresses default if overridden.
* **Parameters:** `inst` — the entity instance, `volume` — optional float, `ispredicted` — boolean.
* **Returns:** Boolean: `true` if default footstep should be suppressed.

### `FoleyOverrideFn(inst, volume, ispredicted)`
* **Description:** Plays foley sounds based on clothing skin overrides. Suppresses default if overridden.
* **Parameters:** `inst` — the entity instance, `volume` — optional float, `ispredicted` — boolean.
* **Returns:** Boolean: `true` if default foley should be suppressed.

## Events & listeners
- **Listens to:**
  - `respawnfromghost` — triggers `OnRespawnFromGhost`
  - `onattackother` — triggers `GenericCommander_OnAttackOther`
  - `spooked` — triggers `OnSpooked`
  - `closepopups` — triggers `OnClosePopups`
  - `plant_stage_learned` — triggers `OnLearnPlantStage`
  - `fertilizer_learned` — triggers `OnLearnFertilizer`
  - `oversized_picture` — triggers `OnTakeOversizedPicture`
  - `recipe_learned` — triggers `OnLearnCookbookRecipe`
  - `eat` — triggers `OnEat`
  - `death` — triggers `OnPlayerDeath`
  - `died` — triggers `OnPlayerDied`
  - `makeplayerghost` — triggers `OnMakePlayerGhost`
  - `makeplayercorpse` — triggers `OnMakePlayerCorpse`
  - `deathtriggervinesave` — triggers `OnDeathTriggerVineSave`
  - `respawnfromvinesave` — triggers `OnRespawnFromVineSave`
  - `respawnfromplayercorpse` — triggers `OnRespawnFromPlayerCorpse`
  - `world_paused` — triggers `OnWorldPaused`
  - `post_activate_handshake_client` — triggers `OnPostActivateHandshake_Client`
  - `post_activate_handshake_server` — triggers `OnPostActivateHandshake_Server`

- **Pushes:**
  - `ms_closepopups`
  - `ms_becameghost`
  - `ms_respawnedfromghost`
  - `activateresurrection`
  - `rez_player`
  - `skilltreeinitialized_client` — fired on client at handshake `READY`
  - `ms_skilltreeinitialized` — fired on server at handshake `READY`
  - `ms_playerdespawnandmigrate` — used for cross-shard moves
  - `ms_playerbottled` — used during resurrection