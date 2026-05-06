---
id: woodie
title: Woodie
description: Defines the Woodie player character prefab with complete wereform transformation system (beaver, moose, goose), including action pickers, vision effects, drain rate calculations, combat mechanics, skin mode handling, skill integration, and lifecycle callbacks for save/load operations.
tags: [player, transformation, wereform, skills, combat]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 965084b4
system_scope: player
---

# Woodie

> Based on game build **722832** | Last updated: 2026-04-27

## Overview

The Woodie prefab defines the playable character Woodie with a unique wereform transformation system. Players can transform into three were-creature forms (werebeaver, weremoose, weregoose) based on wereness accumulation, with each form having distinct abilities, stats, and mechanics. The prefab integrates with the skill tree system for form-specific upgrades, handles transformation callbacks for all lifecycle events (activation, ghost state, save/load), and configures numerous components including combat, locomotion, vision, sound, and skin systems. Master-side initialization sets up wereness tracking, tackler mechanics for moose form, groundpounder for beaver form, and dodge mechanics for goose form. Client-side initialization handles visual overlays, netvar synchronization, and camera/audio effects for wereform states.

## Usage example

```lua
-- Spawn Woodie player character prefab
local woodie = SpawnPrefab("woodie")
-- Note: Instance methods below (IsWerebeaver, GetWereness, etc.) are assigned in master_postinit
-- and are only available after server-side initialization completes.

-- Check if in specific wereform (inst-accessible methods)
if woodie:IsWerebeaver() then
    -- Beaver-specific logic
elseif woodie:IsWeremoose() then
    -- Moose-specific logic
elseif woodie:IsWeregoose() then
    -- Goose-specific logic
end

-- Get wereness percentage (inst-accessible method)
local wereness = woodie:GetWereness()

-- Use wereform skill ability (inst-accessible method)
woodie:UseWereFormSkill()

-- Set goose flying state (inst-accessible method)
woodie:SetGooseFlying(true)

-- Trigger moose smash shake effect (inst-accessible method)
woodie:PushMooseSmashShake()
```

## Dependencies & tags

**External dependencies:**
- `prefabs/player_common` -- MakePlayerCharacter function imported for player prefab construction
- `easing` -- easing module imported for rotation interpolation
- `TUNING` -- Global balance constants accessed for damage, speed, wereness values
- `STRINGS` -- Localization strings for action display text
- `ACTIONS` -- Action enums for CHOP, MINE, DIG, ATTACK, USE_WEREFORM_SKILL
- `TheSim` -- FindEntities for nearby interactable entity search
- `CONTROL_FORCE_ATTACK` -- Control enum for force attack check
- `FlattenTree` -- Utility function to merge prefabs and start_inv tables
- `TheWorld` -- PushEvent for enabledynamicmusic, ismastersim check
- `ThePlayer` -- Reference for local player in camera shake and flying checks
- `TheFocalPoint` -- SoundEmitter for beaver music and focalpoint component
- `TheCamera` -- SetOffset for goose flying camera, Shake for moose smash effect
- `TheMixer` -- PushMix and PopMix for flying audio mix
- `DEGREES` -- Rotation conversion constant
- `Lerp` -- Rotation interpolation for reticule smoothing
- `Vector3` -- Position vectors for reticule and camera
- `CAMERASHAKE` -- VERTICAL constant for camera shake type
- `Image` -- Create beaver overlay image
- `ANCHOR_MIDDLE` -- Image anchor positioning
- `SCALEMODE_FILLSCREEN` -- Image scale mode for overlay
- `EQUIPSLOTS` -- Reference EQUIPSLOTS.HANDS for equipped item check
- `COLLISION` -- Set collision mask constants for Physics component
- `SpawnPrefab` -- Spawn lucy and transform FX prefabs
- `USERFLAGS` -- Global table for CHARACTER_STATE network flags
- `FRAMES` -- Global constant for periodic task timing
- `TheNet` -- GetServerGameMode for game mode determination
- `ShakeAllCameras` -- Called in OnTackleCollide for moose tackle impact
- `GetGameModeProperty` -- Checks no_hunger game mode property
- `IsTeleportLinkingPermittedFromPoint` -- Checks teleport permission for weregoose

**Components used:**
- `playercontroller` -- Checked for IsDoingOrWorking, IsControlPressed, IsEnabled, directwalking, isclientcontrollerattached properties
- `playeractionpicker` -- SortActionList called to build action lists for beaver/moose interactions
- `skilltreeupdater` -- HasSkillTag called to check beaver_epic and goose_epic skill unlocks
- `combat` -- Accessed via replica.combat for CanTarget checks
- `reticule` -- Added/removed for were-mode targeting, position and rotation updates
- `playervision` -- PushForcedNightVision and PopForcedNightVision for were-form vision effects
- `locomotor` -- runspeed modified based on were-mode
- `wereness` -- GetPercent and rate for were-ness tracking
- `beard` -- bits property modified on beard reset
- `player_classified` -- currentwereness and werenessdrainrate netvars for client-side were-ness
- `focalpoint` -- StartFocusSource and StopFocusSource for goose flying camera
- `inventory` -- GetEquippedItem, FindItem, Equip
- `workable` -- Check action type for CHOP
- `finiteuses` -- GetUses to check axe durability
- `possessedaxe` -- Set revert_prefab, revert_uses, transform_fx on Lucy
- `drownable` -- Toggle enabled for goose drowning immunity
- `worker` -- SetAction effectiveness for CHOP/MINE/DIG/HAMMER
- `groundpounder` -- Configure ring mode and parameters for werebeaver
- `attackdodger` -- Added/removed for goose form dodge mechanic
- `health` -- AddRegenSource and RemoveRegenSource for moose health regen skill
- `planardefense` -- AddBonus and RemoveBonus for moose planar defense skill
- `grogginess` -- isgroggy property checked to disable flap sounds
- `debuffable` -- SetFollowSymbol for debuff visual positioning per skin mode
- `skinner` -- HideAllClothing and SetSkinMode for wereform skin handling
- `freezable` -- SetShatterFXLevel for goose freeze effect level
- `sanity` -- custom_rate_fn set to WereSanityFn for were forms
- `pinnable` -- canbepinned set to true for human, false for were forms
- `hunger` -- Pause/Resume and SetPercent/SetMax configured based on were form
- `temperature` -- inherentinsulation and inherentsummerinsulation set for each were form
- `moisture` -- SetInherentWaterproofness configured for each were form
- `talker` -- IgnoreAll/StopIgnoringAll called to mute Woodie in were forms
- `catcher` -- SetEnabled true for human, false for were forms
- `sandstormwatcher` -- SetSandstormSpeedMultiplier for human/were forms
- `moonstormwatcher` -- SetMoonstormSpeedMultiplier for human/were forms
- `miasmawatcher` -- SetMiasmaSpeedMultiplier for human/were forms
- `carefulwalker` -- SetCarefulWalkingSpeedMultiplier for human/were forms
- `wereeater` -- ResetFoodMemory called on all transformations
- `inspectable` -- getstatus swapped between inst._getstatus and GetWereStatus
- `tackler` -- All setter methods and AddWorkAction for moose tackle behavior
- `frostybreather` -- SetOffsetFn set to GetFrostyBreatherOffset
- `foodaffinity` -- AddPrefabAffinity for honeynuggets
- `rider` -- Accessed via inst.replica.rider in GetFrostyBreatherOffset
- `physics` -- Teleport called in UseWereFormSkill for weregoose teleport
- `soundemitter` -- PlaySound called in OnTackleCollide for moose bounce sound

