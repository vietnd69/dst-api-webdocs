---
id: playercontroller
title: Playercontroller
description: Handles player input processing, movement control, targeting, and action execution for both keyboard/mouse and controller interfaces.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 6a5024c8
---

# Playercontroller

## Overview
The PlayerController component is the central input handler for player-controlled entities in Don't Starve Together. It processes all control inputs from both keyboard/mouse and gamepad devices, translates them into game actions (movement, attacking, using items, building), manages targeting systems (especially for controllers), handles placement mode for building and deployment, and coordinates with the network layer to synchronize actions between client and server. It manages state for direct walking, drag walking, prediction-based movement, camera control, reticule/target rendering, and controller-specific features like target locking and command wheel.

## Dependencies & Tags
- **Component Dependencies**:
  - `inst.components.locomotor`
  - `inst.components.combat`
  - `inst.components.inventory`
  - `inst.components.builder`
  - `inst.replica.inventory`, `inst.replica.builder`, `inst.replica.combat`, `inst.replica.rider`
  - `inst.player_classified` (client-side classified data)
- **Event Listeners** (added during Activate()):
  - `"equip"`/`"unequip"`/`"inventoryclosed"` (client only) -> Updates equipment-dependent features like reticule and gridplacer
  - `"buildstructure"` -> Cancels placement
  - `"zoomcamera"` -> Handles camera zoom
  - `"newactiveitem"` -> Cancels AOE targeting
  - `"continuefrompause"` -> Refreshes controller state and caches zoom/scroll mappings
  - `"deactivateworld"` (client only) -> Deactivates component
  - `"newstate"` (client only, for prediction) -> Syncs state for prediction
- **Tags Used**:
  - Player-specific tags like `"playerghost"`, `"weregoose"`, `"sitting_on_chair"`, `"usingmagiciantool"`, `"nopredict"`, `"canrepeatcast"`, `"busy"`, `"idle"`, `"moving"`, `"floating"`, `"boathopping"`, `"attack"`, `"steeringboat"`, `"rotatingboat"`, `"cancatch"`, `"hasfurnituredecoritem"`, `"inspectable"`, `"stealth"`, `"hostile"`, `"INLIMBO"`, `"NOCLICK"`, `"decors"`, `"FX"`, `"heavy"`, `"fire"`, `"lighter"`, `"catchable"`, `"pinned"`, `"corpse"`, `"saddled"`, `"brushable"`, `"pocketdimension_container"`, `"walker"`, `"locomotor"`, `"client_forward_action_target"`, `"groundcutter"`, `"client_forward_action_target"`.
