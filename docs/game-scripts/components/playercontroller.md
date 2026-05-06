---
id: playercontroller
title: Playercontroller
description: The PlayerController component manages player input handling, action execution, locomotion prediction, targeting systems, and remote synchronization for both controller and mouse/keyboard interfaces in Don't Starve Together.
tags: [player, input, locomotion, actions, network]
sidebar_position: 10

last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: b3147e48
system_scope: player
---

# Playercontroller

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
The `playercontroller` component is the central input processing system attached to player entities, handling all controller, keyboard, and mouse interactions. It manages action execution through buffered actions, locomotion prediction for network synchronization, and targeting systems including AOE spell targeting and combat target selection. This component coordinates with `playeractionpicker` for action determination, `placer` for building placement, `reticule` for targeting visualization, and `locomotor` for movement execution. It activates when a player joins and deactivates on disconnect, maintaining remote procedure call synchronization between client and server for all player actions.

## Usage example
```lua
-- Access the player controller component on the local player
local player = ThePlayer
local controller = player.components.playercontroller

-- Activate the controller (called automatically on player join)
controller:Activate()

-- Check if AOE targeting is active
if controller:IsAOETargeting() then
    local pos = controller:GetAOETargetingPos()
    print("Targeting position:", pos)
end

-- Cancel current placement mode
controller:CancelPlacement()

-- Deactivate controller (on player disconnect)
controller:Deactivate()
```

## Dependencies & tags

**External dependencies:**
- `TheWorld` -- Accessed for Map, ismastersim, and event listening (deactivateworld, continuefrompause)
- `TheInput` -- Used for control value reading, handler registration, controller attachment checks, and control scheme queries
- `TheCamera` -- Used for GetRightVec, GetDownVec, ZoomIn, and ZoomOut operations
- `TheNet` -- Used for GetClientTableForUser to determine remote authority
- `ThePlayer` -- Referenced in OnEquipChanged and OnDeactivateWorld for player-specific logic
- `TheFrontEnd` -- Used for GetActiveScreen to access mapscreen
- `Profile` -- Used for GetTargetLockingEnabled and GetCommandWheelAllowsGameplay settings
- `TUNING` -- Accessed for CONTROLLER_DEADZONE_RADIUS constant
- `GLOBAL` -- Implicit access to CONTROL_* constants, EQUIPSLOTS, RPC, DEGREES, FRAMES, Vector3, IsConsole, IsPaused, math, ipairs, pairs, next, SpawnPrefab, CreateEntity, SendRPCToServer
- `CycleAxisAlignmentValues` -- Global function called for axis-aligned placement grid cycling
- `TheFocalPoint` -- Used for sound emission on invalid actions
- `ACTIONS` -- Global table of action definitions used for BufferedAction creation
- `RPC` -- Global table of RPC identifiers for server communication
- `SendRPCToServer` -- Global function to send remote procedure calls to the server
- `BufferedAction` -- Global constructor for creating action objects
- `GetTime` -- Global function to retrieve current simulation time
- `SetClientRequestedAction` -- Global function to set the client's requested action state
- `ClearClientRequestedAction` -- Global function to clear the client's requested action state
- `IsEntityDead` -- Global function to check entity death state
- `CanEntitySeeTarget` -- Global function to check line of sight
- `GetGameModeProperty` -- Global function to retrieve game mode specific properties
- `CONTROL_* constants` -- Input control identifiers for primary, secondary, attack, action, movement, camera, and virtual controls (CONTROL_PRIMARY, CONTROL_ATTACK, CONTROL_SECONDARY, CONTROL_ACTION, CONTROL_CONTROLLER_ACTION, CONTROL_CONTROLLER_ALTACTION, CONTROL_CONTROLLER_ATTACK, CONTROL_ROTATE_LEFT, CONTROL_ROTATE_RIGHT, CONTROL_ZOOM_IN, CONTROL_ZOOM_OUT, CONTROL_MOVE_UP, CONTROL_MOVE_DOWN, CONTROL_MOVE_LEFT, CONTROL_MOVE_RIGHT, VIRTUAL_CONTROL_CAMERA_ROTATE_LEFT, VIRTUAL_CONTROL_CAMERA_ROTATE_RIGHT, VIRTUAL_CONTROL_CAMERA_ZOOM_IN, VIRTUAL_CONTROL_CAMERA_ZOOM_OUT)
- `TheSim` -- Used for RegisterFindTags to create registered entity search tags
- `STRINGS` -- Used for hover text override and UI string lookups
- `EQUIPSLOTS` -- Used for HANDS equipment slot constant
- `IsPaused` -- Used to check if game is paused
- `SpawnPrefab` -- Used to spawn placer and reticule prefabs
- `TOOLACTIONS` -- Used to iterate tool action tag mappings
- `RADIANS` -- Used for angle conversion in rotation calculations
- `TheScrapbookPartitions` -- SetInspectedByCharacter called for scrapbook tracking
- `FindEntity` -- Entity search function with tag filtering
- `FunctionOrValue` -- Helper to resolve override parameter as function or direct value
- `GetStaticTime` -- Gets static time for rotation/zoom repeat timing
- `Remap` -- Remaps analog input values to speed/delta ranges
- `Vector3` -- Creates position vectors for double-click position tracking
- `DOUBLE_CLICK_TIMEOUT` -- Time window for double-click detection
- `DOUBLE_CLICK_POS_THRESHOLD` -- Position threshold for double-click detection
- `math2d` -- Used for distance squared calculations.
- `CanEntitySeePoint` -- Global function to check entity visibility of a point.
- `ACTION_FILTER_PRIORITIES` -- Table of action filter priority constants.
- `ACTIONS_BY_ACTION_CODE` -- Lookup table for actions by code.
- `MOD_ACTIONS_BY_ACTION_CODE` -- Lookup table for mod actions by code.
- `ACTIONS_MAP_REMAP` -- Lookup table for map action remapping.
- `PREFAB_SKINS_IDS` -- Lookup table for resolving skin indices by recipe and skin name

**Components used:**
- `locomotor` -- Cached in constructor as self.locomotor for movement control
- `combat` -- Accessed via inst.components.combat and inst.replica.combat for targeting and attack validation
- `boatcannonuser` -- Accessed via inst.components.boatcannonuser for cannon reticule and aiming
- `playeractionpicker` -- Accessed via inst.components.playeractionpicker for action selection
- `revivablecorpse` -- Checked on target for corpse revival validation
- `attuner` -- Checked for remoteresurrector and gravestoneresurrector attunement via HasAttunement
- `steeringwheeluser` -- SteerInDir() called for boat steering input
- `highlight` -- Adds component to entities, calls Highlight() and UnHighlight() for visual feedback on targets
- `reticule` -- Created, destroyed, and managed for targeting UI based on equipped items (on equipped item entity)
- `aoetargeting` -- Checked on equipped items via IsEnabled() and StopTargeting() methods (on equipped item entity)
- `spellbook` -- Checked on reticule to skip targeting logic when spellbook is active (on reticule entity)
- `placer` -- Accessed via placer.components.placer and deployplacer.components.placer for build validation and actions (on placer entity)
- `aoecharging` -- Checked and used for AOE charging operations (on equipped item entity)
- `playeravatardata` -- GetData called to retrieve player info for inspection popup (on target entity)
- `walkableplatform` -- GetEmbarkPosition() called on platform entity for hop target calculation (on platform entity)
- `embarker` -- GetEmbarkPosition() and embarkable property accessed for hop RPC (on player entity)