**Tags:**
- `playerghost` -- check
- `LunarBuildup` -- check
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `catchable` -- check
- `sign` -- check
- `walkingplank` -- check
- `interactable` -- check
- `plank_extended` -- check
- `on_walkable_plank` -- check
- `beaver` -- check
- `weregoose` -- check
- `player` -- check
- `HAMMER_workable` -- check
- `DIG_workable` -- check
- `CHOP_workable` -- check
- `MINE_workable` -- check
- `tree` -- check
- `beaverchewable` -- check
- `possessable_axe` -- check
- `player_lunar_aligned` -- check
- `moving` -- check
- `flying` -- check
- `tailslapping` -- check
- `toughworker` -- add
- `wereplayer` -- add/remove
- `weremoose` -- add/remove
- `inherentshadowdominance` -- add/remove
- `shadowdominance` -- add/remove
- `player_shadow_aligned` -- check
- `woodcutter` -- add
- `polite` -- add
- `werehuman` -- add
- `bearded` -- add
- `quagmire_shopper` -- add
- `wereness` -- add
- `cancarveboards` -- add
- `ghostbuild` -- check
- `transform` -- check
- `largecreature` -- check
- `epic` -- check
- `nomorph` -- check
- `silentmorph` -- check
- `nocavein` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | (see source) | Asset declarations including scripts, sounds, animations, atlases, images, minimap images |
| `prefabs` | table | (see source) | Prefab dependencies including FX prefabs, transform effects, feather/ripple/splash variants, reticuleline2 |
| `start_inv` | table | (see source) | Maps game modes to starting inventory items for Woodie. Merged into prefabs array via FlattenTree. |
| `BEAVERVISION_COLOURCUBES` | table | day/dusk/night/full_moon → beaver_vision_cc.tex | Colour cube texture paths for beaver vision effect |
| `WEREMODE_NAMES` | table | {"beaver", "moose", "goose"} | Array mapping mode indices to wereform name strings |
| `WEREMODES` | table | NONE=0, BEAVER=1, MOOSE=2, GOOSE=3 | Constants for wereform mode enumeration. Dynamically generated from WEREMODE_NAMES via loop: BEAVER=1, MOOSE=2, GOOSE=3. |
| `SKIN_MODE_DATA` | table | (see source) | Skin mode configuration including bank, shadow size, debuff symbol, hideclothing, freezelevel per skin mode |
| `BEAVER_LMB_ACTIONS` | table | {"CHOP", "MINE", "DIG"} | Action types for beaver left-mouse-button interactions |
| `BEAVER_ACTION_TAGS` | table | (see source) | Tags used for beaver action target detection including LunarBuildup and workable tags |
| `BEAVER_TARGET_EXCLUDE_TAGS` | table | {"FX", "NOCLICK", "DECOR", "INLIMBO", "catchable", "sign"} | Tags excluded from beaver target search |
| `GOOSE_FLAP_STATES` | table | (see source) | State names where goose flap sound should be killed |
| `GOOSE_HONK_STATES` | table | (see source) | State names where goose honk sound should play |
| `WEREMODE_FROSTYBREATHER_OFFSET` | (local) | BEAVER/MOOSE/GOOSE → Vector3 | Frostybreather offset vectors per wereform mode. Used by GetFrostyBreatherOffset(). |
| `TALLER_FROSTYBREATHER_OFFSET` | (local) | Vector3(.3, 3.75, 0) | Frostybreather offset when player is riding. |
| `DEFAULT_FROSTYBREATHER_OFFSET` | (local) | Vector3(.3, 1.15, 0) | Default frostybreather offset when not in wereform or riding. |

## Main functions

### `IsWereMode(mode)` (internal)
* **Description:** Checks if the given mode index corresponds to a valid wereform name in WEREMODE_NAMES table.
* **Parameters:**
  - `mode` -- number - wereform mode index to validate against WEREMODE_NAMES
* **Returns:** boolean - true if mode is valid, false otherwise
* **Error states:** None

### `GetWereStatus(inst)` (internal)
* **Description:** Returns the current wereform status string, appending 'GHOST' suffix if the player has the playerghost tag.
* **Parameters:**
  - `inst` -- Entity instance - the player entity to check wereform status for
* **Returns:** string - uppercase wereform name (BEAVER, MOOSE, GOOSE) with optional GHOST suffix
* **Error states:** Errors if inst is nil or lacks weremode netvar (no nil guard before inst:HasTag or inst.weremode:value() calls).

### `CannotExamine(inst)` (internal)
* **Description:** Placeholder function that always returns false, preventing examination actions on the player.
* **Parameters:**
  - `inst` -- Entity instance - the player entity
* **Returns:** boolean - always false
* **Error states:** None

### `BeaverActionString(inst, action)` (internal)
* **Description:** Returns the appropriate action string from STRINGS.ACTIONS based on the action type for beaver form interactions.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `action` -- table - action object containing action type and metadata
* **Returns:** string or nil - action string from STRINGS.ACTIONS or nil
* **Error states:** None

### `GetBeaverAction(inst, target)` (internal)
* **Description:** Determines the appropriate beaver action based on target tags including LunarBuildup, workable tags (CHOP/MINE/DIG), and walkingplank interactions.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `target` -- Entity instance - the target entity to interact with
* **Returns:** ACTIONS enum or nil - the action to perform or nil if no valid action
* **Error states:** None

### `BeaverActionButton(inst, force_target)` (internal)
* **Description:** Finds and returns a buffered action for beaver left-click interaction, searching nearby entities via TheSim:FindEntities if no force_target provided, using distance thresholds based on directwalking state.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `force_target` -- Entity instance or nil - optional forced target entity
* **Returns:** BufferedAction or nil - the action to execute or nil if no valid action found
* **Error states:** Errors if inst.components.playercontroller is nil (no guard present before IsDoingOrWorking call)

