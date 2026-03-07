---
id: player_common
title: Player Common
description: Central player component implementing shared behaviors, HUD/camera controls, weather effects, seamless swaps, and YOTB skin unlocking.
tags: [player, camera, hud, weather, swap, yotb]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6280f3b8
system_scope: player
---

# Player Common

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`player_common.lua` is the core player component responsible for managing player state, input, HUD/camera behavior, environmental interactions (miasma, storms, canopy), YOTB skin unlocking, seamless character swaps (including monkey transformations), and event-driven systems such as debuff handling, item exhaustion fallback, and PVP metadata. It defines the factory function `MakePlayerCharacter` to construct player prefabs and embeds numerous helper functions (`fns.*`) for common player operations. This component acts as a central coordinator, delegating specialized logic to external modules like `player_common_extensions` (`ex_fns`) and managing network replication for client-server synchronization.

## Usage example
```lua
-- Create a custom player prefab with YOTB support and custom camera offset
local function postinit(inst)
    -- Set base camera distance
    fns.SetCameraDistance(inst, 8)

    -- Apply custom transform scale
    fns.ApplyScale(inst, "custom_modifier", 1.2)

    -- Unlock a YOTB skin set
    if fns.YOTB_issetunlocked ~= nil then
        fns.YOTB_unlockskinset(inst, "winter2024")
    end

    -- Listen for gym entry
    inst:ListenForEvent("on_enter_might_gym", function(inst) fns.SetGymStartState(inst) end)
end

return MakePlayerCharacter("myprefab", nil, nil, nil, nil)
```