**Tags:**
- `turfhat` -- check
- `action_pulls_up_map` -- check
- `busy` -- check
- `pausepredict` -- check
- `canrepeatcast` -- check
- `boatbuilder` -- check
- `playerghost` -- check
- `weregoose` -- check
- `attack` -- check
- `abouttoattack` -- check
- `sitting_on_chair` -- check
- `using_drone_remote` -- check
- `cave` -- check
- `beaver` -- check
- `propweapon` -- check
- `INLIMBO` -- check
- `stealth` -- check
- `overrideattack` -- check
- `smolder` -- check
- `LunarBuildup` -- check
- `MINE_tool` -- check
- `quagmireharvestabletree` -- check
- `trapsprung` -- check
- `minesprung` -- check
- `mine_not_reusable` -- check
- `inactive` -- check
- `activatable_forcenopickup` -- check
- `wall` -- check
- `heavy` -- check
- `fire` -- check
- `lighter` -- check
- `catchable` -- check
- `spider` -- check
- `pickable` -- check
- `harvestable` -- check
- `readyforharvest` -- check
- `notreadyforharvest` -- check
- `withered` -- check
- `tapped_harvestable` -- check
- `tendable_farmplant` -- check
- `mime` -- check
- `dried` -- check
- `burnt` -- check
- `donecooking` -- check
- `inventoryitemholder_take` -- check
- `unsaddler` -- check
- `saddled` -- check
- `brush` -- check
- `brushable` -- check
- `corpse` -- check
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `autopredict` -- check
- `doing` -- check
- `working` -- check
- `aoecharging` -- check
- `shadowsubmissive` -- check
- `player` -- check
- `hostile` -- check
- `mineactive` -- check
- `intense` -- check
- `paired` -- check
- `haunted` -- check
- `pinned` -- check
- `gestaltcapturable` -- check
- `moonstormstaticcapturable` -- check
- `gestalt_cage` -- check
- `moonstormstatic_catcher` -- check
- `cancatch` -- check
- `inspectable` -- check
- `moving` -- check
- `idle` -- check
- `channeling` -- check
- `remoteresurrector` -- check
- `gravestoneresurrector` -- check
- `ghostfriend_notsummoned` -- check
- `client_forward_action_target` -- check
- `fueldepleted` -- check
- `usingmagiciantool` -- check
- `walkableplatform` -- check
- `walkableperipheral` -- check
- `ignoremouseover` -- check
- `nopredict` -- check
- `boathopping` -- check
- `steeringboat` -- check
- `rotatingboat` -- check
- `giftmachine` -- check
- `fishingrod` -- check
- `fishable` -- check
- `bundle` -- check
- `portal` -- check
- `hasfurnituredecoritem` -- check
- `mermthrone` -- check
- `merm` -- check
- `crabking_claw` -- check
- `overridelocomote` -- check
- `canrotate` -- check
- `floating` -- check
- `nodragwalk` -- check
- `floating_predict_move` -- check
- `keep_equip_toss` -- check
- `magician` -- check
- `allow_action_on_impassable` -- check
- `magiciantool` -- check
- `pocketdimension_container` -- check
- `mapaction_works_on_unexplored` -- check
- `locomotor` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | — | The entity instance that owns this component. |
| `map` | Map | — | Reference to TheWorld.Map for terrain and passability checks. |
| `ismastersim` | boolean | — | True if running on the master server simulation. |
| `locomotor` | Component | — | Cached reference to the locomotor component for movement control. |
| `attack_buffer` | Control ID or BufferedAction | `nil` | Stores pending attack control or buffered attack action. |
| `controller_attack_override` | BufferedAction | `nil` | Override attack action for controller input. |
| `remote_vector` | Vector3 | `Vector3()` | Stores remote movement direction and mode (y value indicates stop/direct/drag/predict walking). |
| `remote_predict_dir` | number | `nil` | Remote prediction direction in radians. |
| `remote_predict_stop_tick` | number | `nil` | Tick when server detected movement stop. |
| `remote_predict_stop_notified` | boolean | `nil` | Whether server received explicit stop notification from client. |
| `client_last_predict_walk` | table | `{ tick = nil, direct = false }` | Tracks last prediction walk tick and mode for synchronization. |
| `remote_controls` | table | `{}` | Table of active remote control states with cooldown timers. |
| `remote_predicting` | boolean | `false` | Whether remote movement prediction is enabled. |
| `remote_authority` | boolean | — | Whether player has admin/moderator/friend authority for prediction. |
| `recent_bufferedaction` | table | `{}` | Stores recent buffered action data to prevent cancellation during direct walking. |
| `dragwalking` | boolean | `false` | Whether player is currently drag walking. |
| `directwalking` | boolean | `false` | Whether player is currently direct walking. |
| `predictwalking` | boolean | `false` | Whether player is currently predict walking. |
| `predictionsent` | boolean | `false` | Whether prediction data has been sent to server. |
| `draggingonground` | boolean | `false` | Whether player is currently dragging on ground for movement. |
| `is_hopping` | boolean | `false` | Whether player is currently hopping (boat embark/disembark). |
| `startdragtestpos` | Vector3 | `nil` | Starting position for drag test. |
| `startdragtime` | number | `nil` | Time when drag started for threshold detection. |
| `startdoubleclicktime` | number | `nil` | Time of first click for double-click detection. |
| `startdoubleclickpos` | Vector3 | `nil` | Position of first click for double-click detection. |
| `doubletapmem` | table | `{ down = false }` | Memory for double-tap directional input detection. |
| `isclientcontrollerattached` | boolean | `false` | Whether controller is attached on client. |
| `mousetimeout` | number | `10` | Timeout value for mouse input. |
| `time_direct_walking` | number | `0` | Accumulated time spent direct walking. |
| `controller_target` | Entity | `nil` | Current controller interaction target entity. |
| `controller_target_age` | number | `math.huge` | Age of current controller target for flicker prevention. |
| `controller_attack_target` | Entity | `nil` | Current controller attack target entity. |
| `controller_attack_target_ally_cd` | number | `nil` | Cooldown for targeting allies. |
| `controller_targeting_lock_available` | boolean | — | Whether target locking is available from profile settings. |
| `controller_targeting_lock_target` | boolean | `false` | Whether target locking is currently enabled. |
| `controller_targeting_targets` | table | `{}` | List of valid targets for locking. |
| `controller_targeting_target_index` | number | `nil` | Current index in targeting targets list. |
| `command_wheel_allows_gameplay` | boolean | — | Whether command wheel allows gameplay while open. |
| `reticule` | Component | `nil` | Current reticule component for targeting visualization. |
| `terraformer` | Entity | `nil` | Terraformer prefab for ground modification. |
| `deploy_mode` | boolean | — | Whether deploy placement mode is active. |
| `deployplacer` | Entity | `nil` | Deploy placer prefab entity. |
| `placer` | Entity | `nil` | Build placer prefab entity. |
| `placer_recipe` | table | `nil` | Current placement recipe data. |
| `placer_recipe_skin` | string | `nil` | Skin identifier for placer prefab. |
| `placer_cached` | table | `nil` | Cached placement recipe for restoration. |
| `LMBaction` | BufferedAction | `nil` | Current left mouse button action. |
| `RMBaction` | BufferedAction | `nil` | Current right mouse button action. |
| `handler` | InputHandler | `nil` | Input control handler reference. |
| `actionbuttonoverride` | function | `nil` | Override function for action button behavior. |
| `heldactioncooldown` | number | `0` | Cooldown timer for held action repetition. |
| `remoteinteractionaction` | Action | `nil` | Stored remote interaction action code. |
| `remoteinteractiontarget` | Entity | `nil` | Stored remote interaction target entity. |
| `is_map_enabled` | boolean | `true` | Server-side only: whether map controls are enabled. |
| `can_use_map` | boolean | `true` | Server-side only: whether player can use map. |
| `classified` | Entity | — | Server-side only: player_classified entity for netvar synchronization (client uses AttachClassified method). |

