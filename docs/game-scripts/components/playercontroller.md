---
id: playercontroller
title: Playercontroller
description: Manages player input, locomotion prediction, targeting, placement, and combat actions for the player entity in Don't Starve Together.
tags: [player, input, locomotion, combat, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6a5024c8
system_scope: player
---

# Playercontroller

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The PlayerController component provides unified input handling and action coordination for the player entity in DST. It processes keyboard, mouse, and controller inputs on both client and server, manages state prediction for movement and actions, handles placement of structures/items via reticules and placers, supports targeting systems (including lock-on and cycling), orchestrates attack sequences and AOE charging/targeting, and synchronizes remote control state across networked clients. It acts as the central hub for player interaction by routing inputs to appropriate action buffers, coordinating with locomotor for movement prediction, and interfacing with inventory, combat, and builder subsystems.

## Usage example
```lua
local player = ThePlayer
if not player:AddComponent("playercontroller") then
    return
end

-- Activate input handling
player.components.playercontroller:Activate()

-- Manually trigger an action
player.components.playercontroller.DoActionButton(player.components.playercontroller)

-- Enable map controls
player.components.playercontroller:EnableMapControls(true)

-- Toggle target locking (controller only)
if player.components.playercontroller:CanLockTargets() then
    player.components.playercontroller:ControllerTargetLockToggle()
end
```

## Dependencies & tags
**Components used:**
- `inventory`, `combat`, `builder`, `equippable`, `health`, `rider`, `revivablecorpse`, `playeravatardata`, `aoetargeting`, `steeringwheeluser`, `embarker`, `spellbook`, `highlight`, `walkableplatform`, `predictwalkable`, `playeractionpicker`, `player_classified`
- `locomotor` (via `self.locomotor`)
- Global systems: `TheInput`, `TheSim`, `TheWorld`, `TheFrontEnd`, `TheCamera`, `Profile`, `TheScrapbookPartitions`, `RPC`

**Tags:**  
`"pausepredict"`, `"canrepeatcast"`, `"busy"`, `"playerghost"`, `"weregoose"`, `"turfhat"`, `"action_pulls_up_map"`, `"hostile"`, `"stealth"`, `"heavy"`, `"fire"`, `"lighter"`, `"catchable"`, `"spider"`, `"INLIMBO"`, `"NOCLICK"`, `"DECOR"`, `"pickable"`, `"harvestable"`, `"readyforharvest"`, `"minesprung"`, `"inactive"`, `"wall"`, `"inventoryitemholder_take"`, `"unsaddler"`, `"saddled"`, `"brush"`, `"brushable"`, `"revivablecorpse"`, `"corpse"`, `"gestaltcapturable"`, `"moonstormstaticcapturable"`, `"pinned"`, `"tapped_harvestable"`, `"tendable_farmplant"`, `"dried"`, `"donecooking"`, `"LunarBuildup"`, `"smolder"`, `"inspectable"`, `"usingmagiciantool"`, `"fueldepleted"`, `"client_forward_action_target"`, `"buoyant"`, `"mermthrone"`, `"merm"`, `"crabking_claw"`, `"bundle"`, `"hasfurnituredecoritem"`, `"portal"`, `"fishable"`, `"cancatch"`, `"warpdoor"`, `"pocketdimension_container"`, `"magiciantool"`, `"mapaction_works_on_unexplored"`, `"locomotor"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity that owns this component (typically `ThePlayer`). |
| `map` | `World` | — | Reference to the current world map (cached at init). |
| `ismastersim` | `boolean` | — | True if this node is authoritative for simulation (server or local player). |
| `locomotor` | `locomotor` | — | Reference to the player's locomotor component for movement/action buffering. |
| `_hasitemslots` | `boolean` | — | Cached inventory slot presence (updated by `CacheHasItemSlots`). |
| `handler` | `handler` or `nil` | `nil` | Active handler (e.g., UI overlay) that blocks default input. |
| `controller_target` | `Entity` or `nil` | `nil` | Current interaction target for controller (non-combat). |
| `controller_attack_target` | `Entity` or `nil` | `nil` | Current attack target for controller. |
| `controller_attack_target_ally_cd` | `number` | `0` | Ally attack cooldown timer. |
| `controller_targeting_lock_available` | `boolean` | — | Whether locking is available (state dependant). |
| `controller_targeting_lock_target` | `boolean` | — | Whether target lock is enabled. |
| `controller_targeting_targets` | `table` | — | List of valid entities for lock cycling. |
| `controller_targeting_target_index` | `number` | `0` | Current index in cycling list. |
| `remote_vector` | `Vector3` | `{x=0,y=0,z=0}` | Encodes remote walking mode (`y` flag) and target direction/position. |
| `remote_predict_dir` | `Vector3` or `nil` | `nil` | Direction for prediction override. |
| `remote_predict_stop_tick` | `number` or `nil` | `nil` | Tick at which prediction walking should stop. |
| `client_last_predict_walk` | `number` or `nil` | `nil` | Last predict walk tick on client. |
| `remote_controls` | `table` | `{}` | Map of active control IDs to remaining cooldowns. |
| `remote_predicting` | `boolean` | — | Whether prediction is in effect. |
| `remote_authority` | `boolean` | — | True if remote input has authority (e.g., console client). |
| `mousetimeout` | `number` | `0` | Time until mouse input can be processed. |
| `placer`, `deployplacer` | `Entity` or `nil` | `nil` | Active placement preview entity. |
| `placer_recipe`, `placer_recipe_skin` | `string` | — | Recipe/skin used for current placement. |
| `reticule` | `Entity` or `nil` | — | Reticule entity for targeting/placement visuals. |
| `terraformer` | `Entity` or `nil` | — | Terraformer preview entity. |
| `deploy_mode`, `deploy_mode` | `boolean` | — | True if deploy mode is active. |
| `classified` | `player_classified` or `nil` | `nil` | Client-side state classification for UI/networking. |
| `is_map_enabled` | `boolean` | — | Whether map controls are enabled (server only). |
| `can_use_map` | `boolean` | — | Whether map can be used (client/server sync). |
| `_clearinteractiontarget` | `function` or `nil` | — | Client-side cleanup function for interaction target. |
| `LMBaction`, `RMBaction` | `action` or `nil` | — | Cached LMB and RMB actions (used for map UI). |

## Main functions

### `PlayerController(inst)`
* **Description:** Constructor for the PlayerController component. Initializes internal state, caches references, registers event listeners, and schedules `OnInit`.
* **Parameters:**
  * `inst` — the entity instance to attach this component to.
* **Returns:** None.

### `PlayerController:Activate()`
* **Description:** Enables the player controller: registers control handler, sets up event listeners, initializes reticule, and starts prediction updates on client.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:Deactivate()`
* **Description:** Disables the player controller: cancels pending actions (placement, deploy, AOETargeting), removes reticule/terraformer, clears events, and stops updates.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:Enable(val)`
* **Description:** Enables or disables controller input (server only). Updates `classified.iscontrollerenabled`.
* **Parameters:**
  * `val` — boolean enable/disable.
* **Returns:** None.

### `PlayerController:ToggleController(val)`
* **Description:** Updates controller attachment state, refreshes reticule, and sends RPC (client). Returns active item on server if controller is attached.
* **Parameters:**
  * `val` — boolean new controller attachment state.
* **Returns:** None.

### `PlayerController:EnableMapControls(val)`
* **Description:** Enables/disables map controls on server and syncs to classified. Sets `is_map_enabled`.
* **Parameters:**
  * `val` — boolean.
* **Returns:** None.

### `PlayerController:SetCanUseMap(val)`
* **Description:** Sets `can_use_map` and synchronizes with classified map control state.
* **Parameters:**
  * `val` — boolean.
* **Returns:** None.

### `PlayerController:IsEnabled()`
* **Description:** Checks if controller is enabled (classification check + HUD blocking). Returns detailed blocking state.
* **Parameters:** None.
* **Returns:** `enable: boolean`, `hudblocking: string` (truthy value when HUD blocking is "allow limited gameplay").

### `PlayerController:IsMapControlsEnabled()`
* **Description:** Returns whether map controls are currently enabled based on classification and HUD state.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:IsControlPressed(control)`
* **Description:** Checks if a given control is currently pressed (via handler or remote controls).
* **Parameters:**
  * `control` — control ID (e.g., `CONTROL_ATTACK`, `CONTROL_PRIMARY`).
* **Returns:** `boolean`.

### `PlayerController:IsAnyOfControlsPressed(...)`
* **Description:** Checks if any of the provided controls are pressed.
* **Parameters:** variadic control IDs.
* **Returns:** `boolean`.

### `GetWorldControllerVector()`
* **Description:** Computes normalized world-space movement vector from analog controller inputs, with deadzone applied.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil` (if input inside deadzone).

### `PlayerController:GetMapTarget(act)`
* **Description:** Validates if an action is a map-pull action and returns its target entity.
* **Parameters:**
  * `act` — action object to validate.
* **Returns:** `ent` or `nil` if action invalid or lacks `"action_pulls_up_map"`.

### `PlayerController:PullUpMap(maptarget, forced_actiondef)`
* **Description:** Opens map screen and sets the map target. Centers map on player and cleans up HUD as needed.
* **Parameters:**
  * `maptarget` — target entity (e.g., portal, structure).
  * `forced_actiondef` — optional forced action definition.
* **Returns:** None.

### `PlayerController:DoActionButton()`
* **Description:** Initiates LMB-like actions: placement, deploy, pickup, use on scene, haunted, buff catching, etc. Handles both local and remote execution.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:DoControllerActionButton()`
* **Description:** Server/client handler for controller ACTION button: triggers placement, deploy, or dispatches remote action.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:OnRemoteControllerActionButton(actioncode, target, isreleased, noforce, mod_name)`
* **Description:** Server-side handler for remote ACTION button press. Resolves and queues action.
* **Parameters:**
  * `actioncode`, `target`, `isreleased`, `noforce`, `mod_name`.
* **Returns:** None.

### `PlayerController:DoControllerAltActionButton()`
* **Description:** Handles controller ALTACTION (RMB) button: placement cancellation, inventory actions, mount/dismount, spellbook, or dispose.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:DoControllerAttackButton(target)`
* **Description:** Initiates attack action for controller. Buffers attack with target or defaults. Respectsriding/item flags.
* **Parameters:**
  * `target` — optional attack target entity.
* **Returns:** None.

### `PlayerController:RemoteAttackButton(target, force_attack, isleftmouse, isreleased)`
* **Description:** Client-side RPC to send attack action to server.
* **Parameters:**
  * `target`, `force_attack`, `isleftmouse`, `isreleased`.
* **Returns:** None.

### `PlayerController:OnRemoteAttackButton(target, force_attack, noforce, isleftmouse, isreleased)`
* **Description:** Server-side RPC handler for attack. Handles chain attack and action buffering.
* **Parameters:**
  * `target`, `force_attack`, `noforce`, `isleftmouse`, `isreleased`.
* **Returns:** None.

### `StartAOETargetingUsing(item)`
* **Description:** Starts AOE targeting mode using a given item if it supports AOE targeting and is enabled.
* **Parameters:**
  * `item` — item entity with `components.aoetargeting`.
* **Returns:** None.

### `TryAOETargeting()`
* **Description:** Attempts to start AOE targeting on the currently equipped hands item, respecting `"allowriding"` andriding flags.
* **Parameters:** None.
* **Returns:** `boolean` — true if targeting started.

### `CancelAOETargeting()`
* **Description:** Stops AOE targeting mode by calling `StopTargeting()` on current reticule.
* **Parameters:** None.
* **Returns:** None.

### `TryAOECharging(force_rotation, iscontroller)`
* **Description:** Begins AOE charging state (slingshot). Validates item, state, and computes rotation. RPCs to server if needed.
* **Parameters:**
  * `force_rotation` — optional override rotation.
  * `iscontroller` — boolean for input source.
* **Returns:** `boolean` — true if charging started.

### `OnRemoteAOECharging(rotation, startflag)`
* **Description:** Server-side RPC handler for AOE charging. Sets rotation or starts charging.
* **Parameters:**
  * `rotation` — rotation angle (radians).
  * `startflag` — 0 (set rotation), 1/2 (start charging).
* **Returns:** None.

### `EchoReticuleAt(x, y, z)`
* **Description:** Spawns and flashes a reticule at world position (x,0,z) for feedback.
* **Parameters:**
  * `x`, `y`, `z` — world coordinates.
* **Returns:** None.

### `RefreshReticule(item)`
* **Description:** Destroys current reticule and creates a new one from equipped item (or override).
* **Parameters:**
  * `item` — optional override item.
* **Returns:** None.

### `GetAttackTarget(force_attack, force_target, isretarget, use_remote_predict)`
* **Description:** Finds best attack target by scanning entities and validating via `ValidateAttackTarget`.
* **Parameters:**
  * `force_attack`, `force_target`, `isretarget`, `use_remote_predict`.
* **Returns:** `Entity` or `nil`.

### `GetPickupAction(self, target, tool)`
* **Description:** Determines the `ACTIONS.*` code for interacting with a target (e.g., pickup, harvest, unpin, revive).
* **Parameters:**
  * `self`, `target`, `tool`.
* **Returns:** `ACTIONS.*` enum or `nil`.

### `GetActionButtonAction(force_target)`
* **Description:** Returns the highest-priority `BufferedAction` for the action button (pickup, haunted, catching, use, build).
* **Parameters:**
  * `force_target` — optional override target.
* **Returns:** `BufferedAction` or `nil`.

### `GetInspectButtonAction(target)`
* **Description:** Returns `BufferedAction` for `"LOOKAT"` inspect if target is inspectable.
* **Parameters:**
  * `target` — inspectable entity.
* **Returns:** `BufferedAction` or `nil`.

### `DoInspectButton()`
* **Description:** Triggers inspect action (scrapbook, popup, etc.).
* **Parameters:** None.
* **Returns:** None.

### `GetResurrectButtonAction()`
* **Description:** Returns `BufferedAction` for `"REMOTERESURRECT"` if player is ghost and has valid attunement.
* **Parameters:** None.
* **Returns:** `BufferedAction` or `nil`.

### `DoResurrectButton()`
* **Description:** Triggers resurrect action (ghost to body).
* **Parameters:** None.
* **Returns:** None.

### `DoCharacterCommandWheelButton()`
* **Description:** Handles spellbook use or escape via command wheel.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:UpdateControllerTargets(dt)`
* **Description:** Main target update loop. Dispatches to attack/target update functions unless disabled.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `UpdateControllerAttackTarget(self, dt, x, y, z, dirx, dirz)`
* **Description:** Updates `controller_attack_target`: checks validity, range, visibility, and ally cooldown.
* **Parameters:**
  * `self`, `dt`, `x`, `y`, `z`, `dirx`, `dirz`.
* **Returns:** None.

### `UpdateControllerInteractionTarget(self, dt, x, y, z, dirx, dirz, heading_angle)`
* **Description:** Updates `controller_target` for interactions: catching, fishing, portal priority.
* **Parameters:**
  * `self`, `dt`, `x`, `y`, `z`, `dirx`, `dirz`, `heading_angle`.
* **Returns:** None.

### `PlayerController:GetControllerTarget()`
* **Description:** Returns current interaction target.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `PlayerController:GetControllerAttackTarget()`
* **Description:** Returns current attack target.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `PlayerController:CanLockTargets()`
* **Description:** Returns whether target locking is available (state dependent).
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:IsControllerTargetLockEnabled()`
* **Description:** Returns whether target lock is currently enabled.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:IsControllerTargetLocked()`
* **Description:** Returns whether a target is locked (lock enabled + attack target exists).
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:ControllerTargetLock(enable)`
* **Description:** Enables or disables target locking.
* **Parameters:**
  * `enable` — boolean.
* **Returns:** None.

### `PlayerController:ControllerTargetLockToggle()`
* **Description:** Toggles target lock state.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:CycleControllerAttackTargetForward()`
* **Description:** Cycles forward through valid locking candidates.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:CycleControllerAttackTargetBack()`
* **Description:** Cycles backward through valid locking candidates.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:ResetRemoteController()`
* **Description:** Resets remote controller state: clears vector, controls, and prediction flags.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:GetRemoteDirectVector()`
* **Description:** Returns remote direct walking vector if flag `y==1`.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:GetRemoteDragPosition()`
* **Description:** Returns remote drag walking vector if flag `y==2`.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:GetRemotePredictPosition()`
* **Description:** Converts remote predict walking position to world space (if flag >=3 and platform valid).
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:GetRemotePredictPositionExternal()`
* **Description:** External version of `GetRemotePredictPosition`; always uses `ConvertPlatformRelativeToAbsoluteXZ`.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:GetRemotePredictStopXZ()`
* **Description:** Returns predicted stop position (XZ only) if tick matches and flag ==0.
* **Parameters:** None.
* **Returns:** `Vector3` XZ or `nil`.

### `PlayerController:OnRemoteDirectWalking(x, z)`
* **Description:** Server-side handler for direct walking RPC.
* **Parameters:**
  * `x`, `z` — direction.
* **Returns:** None.

### `PlayerController:OnRemoteDragWalking(x, z)`
* **Description:** Server-side handler for drag walking RPC.
* **Parameters:**
  * `x`, `z` — position.
* **Returns:** None.

### `PlayerController:OnRemotePredictWalking(x, z, isdirectwalking, isstart, platform, overridemovetime)`
* **Description:** Client-side handler for walking prediction RPC.
* **Parameters:**
  * `x`, `z` — position.
  * `isdirectwalking` — boolean.
  * `isstart` — restart timer if true.
  * `platform` — optional platform.
  * `overridemovetime` — optional override time.
* **Returns:** None.

### `PlayerController:RemoteDirectWalking(x, z)`
* **Description:** Sends RPC for direct walking to server.
* **Parameters:**
  * `x`, `z` — direction.
* **Returns:** None.

### `PlayerController:RemoteDragWalking(x, z)`
* **Description:** Sends RPC for drag walking to server.
* **Parameters:**
  * `x`, `z` — position.
* **Returns:** None.

### `PlayerController:RemotePredictWalking(x, z, isstart, overridemovetime, overridedirect)`
* **Description:** Sends RPC for predict walking (flag 3/4) to server.
* **Parameters:**
  * `x`, `z` — position.
  * `isstart`, `overridemovetime`, `overridedirect`.
* **Returns:** None.

### `PlayerController:OnRemoteStopWalking()`
* **Description:** Server-side handler to stop remote walking.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:RemoteStopWalking()`
* **Description:** Sends RPC to stop remote walking if currently walking.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:DoPredictWalking(dt)`
* **Description:** Server-side handler for remote predict walking. Implements path following, stop detection, and rubber band.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** `boolean` or `nil`.

### `PlayerController:DoDragWalking(dt)`
* **Description:** Handles drag walking behavior (preview and direct).
* **Parameters:**
  * `dt` — delta time.
* **Returns:** `boolean` or `nil`.

### `PlayerController:DoBoatSteering(dt)`
* **Description:** Handles boat steering via remote/local input.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `PlayerController:DoDoubleTapDir(allowaction)`
* **Description:** Detects double-tap direction input for actions (e.g., sprint).
* **Parameters:**
  * `allowaction` — if true, trigger immediate action.
* **Returns:** None.

### `PlayerController:OnRemoteDoubleTapAction(actioncode, position, noforce, mod_name)`
* **Description:** Server-side handler for double-tap action.
* **Parameters:**
  * `actioncode`, `position`, `noforce`, `mod_name`.
* **Returns:** None.

### `PlayerController:DoDirectWalking(dt)`
* **Description:** Handles direct walking with action buffering and combat clear-on-walk.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `PlayerController:DoCameraControl()`
* **Description:** Handles camera rotation/zoom (controller/freecam/legacy).
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:OnLeftUp()`
* **Description:** Handles release of left button during drag walking.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:OnLeftClick(down)`
* **Description:** Main LMB handler: placement, AOE targeting, double-tap, map pull, walking/drag start, combat retarget, RPC.
* **Parameters:**
  * `down` — boolean (true = press, false = release).
* **Returns:** None.

### `PlayerController:OnRemoteLeftClick(actioncode, position, target, isreleased, controlmodscode, noforce, mod_name, spellbook, spell_id)`
* **Description:** Server-side RPC handler for LMB. Resolves mouse actions and queues action.
* **Parameters:**
  * `actioncode`, `position`, `target`, `isreleased`, `controlmodscode`, `noforce`, `mod_name`, `spellbook`, `spell_id`.
* **Returns:** None.

### `PlayerController:OnRightClick(down)`
* **Description:** Main RMB handler: placement cancel, AOE cancel, map pull, RPC for remote.
* **Parameters:**
  * `down` — boolean.
* **Returns:** None.

### `PlayerController:OnRemoteRightClick(actioncode, position, target, rotation, isreleased, controlmodscode, noforce, mod_name)`
* **Description:** Server-side RPC handler for RMB.
* **Parameters:**
  * `actioncode`, `position`, `target`, `rotation`, `isreleased`, `controlmodscode`, `noforce`, `mod_name`.
* **Returns:** None.

### `PlayerController:RemapMapAction(act, position)`
* **Description:** Attempts to remap action to map-specific action (e.g., map-only actions).
* **Parameters:**
  * `act` — action object.
  * `position` — world position.
* **Returns:** Remapped action or `nil`.

### `PlayerController:GetMapActions(position, maptarget, actiondef)`
* **Description:** Gets LMB/RMB actions for map context (minimap/full map).
* **Parameters:**
  * `position` — map position.
  * `maptarget` — optional target.
  * `actiondef` — optional forced action def.
* **Returns:** `LMBaction`, `RMBaction`.

### `PlayerController:UpdateActionsToMapActions(position, maptarget, forced_actiondef)`
* **Description:** Caches map actions in `self.LMBaction`/`self.RMBaction`.
* **Parameters:**
  * `position`, `maptarget`, `forced_actiondef`.
* **Returns:** `LMBaction`, `RMBaction`.

### `PlayerController:GetItemSelfAction(item)`
* **Description:** Gets self-targeted inventory action (equip, use on self).
* **Parameters:**
  * `item` — item entity.
* **Returns:** Action or `nil`.

### `PlayerController:GetSceneItemControllerAction(item)`
* **Description:** Gets LMB/RMB actions for scene item (filters low-value actions).
* **Parameters:**
  * `item` — scene entity.
* **Returns:** `lmb`, `rmb`.

### `PlayerController:IsAxisAlignedPlacement()`
* **Description:** Returns true if current placer requires axis-aligned rotation.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:GetPlacerPosition()`
* **Description:** Returns world position of placer or deployplacer.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:GetGroundUseAction(position, spellbook)`
* **Description:** Gets LMB/RMB ground-use actions (placement, spells, terraform).
* **Parameters:**
  * `position` — optional world position.
  * `spellbook` — optional spellbook to use instead of hands item.
* **Returns:** `lmb`, `rmb`.

### `PlayerController:GetGroundUseSpecialAction(position, right)`
* **Description:** Gets special ground-use action (e.g., special tool).
* **Parameters:**
  * `position` — optional.
  * `right` — `true` for RMB, `false` for LMB.
* **Returns:** Action or `nil`.

### `PlayerController:HasGroundUseSpecialAction(right)`
* **Description:** Returns true if a special ground action exists at current position.
* **Parameters:**
  * `right` — boolean.
* **Returns:** `boolean`.

### `PlayerController:GetItemUseAction(active_item, target)`
* **Description:** Gets item-use action on target (includes mounted store, magic tool fallback).
* **Parameters:**
  * `active_item` — currently held item.
  * `target` — optional target entity.
* **Returns:** Action or `nil`.

### `PlayerController:DoAction(buffaction, spellbook)`
* **Description:** Processes buffered action: validity, busy exceptions, duplicate prevention, auto-equip, push.
* **Parameters:**
  * `buffaction` — `BufferedAction` table.
  * `spellbook` — optional spellbook for AOE repeat casting.
* **Returns:** None.

### `PlayerController:DoActionAutoEquip(buffaction)`
* **Description:** Auto-equips item for valid actions (excludes DROP, GIVE, etc.).
* **Parameters:**
  * `buffaction` — `BufferedAction`.
* **Returns:** None.

### `PlayerController:CancelPlacement(cache)`
* **Description:** Cancels placement preview and clears state. Optionally caches recipe.
* **Parameters:**
  * `cache` — boolean.
* **Returns:** None.

### `PlayerController:CancelDeployPlacement()`
* **Description:** Cancels deploy mode and removes deployplacer.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:StartBuildPlacementMode(recipe, skin)`
* **Description:** Starts build placement mode: spawns placer and sets up builder/testfn.
* **Parameters:**
  * `recipe`, `skin`.
* **Returns:** None.

### `PlayerController:IsTwinStickAiming()`
* **Description:** Returns true if reticule is in twin-stick aiming mode.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:GetAOETargetingPos()`
* **Description:** Returns current AOE targeting position from reticule.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `PlayerController:IsAOETargeting()`
* **Description:** Returns true if currently targeting with AOE reticule.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:HasAOETargeting()`
* **Description:** Returns true if equipped item supports AOE targeting/charging.
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:CooldownRemoteController(dt)`
* **Description:** Decrements all remote control cooldowns.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `PlayerController:CooldownHeldAction(dt)`
* **Description:** Decrements held action cooldown timer.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `PlayerController:OnRemoteStopControl(control)`
* **Description:** Server-side handler for stopping a remote control.
* **Parameters:**
  * `control` — control ID.
* **Returns:** None.

### `PlayerController:OnRemoteStopAllControls()`
* **Description:** Server-side handler for stopping all remote controls.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:RemoteStopControl(control)`
* **Description:** Stops specific control and sends RPC.
* **Parameters:**
  * `control` — control ID.
* **Returns:** None.

### `PlayerController:RemoteStopAllControls()`
* **Description:** Stops all controls and sends RPC.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:RemotePausePrediction(frames)`
* **Description:** Pushes frame count to pause prediction on server.
* **Parameters:**
  * `frames` — number of frames (default 0).
* **Returns:** None.

### `PlayerController:ShouldPlayerHUDControlBeIgnored(control, down)`
* **Description:** Returns true if HUD control should be ignored in favor of PlayerController priority.
* **Parameters:**
  * `control`, `down`.
* **Returns:** `boolean`.

### `PlayerController:OnControl(control, down)`
* **Description:** Main input handler. Routes controls to handlers: action, attack, toggle, map, placement cancel, inventory, targeting.
* **Parameters:**
  * `control`, `down`.
* **Returns:** None.

### `PlayerController:EncodeControlMods()`
* **Description:** Encodes modifier controls (FORCE_INSPECT, ATTACK, etc.) into bitmask.
* **Parameters:** None.
* **Returns:** `number` or `nil`.

### `PlayerController:DecodeControlMods(code)`
* **Description:** Decodes bitmask and populates `remote_controls` for modifiers.
* **Parameters:**
  * `code` — bitmask.
* **Returns:** None.

### `PlayerController:ClearControlMods()`
* **Description:** Clears all modifier flags from `remote_controls`.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:CanLocomote()`
* **Description:** Returns whether client can predict locomotion (state, prediction paused).
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:IsBusy()`
* **Description:** Returns true if player is in busy state (tag, state, prediction pause on client).
* **Parameters:** None.
* **Returns:** `boolean`.

### `PlayerController:GetCursorInventoryObject()`
* **Description:** Returns inventory item under cursor (client, controller only).
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `PlayerController:GetCursorInventorySlotAndContainer()`
* **Description:** Returns slot and container for cursor item (client).
* **Parameters:** None.
* **Returns:** `slot`, `container`.

### `PlayerController:GetHoverTextOverride()`
* **Description:** Returns hover text for placement preview if applicable.
* **Parameters:** None.
* **Returns:** `string` or `nil`.

### `PlayerController:OnRemoteControllerActionButtonDeploy(invobject, position, rotation, isreleased)`
* **Description:** Server-side handler for deploy action RPC.
* **Parameters:**
  * `invobject`, `position`, `rotation`, `isreleased`.
* **Returns:** None.

### `PlayerController:OnRemoteControllerActionButtonPoint(actioncode, position, isreleased, noforce, mod_name, isspecial, spellbook, spell_id)`
* **Description:** Server-side handler for point-based action RPC (special/spellbook/cannon).
* **Parameters:**
  * `actioncode`, `position`, `isreleased`, `noforce`, `mod_name`, `isspecial`, `spellbook`, `spell_id`.
* **Returns:** None.

### `PlayerController:OnRemoteControllerAltActionButton(actioncode, target, isreleased, noforce, mod_name)`
* **Description:** Server-side handler for remote alt action.
* **Parameters:**
  * `actioncode`, `target`, `isreleased`, `noforce`, `mod_name`.
* **Returns:** None.

### `PlayerController:OnRemoteControllerAltActionButtonPoint(actioncode, position, isreleased, noforce, isspecial, mod_name)`
* **Description:** Server-side handler for remote point-based alt action.
* **Parameters:**
  * `actioncode`, `position`, `isreleased`, `noforce`, `isspecial`, `mod_name`.
* **Returns:** None.

### `PlayerController:OnRemoteControllerAttackButton(target, isreleased, noforce)`
* **Description:** Server-side handler for remote attack button.
* **Parameters:**
  * `target`, `isreleased`, `noforce`.
* **Returns:** None.

### `PlayerController:DoControllerDropItemFromInvTile(item, single)`
* **Description:** Calls `inventory:DropItemFromInvTile` on server.
* **Parameters:**
  * `item`, `single`.
* **Returns:** None.

### `PlayerController:DoControllerInspectItemFromInvTile(item)`
* **Description:** Calls `inventory:InspectItemFromInvTile`.
* **Parameters:**
  * `item`.
* **Returns:** None.

### `PlayerController:DoControllerUseItemOnSelfFromInvTile(item)`
* **Description:** Handles using item on self from inventory tile (including repeat hold).
* **Parameters:**
  * `item`.
* **Returns:** None.

### `PlayerController:DoControllerUseItemOnSceneFromInvTile(item)`
* **Description:** Handles using item on scene from inventory tile.
* **Parameters:**
  * `item`.
* **Returns:** None.

### `PlayerController:RotLeft(speed)`
* **Description:** Rotates camera left by fixed or continuous speed.
* **Parameters:**
  * `speed` — optional rotation speed.
* **Returns:** None.

### `PlayerController:RotRight(speed)`
* **Description:** Rotates camera right by fixed or continuous speed.
* **Parameters:**
  * `speed` — optional rotation speed.
* **Returns:** None.

### `PlayerController:AttachClassified(classified)`
* **Description:** Attaches classified component and listens for its removal.
* **Parameters:**
  * `classified` — component to attach.
* **Returns:** None.

### `PlayerController:DetachClassified()`
* **Description:** Detaches classified component and clears listener.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:OnRemoveFromEntity()`
* **Description:** Cleans up events, deactivates controller, removes classified.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:GetPlatformRelativePosition(absolute_x, absolute_z)`
* **Description:** Converts world coordinates to local platform space if standing on platform.
* **Parameters:**
  * `absolute_x`, `absolute_z`.
* **Returns:** `platform`, `local_x`, `local_z` or `nil, absolute_x, absolute_z`.

### `PlayerController:RemoteUseItemFromInvTile(buffaction, item)`
* **Description:** RPC to use item from inventory tile (non-sim side).
* **Parameters:**
  * `buffaction`, `item`.
* **Returns:** None.

### `PlayerController:RemoteControllerUseItemOnItemFromInvTile(buffaction, item, active_item)`
* **Description:** RPC to use `active_item` on `item` (both inventory).
* **Parameters:**
  * `buffaction`, `item`, `active_item`.
* **Returns:** None.

### `PlayerController:RemoteControllerUseItemOnSelfFromInvTile(buffaction, item)`
* **Description:** RPC to use item on self (inventory).
* **Parameters:**
  * `buffaction`, `item`.
* **Returns:** None.

### `PlayerController:RemoteControllerUseItemOnSceneFromInvTile(buffaction, item)`
* **Description:** RPC to use item on scene entity.
* **Parameters:**
  * `buffaction`, `item`.
* **Returns:** None.

### `PlayerController:RemoteInspectItemFromInvTile(item)`
* **Description:** RPC to inspect item from tile.
* **Parameters:**
  * `item`.
* **Returns:** None.

### `PlayerController:RemoteDropItemFromInvTile(item, single)`
* **Description:** RPC to drop item from tile.
* **Parameters:**
  * `item`, `single`.
* **Returns:** None.

### `PlayerController:RemoteCastSpellBookFromInv(item, spell_id, spell_action)`
* **Description:** RPC to cast spell from spellbook.
* **Parameters:**
  * `item`, `spell_id`, `spell_action`.
* **Returns:** None.

### `PlayerController:RemoteMakeRecipeFromMenu(recipe, skin)`
* **Description:** RPC to build recipe from crafting menu.
* **Parameters:**
  * `recipe`, `skin`.
* **Returns:** None.

### `PlayerController:RemoteMakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** RPC to build recipe at point (with platform-relative coords).
* **Parameters:**
  * `recipe`, `pt`, `rot`, `skin`.
* **Returns:** None.

### `PlayerController:RemoteBufferedAction(buffaction)`
* **Description:** Client-side execution of buffered action during prediction.
* **Parameters:**
  * `buffaction`.
* **Returns:** None.

### `PlayerController:OnRemoteBufferedAction()`
* **Description:** Server-side handler for remote buffered action start. Corrects drift, forces movement, prevents vector cancellation.
* **Parameters:** None.
* **Returns:** None.

### `PlayerController:OnRemoteInteractionTarget(actioncode, target)`
* **Description:** Sets internal `remoteinteractionaction`/`target` for tracking.
* **Parameters:**
  * `actioncode`, `target`.
* **Returns:** None.

### `PlayerController:RemoteInteractionTarget(actioncode, target)`
* **Description:** Sends RPC only if target/action changed.
* **Parameters:**
  * `actioncode`, `target`.
* **Returns:** None.

### `PlayerController:GetRemoteInteraction()`
* **Description:** Returns current `remoteinteractionaction`/`target`.
* **Parameters:** None.
* **Returns:** `action`, `target`.

### `PlayerController:OnLocomotorBufferedAction(act)`
* **Description:** Callback when locomotor buffers an action.
* **Parameters:**
  * `act`.
* **Returns:** None.

### `PlayerController:OnRemoteToggleMovementPrediction(val)`
* **Description:** Server-side handler to toggle remote movement prediction.
* **Parameters:**
  * `val` — boolean.
* **Returns:** None.

### `CheckControllerPriorityTagOrOverride(target, tag, override)`
* **Description:** Checks if target has tag unless override is provided.
* **Parameters:**
  * `target`, `tag`, `override`.
* **Returns:** `boolean` or override value.

### `_CalcAOEChargingStartingRotation(self)`
* **Description:** Calculates starting rotation for AOE charging from input.
* **Parameters:**
  * `self`.
* **Returns:** Rotation (radians) or `nil`.

### `RemoteAOEChargingDir(rotation)`
* **Description:** Sends RPC for AOE charging rotation.
* **Parameters:**
  * `rotation`.
* **Returns:** None.

### `GetActiveSpellBook()`
* **Description:** Returns reticule's spellbook owner if valid.
* **Parameters:** None.
* **Returns:** `inst` or `nil`.

### `ValidateAttackTarget(combat, target, force_attack, x, z, has_weapon, reach)`
* **Description:** Validates if target is attackable: combat state, stealth, ally/follower, hostility, range.
* **Parameters:**
  * `combat`, `target`, `force_attack`, `x`, `z`, `has_weapon`, `reach`.
* **Returns:** `boolean`.

### `GetHoverTextOverride()`
* **Description:** Returns hover text for placement preview if active.
* **Parameters:** None.
* **Returns:** `string` or `nil`.

### `IsDoingOrWorking()`
* **Description:** Returns true if player is in doing/working state/tag.
* **Parameters:** None.
* **Returns:** `boolean`.

### `UsingMouse()`
* **Description:** Returns true if controller is not attached.
* **Parameters:** None.
* **Returns:** `boolean`.

### `ClearActionHold()`
* **Description:** Resets hold-related fields and sends RPC if client.
* **Parameters:** None.
* **Returns:** None.

### `RepeatHeldAction()`
* **Description:** Handles repeating held actions (e.g., inventory long-press).
* **Parameters:** None.
* **Returns:** None.

### `OnWallUpdate(dt)`
* **Description:** If handler active, triggers `DoCameraControl`.
* **Parameters:**
  * `dt`.
* **Returns:** None.

### `GetCombatRetarget()`
* **Description:** Returns combat retarget target from state memory or replica.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `GetCombatTarget()`
* **Description:** Returns combat attack target from state memory.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `OnUpdate(dt)`
* **Description:** Main per-frame update: processes input, placement, targeting, reticule, dragging, walking modes, boat steering, combat chaining, RPC sync, input HUD blocking.
* **Parameters:**
  * `dt` — delta time.
* **Returns:** None.

### `OnPlayerActivated(inst)`
* **Description:** Event callback to activate player controller.
* **Parameters:**
  * `inst`.
* **Returns:** None.

### `OnPlayerDeactivated(inst)`
* **Description:** Event callback to deactivate player controller.
* **Parameters:**
  * `inst`.
* **Returns:** None.

### `OnInit(inst, self)`
* **Description:** Post-constructor init; registers events, early client setup, calls `OnEquipChanged`.
* **Parameters:**
  * `inst`, `self`.
* **Returns:** None.

### `OnEquipChanged(inst)`
* **Description:** Handles inventory equip/unequip: toggles `gridplacer_turfhat`.
* **Parameters:**
  * `inst`.
* **Returns:** None.

### `OnBuild(inst)`
* **Description:** Event callback to cancel placement on build event.
* **Parameters:**
  * `inst`.
* **Returns:** None.

### `OnEquip(inst, data)`
* **Description:** Handles equip: manages reticule/aoetargeting.
* **Parameters:**
  * `inst`, `data` — `{eslot, item}`.
* **Returns:** None.

### `OnUnequip(inst, data)`
* **Description:** Handles unequip: restores previous reticule.
* **Parameters:**
  * `inst`, `data`.
* **Returns:** None.

### `OnInventoryClosed(inst)`
* **Description:** Clears AOETargeting and destroys reticule on inventory close.
* **Parameters:**
  * `inst`.
* **Returns:** None.

### `OnZoom(inst, data)`
* **Description:** Handles camera zoom in/out.
* **Parameters:**
  * `inst`, `data.zoom`, `data.zoomout`.
* **Returns:** None.

### `OnNewActiveItem(inst, data)`
* **Description:** Cancels AOETargeting on new active item.
* **Parameters:**
  * `inst`, `data`.
* **Returns:** None.

### `OnContinueFromPause()`
* **Description:** Re-syncs controller state and zoom mapping after resume.
* **Parameters:** None.
* **Returns:** None.

### `OnDeactivateWorld()`
* **Description:** Deactivates controller before world reset/regenerate.
* **Parameters:** None.
* **Returns:** None.

### `CacheHasItemSlots(self)`
* **Description:** Updates cached `_hasitemslots`.
* **Parameters:**
  * `self`.
* **Returns:** `boolean`.

### `HasItemSlots(self)`
* **Description:** Returns cached `_hasitemslots`.
* **Parameters:**
  * `self`.
* **Returns:** `boolean`.

### `UpdateControllerConflictingTargets(self)`
* **Description:** Resolves conflicts between interaction and attack targets.
* **Parameters:**
  * `self`.
* **Returns:** None.

## Events & listeners

### Listens to
- `"playeractivated"` — triggers `OnPlayerActivated`
- `"playerdeactivated"` — triggers `OnPlayerDeactivated`
- `"buildstructure"` — triggers `OnBuild`
- `"equip"` — triggers `OnEquip`
- `"unequip"` — triggers `OnUnequip`
- `"zoomcamera"` — triggers `OnZoom`
- `"newactiveitem"` — triggers `OnNewActiveItem`
- `"continuefrompause"` — triggers `OnContinueFromPause`
- `"inventoryclosed"` — triggers `OnInventoryClosed`
- `"deactivateworld"` — triggers `OnDeactivateWorld`
- `"onremove"` — triggers `AttachClassified` removal listener
- `"newstate"` — triggers `OnNewState` when movement prediction enabled

### Pushes
- `"endsteeringreticule"` — during boat steering transitions
- `"starsteeringreticule"` — during boat steering transitions
- `"locomote"` — via `OnRemotePredictOverrideLocomote` with `{ dir = dir, remoteoverridelocomote = true }`
- `"quagmire_shoptab"` — in `OnLeftClick` when `LOOKAT` action has quagmire_shoptab
- `"ms_overridelocomote_click"` — in `OnLeftClick` for server direction override
- `"endsteeringreticule"`, `"starsteeringreticule"` — client platform events