### `BeaverGetLMBActions(inst, target)` (internal)
* **Description:** Returns sorted action list for beaver left-mouse-button interactions with workable targets, excluding sign-tagged entities.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `target` -- Entity instance - the target entity
* **Returns:** table or nil - sorted action list from playeractionpicker or nil
* **Error states:** Errors if inst.components.playeractionpicker is nil (no guard present)

### `BeaverLeftClickPicker(inst, target)` (internal)
* **Description:** Handles beaver left-click target selection, checking combat targets with force attack override, LunarBuildup removal, workable objects, and walking plank mounting.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `target` -- Entity instance - the clicked target entity
* **Returns:** table or nil - sorted action list or nil if no valid action
* **Error states:** Errors if inst.replica.combat, inst.components.playercontroller, or inst.components.playeractionpicker is nil (no guards present)

### `BeaverRightClickPicker(inst, target, pos)` (internal)
* **Description:** Handles beaver right-click actions including abandon ship from walkable planks, hammer/dig workable objects, and wereform skill usage when epic skill is unlocked and not in client controller mode.
* **Parameters:**
  - `inst` -- Entity instance - the beaver player
  - `target` -- Entity instance or nil - the right-clicked target
  - `pos` -- Vector3 or nil - world position if no target
* **Returns:** table or nil - sorted action list or nil
* **Error states:** Errors if inst.components.playercontroller, inst.components.skilltreeupdater, or inst.components.playeractionpicker is nil (no guards present)

### `BeaverAndGoosePointSpecialActions(inst, pos, useitem, right)` (internal)
* **Description:** Returns special wereform skill actions for beaver or goose forms when epic skill tag is unlocked, player controller is enabled, and right-clicking.
* **Parameters:**
  - `inst` -- Entity instance - the player
  - `pos` -- Vector3 - world position
  - `useitem` -- Entity or nil - item being used
  - `right` -- boolean - whether this is a right-click
* **Returns:** table - array containing USE_WEREFORM_SKILL action or empty table
* **Error states:** Errors if inst.components.playercontroller or inst.components.skilltreeupdater is nil (no guards present)

### `MooseLeftClickPicker(inst, target)` (internal)
* **Description:** Handles moose left-click target selection for combat with force attack override or mounting extended walking planks.
* **Parameters:**
  - `inst` -- Entity instance - the moose player
  - `target` -- Entity instance - the clicked target entity
* **Returns:** table or nil - sorted action list or nil
* **Error states:** Errors if inst.replica.combat, inst.components.playercontroller, or inst.components.playeractionpicker is nil (no guards present)

### `MooseRightClickPicker(inst, target, pos)` (internal)
* **Description:** Returns action list for Moose mode right-click. Checks if target is a walking plank and player is on it for ABANDON_SHIP action, otherwise returns TACKLE action if not using controller.
* **Parameters:**
  - `inst` -- Player entity instance
  - `target` -- Target entity or nil
  - `pos` -- World position vector
* **Returns:** Action list table or nil
* **Error states:** Errors if inst.components.playeractionpicker or inst.components.playercontroller is nil (no nil guards present).

### `MoosePointSpecialActions(inst, pos, useitem, right)` (internal)
* **Description:** Returns special actions for Moose mode. Returns TACKLE action if right-click and player controller is enabled.
* **Parameters:**
  - `inst` -- Player entity instance
  - `pos` -- World position vector
  - `useitem` -- Item being used or nil
  - `right` -- Boolean indicating right-click action
* **Returns:** Action table or empty table
* **Error states:** Errors if inst.components.playercontroller is nil (no nil guard present).

### `GooseActionString(inst, action)` (internal)
* **Description:** Returns the action string for Goose were-form skill usage.
* **Parameters:**
  - `inst` -- Player entity instance
  - `action` -- Action being performed
* **Returns:** String from STRINGS.ACTIONS.USE_WEREFORM_SKILL.GOOSE and true
* **Error states:** None

### `GooseRightClickPicker(inst, target, pos)` (internal)
* **Description:** Returns action list for Goose mode right-click. Requires player not using controller and has goose_epic skill tag.
* **Parameters:**
  - `inst` -- Player entity instance
  - `target` -- Target entity or nil
  - `pos` -- World position vector
* **Returns:** Action list table or nil
* **Error states:** Errors if inst.components.playercontroller, inst.components.skilltreeupdater, or inst.components.playeractionpicker is nil (no nil guards present).