## Main functions

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Removes event callbacks, calls Deactivate, and detaches classified entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AttachClassified(classified)`
* **Description:** Attaches a classified entity and registers onremove event listener for automatic detachment.
* **Parameters:**
  - `classified` -- Classified entity to attach for network replication
* **Returns:** None

### `DetachClassified()`
* **Description:** Detaches the classified entity by clearing references and callback.
* **Parameters:** None
* **Returns:** None

### `Activate()`
* **Description:** Activates the player controller by adding input handler, resetting remote controllers, refreshing reticule, and registering all event listeners. Client-only components start updating.
* **Parameters:** None
* **Returns:** None

### `Deactivate()`
* **Description:** Deactivates the player controller by cancelling placements, destroying reticule, removing input handler, and unregistering all event listeners.
* **Parameters:** None
* **Returns:** None

### `Enable(val)`
* **Description:** Sets the iscontrollerenabled netvar on classified entity (server-side only).
* **Parameters:**
  - `val` -- Boolean value to enable or disable controller
* **Returns:** None

### `ToggleController(val)`
* **Description:** Toggles controller attachment state, refreshes reticule, sends RPC to server if client, and returns active item if enabling on server with inventory.
* **Parameters:**
  - `val` -- Boolean indicating controller attachment state
* **Returns:** None

### `EnableMapControls(val)`
* **Description:** Enables or disables map controls on server, updates classified entity map control visibility.
* **Parameters:**
  - `val` -- Boolean to enable or disable map controls
* **Returns:** None

### `SetCanUseMap(val)`
* **Description:** Sets the can_use_map flag on server and updates classified entity map control visibility.
* **Parameters:**
  - `val` -- Boolean to set whether player can use map
* **Returns:** None

### `GetMapTarget(act)`
* **Description:** Validates and returns a map target from action data. Checks for map_action flag, HUD existence, action_pulls_up_map tag, and valid_map_actions whitelist.
* **Parameters:**
  - `act` -- Action definition table with action, target, invobject, and maptarget fields
* **Returns:** Entity map target or nil if invalid

### `PullUpMap(maptarget, forced_actiondef)`
* **Description:** Opens the map screen, returns active item, closes other HUD screens (crafting, spell wheel, controller inventory), and focuses map on target position with optional distance offset.
* **Parameters:**
  - `maptarget` -- Target entity for map focus
  - `forced_actiondef` -- Optional forced action definition
* **Returns:** None

### `IsEnabled()`
* **Description:** Checks if player controller is enabled by verifying classified controller enabled state and HUD input focus. Returns secondary boolean for limited gameplay allowance during HUD blocking.
* **Parameters:** None
* **Returns:** Boolean enabled state, optional second boolean for HUD blocking with limited gameplay

### `IsMapControlsEnabled()`
* **Description:** Checks if map controls are enabled by verifying classified state and HUD existence.
* **Parameters:** None
* **Returns:** Boolean indicating if map controls are enabled

### `IsControlPressed(control)`
* **Description:** Checks if a control is currently pressed, using TheInput on client or remote_controls table on server.
* **Parameters:**
  - `control` -- Control ID to check
* **Returns:** Boolean indicating if control is pressed

### `IsAnyOfControlsPressed(...)`
* **Description:** Checks if any of the provided controls are currently pressed.
* **Parameters:**
  - `...` -- Variable number of control IDs to check
* **Returns:** Boolean indicating if any control is pressed

### `CooldownRemoteController(dt)`
* **Description:** Decrements cooldown timers for all remote controls and calls CooldownHeldAction.
* **Parameters:**
  - `dt` -- Delta time in seconds
* **Returns:** None

### `CooldownHeldAction(dt)`
* **Description:** Decrements the heldactioncooldown timer.
* **Parameters:**
  - `dt` -- Delta time in seconds
* **Returns:** None

### `OnRemoteStopControl(control)`
* **Description:** Server-side handler to clear a remote control from remote_controls table when player is enabled and has no local handler.
* **Parameters:**
  - `control` -- Control ID to stop
* **Returns:** None

### `OnRemoteStopAllControls()`
* **Description:** Server-side handler to clear all remote controls when player is enabled and has no local handler.
* **Parameters:** None
* **Returns:** None

### `RemoteStopControl(control)`
* **Description:** Client-side function to clear a remote control and send StopControl RPC to server.
* **Parameters:**
  - `control` -- Control ID to stop
* **Returns:** None

### `RemoteStopAllControls()`
* **Description:** Client-side function to clear all remote controls and send StopAllControls RPC to server.
* **Parameters:** None
* **Returns:** None

### `RemotePausePrediction(frames)`
* **Description:** Server-side function to push pause prediction frames to classified entity.
* **Parameters:**
  - `frames` -- Number of frames to pause prediction (default `0`)
* **Returns:** None

### `ShouldPlayerHUDControlBeIgnored(control, down)`
* **Description:** Determines if a control should be ignored by PlayerHUD based on priority rules for axis-aligned placement and controller target lock.
* **Parameters:**
  - `control` -- Control ID being processed
  - `down` -- Boolean indicating control press state
* **Returns:** Boolean indicating if control should be ignored

### `OnControl(control, down)`
* **Description:** Main input handler for all control events. Processes pause state, enabled state, hack flags, and routes controls to appropriate action handlers (ACTION, ATTACK, PRIMARY, SECONDARY, CANCEL, INSPECT, etc.). Handles inventory tile controls when inventory is visible.
* **Parameters:**
  - `control` -- Control ID that was triggered
  - `down` -- Boolean indicating if control is pressed (`true`) or released (`false`)
* **Returns:** Boolean true for handled hack controls, otherwise nil

### `EncodeControlMods()`
* **Description:** Encodes modifier control states (FORCE_INSPECT, FORCE_ATTACK, FORCE_TRADE, FORCE_STACK) into a bitfield code.
* **Parameters:** None
* **Returns:** Integer bitfield code or nil if no modifiers active

### `DecodeControlMods(code)`
* **Description:** Decodes a bitfield code into remote_controls table entries for modifier controls.
* **Parameters:**
  - `code` -- Integer bitfield code to decode (default `0`)
* **Returns:** None

### `ClearControlMods()`
* **Description:** Clears all remote control modifiers by setting entries in self.remote_controls to nil.
* **Parameters:** None
* **Returns:** None

### `CanLocomote()`
* **Description:** Checks if the player is allowed to locomote based on master sim status, state tags, and prediction frames.
* **Parameters:** None
* **Returns:** boolean

### `IsBusy()`
* **Description:** Determines if the player is currently busy by checking state tags and prediction frames on master or client.
* **Parameters:** None
* **Returns:** boolean

### `HasItemSlots()`
* **Description:** Returns cached _hasitemslots value indicating if inventory has item slots. Value is initialized by CacheHasItemSlots which calls replica.inventory:GetNumSlots().
* **Parameters:** None
* **Returns:** boolean -- true if inventory has slots, false otherwise

### `GetCursorInventoryObject()`
* **Description:** Returns the inventory item currently under the cursor if using a controller and HUD is available.
* **Parameters:** None
* **Returns:** Entity instance or nil

### `GetCursorInventorySlotAndContainer()`
* **Description:** Returns the slot and container information for the item under the cursor if using a controller.
* **Parameters:** None
* **Returns:** Table or nil

### `DoControllerActionButton()`
* **Description:** Handles the primary controller action button press, managing placement, spellcasting, cannon aiming, or ground actions with RPC synchronization.
* **Parameters:** None
* **Returns:** None

### `OnRemoteControllerActionButton(actioncode, target, isreleased, noforce, mod_name)`
* **Description:** Server-side handler for remote controller action button events, validating and executing the requested action.
* **Parameters:**
  - `actioncode` -- Numeric code identifying the action
  - `target` -- Target entity for the action
  - `isreleased` -- Boolean indicating if the button was released
  - `noforce` -- Boolean to prevent forcing the action point
  - `mod_name` -- Name of the action mod if applicable
* **Returns:** None
* **Error states:** Asserts if actioncode is nil but isreleased is not nil

### `OnRemoteControllerActionButtonPoint(actioncode, position, isreleased, noforce, mod_name, isspecial, spellbook, spell_id)`
* **Description:** Server-side handler for remote controller action button events targeting a specific point, handling spells and cannon aiming.
* **Parameters:**
  - `actioncode` -- Numeric code identifying the action
  - `position` -- Vector3 position for the action
  - `isreleased` -- Boolean indicating if the button was released
  - `noforce` -- Boolean to prevent forcing the action point
  - `mod_name` -- Name of the action mod if applicable
  - `isspecial` -- Boolean indicating a special action type
  - `spellbook` -- Spellbook entity if casting a spell
  - `spell_id` -- ID of the selected spell
* **Returns:** None

### `OnRemoteControllerActionButtonDeploy(invobject, position, rotation, isreleased)`
* **Description:** Server-side handler for deploying objects via controller, validating ownership and creating buffered actions.
* **Parameters:**
  - `invobject` -- Inventory object being deployed
  - `position` -- Vector3 position for deployment
  - `rotation` -- Rotation angle for deployment
  - `isreleased` -- Boolean indicating if the button was released
* **Returns:** None

### `DoControllerAltActionButton()`
* **Description:** Handles the alternative controller action button press, managing cancellation, special actions, mounting, or spellbook usage.
* **Parameters:** None
* **Returns:** None

### `OnRemoteControllerAltActionButton(actioncode, target, isreleased, noforce, mod_name)`
* **Description:** Server-side handler for remote controller alt action button events, validating and executing the requested action.
* **Parameters:**
  - `actioncode` -- Numeric code identifying the action
  - `target` -- Target entity for the action
  - `isreleased` -- Boolean indicating if the button was released
  - `noforce` -- Boolean to prevent forcing the action point
  - `mod_name` -- Name of the action mod if applicable
* **Returns:** None
* **Error states:** Asserts if actioncode is nil but isreleased is not nil

### `OnRemoteControllerAltActionButtonPoint(actioncode, position, isreleased, noforce, isspecial, mod_name)`
* **Description:** Server-side handler for remote controller alt action button events targeting a specific point.
* **Parameters:**
  - `actioncode` -- Numeric code identifying the action
  - `position` -- Vector3 position for the action
  - `isreleased` -- Boolean indicating if the button was released
  - `noforce` -- Boolean to prevent forcing the action point
  - `isspecial` -- Boolean indicating a special action type
  - `mod_name` -- Name of the action mod if applicable
* **Returns:** None

### `DoControllerAttackButton(target)`
* **Description:** Handles the controller attack button press, validating target visibility and state before sending attack RPCs.
* **Parameters:**
  - `target` -- Target entity to attack, or nil for ground attack
* **Returns:** None

### `OnRemoteControllerAttackButton(target, isreleased, noforce)`
* **Description:** Server-side handler for remote controller attack button events, buffering attacks and handling chain attacks.
* **Parameters:**
  - `target` -- Target entity to attack or true for button down flag
  - `isreleased` -- Boolean indicating if the button was released
  - `noforce` -- Boolean to prevent forcing the action point
* **Returns:** None

### `DoControllerDropItemFromInvTile(item, single)`
* **Description:** Drops an item from the inventory tile when using a controller. Checks if the item is locked in slot before allowing the drop.
* **Parameters:**
  - `item` -- Inventory item entity to drop
  - `single` -- Boolean indicating whether to drop a single item from a stack
* **Returns:** nil

### `DoControllerInspectItemFromInvTile(item)`
* **Description:** Inspects an item from the inventory tile when using a controller.
* **Parameters:**
  - `item` -- Inventory item entity to inspect
* **Returns:** nil

### `DoControllerUseItemOnSelfFromInvTile(item)`
* **Description:** Uses an item on the player from the inventory tile. Sets up action repeat function and handles deploy mode for deployable items.
* **Parameters:**
  - `item` -- Inventory item entity to use on self, or nil to get cursor object
* **Returns:** nil

### `DoControllerUseItemOnSceneFromInvTile(item)`
* **Description:** Uses an item on the scene from the inventory tile. Moves items to player inventory if not grand owner, otherwise uses on scene.
* **Parameters:**
  - `item` -- Inventory item entity to use on scene, or nil to get cursor object
* **Returns:** nil

### `RotLeft(speed)`
* **Description:** Rotates the camera to the left by 45 degrees (or 22.5 in caves). Handles both paused and unpaused states, with special handling for drone camera.
* **Parameters:**
  - `speed` -- Optional rotation speed value for continuous rotation
* **Returns:** nil

### `RotRight(speed)`
* **Description:** Rotates the camera to the right by 45 degrees (or 22.5 in caves). Handles both paused and unpaused states, with special handling for drone camera.
* **Parameters:**
  - `speed` -- Optional rotation speed value for continuous rotation
* **Returns:** nil

### `GetHoverTextOverride()`
* **Description:** Returns custom hover text when in build placement mode, showing the build action and recipe name.
* **Parameters:** None
* **Returns:** string hover text or nil if not in placement mode

### `CancelPlacement(cache)`
* **Description:** Cancels the current building placement mode. Optionally caches the recipe for later restoration. Removes the placer prefab.
* **Parameters:**
  - `cache` -- Boolean indicating whether to cache the current placement recipe
* **Returns:** nil

### `CancelDeployPlacement()`
* **Description:** Cancels deploy placement mode and removes the deploy placer prefab. Sets deploy_mode based on controller attachment status.
* **Parameters:** None
* **Returns:** nil

### `StartBuildPlacementMode(recipe, skin)`
* **Description:** Starts building placement mode by spawning a placer prefab and setting up the build validation test function.
* **Parameters:**
  - `recipe` -- Recipe table containing build information
  - `skin` -- Optional skin identifier for the placer prefab
* **Returns:** nil

### `IsTwinStickAiming()`
* **Description:** Checks if the reticule component is currently in twin stick aiming mode.
* **Parameters:** None
* **Returns:** boolean

### `GetAOETargetingPos()`
* **Description:** Returns the current AOE targeting position from the reticule component.
* **Parameters:** None
* **Returns:** Vector3 position or nil if no reticule

### `IsAOETargeting()`
* **Description:** Checks if the reticule has an aoetargeting component attached.
* **Parameters:** None
* **Returns:** boolean

### `HasAOETargeting()`
* **Description:** Checks if the equipped item has AOE targeting or charging enabled. Respects allowriding property for mounted players.
* **Parameters:** None
* **Returns:** boolean

### `TryAOETargeting()`
* **Description:** Attempts to start AOE targeting with the equipped item. Returns false if player is riding and allowriding is false.
* **Parameters:** None
* **Returns:** boolean - true if targeting started successfully

### `StartAOETargetingUsing(item)`
* **Description:** Starts AOE targeting using a specific item. Clears action hold, cancels placement modes, and returns active item to inventory before starting targeting.
* **Parameters:**
  - `item` -- Item entity with aoetargeting component
* **Returns:** nil
* **Error states:** None

### `GetActiveSpellBook()`
* **Description:** Returns the reticule instance if it has a spellbook component, otherwise nil.
* **Parameters:** None
* **Returns:** Entity instance or nil

### `CancelAOETargeting()`
* **Description:** Stops AOE targeting by calling StopTargeting on the aoetargeting component.
* **Parameters:** None
* **Returns:** nil

### `TryAOECharging(force_rotation, iscontroller)`
* **Description:** Attempts to start AOE charging with the equipped item. Handles server/client rotation synchronization and sends RPC to server.
* **Parameters:**
  - `force_rotation` -- Optional forced rotation angle, or nil to calculate
  - `iscontroller` -- Boolean indicating if using controller input
* **Returns:** boolean - true if charging started successfully

### `OnRemoteAOECharging(rotation, startflag)`
* **Description:** Handles remote AOE charging RPC from clients. Starts charging or updates rotation based on startflag value.
* **Parameters:**
  - `rotation` -- Rotation angle from remote client
  - `startflag` -- Flag indicating start (`1` or `2` for controller) or direction update
* **Returns:** nil

### `RemoteAOEChargingDir(rotation)`
* **Description:** Sends AOE charging direction update RPC to the server.
* **Parameters:**
  - `rotation` -- Rotation angle to send to server
* **Returns:** nil

### `EchoReticuleAt(x, y, z)`
* **Description:** Spawns a reticule prefab at the specified position and triggers a flash effect or schedules removal.
* **Parameters:**
  - `x` -- World X position
  - `y` -- World Y position (unused, set to `0`)
  - `z` -- World Z position
* **Returns:** nil

### `RefreshReticule(item)`
* **Description:** Refreshes the reticule component based on the equipped item. Destroys existing reticule and creates new one if needed.
* **Parameters:**
  - `item` -- Optional item entity, defaults to equipped hands item
* **Returns:** nil

### `GetAttackTarget(force_attack, force_target, isretarget, use_remote_predict)`
* **Description:** Finds and validates an attack target based on combat state, inventory state, range, visibility, and hostility rules.
* **Parameters:**
  - `force_attack` -- Boolean indicating forced attack mode
  - `force_target` -- Optional specific target entity to attack
  - `isretarget` -- Boolean indicating if this is a retarget attempt
  - `use_remote_predict` -- Boolean for remote prediction mode
* **Returns:** Target entity or nil if no valid target

### `DoAttackButton(retarget, isleftmouse)`
* **Description:** Handles attack button press. Gets attack target, sends remote RPC if client, and executes attack action through locomotor.
* **Parameters:**
  - `retarget` -- Target entity or nil for auto-target
  - `isleftmouse` -- Boolean indicating if triggered by left mouse button
* **Returns:** nil

### `OnRemoteAttackButton(target, force_attack, noforce, isleftmouse, isreleased)`
* **Description:** Handles remote attack button RPC from clients on master sim. Validates target and creates attack buffer.
* **Parameters:**
  - `target` -- Target entity from remote client
  - `force_attack` -- Boolean indicating forced attack
  - `noforce` -- Boolean to skip force attack logic
  - `isleftmouse` -- Boolean indicating left mouse button
  - `isreleased` -- Boolean indicating button release state
* **Returns:** nil

### `RemoteAttackButton(target, force_attack, isleftmouse, isreleased)`
* **Description:** Sends attack button RPC to server with target, force attack flag, and input state information.
* **Parameters:**
  - `target` -- Target entity or nil
  - `force_attack` -- Boolean indicating forced attack
  - `isleftmouse` -- Boolean indicating left mouse button
  - `isreleased` -- Boolean indicating button release state
* **Returns:** nil

### `SetIsOverrideAttack(val)`
* **Description:** Sets the override attack state on master sim through the classified component netvar.
* **Parameters:**
  - `val` -- Boolean value to set for override attack state
* **Returns:** nil

### `IsOverrideAttack()`
* **Description:** Checks if override attack is active via stategraph tag or classified component netvar.
* **Parameters:** None
* **Returns:** boolean

### `IsDoingOrWorking()`
* **Description:** Checks if the player is currently doing or working by checking stategraph tags and entity tags based on simulation state.
* **Parameters:** None
* **Returns:** boolean

### `GetActionButtonAction(force_target)`
* **Description:** Determines the appropriate action for the action button based on player state, equipped tools, and nearby entities. Handles haunting, bug catching, gestalt capture, moonstorm static capture, catching, unpinning, corpse revival, and general pickup/work actions.
* **Parameters:**
  - `force_target` -- Entity instance to force as action target, or nil to auto-detect nearby interactable entities
* **Returns:** BufferedAction instance or nil if no valid action found

### `DoActionButton()`
* **Description:** Executes the action button logic, either pushing action to locomotor on master sim or sending remote action to server. Handles placer build completion if placer component exists.
* **Parameters:** None
* **Returns:** None

### `OnRemoteActionButton(actioncode, target, isreleased, noforce, mod_name)`
* **Description:** Server-side handler for remote action button presses from clients. Validates action and pushes to locomotor if valid.
* **Parameters:**
  - `actioncode` -- Numeric action code from CONTROL_ACTION
  - `target` -- Target entity for the action
  - `isreleased` -- Boolean indicating if action button was released
  - `noforce` -- Boolean to skip forced action point setting
  - `mod_name` -- Mod name string for modded actions
* **Returns:** None

### `RemoteActionButton(action, isreleased)`
* **Description:** Sends action button press to server via RPC. Sets remote_controls cooldown tracking.
* **Parameters:**
  - `action` -- BufferedAction instance or nil
  - `isreleased` -- Boolean indicating button release state
* **Returns:** None

### `GetInspectButtonAction(target)`
* **Description:** Returns LOOKAT action if target is inspectable and player is in valid state (moving, idle, or channeling).
* **Parameters:**
  - `target` -- Entity instance to inspect
* **Returns:** BufferedAction instance or nil

### `DoInspectButton()`
* **Description:** Executes inspect button logic. Opens player info popup if target has playeravatardata component. Updates scrapbook inspection tracking.
* **Parameters:** None
* **Returns:** None

### `OnRemoteInspectButton(target)`
* **Description:** Server-side handler for remote inspect button. Validates and pushes LOOKAT action to locomotor.
* **Parameters:**
  - `target` -- Entity instance to inspect on server
* **Returns:** None

### `RemoteInspectButton(action)`
* **Description:** Sends inspect button action to server via RPC.InspectButton.
* **Parameters:**
  - `action` -- BufferedAction instance with target entity
* **Returns:** None

### `GetResurrectButtonAction()`
* **Description:** Returns REMOTERESURRECT action if player is ghost and has attunement to remoteresurrector or gravestoneresurrector.
* **Parameters:** None
* **Returns:** BufferedAction instance or nil

### `DoResurrectButton()`
* **Description:** Executes resurrect button logic. Pushes action to locomotor on master sim or sends remote action to server.
* **Parameters:** None
* **Returns:** None

### `OnRemoteResurrectButton()`
* **Description:** Server-side handler for remote resurrect button. Validates and pushes REMOTERESURRECT action to locomotor.
* **Parameters:** None
* **Returns:** None

### `RemoteResurrectButton()`
* **Description:** Sends resurrect button action to server via RPC.ResurrectButton.
* **Parameters:** None
* **Returns:** None

### `DoCharacterCommandWheelButton()`
* **Description:** Handles spellbook usage from character command wheel. Finds spellbook in inventory with special case handling for Wendy's Abigail flower when ghost friend not summoned.
* **Parameters:** None
* **Returns:** None

### `OnRemoteCharacterCommandWheelButton(target)`
* **Description:** Server-side handler for remote character command wheel button. Validates spellbook ownership and executes USESPELLBOOK action.
* **Parameters:**
  - `target` -- Spellbook entity target
* **Returns:** None

### `RemoteCharacterCommandWheelButton(action)`
* **Description:** Sends spellbook action to server via RPC.CharacterCommandWheelButton. Skips CLOSESPELLBOOK actions.
* **Parameters:**
  - `action` -- BufferedAction instance for spellbook usage
* **Returns:** None

### `UsingMouse()`
* **Description:** Returns true if player is not using controller input (using mouse/keyboard instead).
* **Parameters:** None
* **Returns:** boolean

### `ClearActionHold()`
* **Description:** Clears all action hold state variables and sends clear RPC to server if not master sim.
* **Parameters:** None
* **Returns:** None

### `RepeatHeldAction()`
* **Description:** Repeats held action with cooldown tracking. Handles both master sim and client-side action repetition with locomotor fast-forward suppression.
* **Parameters:** None
* **Returns:** None

### `OnWallUpdate(dt)`
* **Description:** Called during wall update. Triggers camera control if handler exists.
* **Parameters:**
  - `dt` -- Delta time in seconds since last update
* **Returns:** None

### `GetCombatRetarget()`
* **Description:** Returns current combat retarget from stategraph statemem or replica combat component.
* **Parameters:** None
* **Returns:** Entity instance or nil

### `GetCombatTarget()`
* **Description:** Returns the current combat attack target from stategraph statemem, or nil if not on stategraph.
* **Parameters:** None
* **Returns:** Entity instance or nil

### `OnUpdate(dt)`
* **Description:** Main update loop called every frame. Handles input processing, action holding, dragging, placement modes (build/deploy/terraform), reticule visibility, target highlighting, locomotion prediction, attack buffering, and control cooldowns. Manages enabled/disabled states based on HUD blocking and busy states.
* **Parameters:**
  - `dt` -- number - delta time in seconds since last update frame
* **Returns:** None

### `UpdateControllerTargets(dt)`
* **Description:** Main update loop for controller targets; checks exclusion states (sitting, weregoose, gym) and calls local update helpers.
* **Parameters:**
  - `dt` -- Delta time since last update.
* **Returns:** nil

### `GetControllerTarget()`
* **Description:** Returns the current valid controller interaction target.
* **Parameters:** None
* **Returns:** Entity instance or nil if invalid/missing.

### `GetControllerAttackTarget()`
* **Description:** Returns the current valid controller attack target.
* **Parameters:** None
* **Returns:** Entity instance or nil if invalid/missing.

### `CanLockTargets()`
* **Description:** Checks if target locking is available.
* **Parameters:** None
* **Returns:** boolean

### `IsControllerTargetLockEnabled()`
* **Description:** Checks if target locking is currently enabled.
* **Parameters:** None
* **Returns:** boolean

### `IsControllerTargetLocked()`
* **Description:** Checks if a target is currently locked.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if not locked.

### `ControllerTargetLock(enable)`
* **Description:** Sets the target lock state; only enables if a target is available and locking is allowed.
* **Parameters:**
  - `enable` -- Boolean to enable or disable target locking.
* **Returns:** nil

### `ControllerTargetLockToggle()`
* **Description:** Toggles the current target lock state.
* **Parameters:** None
* **Returns:** nil

### `CycleControllerAttackTargetBack()`
* **Description:** Cycles the attack target index backward in the locked target list.
* **Parameters:** None
* **Returns:** nil

### `CycleControllerAttackTargetForward()`
* **Description:** Cycles the attack target index forward in the locked target list. Wraps to first target if at end of list.
* **Parameters:** None
* **Returns:** nil

### `ResetRemoteController()`
* **Description:** Resets the remote control vector and clears remote controls table.
* **Parameters:** None
* **Returns:** nil

### `ClearRemotePredictData(force_reset_timer)`
* **Description:** Clears remote prediction data and optionally cancels the locomotor prediction timer.
* **Parameters:**
  - `force_reset_timer` -- Optional boolean to force reset the locomotor prediction timer.
* **Returns:** nil

### `GetRemoteDirectVector()`
* **Description:** Returns the remote vector if it represents direct walking (`y == 1`).
* **Parameters:** None
* **Returns:** Vector3 or nil

### `GetRemoteDragPosition()`
* **Description:** Returns the remote vector if it represents drag walking (`y == 2`).
* **Parameters:** None
* **Returns:** Vector3 or nil

### `GetRemotePredictPosition()`
* **Description:** Returns the predicted remote position if `y >= 3`, converting platform coordinates if necessary.
* **Parameters:** None
* **Returns:** Vector3 or nil

### `GetRemotePredictPositionExternal()`
* **Description:** Returns the predicted remote position for external use, converting platform coordinates to absolute XZ.
* **Parameters:** None
* **Returns:** Vector3 or nil

### `GetRemotePredictStopXZ()`
* **Description:** Returns the stop position XZ if the stop tick matches the next tick and vector y is `0`.
* **Parameters:** None
* **Returns:** x, z (numbers) or nil

### `OnRemoteDirectWalking(x, z)`
* **Description:** Callback received on master sim when remote player initiates direct walking. Sets `remote_vector` coordinates with y=1 (direct walk mode) and clears predict data. Only executes if `ismastersim`, `IsEnabled()`, and `handler == nil`.
* **Parameters:**
  - `x` -- Target X coordinate.
  - `z` -- Target Z coordinate.
* **Returns:** nil
* **Error states:** None

### `OnRemoteDragWalking(x, z)`
* **Description:** Handles remote drag walking input; sets vector y to `2` and clears predict data.
* **Parameters:**
  - `x` -- Target X coordinate.
  - `z` -- Target Z coordinate.
* **Returns:** nil

### `OnRemotePredictWalking(x, z, isdirectwalking, isstart, platform, overridemovetime, isstop)`
* **Description:** Handles remote predicted walking input; updates vector, prediction flags, and locomotor timers.
* **Parameters:**
  - `x` -- Target X coordinate or nil.
  - `z` -- Target Z coordinate or nil.
  - `isdirectwalking` -- Boolean indicating direct vs predicted walking.
  - `isstart` -- Boolean indicating start of movement.
  - `platform` -- Platform entity instance.
  - `overridemovetime` -- Optional time override for prediction.
  - `isstop` -- Boolean indicating stop of movement.
* **Returns:** nil

### `OnRemotePredictOverrideLocomote(dir)`
* **Description:** Handles remote locomotion override on master sim. Checks state tags and busy status, then sets move direction if allowed and pushes 'locomote' event with remote override flag.
* **Parameters:**
  - `dir` -- Direction vector for locomotion override (optional, used for rotation if entity can rotate).
* **Returns:** None
* **Error states:** None

### `OnRemoteStartHop(x, z, platform)`
* **Description:** Handles remote hop initiation on master sim. Validates hop distance with rubber band tolerance and platform velocity compensation.
* **Parameters:**
  - `x` -- Target X coordinate.
  - `z` -- Target Z coordinate.
  - `platform` -- Platform entity for embarkation.
* **Returns:** None

### `OnRemoteStopWalking()`
* **Description:** Server-side handler for remote stop walking notification. Clears remote vector and prediction data.
* **Parameters:** None
* **Returns:** None

### `OnRemoteStopHopping()`
* **Description:** Server-side handler for remote stop hopping notification. Clears remote vector and prediction data.
* **Parameters:** None
* **Returns:** None

### `RemoteDirectWalking(x, z)`
* **Description:** Sends direct walking RPC to server with direction components.
* **Parameters:**
  - `x` -- Direction X component.
  - `z` -- Direction Z component.
* **Returns:** None

### `RemoteDragWalking(x, z)`
* **Description:** Sends drag walking RPC to server with platform-relative position.
* **Parameters:**
  - `x` -- Target X coordinate.
  - `z` -- Target Z coordinate.
* **Returns:** None

### `RemotePredictWalking(x, z, isstart, overridemovetime, overridedirect, isstop)`
* **Description:** Sends prediction walking RPC to server with platform-relative position. Sets predictionsent flag and handles start/stop events separately.
* **Parameters:**
  - `x` -- number or nil - predicted X position
  - `z` -- number or nil - predicted Z position
  - `isstart` -- boolean - whether this is the start of prediction
  - `overridemovetime` -- number or nil - override time for movement
  - `overridedirect` -- boolean or nil - override for direct walking mode
  - `isstop` -- boolean - whether this is a stop prediction
* **Returns:** None

### `RemotePredictOverrideLocomote(dir, autodir)`
* **Description:** Sends remote predict override locomote RPC to server.
* **Parameters:**
  - `dir` -- number or nil - direction in radians
  - `autodir` -- boolean or nil - whether to use automatic direction
* **Returns:** None

### `RemoteStopWalking()`
* **Description:** Sends stop walking RPC to server if not already stopped.
* **Parameters:** None
* **Returns:** None

### `DoPredictHopping(dt)`
* **Description:** Handles client-side hopping prediction synchronization. Sends StartHop RPC when locomotor begins hopping.
* **Parameters:**
  - `dt` -- Delta time in seconds.
* **Returns:** None

### `IsLocalOrRemoteHopping()`
* **Description:** Checks if player is currently hopping locally or via remote prediction.
* **Parameters:** None
* **Returns:** boolean

### `DoClientBusyOverrideLocomote()`
* **Description:** Passes overridelocomote events to server during busy states when controls are disabled.
* **Parameters:** None
* **Returns:** None

### `DoClientBusyOverrideLocomoteClick(pos)`
* **Description:** Left click version of busy override locomote for actions like exiting hotspring.
* **Parameters:**
  - `pos` -- Vector3 position for angle calculation.
* **Returns:** None

### `DoPredictWalking(dt)`
* **Description:** Handles predicted walking on master sim or sends prediction updates from client. Manages rubber band correction and stop detection.
* **Parameters:**
  - `dt` -- Delta time in seconds.
* **Returns:** boolean - true if predict walking was processed

### `DoDragWalking(dt)`
* **Description:** Handles drag walking input by getting remote drag position or world position during drag.
* **Parameters:**
  - `dt` -- Delta time in seconds.
* **Returns:** boolean - true if drag walking was processed

### `DoBoatSteering(dt)`
* **Description:** Handles boat steering input from controller or remote vector.
* **Parameters:**
  - `dt` -- Delta time in seconds.
* **Returns:** None

### `DoDoubleTapDir(allowaction)`
* **Description:** Processes double-tap directional input for quick actions. Tracks tap timing, direction changes, and thresholds. Sends DoubleTapAction RPC and executes action on valid double-tap.
* **Parameters:**
  - `allowaction` -- boolean - whether to allow double-tap action execution
* **Returns:** None

### `OnRemoteDoubleTapAction(actioncode, position, noforce, mod_name)`
* **Description:** Server-side handler for remote double-tap actions. Validates action code and mod name, sets action point if forced, and executes the double-click action.
* **Parameters:**
  - `actioncode` -- number - action code identifier
  - `position` -- Vector or nil - target position for action
  - `noforce` -- boolean - whether to prevent forced action
  - `mod_name` -- string or nil - mod name for action
* **Returns:** None

### `DoDirectWalking(dt)`
* **Description:** Handles direct walking input by getting remote direct vector or world controller vector, managing buffered actions, and running locomotor. Tracks direct walking time and clears combat target after 0.2 seconds if not attacking.
* **Parameters:**
  - `dt` -- number - delta time in seconds
* **Returns:** None

### `DoDirectStopWalking()`
* **Description:** Client-side function for stopping during busy states when not predicting. Clears recent buffered action, resets walking flags, cools down remote controller, and sends stop walking RPC.
* **Parameters:** None
* **Returns:** None

### `DoCameraControl()`
* **Description:** Handles camera rotation and zoom input from controller or keyboard, respecting deadzone thresholds and invert rotation settings.
* **Parameters:** None
* **Returns:** None

### `OnLeftUp()`
* **Description:** Handles left mouse button release, stops dragging state, clears drag time, and restarts any buffered actions that were pushed during drag release.
* **Parameters:** None
* **Returns:** None

### `DoAction(buffaction, spellbook)`
* **Description:** Executes a buffered action after validating it is still valid, checking for duplicates, handling auto-equip, highlighting targets, and pushing to locomotor or sending RPC to server.
* **Parameters:**
  - `buffaction` -- BufferedAction instance containing action details (action type, target, position, invobject, doer)
  - `spellbook` -- Optional spellbook entity instance for spell-related actions
* **Returns:** None

### `DoActionAutoEquip(buffaction)`
* **Description:** Auto-equips equippable items to hands slot for compatible actions, excluding drop, combine, store, equip, give, fuel, deploy, construct, and decorate actions.
* **Parameters:**
  - `buffaction` -- BufferedAction instance containing invobject to potentially auto-equip
* **Returns:** None

### `OnLeftClick(down)`
* **Description:** Handles left mouse button click events including placement, AOE targeting, double-click actions, walkto/attack/lookat actions, and remote control synchronization via RPC.
* **Parameters:**
  - `down` -- boolean -- true for press, false for release
* **Returns:** None

### `OnRemoteLeftClick(actioncode, position, target, isreleased, controlmodscode, noforce, mod_name, spellbook, spell_id)`
* **Description:** Server-side handler for remote left click actions, decodes control mods, retrieves mouse actions from playeractionpicker, and executes the action via DoAction.
* **Parameters:**
  - `actioncode` -- number -- action code from ACTIONS table
  - `position` -- Vector3 -- world position for the action
  - `target` -- Entity -- target entity or nil
  - `isreleased` -- boolean -- whether the button was released
  - `controlmodscode` -- number -- encoded control modifier state
  - `noforce` -- boolean -- whether to force the action point
  - `mod_name` -- string -- action mod name or nil
  - `spellbook` -- Entity -- spellbook entity or nil
  - `spell_id` -- string/number -- selected spell ID or nil
* **Returns:** None
* **Error states:** Asserts if actioncode is nil but isreleased is not nil

### `GetPlatformRelativePosition(absolute_x, absolute_z)`
* **Description:** Converts absolute world coordinates to platform-relative coordinates using TheWorld.Map:GetPlatformAtPoint and entity WorldToLocalSpace transformation.
* **Parameters:**
  - `absolute_x` -- number -- absolute world X coordinate
  - `absolute_z` -- number -- absolute world Z coordinate
* **Returns:** platform (Entity or nil), absolute_x (number), absolute_z (number)

### `OnRightClick(down)`
* **Description:** Handles right mouse button click events including placement cancellation, AOE targeting cancellation, crafting/spell wheel closing, deploy actions with rotation, and remote control synchronization via RPC.
* **Parameters:**
  - `down` -- boolean -- true for press, false for release
* **Returns:** None

### `OnRemoteRightClick(actioncode, position, target, rotation, isreleased, controlmodscode, noforce, mod_name)`
* **Description:** Handles remote right click input from clients, decoding mods and executing the corresponding action if valid.
* **Parameters:**
  - `actioncode` -- The action code identifier.
  - `position` -- The world position of the click.
  - `target` -- The entity target under the mouse.
  - `rotation` -- The rotation angle for the action.
  - `isreleased` -- Boolean indicating if the button was released.
  - `controlmodscode` -- Encoded control modifier state.
  - `noforce` -- Boolean to prevent forcing the action.
  - `mod_name` -- The name of the action mod.
* **Returns:** None

### `RemapMapAction(act, position)`
* **Description:** Remaps an action for map context, checking validity against map tiles and exploration status.
* **Parameters:**
  - `act` -- The BufferedAction to potentially remap.
  - `position` -- The Vector3 position for the action.
* **Returns:** The remapped action or nil if invalid.

### `GetMapActions(position, maptarget, actiondef)`
* **Description:** Retrieves left and right mouse actions available for the given map position and target.
* **Parameters:**
  - `position` -- The map position clicked.
  - `maptarget` -- The entity target on the map.
  - `actiondef` -- Optional specific action definition to force.
* **Returns:** LMBaction, RMBaction

### `UpdateActionsToMapActions(position, maptarget, forced_actiondef)`
* **Description:** Updates the component's stored LMB and RMB actions based on map context.
* **Parameters:**
  - `position` -- The map position.
  - `maptarget` -- The map target entity.
  - `forced_actiondef` -- Optional action definition to force.
* **Returns:** LMBaction, RMBaction

### `OnMapAction(actioncode, position, maptarget, mod_name)`
* **Description:** Executes a map action, handling server/client logic and locomotion preview.
* **Parameters:**
  - `actioncode` -- The action code.
  - `position` -- The map position.
  - `maptarget` -- The map target entity.
  - `mod_name` -- The mod name if applicable.
* **Returns:** None

### `GetLeftMouseAction()`
* **Description:** Returns the currently stored left mouse action.
* **Parameters:** None
* **Returns:** The LMBaction BufferedAction or nil.

### `GetRightMouseAction()`
* **Description:** Returns the currently stored right mouse action.
* **Parameters:** None
* **Returns:** The RMBaction BufferedAction or nil.

### `GetItemSelfAction(item)`
* **Description:** Gets the action for using an item on self, filtering out lookat actions.
* **Parameters:**
  - `item` -- The inventory item entity.
* **Returns:** The action or nil.

### `GetSceneItemControllerAction(item)`
* **Description:** Gets valid controller actions for a scene item, filtering out lookat, walkto, and attack (only if item has combat component).
* **Parameters:**
  - `item` -- The scene item entity.
* **Returns:** lmb, rmb

### `IsAxisAlignedPlacement()`
* **Description:** Checks if the current placer or deployplacer is axis aligned.
* **Parameters:** None
* **Returns:** Boolean.

### `GetPlacerPosition()`
* **Description:** Returns the position of the placer or deployplacer.
* **Parameters:** None
* **Returns:** Vector3 or nil.

### `GetGroundUseAction(position, spellbook)`
* **Description:** Determines actions available for using items or spells on the ground.
* **Parameters:**
  - `position` -- The ground position.
  - `spellbook` -- Optional spellbook item.
* **Returns:** lmb action, rmb action (only if different from lmb)

### `GetGroundUseSpecialAction(position, right)`
* **Description:** Gets special actions available for ground use.
* **Parameters:**
  - `position` -- The ground position.
  - `right` -- Boolean for right click context.
* **Returns:** Action or nil.

### `HasGroundUseSpecialAction(right)`
* **Description:** Checks if any special ground use actions exist.
* **Parameters:**
  - `right` -- Boolean for right click context.
* **Returns:** Boolean.

### `GetItemUseAction(active_item, target)`
* **Description:** Determines the valid action for using an active item on a target, handling mounted store logic.
* **Parameters:**
  - `active_item` -- The item being used.
  - `target` -- The target entity.
* **Returns:** The action or nil.

### `RemoteUseItemFromInvTile(buffaction, item)`
* **Description:** Handles remote execution of using an item from an inventory tile.
* **Parameters:**
  - `buffaction` -- The buffered action.
  - `item` -- The item entity.
* **Returns:** None

### `RemoteControllerUseItemOnItemFromInvTile(buffaction, item, active_item)`
* **Description:** Handles remote execution of using an active item on another item from inventory tile.
* **Parameters:**
  - `buffaction` -- The buffered action.
  - `item` -- The target item.
  - `active_item` -- The active item being used.
* **Returns:** None

### `RemoteControllerUseItemOnSelfFromInvTile(buffaction, item)`
* **Description:** Handles remote execution of using an item on self from inventory tile.
* **Parameters:**
  - `buffaction` -- The buffered action.
  - `item` -- The item entity.
* **Returns:** None

### `RemoteControllerUseItemOnSceneFromInvTile(buffaction, item)`
* **Description:** Handles remote execution of using an item on a scene entity from inventory tile.
* **Parameters:**
  - `buffaction` -- The buffered action.
  - `item` -- The item entity.
* **Returns:** None

### `RemoteInspectItemFromInvTile(item)`
* **Description:** Handles remote execution of inspecting an item from inventory tile.
* **Parameters:**
  - `item` -- The item entity to inspect.
* **Returns:** None

### `RemoteDropItemFromInvTile(item, single)`
* **Description:** Handles remote execution of dropping an item from inventory tile.
* **Parameters:**
  - `item` -- The item entity to drop.
  - `single` -- Boolean to drop single item vs stack.
* **Returns:** None

### `RemoteCastSpellBookFromInv(item, spell_id, spell_action)`
* **Description:** Handles client-side remote spell casting from inventory. Sends RPC to server after optionally calling pre_action_cb and previewing the action through locomotor.
* **Parameters:**
  - `item` -- Entity instance representing the spellbook item or player instance
  - `spell_id` -- Number or string identifier for the spell to cast
  - `spell_action` -- Action definition for casting, defaults to ACTIONS.CAST_SPELLBOOK if nil
* **Returns:** nil

### `RemoteMakeRecipeFromMenu(recipe, skin)`
* **Description:** Handles client-side remote recipe building from menu. Resolves skin index from PREFAB_SKINS_IDS and sends RPC to server with optional locomotor preview.
* **Parameters:**
  - `recipe` -- Table containing recipe data including product, name, and rpc_id
  - `skin` -- Skin identifier for the recipe product, can be nil
* **Returns:** nil

### `RemoteMakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Handles client-side remote recipe building at a specific world position. Converts position to platform-relative coordinates and sends RPC to server.
* **Parameters:**
  - `recipe` -- Table containing recipe data including name and rpc_id
  - `pt` -- Vector table with x and z coordinates for build position
  - `rot` -- Rotation value for the built structure
  - `skin` -- Skin identifier for the recipe, can be nil