## Dependencies & tags
**Components used:** `player_classified`, `cameradistancebonuses`, `seamlessplayerswapper`, `buffs`, `damageoverlay`, `player_inventory`, `locomotor`, `actionsupplier`, `action`, `leader`, `companion`, `freeze`, `firebuilder`, `firestarter`, `wetness`, `lighter`, `soul`, `resurrector`, `attunement`, `mouth`, `healthbar`, `minimap`, `net_float`, `net_bool`, `net_event`, `net_hash`, `net_shortint`, `SourceModifierList`.  
**Tags:** `"player"`, `"playerghost"`, `"monster"`, `"pig"`, `"companion"`, `"prey"`, `"hostile"`, `"stronggrip"`, `"stickygrip"`, `"frozen"`, `"reviver"`, `"noreviverhealthpenalty"`, `"notarget"`, `"spawnprotection"`, `"lunacyarea"`, `"wildfireprotected"`, `"spiderwhisperer"`, `"spiderdisguise"`, `"shadowcreature"`, `"nightmarecreature"`, `"ghost"`, `"noauradamage"`, `"player_"..userid`, `"hiding"`, `"noplayerindicator"`, `"usesvegetarianequipment"`, `"ghostlyelixirable"`, `"scarytoprey"`, `"character"`, `"lightningtarget"`, `UPGRADETYPES.WATERPLANT.."_upgradeuser"`, `UPGRADETYPES.MAST.."_upgradeuser"`, `UPGRADETYPES.CHEST.."_upgradeuser"`, `"debuffable"`, `"stageactor"`, `"_health"`, `"_hunger"`, `"_sanity"`, `"_builder"`, `"_combat"`, `"_moisture"`, `"_sheltered"`, `"_rider"`, `DANGER_*_ONEOF_TAGS` (e.g., `"_combat"`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._underleafcanopy` | `net_bool` | `false` | Whether player is under a leaf canopy (networked). |
| `inst._sharksoundparam` | `net_float` | `0` | Shark sound parameter (networked). |
| `inst._piratemusicstate` | `net_hash` | `nil` | Pirate music state (networked). |
| `inst.cameradistancebonuses` | `SourceModifierList` | `SourceModifierList()` | List of camera distance modifiers. |

## Main functions
### `MakePlayerCharacter(name, customprefabs, customassets, common_postinit, master_postinit, starting_inventory)`
* **Description:** Factory function to create a player character prefab. Accepts custom prefabs/assets and optional initialization callbacks for common and master (server-only) phases.  
* **Parameters:** `name` — prefab name and build name; `customprefabs` — optional table of additional prefabs (deduplicated); `customassets` — optional table of additional assets; `common_postinit` — optional function called for all instances; `master_postinit` — optional function called on server; `starting_inventory` — deprecated, unused.  
* **Returns:** `Prefab` instance.

### `fns.IsNearDanger(inst, hounded_ok)`
* **Description:** Checks if the player is near danger: hounded attacks/warnings, burning/smoldering, aggressive monsters. Optionally excludes pig-related threats.  
* **Parameters:** `inst` — player entity; `hounded_ok` — if true, ignores hounded state.  
* **Returns:** Boolean — true if danger is nearby.

### `fns.TargetForceAttackOnly(inst, target)`
* **Description:** Determines whether the "Attack" command should be hidden unless explicitly force-attacking a target (e.g., shadow creatures that are not hostile).  
* **Parameters:** `inst` — player entity; `target` — target entity.  
* **Returns:** Boolean — true if attack command should be hidden.

### `fns.SetGymStartState(inst)`
* **Description:** Prepares player for Might Gym entry: hides HUD, closes popups, disables facing.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.SetGymStopState(inst)`
* **Description:** Restores normal player state after gym exit: re-enables facing, shows HUD.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.YOTB_unlockskinset(inst, skinset)`
* **Description:** Unlocks a YOTB skin set for the player if the YOTB event is active.  
* **Parameters:** `inst` — player entity; `skinset` — string identifier for skin set.  
* **Returns:** None.

### `fns.YOTB_issetunlocked(inst, skinset)`
* **Description:** Checks if a YOTB skin set is unlocked.  
* **Parameters:** `inst` — player entity; `skinset` — string identifier.  
* **Returns:** Boolean — true if unlocked; nil if YOTB event not active.

### `fns.YOTB_isskinunlocked(inst, skin)`
* **Description:** Checks if a specific skin is unlocked by searching YOTB costuming data.  
* **Parameters:** `inst` — player entity; `skin` — string skin identifier.  
* **Returns:** Boolean — true if unlocked; nil if YOTB event not active.

### `fns.YOTB_getrandomset(inst)`
* **Description:** If no skin sets are currently selected, picks a random YOTB skin set.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.IsInMiasma(inst)`
* **Description:** Checks if the player is currently inside a miasma cloud.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if in miasma; nil if `player_classified` missing.

### `fns.IsInAnyStormOrCloud(inst)`
* **Description:** Checks if the player is in a sandstorm (≥ full level) or miasma.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if in severe weather/cloud; nil if `player_classified` missing.

### `fns.IsChannelCasting(inst)`
* **Description:** Checks if the player is currently channel-casting.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if channel casting; false if `player_classified` missing.

### `fns.IsChannelCastingItem(inst)`
* **Description:** Checks if the player is channel-casting an item.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if channel casting an item; false if `player_classified` missing.

### `fns.OnStartChannelCastingItem(inst, item)`
* **Description:** Adjusts speed multipliers when starting item channel-cast to avoid stacking issues.  
* **Parameters:** `inst` — player entity; `item` — item being channeled.  
* **Returns:** None.

### `fns.OnStopChannelCastingItem(inst)`
* **Description:** Restores default speed multipliers after channel casting ends.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.IsTeetering(inst)`
* **Description:** Checks if the player is standing on an active teetering platform.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if teetering.

### `fns.IsCarefulWalking(inst)`
* **Description:** Checks if the player is walking carefully.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — true if careful walking active; nil if `player_classified` missing.

### `fns.EnableBoatCamera(inst, enable)`
* **Description:** Toggles boat camera mode by pushing `enableboatcamera` event.  
* **Parameters:** `inst` — player entity; `enable` — boolean.  
* **Returns:** None.

### `fns.IsHUDVisible(inst)`
* **Description:** Returns HUD visibility status (client-side).  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — visibility status from `player_classified`.

### `fns.ShowActions(inst, show)`
* **Description:** Server-side command to toggle action icons visibility.  
* **Parameters:** `inst` — player entity; `show` — boolean.  
* **Returns:** None.

### `fns.ShowCrafting(inst, show)`
* **Description:** Server-side command to toggle crafting UI visibility.  
* **Parameters:** `inst` — player entity; `show` — boolean.  
* **Returns:** None.

### `fns.ShowHUD(inst, show)`
* **Description:** Server-side command to toggle HUD visibility.  
* **Parameters:** `inst` — player entity; `show` — boolean.  
* **Returns:** None.

### `fns.ShowPopUp(inst, popup, show, ...)`
* **Description:** RPC to show/hide a popup for this player (client-side only on server).  
* **Parameters:** `inst` — player entity; `popup` — popup definition; `show` — boolean; `...` — arguments.  
* **Returns:** None.

### `fns.ResetMinimapOffset(inst)`
* **Description:** Forces minimap center flag dirty to reset offset.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.CloseMinimap(inst)`
* **Description:** Forces minimap close flag dirty to close it.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.SetCameraDistance(inst, distance)`
* **Description:** Sets base camera distance.  
* **Parameters:** `inst` — player entity; `distance` — numeric value (≥ 0).  
* **Returns:** None.

### `fns.AddCameraExtraDistance(inst, source, distance, key)`
* **Description:** Adds a camera distance bonus (e.g., from items).  
* **Parameters:** `inst` — player entity; `source` — modifier source; `distance` — bonus distance; `key` — modifier key.  
* **Returns:** None.

### `fns.RemoveCameraExtraDistance(inst, source, key)`
* **Description:** Removes a camera distance bonus.  
* **Parameters:** `inst` — player entity; `source` — modifier source; `key` — modifier key.  
* **Returns:** None.

### `fns.SetCameraZoomed(inst, iszoomed)`
* **Description:** Sets whether camera is zoomed.  
* **Parameters:** `inst` — player entity; `iszoomed` — boolean.  
* **Returns:** None.

### `fns.SnapCamera(inst, resetrot)`
* **Description:** Requests camera snap (e.g., after teleport).  
* **Parameters:** `inst` — player entity; `resetrot` — if true, reset camera rotation.  
* **Returns:** None.

### `fns.ShakeCamera(inst, mode, duration, speed, scale, source_or_pt, maxDist)`
* **Description:** Triggers camera shake, optionally scaled by distance.  
* **Parameters:** `inst` — player entity; `mode` — shake mode; `duration` — seconds; `speed` — Hz; `scale` — intensity; `source_or_pt` — optional source or point; `maxDist` — max distance for scaling.  
* **Returns:** None.

### `fns.ScreenFade(inst, isfadein, time, iswhite)`
* **Description:** Triggers screen fade with encoded network parameters.  
* **Parameters:** `inst` — player entity; `isfadein` — boolean; `time` — seconds; `iswhite` — white fade.  
* **Returns:** None.

### `fns.ScreenFlash(inst, intensity)`
* **Description:** Triggers screen flash with encoded network intensity.  
* **Parameters:** `inst` — player entity; `intensity` — 0–1.  
* **Returns:** None.

### `fns.SetBathingPoolCamera(inst, target)`
* **Description:** Sets camera target for bath pool view.  
* **Parameters:** `inst` — player entity; `target` — entity or point.  
* **Returns:** None.

### `fns.ApplyScale(inst, source, scale)`
* **Description:** Applies per-source transform scale multiplier to entity.  
* **Parameters:** `inst` — player entity; `source` — identifier string; `scale` — numeric factor.  
* **Returns:** None.

### `fns.ApplyAnimScale(inst, source, scale)`
* **Description:** Applies per-source animation scale multiplier.  
* **Parameters:** `inst` — player entity; `source` — identifier string; `scale` — numeric factor.  
* **Returns:** None.

### `fns.OnDebuffAdded(inst, name, debuff)`
* **Description:** Callback when debuff added — sets symbol if `elixir_buff`.  
* **Parameters:** `inst` — player entity; `name` — debuff name; `debuff` — debuff object.  
* **Returns:** None.

### `fns.OnDebuffRemoved(inst, name, debuff)`
* **Description:** Callback when debuff removed — clears symbol if `elixir_buff`.  
* **Parameters:** `inst` — player entity; `name` — debuff name; `debuff` — debuff object.  
* **Returns:** None.

### `fns.SetSymbol(inst, symbol)`
* **Description:** Sets player buff symbol, synced to client via netvar.  
* **Parameters:** `inst` — player entity; `symbol` — integer ID.  
* **Returns:** None.

### `fns.IsHUDVisible(inst)`
* **Description:** Returns HUD visibility status (client-side).  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean — visibility status from `player_classified`.

### `fns.IsInMiasma(inst)`
* **Description:** Checks if player is in miasma.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `fns.IsInAnyStormOrCloud(inst)`
* **Description:** Checks if player is in miasma or full-level sandstorm.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `fns.IsChannelCasting(inst)`
* **Description:** Checks if player is channel-casting.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `fns.IsChannelCastingItem(inst)`
* **Description:** Checks if player is channel-casting an item.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `fns.EnableBoatCamera(inst, enable)`
* **Description:** Toggles boat camera mode.  
* **Parameters:** `inst` — player entity; `enable` — boolean.  
* **Returns:** None.

### `fns.ResetMinimapOffset(inst)`
* **Description:** Resets minimap offset.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.CloseMinimap(inst)`
* **Description:** Forces minimap close.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.SetCameraDistance(inst, distance)`
* **Description:** Sets base camera distance.  
* **Parameters:** `inst` — player entity; `distance` — number.  
* **Returns:** None.

### `fns.AddCameraExtraDistance(inst, source, distance, key)`
* **Description:** Adds camera distance bonus.  
* **Parameters:** `inst` — player entity; `source` — string; `distance` — number; `key` — string.  
* **Returns:** None.

### `fns.RemoveCameraExtraDistance(inst, source, key)`
* **Description:** Removes camera distance bonus.  
* **Parameters:** `inst` — player entity; `source` — string; `key` — string.  
* **Returns:** None.

### `fns.SetCameraZoomed(inst, iszoomed)`
* **Description:** Sets camera zoom state.  
* **Parameters:** `inst` — player entity; `iszoomed` — boolean.  
* **Returns:** None.

### `fns.SnapCamera(inst, resetrot)`
* **Description:** Requests camera snap.  
* **Parameters:** `inst` — player entity; `resetrot` — boolean.  
* **Returns:** None.

### `fns.ShakeCamera(inst, mode, duration, speed, scale, source_or_pt, maxDist)`
* **Description:** Triggers camera shake.  
* **Parameters:** `inst` — player entity; `mode` — string; `duration` — number; `speed` — number; `scale` — number; `source_or_pt` — optional entity or vector; `maxDist` — optional number.  
* **Returns:** None.

### `fns.ScreenFade(inst, isfadein, time, iswhite)`
* **Description:** Triggers screen fade.  
* **Parameters:** `inst` — player entity; `isfadein` — boolean; `time` — number; `iswhite` — boolean.  
* **Returns:** None.

### `fns.ScreenFlash(inst, intensity)`
* **Description:** Triggers screen flash.  
* **Parameters:** `inst` — player entity; `intensity` — number (0–1).  
* **Returns:** None.

### `fns.SetBathingPoolCamera(inst, target)`
* **Description:** Sets camera target for bath pool.  
* **Parameters:** `inst` — player entity; `target` — entity or vector.  
* **Returns:** None.

### `fns.ApplyScale(inst, source, scale)`
* **Description:** Applies transform scale multiplier.  
* **Parameters:** `inst` — player entity; `source` — string; `scale` — number.  
* **Returns:** None.

### `fns.ApplyAnimScale(inst, source, scale)`
* **Description:** Applies animation scale multiplier.  
* **Parameters:** `inst` — player entity; `source` — string; `scale` — number.  
* **Returns:** None.

### `fns.OnDebuffAdded(inst, name, debuff)`
* **Description:** Handles debuff add (e.g., elixir symbol).  
* **Parameters:** `inst` — player entity; `name` — string; `debuff` — object.  
* **Returns:** None.

### `fns.OnDebuffRemoved(inst, name, debuff)`
* **Description:** Handles debuff removal (e.g., elixir symbol).  
* **Parameters:** `inst` — player entity; `name` — string; `debuff` — object.  
* **Returns:** None.

### `fns.SetSymbol(inst, symbol)`
* **Description:** Sets player buff symbol.  
* **Parameters:** `inst` — player entity; `symbol` — number.  
* **Returns:** None.

### `fns.OnItemRanOut(inst, data)`
* **Description:** Attempts to re-equip replacement if equipped item runs out.  
* **Parameters:** `inst` — player entity; `data` — event data (`prefab`, `equipslot`).  
* **Returns:** None.

### `fns.OnUmbrellaRanOut(inst, data)`
* **Description:** Attempts to re-equip replacement umbrella if current runs out.  
* **Parameters:** `inst` — player entity; `data` — event data.  
* **Returns:** None.

### `fns.ArmorBroke(inst, data)`
* **Description:** Attempts to re-equip replacement armor on break.  
* **Parameters:** `inst` — player entity; `data` — event data (`armor`).  
* **Returns:** None.

### `fns.EnableLoadingProtection(inst)`
* **Description:** Enables invincibility and physics disable during loading.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.DisableLoadingProtection(inst)`
* **Description:** Disables loading protection after delay.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.CommonSeamlessPlayerSwap(inst)`
* **Description:** Common cleanup for seamless player swap.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.CommonSeamlessPlayerSwapTarget(inst)`
* **Description:** Common setup for seamless swap target.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.LocalSeamlessPlayerSwap(inst)`
* **Description:** Client-side prep for local player seamless swap.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.LocalSeamlessPlayerSwapTarget(inst)`
* **Description:** Client-side prep for local player as swap target.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.MasterSeamlessPlayerSwap(inst)`
* **Description:** Server-side prep for master player seamless swap.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.MasterSeamlessPlayerSwapTarget(inst)`
* **Description:** Server-side prep for master player as swap target.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.EnableMovementPrediction(inst, enable)`
* **Description:** Enables/disables movement prediction on client (if configured). Delegates to `ex_fns.*`.  
* **Parameters:** `inst` — player entity; `enable` — boolean.  
* **Returns:** None.

### `fns.OnChangeArea(inst, area)`
* **Description:** Enables/disables lunacy based on area tags.  
* **Parameters:** `inst` — player entity; `area` — area definition or nil.  
* **Returns:** None.

### `fns.OnAlterNight(inst)`
* **Description:** Enables lunacy during night in the Alter world.  
* **Parameters:** `inst` — player entity.  
* **Returns:** None.

### `fns.OnStormLevelChanged(inst, data)`
* **Description:** Enables lunacy during moonstorm.  
* **Parameters:** `inst` — player entity; `data` — storm event data.  
* **Returns:** None.

### `fns.OnRiftMoonTile(inst, on_rift_moon)`
* **Description:** Enables lunacy when on rift moon tile.  
* **Parameters:** `inst` — player entity; `on_rift_moon` — boolean.  
* **Returns:** None.

### `fns.OnFullMoonEnlightenment(inst, isfullmoon)`
* **Description:** Enables post-rift lunacy during full moon.  
* **Parameters:** `inst` — player entity; `isfullmoon` — boolean.  
* **Returns:** None.

### `GetStatus(inst, viewer)`
* **Description:** Returns player status string (GHOST, REVIVER, etc.).  
* **Parameters:** `inst` — player entity; `viewer` — inspecting entity.  
* **Returns:** String or nil.

### `GetDescription(inst, viewer)`
* **Description:** Returns formatted description string based on inspectability.  
* **Parameters:** `inst` — player entity; `viewer` — inspecting entity.  
* **Returns:** String.

### `GetTalkerOffset(inst)`
* **Description:** Returns vertical offset for speech bubbles based on rider/ghost status.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Vector3.

### `GetFrostyBreatherOffset(inst)`
* **Description:** Returns offset for frost breath effect.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Vector3.

### `CanUseTouchStone(inst, touchstone)`
* **Description:** Checks if player can use a specific touchstone.  
* **Parameters:** `inst` — player entity; `touchstone` — touchstone entity.  
* **Returns:** Boolean.

### `GetTemperature(inst)`
* **Description:** Gets player’s current temperature.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Number.

### `IsFreezing(inst)`
* **Description:** Checks if player is freezing.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `IsOverheating(inst)`
* **Description:** Checks if player is overheating.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Boolean.

### `GetMoisture(inst)`
* **Description:** Gets player moisture level.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Number.

### `GetMaxMoisture(inst)`
* **Description:** Gets player max moisture.  
* **Parameters:** `inst` — player entity.  
* **Returns:** Number.

### `GetMoistureRateScale(inst)`
* **Description:** Gets moisture rate scale (e.g., NEUTRAL, WET, DRY).  
* **Parameters:** `inst` — player entity.  
* **Returns:** Enum value (`RATE_SCALE.*`).

### `GetStormLevel(inst, stormtype)`
* **Description:** Gets normalized storm level (0–1).  
* **Parameters:** `inst` — player entity; `stormtype` — optional filter.  
* **Returns:** Number — storm level / 7 or 0.

### `MinMult(recalcmult, mult)`
* **Description:** Utility to compute a multiplier that prevents stacking above min.  
* **Parameters:** `recalcmult`, `mult` — numeric.  
* **Returns:** Number.

## Events & listeners
**Listens to:**  
`gotnewitem` — plays pickup sound; `equip` — plays equip sound; `itemranout` — triggers fallback equip; `umbrellaranout` — triggers fallback umbrella equip; `armorbroke` — triggers fallback armor equip; `picksomething` — plays pick-up sound; `dropitem` — plays drop sound; `actionfailed` — speaks failure message; `wonteatfood` — says "yucky"; `working` — triggers `DropWetTool`; `onstartedfire` — marks fire starter; `onattackother`, `onareaattackother` — marks PVP attacker; `killed` — marks killer; `learncookbookrecipe`, `learncookbookstats`, `oneat`, `learnplantstage`, `learnfertilizer`, `takeoversizedpicture` — delegated to `ex_fns`; `changearea` — enables/disables lunacy; `stormlevel` — enables lunacy; `on_RIFT_MOON_tile`, `on_LUNAR_MARSH_tile` — enables lunacy; `isnight`, `isalterawake` — enables lunacy on alter nights; `isfullmoon` — enables post-rift lunacy; `murdered` — delegated to `ex_fns`; `onstage`, `startstageacting`, `stopstageacting` — delegated; `ms_closepopups` — delegated; `gotnewattunement` — spawns attunement FX; `attunementlost` — handles FX; `cancelmovementprediction` — instant movement cancel.

**Pushes:**  
`on_enter_might_gym` — signals gym entry; `ms_closepopups` — triggers popup close; `yotb_learnblueprint` — signals new YOTB skin; `playerdeactivated`, `playeractivated` — signals state changes; `finishseamlessplayerswap` — signals swap completion; `playerexited` — signals view exit; `seamlessplayerswap`, `seamlessplayerswaptarget` — signals swap start/target; `enablemovementprediction` — enables/disables prediction; `enableboatcamera` — toggles boat camera; `respawnfromghost` — triggers ghost respawn; `player_despawn` — signals despawn; `newskillpointupdated` — after initialization; `ms_playerspawn` — at end of server init.