- **Notable Target Tags**:
  - `"_combat"` for combat entities, `"_health"`, `"inventoryitem"`, `"pickup"`, `"pickup_workable"`, `"tapped_harvestable"`, `"tendable_farmplant"`, `"dried"`, `"donecooking"`, `"inventoryitemholder_take"`, `"brush"`, `"unfertilized"`, `"minesprung"`, `"inactive"`, `"wall"`, `"portal"`, `"hasfurnituredecoritem"`, `"mermthrone"`, `"merm"`, `"crabking_claw"`, `"gestaltcapturable"`, `"moonstormstaticcapturable"`, `"catchable"`, `"pinned"`, `"corpse"`, `"haunted"`, `"pocketdimension_container"`, `"boatbuilder"`, `"boat"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | EntityRef | — | Reference to the player entity. |
| `map` | MapComponent | — | World map component (cached on init). |
| `ismastersim` | boolean | — | True if this instance is the server master simulation. |
| `locomotor` | LocomotorComponent | — | Component for movement actions (cached on init). |
| `HasItemSlots` | function | — | Function to check if inventory has slots. Initialized via `CacheHasItemSlots`. |
| `attack_buffer` | BufferedAction \| nil \| string (`CONTROL_ATTACK`/`CONTROL_CONTROLLER_ATTACK`) | `nil` | Buffered attack action or command identifier. |
| `controller_attack_override` | BufferedAction \| nil | `nil` | Overrides default controller attack behavior. |
| `remote_vector` | Vector3 | `Vector3()` | Encodes walking state: `y=0`: stopped, `y=1`: direct walk, `y=2`: drag walk, `y=3/4`: predict walk (direct/predict), `y=5`: override, `y=6`: hopping. |
| `remote_predict_dir` | number\|nil | `nil` | Last predicted movement direction. |
| `remote_predict_stop_tick` | number\|nil | `nil` | Tick count when a predicted walk stopped. |
| `client_last_predict_walk` | table | `{ tick = nil, direct = false }` | Tracks last client-side prediction walk state. |
| `remote_controls` | table | `{}` | Map of active controls to their cooldown values. |
| `remote_predicting` | boolean | `false` | Whether prediction mode is active. |
| `remote_authority` | boolean | `false` | True if client has elevated permissions (admin/mod/friend) on console builds. |
| `recent_bufferedaction` | table | `{ act = nil, t = 0, x = 0, z = 0 }` | Stores the last buffered action for control conflict prevention. |
| `dragwalking` | boolean | `false` | Whether drag walking is active. |
| `directwalking` | boolean | `false` | Whether direct walking is active. |
| `predictwalking` | boolean | `false` | Whether prediction-based walking is active. |
| `predictionsent` | boolean | `false` | Deprecated; preserved for compatibility. |
| `draggingonground` | boolean | `false` | Whether the player is dragging the mouse on the ground. |
| `is_hopping` | boolean | `false` | Tracks if player is hopping. |
| `startdragtestpos` | Vector3\|nil | `nil` | Start position for drag test. |
| `startdragtime` | number\|nil | `nil` | Time when drag test started. |
| `startdoubleclicktime` | number\|nil | `nil` | Time when double-click started. |
| `startdoubleclickpos` | Vector3\|nil | `nil` | Screen position at double-click start. |
| `doubletapmem` | table | `{ down = false }` | Memory for double-tap detection. |
| `isclientcontrollerattached` | boolean | `false` | Whether a controller is attached. |
| `mousetimeout` | number | `10` | Mouse timeout duration. |
| `time_direct_walking` | number | `0` | Accumulated time of direct walking. |
| `controller_target` | EntityRef\|nil | `nil` | Current controller interaction target. |
| `controller_target_age` | number | `math.huge` | Age of current controller target (used for flicker prevention). |
| `controller_attack_target` | EntityRef\|nil | `nil` | Current controller attack target. |
| `controller_attack_target_ally_cd` | number\|nil | `nil` | Cooldown before re-targeting allies. |
| `controller_targeting_lock_available` | boolean | `true` | Whether target locking is available (based on profile setting). |
| `controller_targeting_lock_target` | boolean | `false` | Whether target locking is enabled. |
| `controller_targeting_targets` | table | `{}` | List of valid targets for cycling when locked. |
| `controller_targeting_target_index` | number\|nil | `nil` | Current index in the cycling list. |
| `command_wheel_allows_gameplay` | boolean | — | Whether command wheel allows movement and other gameplay. |
| `reticule` | ReticuleComponent\|nil | `nil` | Current reticule for targeting (e.g., spellbook, AOE tool). |
| `terraformer` | EntityRef\|nil | `nil` | Terraformer preview entity. |
| `deploy_mode` | boolean | `true` | True when deployment mode is active (controller-specific). |
| `deployplacer` | EntityRef\|nil | `nil` | Deploy placer preview entity. |
| `placer` | EntityRef\|nil | `nil` | Placement preview entity. |
| `placer_recipe` | string\|nil | `nil` | Recipe being placed. |
| `placer_recipe_skin` | string\|nil | `nil` | Skin for the placed recipe. |
| `placer_cached` | table\|nil | `nil` | Cached placer recipe for quick restore. |
| `LMBaction`, `RMBaction` | BufferedAction\|nil | `nil` | Currently cached LMB/RMB actions. |
| `handler` | ControlHandler\|nil | `nil` | Input handler reference (only when active). |
| `actionbuttonoverride` | function\|nil | `nil` | Custom action button override function. |
| `heldactioncooldown` | number | `0` | Cooldown timer for repeated held actions. |
| `remoteinteractionaction`, `remoteinteractiontarget` | — | `nil` | Remote interaction state. |
| `_clearinteractiontarget` | function\|nil | — | Helper for clearing remote interaction on fail. |
| `classified` | Classfied\|nil | — | Client-side classified data for player. |
| `is_map_enabled`, `can_use_map` | boolean | `true` | Controls map enablement. |

## Main Functions

### `OnControl(control, down)`
* **Description**: Main input handler for all controls. Parses control codes, checks if enabled, and routes to specific action handlers (left/right click, placement cancellation, item interaction, controller-specific buttons, targeting). Handles control priority, HUD blocking, and buffering of actions based on player state.
* **Parameters**:
  - `control`: Number — Control ID (e.g., `CONTROL_PRIMARY`, `CONTROL_SECONDARY`, `CONTROL_ATTACK`, `CONTROL_CONTROLLER_ACTION`, etc.).
  - `down`: boolean — True if control was pressed, false if released.

### `OnLeftClick(down)` / `OnRightClick(down)`
* **Description**: Handles mouse left/right clicks. Manages placement mode, AOE targeting, map actions, double-tap/hold detection, and initiates actions via `DoAction`. Supports map actions, reticule ping, and platform-relative positioning for remote clients.
* **Parameters**:
  - `down`: boolean — Click state.

### `DoActionButton()`
* **Description**: Handles the controller "action" button (A on Xbox, X on PlayStation). Tries to pick up, use, harvest, or perform an action on a target. Supports special cases like spellbooks, dismount, rummage, haunt, catch, revive, or uses a tool action. Delegates to `GetActionButtonAction` for action selection and sends RPC for remote clients.
* **Parameters**: None.

### `DoControllerActionButton()`
* **Description**: Handles the dedicated controller action button (L.Dpad or similar). Handles placement, deploy placement, AOE targeting, or gets the ground/controller target action. Coordinates with preview callbacks, RPC sending, and special cases like spellbooks and boat cannons.
* **Parameters**: None.

### `DoControllerAltActionButton()`
* **Description**: Handles the controller alt action button (R.Dpad or similar). Used for secondary actions like applying construction, using items on objects, or accessing spellbooks when no tools are equipped. Similar flow to `DoControllerActionButton` but uses alt action logic.
* **Parameters**: None.

### `DoAttackButton(retarget, isleftmouse)`
* **Description**: Handles attack initiation (mouse or keyboard). Computes valid attack targets, checks attack range, line of sight, hostility, and recent targeting history. Uses `attack_buffer` to prevent spamming and ensures server-side accuracy. For remote clients, sends attack RPC.
* **Parameters**:
  - `retarget`: EntityRef\|nil — Optional target to re-target.
  - `isleftmouse`: boolean — True if the attack was triggered by the left mouse button.

### `DoControllerAttackButton(target)`
* **Description**: Handles controller attack button (e.g., A + stick or R1). If a target is provided, attacks it directly; otherwise, uses `controller_attack_target` or auto-targets via `GetAttackTarget`. Manages attack state, cooldowns, and remote client RPCs.
* **Parameters**:
  - `target`: EntityRef\|nil — Optional override target.

### `GetAttackTarget(force_attack, force_target, isretarget, use_remote_predict)`
* **Description**: Computes the best attack target in range. Considers weapon reach, hostility, recent targeting, line of sight, entity tags (hostile, fleet, epic, monster), and current combat state. Returns the best candidate entity or `nil`.
* **Parameters**:
  - `force_attack`: boolean — Bypass hostility checks (e.g., shift+click).
  - `force_target`: EntityRef\|nil — Force a specific target.
  - `isretarget`: boolean — Allows retargeting of recent targets.
  - `use_remote_predict`: boolean — Use predicted position for remote clients.

### `GetActionButtonAction(force_target)`
* **Description**: Determines the best inventory/tool action for the current situation when the action button is pressed. Checks haunt (ghost), bug net, catch, unpin, revive, pickup, harvest, tool actions, and returns a `BufferedAction`.
* **Parameters**:
  - `force_target`: EntityRef\|nil — Optional specific target.

### `GetControllerTarget()`
* **Description**: Returns the current controller interaction target (cached by `UpdateControllerTargets`). Used for item usage, inspection, and interaction in controller mode.
* **Parameters**: None.

### `GetControllerAttackTarget()`
* **Description**: Returns the current controller attack target (cached by `UpdateControllerTargets`). Used for auto-attack and targeting via controller.
* **Parameters**: None.

### `UpdateControllerTargets(dt)`
* **Description**: Main update function for controller targets. Calculates interaction and attack targets based on proximity, angle, priority tags, and targeting state (including target locking). Updates cached `controller_target` and `controller_attack_target` after validation and filtering.
* **Parameters**:
  - `dt`: number — Delta time since last frame.

### `ControllerTargetLockToggle()`
* **Description**: Toggles target locking. When enabled, locks onto the current `controller_attack_target` and enables cycling of nearby valid targets.
* **Parameters**: None.

### `CycleControllerAttackTargetForward()`
* **Description**: Cycles forward through the list of valid targets for targeting lock. Updates `controller_attack_target` and `controller_targeting_target_index`.
* **Parameters**: None.

### `StartBuildPlacementMode(recipe, skin)`
* **Description**: Activates building placement mode using a recipe. Creates a placer preview entity (`placer`) and sets its builder and test function. Used for constructing buildings and structures.
* **Parameters**:
  - `recipe`: string — Recipe name.
  - `skin`: string\|nil — Skin ID for the recipe.

### `CancelPlacement(cache)`
* **Description**: Cancels current placement mode. Removes the placer entity and clears placement state. Optionally caches the recipe for quick restore if `cache` is true.
* **Parameters**:
  - `cache`: boolean — Whether to cache the recipe and skin.

### `DoDragWalking(dt)`
* **Description**: Handles drag walking logic when the player holds down left-click and drags. Updates the drag state and locomotor direction, and sends drag walking RPC for remote clients.
* **Parameters**:
  - `dt`: number — Delta time.

### `DoDirectWalking(dt)`
* **Description**: Handles direct walking logic when the player holds a directional input. Updates walking mode, calculates direction, and sends direct walking RPC for remote clients. Prevents conflict with buffered actions and manages combat targeting cancellation after timeout.
* **Parameters**:
  - `dt`: number — Delta time.

### `DoPredictWalking(dt)`
* **Description**: Handles prediction-based walking for remote clients and local player in prediction mode. Compares target position to current position, applies locomotor updates, handles overshoot and rubber-banding, and sends prediction RPCs to the server.
* **Parameters**:
  - `dt`: number — Delta time.

### `DoCameraControl()`
* **Description**: Handles camera control via mouse or controller. Supports rotation, zoom, and fine-tuned control with deadzones, repeat delays, and invert settings.
* **Parameters**: None.

### `DoAction(buffaction, spellbook)`
* **Description**: Finalizes and executes an action. Validates the action, prevents duplicates, handles auto-equip for inventory items, triggers preview callbacks, pushes to locomotor, and sends RPC for remote clients.
* **Parameters**:
  - `buffaction`: BufferedAction — Action to execute.
  - `spellbook`: EntityRef\|nil — Optional spellbook for spell actions.

### `Activate()`
* **Description**: Activates the player controller. Attaches input handler, sets up event listeners (equip, build, zoom, etc.), initializes handlers, refreshes reticule, starts updates for simulation and prediction.
* **Parameters**: None.

### `Deactivate()`
* **Description**: Deactivates the player controller. Cancels all active placements, clears handlers, removes event listeners, resets state, destroys reticule/terraformer, and stops updates.
* **Parameters**: None.

### `IsEnabled()`
* **Description**: Returns whether the controller is enabled and input can be processed. Checks classified flags, HUD state, and special modes (crafting, spell wheel, command wheel). Also returns a secondary boolean indicating if HUD is blocking but limited gameplay (e.g., spell wheel) is allowed.
* **Parameters**: None.

### `GetLeftMouseAction()` / `GetRightMouseAction()`
* **Description**: Returns the currently cached LMB/RMB actions (`self.LMBaction`, `self.RMBaction`) computed during the last update.
* **Parameters**: None.

### `GetGroundUseAction(position, spellbook)`
* **Description**: Gets ground-level actions at a given position (or reticule/telegraph position). Supports AOE targeting and spellbook casting, and considers tool validity and passability.
* **Parameters**:
  - `position`: Vector3\|nil — Position to check.
  - `spellbook`: EntityRef\|nil — Optional spellbook to use.

### `GetSceneItemControllerAction(item)`
* **Description**: Gets LMB and RMB actions for a scene item in controller mode. Filters out default/invalid actions like WALKTO and LOOKAT on combat targets, and prefers RMB if LMB is not applicable.
* **Parameters**:
  - `item`: EntityRef — Item to inspect.

### `GetItemUseAction(active_item, target)`
* **Description**: Gets item-specific actions (e.g., use, store, combine) for an active item on a target. Handles special cases like mounted store actions and tool restrictions.
* **Parameters**:
  - `active_item`: EntityRef — The active inventory item.
  - `target`: EntityRef\|nil — Target entity for the action.

### `OnRemote*` Functions
* **Description**: A suite of callback functions for handling RPCs from remote clients (e.g., `OnRemoteLeftClick`, `OnRemoteActionButton`, `OnRemoteControllerActionButton`, etc.). These validate and execute actions on the server, decode control mods, apply action overrides, and trigger locomotor actions.
* **Parameters**: Vary per function, typically include action code, position, target, isreleased, controlmods, mod_name, spellbook, etc.

## Events & Listeners
- **Listens to**:
  - `"buildstructure"` → `OnBuild` → Cancels placement.
  - `"equip"`/`"unequip"` → `OnEquipChanged` → Syncs reticule and gridplacer (`turfhat`).
  - `"inventoryclosed"` (client only) → `OnEquipChanged` → Clears reticule on inventory close.
  - `"zoomcamera"` → `OnZoom` → Zooms camera.
  - `"newactiveitem"` → `OnNewActiveItem` → Cancels AOE targeting.
  - `"continuefrompause"` (World) → `OnContinueFromPause` → Refreshes controller state.
  - `"deactivateworld"` (World) → `OnDeactivateWorld` → Deactivates for world reset.
  - `"newstate"` (client only, for prediction) → `OnNewState` → Syncs state for prediction.
- **Triggers/Events pushed via `PushEvent`**:
  - `"ms_overridelocomote_click"` (server) — Override movement direction.
  - `"locomote"` — Sent via locomotor for remote overridelocomote.
  - `"endsteeringreticule"`, `"starsteeringreticule"` — Boat steering reticule events.