* **Returns:** nil

### `RemoteBufferedAction(buffaction)`
* **Description:** Executes a buffered action on client when controller is enabled. Handles remote prediction walking synchronization before calling the action's preview_cb.
* **Parameters:**
  - `buffaction` -- BufferedAction instance to execute remotely
* **Returns:** nil

### `OnRemoteBufferedAction()`
* **Description:** Server-side handler for remote buffered actions. Adjusts player position based on remote prediction vector and forces locomotion state interrupt if movement delta exceeds threshold.
* **Parameters:** None
* **Returns:** nil

### `OnRemoteInteractionTarget(actioncode, target)`
* **Description:** Stores the remote interaction action code and target entity for creature interaction synchronization. Called on both client and server (no `ismastersim` guard).
* **Parameters:**
  - `actioncode` -- Numeric action code identifying the interaction type
  - `target` -- Entity instance that is the target of the interaction
* **Returns:** nil

### `RemoteInteractionTarget(actioncode, target)`
* **Description:** Client-side function that sends interaction target information to server via RPC if the action or target has changed.
* **Parameters:**
  - `actioncode` -- Numeric action code identifying the interaction type
  - `target` -- Entity instance that is the target of the interaction
* **Returns:** nil

### `GetRemoteInteraction()`
* **Description:** Returns the currently stored remote interaction action code and target entity.
* **Parameters:** None
* **Returns:** actioncode, target -- the stored remote interaction action and target, or nil values if not set