### `Empty()` (internal)
* **Description:** Empty placeholder function used as override for action handlers that should do nothing.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `ReticuleTargetFn(inst)` (internal)
* **Description:** Returns target position for reticule, offset 1.5 units forward from player in local space converted to world space.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** Vector3 position
* **Error states:** None

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)` (internal)
* **Description:** Updates reticule position to match player position and rotates it to face target position. Uses Lerp for smooth rotation when ease is enabled.
* **Parameters:**
  - `inst` -- Player entity instance
  - `pos` -- Target position vector
  - `reticule` -- Reticule entity
  - `ease` -- Boolean enabling smooth rotation
  - `smoothing` -- Smoothing factor for rotation interpolation
  - `dt` -- Delta time for interpolation
* **Returns:** nil
* **Error states:** None

### `EnableReticule(inst, enable)` (internal)
* **Description:** Adds or removes reticule component based on enable flag. Configures reticule properties for were-creature mode and refreshes player controller reticule.
* **Parameters:**
  - `inst` -- Player entity instance
  - `enable` -- Boolean to enable or disable reticule
* **Returns:** nil
* **Error states:** None

### `SetWereActions(inst, mode)` (internal)
* **Description:** Configures action overrides based on were-mode. Behavior depends on mode:
  - NONE — clears ActionStringOverride, actionbuttonoverride, and playeractionpicker overrides (leftclick/rightclick/pointspecialactionsfn), disables reticule.
  - BEAVER — sets BeaverActionString, BeaverActionButton, BeaverLeftClickPicker, BeaverRightClickPicker, BeaverAndGoosePointSpecialActions, disables reticule.
  - MOOSE — clears ActionStringOverride, sets Empty actionbuttonoverride, MooseLeftClickPicker, MooseRightClickPicker, MoosePointSpecialActions, enables reticule.
  - GOOSE — sets GooseActionString, Empty actionbuttonoverride, Empty leftclickoverride, GooseRightClickPicker, BeaverAndGoosePointSpecialActions, disables reticule.
* **Parameters:**
  - `inst` -- Player entity instance
  - `mode` -- Were-mode constant (WEREMODES.BEAVER, WEREMODES.MOOSE, WEREMODES.GOOSE, or none)
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller, inst.components.playeractionpicker, or inst.HUD is nil (no nil guards before member access).

### `SetWereVision(inst, mode)` (internal)
* **Description:** Pushes or pops forced night vision on playervision component based on whether mode is a were-mode. Uses BEAVERVISION_COLOURCUBES for vision effect.
* **Parameters:**
  - `inst` -- Player entity instance
  - `mode` -- Were-mode constant
* **Returns:** nil
* **Error states:** Errors if inst.components.playervision is nil (no nil guard before PushForcedNightVision call).

### `SetWereMode(inst, mode, skiphudfx)` (internal)
* **Description:** Switches player into or out of were-mode. Behavior depends on mode:
  - Were-mode (BEAVER/MOOSE/GOOSE) — enables dynamic music (disabled), plays mode-specific music, shows HUD overlay, sets CanExamine=CannotExamine, configures were-actions/vision/runspeed.
  - Non-were-mode (NONE) — enables dynamic music, kills beaver music, hides HUD overlay, clears CanExamine, resets actions/vision/runspeed to human defaults.
* **Parameters:**
  - `inst` -- Player entity instance
  - `mode` -- Were-mode constant
  - `skiphudfx` -- Boolean to skip HUD effects
* **Returns:** nil
* **Error states:** Errors if inst.HUD or inst.components.locomotor is nil (no nil guards before member access).

### `SetGhostMode(inst, isghost)` (internal)
* **Description:** Sets or clears ghost mode. Clears were-mode when becoming ghost, restores were-mode when leaving ghost state.
* **Parameters:**
  - `inst` -- Player entity instance
  - `isghost` -- Boolean indicating ghost state
* **Returns:** nil
* **Error states:** Errors if inst._SetGhostMode is nil (no nil guard before method call).

### `OnWereModeDirty(inst)` (internal)
* **Description:** Event callback for weremodedirty event. Updates were-mode if HUD exists and player is not a ghost.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `OnGooseFlyingDirty(inst)` (internal)
* **Description:** Event callback for weregooseflyingdirty event. Starts or stops goose fly camera focus source and pushes/pops flying mixer based on flying state and weregoose tag.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `SetGooseFlying(inst, bool)`
* **Description:** Sets the weregooseflying netvar and triggers OnGooseFlyingDirty to update camera and audio.
* **Parameters:**
  - `inst` -- Player entity instance
  - `bool` -- Boolean to set flying state
* **Returns:** nil
* **Error states:** None

### `PushMooseSmashShake_CLIENT(inst)` (internal)
* **Description:** Applies camera shake for Moose smash attack on client. Calculates shake scale based on distance from player with easing.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `OnWereMooseSmashShake(inst)` (internal)
* **Description:** Handles Moose smash shake event. Calls client shake function if stategraph is nil (not predicting own shakes).
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `PushMooseSmashShake_SERVER(inst)` (internal)
* **Description:** Pushes weremoosesmashshake netvar and triggers client shake effect for Moose smash attack.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `OnPlayerDeactivated(inst)` (internal)
* **Description:** Cleanup callback when player is deactivated. Removes event listeners for onremove, weremodedirty, and weregooseflyingdirty. Kills beaver music sound.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if TheFocalPoint.SoundEmitter is nil (no nil guard before KillSound call).

### `OnPlayerActivated(inst)` (internal)
* **Description:** Initialization callback when player is activated. Creates beaver overlay image if needed, sets up event listeners for onremove, weremodedirty, and weregooseflyingdirty. Triggers dirty callbacks.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `GetBeaverness(inst)`
* **Description:** Deprecated function. Always returns 1. Assigned to inst in common_postinit for backward compatibility.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** 1
* **Error states:** None

### `IsBeaverStarving(inst)`
* **Description:** Deprecated function. Always returns false. Assigned to inst in common_postinit for backward compatibility.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** false
* **Error states:** None

### `GetWereness(inst)`
* **Description:** Returns current were-ness percentage. Checks wereness component first, then player_classified netvar, returns 0 if neither available.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** Number between 0 and 1, or 0
* **Error states:** Errors if inst.components.wereness and inst.player_classified are both nil (no nil guards before member access).

### `GetWerenessDrainRate(inst)`
* **Description:** Returns were-ness drain rate. Checks wereness component rate property first, then player_classified netvar divided by -6.3, returns 0 if neither available.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** Number representing drain rate, or 0
* **Error states:** Errors if inst.components.wereness and inst.player_classified are both nil (no nil guards before member access).

### `CanShaveTest(inst, doer)` (internal)
* **Description:** Action validity test for shaving. Returns false with REFUSE reason if player tries to shave themselves.
* **Parameters:**
  - `inst` -- Player entity instance
  - `doer` -- Entity attempting to shave
* **Returns:** false, or false with REFUSE string
* **Error states:** None

### `OnResetBeard(inst)` (internal)
* **Description:** Resets beard bits to 0 if in were-mode, otherwise sets to 3.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if inst.components.beard is nil (no nil guard before bits assignment).

### `WereSanityFn()` (internal)
* **Description:** Returns the were-form sanity penalty from TUNING.
* **Parameters:** None
* **Returns:** TUNING.WERE_SANITY_PENALTY value
* **Error states:** None

### `beaverbonusdamagefn(inst, target, damage, weapon)` (internal)
* **Description:** Calculates bonus damage for Beaver form. Returns BEAVER_WOOD_DAMAGE if target has tree or beaverchewable tag, otherwise 0.
* **Parameters:**
  - `inst` -- Player entity instance
  - `target` -- Target entity being attacked
  - `damage` -- Base damage value
  - `weapon` -- Weapon entity or nil
* **Returns:** Bonus damage number
* **Error states:** None

### `OnGooseRunningOver(inst, CalculateWerenessDrainRate)` (internal)
* **Description:** Callback fired when goose running drain timer expires. Decrements gooserunninglevel, schedules next timer if level `>` 1, or clears running state. Updates wereness drain rate.
* **Parameters:**
  - `inst` -- entity instance
  - `CalculateWerenessDrainRate` -- callback function to calculate drain rate
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guard before SetDrainRate call).

### `CalculateWerenessDrainRate(inst, mode, isfullmoon)` (internal)
* **Description:** Calculates wereness drain rate based on mode, fullmoon status, skill tags, and activity level. Applies multipliers for working/fighting/running states. Returns negative value for drain.
* **Parameters:**
  - `inst` -- entity instance
  - `mode` -- weremode constant (BEAVER, MOOSE, GOOSE)
  - `isfullmoon` -- boolean indicating fullmoon state
* **Returns:** number (negative drain rate)
* **Error states:** Errors if inst.components.skilltreeupdater or inst.sg is nil (no nil guards before method calls).

### `IsLucy(item)` (internal)
* **Description:** Checks if an item is Lucy the Axe by comparing prefab name.
* **Parameters:**
  - `item` -- inventory item entity
* **Returns:** boolean
* **Error states:** None

### `onworked(inst, data)` (internal)
* **Description:** Handler for working event. If chopping with possessable axe and Lucy not in inventory, spawns Lucy prefab, transfers axe properties, removes original axe, and equips Lucy with transform FX follower.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- event data with target reference
* **Returns:** nil
* **Error states:** Errors if equipitem.components.finiteuses is nil when GetUses() is called (no nil guard before method call on the chained access). Errors if equipitem.components.possessedaxe is nil (no nil guard before accessing revert_prefab/revert_uses).

### `OnIsFullmoon(inst, isfullmoon)` (internal)
* **Description:** Handles fullmoon state changes. Clears fullmoon mode when moon ends. On fullmoon start, sets wereness to 100% and starts draining if not lunar aligned. Updates drain rate based on current weremode.
* **Parameters:**
  - `inst` -- entity instance
  - `isfullmoon` -- boolean indicating fullmoon state
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guards before GetPercent/SetPercent/SetWereMode/SetDrainRate calls).

### `SetWereDrowning(inst, mode)` (internal)
* **Description:** Toggles drownable component for goose form. Disables drowning and adjusts collision mask when goose mode active outside caves. Re-enables drowning for other modes with teleport to prevent sinking.
* **Parameters:**
  - `inst` -- entity instance
  - `mode` -- weremode constant
* **Returns:** nil
* **Error states:** Errors if inst.Physics is nil (no nil guard before SetCollisionMask/Teleport calls).

### `SetWereRunner(inst, mode)` (internal)
* **Description:** Sets up goose running drain timer. Cancels existing timer, schedules OnGooseRunningOver callback, sets gooserunninglevel to 2, and updates drain rate. Clears running state for non-goose modes.
* **Parameters:**
  - `inst` -- entity instance
  - `mode` -- weremode constant
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guard before SetDrainRate call).

### `OnBeaverWorkingOver(inst)` (internal)
* **Description:** Callback fired when beaver working drain timer expires. Decrements beaverworkinglevel, schedules next timer if level `>` 1, or clears working state. Updates wereness drain rate.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guard before SetDrainRate call).

### `OnBeaverWorking(inst)` (internal)
* **Description:** Sets up beaver working drain timer. Cancels existing timer, schedules OnBeaverWorkingOver callback, sets beaverworkinglevel to 2, and updates drain rate.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guard before SetDrainRate call).

### `OnBeaverFighting(inst, data)` (internal)
* **Description:** Handler for beaver attacking. Triggers OnBeaverWorking to start working drain timer when target exists.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- event data with target reference
* **Returns:** nil
* **Error states:** None

### `OnBeaverOnMissOther(inst, data)` (internal)
* **Description:** Handler for beaver missing attack. Triggers OnBeaverFighting if not in tailslapping state.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- event data
* **Returns:** nil
* **Error states:** None

### `SetUpGroundPounder(inst)`
* **Description:** Configures groundpounder component for werebeaver. Sets ring mode, numRings to 3, radiusStepDistance to 2.75, ringWidth to 1.5, damage/destruction/push rings, workefficiency to 7, and groundpoundfx. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if inst.components.groundpounder is nil (no nil guard before member access).

### `SetWereWorker(inst, mode)` (internal)
* **Description:** Configures worker component for beaver mode. Behavior depends on mode:
  - BEAVER — adds toughworker tag if recoilimmune skill active, adds worker component with CHOP/MINE/DIG/HAMMER effectiveness based on skills, listens to working/onattackother/onmissother events, adds groundpounder component.
  - Non-BEAVER — removes worker/groundpounder components, removes toughworker tag, restores working listener for NONE mode (non-ghost).
* **Parameters:**
  - `inst` -- entity instance
  - `mode` -- weremode constant
* **Returns:** nil
* **Error states:** Errors if inst.components.skilltreeupdater is nil (no guard before HasSkillTag call)

### `OnMooseFightingOver(inst)` (internal)
* **Description:** Callback fired when moose fighting drain timer expires. Decrements moosefightinglevel, schedules next timer if level `>` 1, or clears fighting state. Updates wereness drain rate.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** None

### `ResetMooseFightingLevel(inst)` (internal)
* **Description:** Cancels existing moose fighting task and schedules a new one to end moose fighting after TUNING.WEREMOOSE_FIGHTING_DRAIN_TIME_DURATION. Resets fighting level to 2 and updates wereness drain rate.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** nil
* **Error states:** None

### `OnMooseFighting(inst, data)` (internal)
* **Description:** Event callback that triggers when Woodie attacks, misses, is attacked, or blocks while in moose form. Calls ResetMooseFightingLevel if target or attacker is present.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `data` -- Event data table containing target and/or attacker references
* **Returns:** nil
* **Error states:** None

### `OnDodgeAttack(inst)`
* **Description:** Spawns weregoose transform FX at Woodie's position with 1.3x scale when dodge attack occurs. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab returns nil (no nil guard before fx.Transform:SetPosition call).

### `SetWereFighter(inst, mode)` (internal)
* **Description:** Configures wereform-specific combat behaviors. Behavior depends on mode:
  - MOOSE — listens to combat events (onattackother/onmissother/attacked/blocked), adds health regen and planar defense skills if activated.
  - GOOSE — adds attackdodger component with dodge cooldown if woodie_curse_goose_3 skill is activated.
  - Other modes — removes moose bonuses (health regen, planar defense), clears fighting state.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `mode` -- WEREMODES constant indicating which wereform (MOOSE or GOOSE)
* **Returns:** nil
* **Error states:** Errors if inst.components.skilltreeupdater, inst.components.planardefense, inst.components.health, or inst.components.attackdodger is nil (no nil guards present before method calls).

### `DoRipple(inst)` (internal)
* **Description:** Spawns weregoose ripple FX prefab if Woodie is over water (drownable component check). Parented to inst.entity.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** nil
* **Error states:** None - gracefully handles nil drownable component.

### `OnNewGooseState(inst, data)` (internal)
* **Description:** Manages goose form sound effects based on current state. Kills or plays flap/honk sounds based on GOOSE_FLAP_STATES and GOOSE_HONK_STATES tables. Manages ripple task based on grogginess state.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `data` -- Event data table containing statename string
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil (no nil guards before PlaySound/KillSound calls).

### `GetGooseWaterproofness(inst)` (internal)
* **Description:** Returns waterproofness value based on woodie_curse_goose_2 skill activation. Returns TUNING.WATERPROOFNESS_ABSOLUTE if skill active, otherwise TUNING.WATERPROOFNESS_LARGE.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** number - waterproofness value from TUNING
* **Error states:** Errors if inst.components.skilltreeupdater is nil (no nil guard before IsActivated call).

### `SetWereSounds(inst, mode)` (internal)
* **Description:** Configures wereform-specific sound overrides. For GOOSE: listens to newstate events, sets flap/honk sounds, overrides hurt/death sounds. For other modes: kills goose sounds, sets appropriate hurt/death sound overrides based on mode.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `mode` -- WEREMODES constant indicating which wereform
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil (no nil guards before KillSound call).

### `ChangeWereModeValue(inst, newmode)` (internal)
* **Description:** Changes Woodie's weremode netvar. Manages wereplayer/beaver/wereform tags, network user flags, and skin mode overrides. Pushes startwereplayer or stopwereplayer events. Calls OnWereModeDirty after change.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `newmode` -- New weremode value to set
* **Returns:** nil
* **Error states:** Errors if inst.weremode netvar or inst.Network is nil (no nil guards before set/AddUserFlag/RemoveUserFlag calls).

### `CustomSetShadowForSkinMode(inst, skinmode)`
* **Description:** Sets dynamic shadow size based on SKIN_MODE_DATA shadow values for the given skinmode. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `skinmode` -- Skin mode string key for SKIN_MODE_DATA lookup
* **Returns:** nil
* **Error states:** Errors if inst.DynamicShadow is nil (no nil guard before SetSize call).

### `CustomSetDebuffSymbolForSkinMode(inst, skinmode)`
* **Description:** Sets debuff follow symbol based on SKIN_MODE_DATA debuffsymbol values for the given skinmode. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `skinmode` -- Skin mode string key for SKIN_MODE_DATA lookup
* **Returns:** nil
* **Error states:** Errors if inst.components.debuffable is nil (no nil guard before SetFollowSymbol call).

### `CustomSetSkinMode(inst, skinmode)`
* **Description:** Applies complete skin mode transformation: hides clothing if specified, sets anim bank, applies skin mode, sets shadow size, sets debuff symbol, sets freeze shatter level, and configures transform facing (8-faced for goose, 4-faced otherwise). Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
  - `skinmode` -- Skin mode string key for SKIN_MODE_DATA lookup
* **Returns:** nil
* **Error states:** Errors if SKIN_MODE_DATA[skinmode], inst.components.skinner, inst.AnimState, inst.DynamicShadow, inst.Transform, or inst.components.freezable is nil (no nil guards before method calls).

### `UpdateShadowDominanceState(inst)`
* **Description:** Updates shadow dominance tags based on wereplayer status and player_shadow_aligned tag. Adds inherentshadowdominance and shadowdominance tags when in wereform and shadow aligned. Removes tags when not in wereform unless shadowdominance item is equipped. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory is nil (no nil guard before accessing equipslots).

### `RecalculateWereformSpeed(inst)`
* **Description:** Applies wereform speed multiplier based on skill tree activation. Sets external speed multiplier for moose (woodie_curse_moose_1) or goose (woodie_curse_goose_1) forms. Removes multiplier when not in wereform. Assigned to inst in master_postinit.
* **Parameters:**
  - `inst` -- Entity instance - the Woodie character entity
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no nil guards before SetExternalSpeedMultiplier/RemoveExternalSpeedMultiplier calls).

### `onbecamehuman(inst)` (internal)
* **Description:** Callback executed when Woodie transforms back to human form. Resets locomotor speed to WILSON_RUN_SPEED, combat damage to UNARMED_DAMAGE, clears absorption and sanity rate modifiers, resumes hunger draining, sets insulation and waterproofness to 0, stops ignoring talker events, enables catcher, restores environment speed multipliers, resets food memory, stops wereness draining, and clears were-form specific functions and tags.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character transforming back to human form
* **Returns:** nil
* **Error states:** Errors if inst.sg is nil (no guard before HasStateTag call in ghostbuild check)

### `onbecamebeaver(inst)` (internal)
* **Description:** Callback executed when Woodie transforms to werebeaver form. Sets skin mode, updates minimap icon, configures BEAVER_RUN_SPEED and BEAVER_DAMAGE, sets absorption to BEAVER_ABSORPTION, applies WereSanityFn, disables pinnable, pauses hunger, sets large insulation and waterproofness, ignores talker events, disables catcher, sets environment speed multipliers to 1, starts wereness draining with calculated rate, and configures beaver-specific were functions.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character transforming to beaver form
* **Returns:** nil
* **Error states:** Errors if inst.sg is nil (no guard before HasStateTag call in ghostbuild check)

### `onbecamemoose(inst)` (internal)
* **Description:** Callback executed when Woodie transforms to weremoose form. Sets skin mode (unless ghostbuild or transform state), updates minimap icon, configures WEREMOOSE_RUN_SPEED and WEREMOOSE_DAMAGE, sets absorption to WEREMOOSE_ABSORPTION, applies WereSanityFn, disables pinnable, pauses hunger, sets large insulation and waterproofness, ignores talker events, disables catcher, sets environment speed multipliers to 1, starts wereness draining with calculated rate, and configures moose-specific were functions.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character transforming to moose form
* **Returns:** nil
* **Error states:** Errors if inst.sg is nil (no guard before HasStateTag call in ghostbuild/transform check)

### `onbecamegoose(inst)` (internal)
* **Description:** Callback executed when Woodie transforms to weregoose form. Sets skin mode, updates minimap icon, sets combat damage to 0 (goose cannot attack), clears absorption, applies WereSanityFn, disables pinnable, pauses hunger, sets large insulation, sets waterproofness via GetGooseWaterproofness, ignores talker events, disables catcher, sets environment speed multipliers to 1, starts wereness draining with calculated rate, and configures goose-specific were functions.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character transforming to goose form
* **Returns:** nil
* **Error states:** Errors if inst.sg is nil (no guard before HasStateTag call in ghostbuild check)

### `onwerenesschange(inst)` (internal)
* **Description:** Event handler for werenessdelta event. Checks if morph is allowed (not nomorph, silentmorph, ghost, or dead). If wereness percent `<=` 0 and in were mode, pushes transform_person event to become human. If wereness percent `>` 0 and not in were mode, determines weremode (random on fullmoon if fullmoon mode), then pushes transform_wereplayer event with appropriate callback (onbecamebeaver, onbecamemoose, or onbecamegoose).
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** nil
* **Error states:** Errors if inst.sg or inst.components.wereness is nil (no nil guards before HasStateTag/GetPercent calls).

### `onnewstate(inst)` (internal)
* **Description:** Event handler for newstate event. Tracks nomorph/silentmorph state tag changes and triggers onwerenesschange when exiting nomorph state. Updates wereness drain rate based on current weremode and fullmoon state.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** nil
* **Error states:** Errors if inst.sg or inst.components.wereness is nil (no nil guards before HasStateTag/SetDrainRate calls).

### `onrespawnedfromghost(inst, data, nofullmoontest)` (internal)
* **Description:** Callback when Woodie respawns from ghost form. Sets up event listeners for werenessdelta, newstate, and isfullmoon world state. Closes inventory if in were mode and triggers appropriate transformation callback based on current weremode value. Calls OnIsFullmoon unless nofullmoontest is true.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- event data table (unused in this function)
  - `nofullmoontest` -- boolean - if true, skips OnIsFullmoon call
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory or inst.components.wereness is nil (no nil guards before Close/GetPercent calls).

### `onbecameghost(inst, data)` (internal)
* **Description:** Callback when Woodie becomes a ghost. Clears wereness to 0 if not in were mode, sets ghost were skin mode if no corpse, resets food memory, stops wereness draining, clears weremode, removes event listeners and world state watches, and clears all were-form specific functions.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- event data table - may contain corpse flag
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness or inst.components.wereeater is nil (no nil guards before StopDraining/ResetFoodMemory calls).

### `OnForceTransform(inst, weremode)` (internal)
* **Description:** Forces Woodie to transform to a specific were form. Converts weremode string to WEREMODES enum, defaults to random mode if invalid or nil. Sets wereness weremode and percent to 1 (full). Notes that StartDraining is handled by stategraph callback, not called here.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `weremode` -- string or nil - target were mode name (beaver, moose, goose)
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness is nil (no nil guards before SetWereMode/SetPercent calls).

### `OnTackleStart(inst)` (internal)
* **Description:** Callback for tackler component when tackle starts. Checks if stategraph is in tackle_pre state, sets tackling flag in state memory, and transitions to tackle_start state. Returns true if tackle initiated.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character in moose form
* **Returns:** boolean - true if tackle started, nil otherwise
* **Error states:** None

### `OnTackleCollide(inst, other)` (internal)
* **Description:** Callback for tackler component on collision. Calculates bounce position based on physics radius, spawns round_puff_fx_hi, plays moose bounce sound, shakes all cameras. Applies grogginess based on woodie_curse_moose_1 skill (reduced grogginess if activated, otherwise 0.99).
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character in moose form
  - `other` -- entity instance - the collided entity
* **Returns:** nil
* **Error states:** Errors if inst.Transform, other.Transform, or inst.SoundEmitter is nil (no nil guards before GetWorldPosition/GetPhysicsRadius/PlaySound calls).

### `OnTackleTrample(inst, other)` (internal)
* **Description:** Callback for tackler component on trample. Spawns round_puff_fx_lg for largecreature or epic tagged entities, otherwise spawns round_puff_fx_sm at other entity position.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character in moose form
  - `other` -- entity instance - the trampled entity
* **Returns:** nil
* **Error states:** Errors if other.Transform is nil (no nil guard before GetWorldPosition call).

### `OnTakeDrowningDamage(inst, tuning)` (internal)
* **Description:** Callback for drownable component when taking drowning damage. Reduces wereness by tuning.WERENESS amount if present.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `tuning` -- tuning table containing WERENESS damage value
* **Returns:** nil
* **Error states:** None

### `GetDrowningDamageTunings(inst)` (internal)
* **Description:** Returns drowning damage tuning table. Uses WEREWOODIE key if in were mode, otherwise WOODIE key from TUNING.DROWNING_DAMAGE.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** table - drowning damage tuning entry
* **Error states:** None

### `onentityreplicated(inst)` (internal)
* **Description:** Client-side callback when entity is replicated. If stategraph exists and entity has wereplayer tag, transitions to idle state to ensure correct idle animation for were state.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character on client
* **Returns:** nil
* **Error states:** None

### `onpreload(inst, data)` (internal)
* **Description:** Called before load to restore state. Handles fullmoontriggered flag to reset wereness if already triggered. Adds player_lunar_aligned tag if saved. Triggers appropriate were form transformation callback based on saved isbeaver, ismoose, or isgoose flags, then goes to idle state.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- save data table containing were form and fullmoon state
* **Returns:** nil
* **Error states:** Errors if inst.components.wereness or inst.sg is nil (no nil guards before SetWereMode/SetPercent/GoToState calls).

### `onload(inst)` (internal)
* **Description:** Called on world load. If in were mode and not ghost, closes inventory and triggers onwerenesschange if wereness percent `<=` 0 (to transform back to human immediately since werenessdelta event won't fire on load). Calls OnIsFullmoon with current world state.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** nil
* **Error states:** Errors if inst.weremode netvar or inst.components.wereness is nil (no nil guards before value/GetPercent calls).

### `onsave(inst, data)` (internal)
* **Description:** Called on world save. Sets isbeaver, ismoose, or isgoose flag in data based on current weremode. Saves fullmoontriggered flag and player_lunar_aligned tag state (needed because skills activate after onload).
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- save data table to populate
* **Returns:** nil
* **Error states:** None

### `GetFrostyBreatherOffset(inst)` (internal)
* **Description:** Returns frostybreather offset vector based on current state. Returns TALLER_FROSTYBREATHER_OFFSET if riding, WEREMODE_FROSTYBREATHER_OFFSET based on current weremode, or DEFAULT_FROSTYBREATHER_OFFSET as fallback.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** Vector3 - offset position for frostybreather component
* **Error states:** Errors if inst.replica.rider is nil (no nil guard before IsRiding call).

### `customidleanimfn(inst)` (internal)
* **Description:** Returns custom idle animation name. Returns idle_woodie if Lucy axe is equipped in HANDS slot, otherwise nil.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** string or nil - animation name or nil for default
* **Error states:** Errors if inst.components.inventory is nil (no nil guard before GetEquippedItem call).

### `CanTeleportLinkFromPoint(map, x, y, z)` (internal)
* **Description:** Filter function for weregoose teleport. Returns false if teleport linking not permitted from point. Returns true only if point is land tile and does not have nocavein tag (prevents landing inside archives).
* **Parameters:**
  - `map` -- world map object
  - `x` -- world x coordinate
  - `y` -- world y coordinate
  - `z` -- world z coordinate
* **Returns:** boolean - true if teleport destination is valid
* **Error states:** None

### `UseWereFormSkill(inst, act)`
* **Description:** Executes were form skill ability. Consumes wereness based on current weremode from TUNING.SKILLS.WOODIE.WERESKILL_WERENESS_CONSUMPTION. If beaver, triggers groundpounder. If weregoose, finds random valid teleport point within 50 units and teleports, resetting minimap offset and snapping camera.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `act` -- action object (unused in function body)
* **Returns:** nil
* **Error states:** Errors if inst has no wereness component (unguarded access to inst.components.wereness). Errors if inst.components.groundpounder is nil when calling GroundPound (no nil guard).

### `IsWerebeaver(inst)`
* **Description:** Returns true if Woodie is currently in werebeaver form by comparing weremode value to WEREMODES.BEAVER.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** boolean - true if in beaver form
* **Error states:** None

### `IsWeremoose(inst)`
* **Description:** Returns true if Woodie is currently in weremoose form by comparing weremode value to WEREMODES.MOOSE.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** boolean - true if in moose form
* **Error states:** None

### `IsWeregoose(inst)`
* **Description:** Returns true if Woodie is currently in weregoose form by comparing weremode value to WEREMODES.GOOSE.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** boolean - true if in goose form
* **Error states:** None

### `OnInventoryStateChanged(inst, data)` (internal)
* **Description:** Adds or removes cancarveboards tag based on whether Woodie has Lucy axe in inventory (checks all containers).
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- event data (unused)
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory is nil (no nil guard before Has call).

### `OnSkillSelectionChange(inst, data)` (internal)
* **Description:** Handles woodie_human_lucy_1 skill activation/deactivation. If activated, sets up event listeners for itemget and itemlose to track Lucy axe inventory state. If deactivated, removes listeners and removes cancarveboards tag.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
  - `data` -- event data (unused)
* **Returns:** nil
* **Error states:** Errors if inst.components.skilltreeupdater is nil (no nil guard before IsActivated call).

### `common_postinit(inst)` (internal)
* **Description:** Client-side post-initialization. Adds woodcutter, polite, werehuman, and bearded tags. Overrides animation build for woodcarving actions and round_puff01 symbol. Adds quagmire_shopper tag in quagmire mode. In standard mode, adds wereness tag, assigns legacy GetBeaverness/IsBeaverStarving/GetWereness/GetWerenessDrainRate functions, sets up netvars for weremode, weregooseflying, and weremoosesmashshake, registers client-side event listeners for weremoosesmashshake, playeractivated, and playerdeactivated, and configures ghost mode override if ghost enabled. Sets frostybreather offset function and client-side OnEntityReplicated handler.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character
* **Returns:** nil
* **Error states:** Errors if inst.AnimState, inst.components.frostybreather, or inst.components.playercontroller is nil (no nil guards before AddOverrideBuild/OverrideSymbol/SetOffsetFn/RefreshReticule calls).

### `master_postinit(inst)` (internal)
* **Description:** Server-only post-initialization. Sets starting inventory based on game mode. Assigns customidleanim function. In standard mode (not lavaarena/quagmire), sets max health/hunger/sanity from TUNING, adds beard component with growth disabled and OnResetBeard callback, adds food affinity for honeynuggets, adds wereness and wereeater components (with OnForceTransform callback), adds tackler component with all callbacks and work actions configured, sets up skin mode functions, assigns UseWereFormSkill and SetGooseFlying, configures drownable callbacks, assigns were form checker functions, assigns RecalculateWereformSpeed/UpdateShadowDominanceState/OnDodgeAttack/SetUpGroundPounder, registers event listeners for ghost events and skill events, calls onrespawnedfromghost, and assigns OnSave/OnLoad/OnPreLoad lifecycle functions.
* **Parameters:**
  - `inst` -- entity instance - the Woodie player character on server
* **Returns:** nil
* **Error states:** Errors if inst.components.health, hunger, sanity, or drownable is nil (no nil guards before SetMaxHealth/SetMax/SetMax/SetOnTakeDrowningDamageFn calls).

## Events & listeners

**Listens to:**
- `onremove` -- Registered in OnPlayerActivated for cleanup on player removal
- `weremodedirty` -- Registered in OnPlayerActivated to update were-mode on netvar change
- `weregooseflyingdirty` -- Registered in OnPlayerActivated to update goose flying state on netvar change
- `working` -- Listened in SetWereWorker for beaver mode and non-ghost none mode
- `onattackother` -- Listened in SetWereWorker for beaver fighting detection
- `onmissother` -- Listened in SetWereWorker for beaver miss detection
- `attacked` -- Triggers OnMooseFighting when Woodie is attacked in moose form
- `blocked` -- Triggers OnMooseFighting when Woodie blocks in moose form
- `newstate` -- Triggers OnNewGooseState when goose form stategraph changes state
- `werenessdelta` -- Triggers onwerenesschange to handle transformation when wereness changes
- `itemget` -- Triggers OnInventoryStateChanged to update cancarveboards tag when Lucy is acquired
- `itemlose` -- Triggers OnInventoryStateChanged to update cancarveboards tag when Lucy is lost
- `ms_respawnedfromghost` -- Triggers onrespawnedfromghost when Woodie respawns from ghost form
- `ms_becameghost` -- Triggers onbecameghost when Woodie becomes a ghost
- `onactivateskill_server` -- Triggers OnSkillSelectionChange when woodie_human_lucy_1 skill is activated
- `ondeactivateskill_server` -- Triggers OnSkillSelectionChange when woodie_human_lucy_1 skill is deactivated
- `ms_skilltreeinitialized` -- Triggers OnSkillSelectionChange when skill tree initializes to check current skill state
- `playeractivated` -- Registered in common_postinit for player activation events
- `playerdeactivated` -- Registered in common_postinit for player deactivation events
- `woodie._weremoosesmashshake` -- Client-side listener for moose smash shake effect

**Pushes:**
- `enabledynamicmusic` -- Pushed on TheWorld when entering/exiting were-mode to toggle dynamic music
- `startwereplayer` -- Pushed when entering wereform mode - used by sentientaxe
- `stopwereplayer` -- Pushed when exiting wereform mode - used by sentientaxe
- `transform_person` -- Pushed in onwerenesschange when wereness reaches 0 to transform back to human
- `transform_wereplayer` -- Pushed in onwerenesschange when wereness `>` 0 to transform to were form (beaver, moose, or goose)