### `OnLocomotorBufferedAction(act)`
* **Description:** Handles locomotor buffered actions by setting remote interaction targets for creature interactions. Clears interactions when server takes control and stores recent action data for prediction.
* **Parameters:**
  - `act` -- BufferedAction instance being processed by locomotor
* **Returns:** nil

### `OnRemoteToggleMovementPrediction(val)`
* **Description:** Server-side handler for toggling remote movement prediction. Stops locomotor, clears state, and registers or unregisters the newstate event listener based on the value.
* **Parameters:**
  - `val` -- Boolean enabling or disabling remote movement prediction
* **Returns:** nil

## Events & listeners

**Listens to:**
- `playeractivated` — Registered in constructor, calls OnPlayerActivated to activate controller
- `playerdeactivated` — Registered in constructor, calls OnPlayerDeactivated to deactivate controller
- `equip` — Registered in OnInit and Activate, handles equipment changes for reticule targeting
- `unequip` — Registered in OnInit and Activate, handles equipment removal for reticule targeting
- `inventoryclosed` — Client-only event registered in OnInit and Activate, triggers reticule cleanup
- `buildstructure` — Registered in Activate, cancels placement when structure is built
- `zoomcamera` — Registered in Activate, handles camera zoom input
- `newactiveitem` — Registered in Activate, cancels AOE targeting on item change
- `continuefrompause` — Registered in Activate on TheWorld, restores controller state after pause
- `deactivateworld` — Client-only event registered in Activate on TheWorld, cleanup for world reset
- `onremove` — Registered in AttachClassified on classified entity, triggers DetachClassified
- `newstate` — Listened to when remote prediction is enabled to sync stategraph state changes

**Pushes:**
- `attackbutton` — Pushed immediately when override attack is triggered in DoControllerAttackButton
- `endsteeringreticule` — Pushed to boat entity when player stops steering, includes player instance in data
- `starsteeringreticule` — Pushed to boat entity when player starts steering (typo in source code for startsteeringreticule), includes player instance in data
- `continuefrompause` — Pushed to TheWorld when controller is recached to continue from pause state
- `locomote` — Pushed in OnRemotePredictOverrideLocomote when remote override is active.
- `quagmire_shoptab` — Pushed when LOOKAT action targets an entity with quagmire_shoptab property