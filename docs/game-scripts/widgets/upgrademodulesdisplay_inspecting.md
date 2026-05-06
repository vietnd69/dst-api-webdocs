---
id: upgrademodulesdisplay_inspecting
title: Upgrademodulesdisplay Inspecting
description: A UI widget for displaying and managing WX-78's upgrade modules, handling controller input, module animations, and energy level updates.
tags: [ui, player, widgets, networking, controller]
sidebar_position: 10

last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: widgets
source_hash: aeed2f15
system_scope: ui
---

# UpgradeModulesDisplay_Inspecting

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
The `UpgradeModulesDisplay_Inspecting` widget provides a user interface for managing WX-78's upgrade modules. It displays circuit bars for different module types (Alpha, Beta, Gamma), handles module placement/removal, and updates energy levels dynamically. The widget supports controller navigation, shadow slot management, and module animations. It integrates with the `SkillTreeUpdater` and `SocketHolder` components to validate module operations and check skill requirements.

## Usage example
```lua
local widget = UpgradeModulesDisplay_Inspecting(player, TheFrontEnd)
TheFrontEnd:AddChild(widget)
widget:UpdateEnergyLevel(5, 0)
widget:UpdateMaxEnergy(7, 0)
widget:OnModulesDirty({ alpha = {1, 2}, beta = {}, gamma = {} }, true)
widget:Close()
```

## Dependencies & tags
**External dependencies:**
- `widgets/uianim` -- Required for UIAnim child widgets.
- `widgets/widget` -- Base widget class for inheritance.
- `util/sourcemodifierlist` -- Required for SourceModifierList module.
- `wx78_moduledefs` -- Provides GetModuleDefinitionFromNetID for module definition lookup.
- `easing` -- Used for animation easing calculations.
- `TheWorld` -- Listens for continuefrompause event.
- `TheSim` -- Gets screen size for resolution scaling.
- `TheInput` -- Checks controller attachment for focus handling.

- `TheFrontEnd` -- Plays sound effects.
- `Profile` -- Gets control scheme.
- `CIRCUIT_BARS` -- Circuit bar enumeration constants.
- `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT` -- Movement direction constants.
- `DistXYSq` -- Calculates squared distance between two vectors.

**Components used:**
- `skilltreeupdater` -- Uses IsActivated for skill checks to determine can_unplug_any and has_shadow_affinity.
- `socketholder` -- Uses GetQualityForPosition, IsSocketNameForPosition, and TryToUnsocket for shadow socket management.

**Tags:**
- `NOCLICK` -- Added to the widget to prevent click interactions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| owner | Entity | nil | The owner entity (WX-78 character) for this widget. |
| controls | Widget | nil | The controls widget for mouse handling. |
| busylocks | number | 0 | Counter for busy operations. |
| timeouttask | task | nil | Task for network call timeout. |
| max_energy | number | unknown | Maximum energy capacity from owner. |
| energy_level | number | unknown | Current energy level from owner. |
| can_unplug_any | boolean | false | Whether unplug any module is allowed based on skills. |
| has_shadow_affinity | boolean | false | Whether shadow affinity is active based on skills. |
| bg | UIAnim | UIAnim | Background UI animation for the module display. |
| bg_shadow | UIAnim | UIAnim | Shadow background UI animation. |
| shadow_slot | Image | Image | Shadow slot image for module placement. |
| shadow_slot_item | UIAnim | UIAnim | Shadow slot item animation. |
| bg_bars | UIAnim | UIAnim | Background bars UI animation. |
| plugs | UIAnim | UIAnim | Plug animations for module slots. |
| chip_objectpools | table | {} | Table of chip object pools per circuit type. |
| chip_poolindexes | table | {} | Table of pool indexes for each circuit type. |
| chip_slotsinuse | table | {} | Table of slots in use per circuit type. |
| energy_backing | UIAnim | UIAnim | Energy backing UI animation. |
| energy_blinking | UIAnim | UIAnim | Energy blinking UI animation. |
| anim | UIAnim | UIAnim | Main energy animation. |
| mousehandler | Widget | Widget | Mouse handler widget for tooltip positioning. |
| moduleremover | UIAnim | UIAnim | Module remover UI animation. |
| default_focus | UIAnim | UIAnim | Default focus chip for controller navigation. |
| shadow_slot_item_isvalid | boolean | nil | Whether shadow slot item is valid. |
| shadow_slot_item_oldanimdata | table | nil | Old animation data for shadow slot item. |
| is_using_module_remover | boolean | false | Whether module remover is currently active. |
| controllerfocuslock | boolean | nil | Whether controller focus is locked. |

## Main functions
### `_ctor(owner, controls)`
* **Description:** Constructor for UpgradeModulesDisplay_Inspecting widget. Initializes the widget with the owner entity and controls.
* **Parameters:**
  - `owner` -- Entity instance for WX-78 character
  - `controls` -- Widget instance for mouse handling
* **Returns:** nil
* **Error states:** Crashes if owner or controls is nil (no nil guard before accessing components)















### `IsBusy()`
* **Description:** Checks if the widget is busy by comparing self.busylocks to zero.
* **Parameters:** None
* **Returns:** boolean true if busy, false otherwise
* **Error states:** None

### `AddBusyLock()`
* **Description:** Increments the busylocks counter by 1.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `StartAsyncTimeout()`
* **Description:** Starts async timeout task; adds busy lock and schedules removal after timeout.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if self.inst is nil

### `CancelAsyncTimeout()`
* **Description:** Cancels async timeout task; removes busy lock if active.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `RemoveBusyLock()`
* **Description:** Decrements the busylocks counter by 1; if negative, sets to 0 and asserts on dev build; returns whether busylocks is now zero.
* **Parameters:** None
* **Returns:** boolean true if busylocks is zero after decrement, false otherwise
* **Error states:** Crashes in development builds if busylocks becomes negative (due to assert BRANCH ~= "dev")

### `ControllerSetFocus(focus)`
* **Description:** Sets controller focus state; if focus is true and controller attached, stops tracking mouse, locks focus, and sets focus on available chip or shadow slot; if false, releases focus.
* **Parameters:**
  - `focus` -- Boolean indicating whether to set focus
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd or TheInput is nil

### `HasInputFocus()`
* **Description:** Checks if module remover is in use and controller is attached.
* **Parameters:** None
* **Returns:** boolean true if input focus is held, false otherwise
* **Error states:** None

### `IsExtended()`
* **Description:** Checks if max energy is at least 7 for extended layout.
* **Parameters:** None
* **Returns:** boolean true if extended, false otherwise
* **Error states:** None

### `UpdateSlotCount()`
* **Description:** Updates slot visibility based on whether layout is extended or not.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if self.bg_shadow or self.bg_bars is nil (no nil guard before accessing GetAnimState)

### `GetToolTipYOffset()`
* **Description:** Calculates tooltip Y offset based on module remover animation state.
* **Parameters:** None
* **Returns:** number Y offset value
* **Error states:** Crashes if self.moduleremover or self.moduleremover:GetAnimState() is nil (no nil guard before accessing GetAnimState)

### `OnLoseFocus()`
* **Description:** Handles widget lose focus; stops module remover if active and controller attached.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil (no nil guard before accessing ControllerAttached)

### `OnGainFocus()`
* **Description:** Handles widget gain focus; clears focus if controller attached and not using module remover.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil (no nil guard before accessing ControllerAttached)

### `StopControllerRemovingModule()`
* **Description:** Stops module remover usage and clears focus.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnControllerStartRemovingModule(item, nosound)`
* **Description:** Starts module remover if item has upgrademoduleremover action or shadow slot is valid; plays negative sound if no valid module to remove.
* **Parameters:**
  - `item` -- Item entity or nil; if has upgrademoduleremover action, triggers module removal
  - `nosound` -- Boolean to skip sound playback
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `OnNewActiveItem()`
* **Description:** Updates module remover state based on active item; stops controller removing module if using controllers.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil

### `ToggleUsingModuleRemover(item)`
* **Description:** Toggles module remover usage; shows/hides remover, updates tooltip position, and handles focus.
* **Parameters:**
  - `item` -- Item entity or nil; toggles module remover state
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd or TheInput is nil

### `UpdateModuleRemoverBuild(moduleremover)`
* **Description:** Updates module remover animation build based on item skin.
* **Parameters:**
  - `moduleremover` -- Item entity with upgrademoduleremover action
* **Returns:** nil
* **Error states:** Crashes if moduleremover.AnimState or self.moduleremover is nil (no nil guard before accessing GetBuild or GetSkinBuild)

### `UpdateChipCharges(plugging_in, skipsound)`
* **Description:** Updates chip charge state based on energy level; plays animations and sounds for power changes.
* **Parameters:**
  - `plugging_in` -- Boolean indicating if module is being plugged in
  - `skipsound` -- Boolean to skip sound playback
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `UpdateMaxEnergy(new_level, old_level)`
* **Description:** Updates max energy level; hides/shows slots, adjusts energy display, and pops extra modules over new limit.
* **Parameters:**
  - `new_level` -- New maximum energy level
  - `old_level` -- Previous maximum energy level
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `UpdateEnergyLevel(new_level, old_level, skipsound)`
* **Description:** Updates energy level display; adjusts slot visibility, starts/stops flicker task, and plays charge sounds.
* **Parameters:**
  - `new_level` -- New energy level
  - `old_level` -- Previous energy level
  - `skipsound` -- Boolean to skip sound playback
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `GetChipXOffset(chiptypeindex)`
* **Description:** Returns X offset for chip based on circuit type.
* **Parameters:**
  - `chiptypeindex` -- Circuit type index (ALPHA, BETA, GAMMA)
* **Returns:** number X offset value
* **Error states:** None

### `GetChipYOffset(chiptypeindex)`
* **Description:** Returns Y offset for chip based on circuit type.
* **Parameters:**
  - `chiptypeindex` -- Circuit type index (ALPHA, BETA, GAMMA)
* **Returns:** number Y offset value
* **Error states:** None

### `OnModuleAdded(bartype, moduledefinition_index, init)`
* **Description:** Adds a module to the display; updates chip position, animations, and module data.
* **Parameters:**
  - `bartype` -- Circuit type index
  - `moduledefinition_index` -- Module definition net ID
  - `init` -- Boolean indicating if initialization
* **Returns:** nil
* **Error states:** None

### `PopModuleAtIndex(bartype, startindex)`
* **Description:** Pops module at specified index; moves remaining modules down and updates positions.
* **Parameters:**
  - `bartype` -- Circuit type index
  - `startindex` -- Index to pop from
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `OnModulesDirty(modules_data, init)`
* **Description:** Updates module display based on dirty data; handles adding, popping, or moving modules.
* **Parameters:**
  - `modules_data` -- Table of module data per circuit type
  - `init` -- Boolean indicating if initialization
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `DropChip(falling_chip)`
* **Description:** Drops a chip; sets animation and cleanup handlers.
* **Parameters:**
  - `falling_chip` -- Chip UIAnim instance to drop
* **Returns:** nil
* **Error states:** Crashes if falling_chip is nil

### `PopOneModule(bartype)`
* **Description:** Pops the top module of specified circuit type; drops it and updates positions.
* **Parameters:**
  - `bartype` -- Circuit type index
* **Returns:** nil
* **Error states:** None

### `PopAllModules()`
* **Description:** Pops all modules; drops each chip and resets slot usage.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil

### `PlayChipAnimation(chip, anim, loop)`
* **Description:** Plays animation on chip and its glow/symbol children.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
  - `anim` -- Animation name
  - `loop` -- Boolean to loop animation (optional)
* **Returns:** nil
* **Error states:** Crashes if chip is nil

### `PushChipAnimation(chip, anim, loop)`
* **Description:** Pushes animation to chip and its glow/symbol children.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
  - `anim` -- Animation name
  - `loop` -- Boolean to loop animation (optional)
* **Returns:** nil
* **Error states:** Crashes if chip is nil

### `SetChipPosition(chip, x, y, z)`
* **Description:** Sets chip position and updates glow position.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
  - `x` -- X position
  - `y` -- Y position
  - `z` -- Z position (optional)
* **Returns:** nil
* **Error states:** Crashes if chip is nil

### `EnableChipGlow(chip, enable)`
* **Description:** Shows or hides chip glow based on enable flag.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
  - `enable` -- Boolean to enable glow
* **Returns:** nil
* **Error states:** Crashes if chip is nil

### `Close()`
* **Description:** Closes widget; resets hover tile modifier and tooltip position, releases focus, and kills widget.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if self.owner or self.controls is nil (no nil guard before accessing owner or controls)

### `ResolveUnplugModuleIndex(moduletype, moduleindex)`
* **Description:** Resolves unplug module index; adjusts for top circuit if not allowed to unplug any.
* **Parameters:**
  - `moduletype` -- Circuit type index
  - `moduleindex` -- Module index to resolve
* **Returns:** integer resolved module index
* **Error states:** None

### `GetModuleRemoverPosition(chip)`
* **Description:** Calculates module remover position based on chip position and screen scale.
* **Parameters:**
  - `chip` -- Chip UIAnim instance or shadow_slot
* **Returns:** Vector3 position
* **Error states:** Crashes if TheSim is nil

### `UnplugShadowSlot()`
* **Description:** Unplugs shadow slot module; plays animation and triggers unsocket action.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil or self.owner.components is nil (no nil guard before accessing owner.components)

### `UnplugModule(moduletype, moduleindex)`
* **Description:** Unplugs specified module; plays animation and triggers unplug action on owner.
* **Parameters:**
  - `moduletype` -- Circuit type index
  - `moduleindex` -- Module index to unplug
* **Returns:** nil
* **Error states:** Crashes if TheFrontEnd is nil or self.owner is nil (no nil guard before accessing owner)

### `ResolveChip(chip)`
* **Description:** Resolves chip for unplug; returns top circuit of same type if not allowed to unplug any.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
* **Returns:** Chip UIAnim instance
* **Error states:** None

### `SetChipTooltip(chip, redirected)`
* **Description:** Sets tooltip for chip based on redirected state.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
  - `redirected` -- Boolean indicating if tooltip is redirected
* **Returns:** nil
* **Error states:** Crashes if chip is nil

### `IsChipValidToFocus(chip)`
* **Description:** Checks if chip is valid for focus (not falling or moving).
* **Parameters:**
  - `chip` -- Chip UIAnim instance
* **Returns:** boolean true if valid, false otherwise
* **Error states:** Crashes if chip is nil

### `IsChipFocused(chip)`
* **Description:** Checks if chip has focus.
* **Parameters:**
  - `chip` -- Chip UIAnim instance
* **Returns:** boolean true if focused, false otherwise
* **Error states:** Crashes if chip is nil

### `SetChipFocusSource(chip, bool, source, redirected)`
* **Description:** Sets the focus state for a chip and updates the module remover position, tooltip, and animation accordingly.
* **Parameters:**
  - `chip` -- the chip object to focus
  - `bool` -- true to set focus, false to remove focus
  - `source` -- the source identifier for the focus change
  - `redirected` -- whether the focus was redirected from another source
* **Returns:** nil
* **Error states:** errors if `chip` is nil

### `SetShadowSlotFocus(focus)`
* **Description:** Sets focus for the shadow slot, updating the tooltip and animation for the shadow slot item.
* **Parameters:**
  - `focus` -- boolean indicating whether to set focus (true) or remove focus (false)
* **Returns:** nil
* **Error states:** errors if `self.shadow_slot` is nil

### `RefocusChip(moduletype, moduleindex, unsocketposition)`
* **Description:** Refocuses a chip after unsocketing, handling controller-based navigation and focus redirection.
* **Parameters:**
  - `moduletype` -- the circuit bar type for the chip to refocus
  - `moduleindex` -- the index of the chip in the circuit bar
  - `unsocketposition` -- position for unsocketing, used for navigation
* **Returns:** nil
* **Error states:** errors if `self.chip_objectpools` is nil

### `OnChipGainFocus(chip)`
* **Description:** Handles chip focus gain, resolving focus source and playing sound if new focus.
* **Parameters:**
  - `chip` -- the chip object gaining focus
* **Returns:** nil
* **Error states:** errors if chip is nil or TheFrontEnd is nil (no nil guard before accessing TheFrontEnd)

### `OnChipLoseFocus(chip)`
* **Description:** Handles chip focus loss, resetting focus source and tooltip.
* **Parameters:**
  - `chip` -- the chip object losing focus
* **Returns:** nil
* **Error states:** errors if `chip` is nil

### `OnShadowSlotGainFocus()`
* **Description:** Handles shadow slot focus gain, setting focus if using module remover.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnShadowSlotLoseFocus()`
* **Description:** Handles shadow slot focus loss, removing focus.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `UpdateModuleRemoverPosition(x, y)`
* **Description:** Updates the module remover position on screen with clamping.
* **Parameters:**
  - `x` -- x-coordinate for the module remover position
  - `y` -- y-coordinate for the module remover position
* **Returns:** nil
* **Error states:** Crashes if TheSim is nil

### `OverrideModuleRemoverPositionAndSpeed(x, y, speed)`
* **Description:** Overrides module remover position and speed, starting or stopping updates accordingly.
* **Parameters:**
  - `x` -- x-coordinate for override target position
  - `y` -- y-coordinate for override target position
  - `speed` -- speed for moving to target position
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil

### `FollowMouseConstrained()`
* **Description:** Starts following mouse movement with constrained positioning.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil

### `OnUpdate(dt)`
* **Description:** Updates module remover position based on target and override settings.
* **Parameters:**
  - `dt` -- delta time for update
* **Returns:** nil
* **Error states:** Crashes if TheInput is nil

### `GetFirstCircuit(bartype)`
* **Description:** Returns the first visible chip in the specified circuit bar.
* **Parameters:**
  - `bartype` -- the circuit bar type
* **Returns:** chip object or nil if none
* **Error states:** errors if `self.chip_objectpools` is nil

### `GetLastCircuit(bartype)`
* **Description:** Returns the last visible chip in the specified circuit bar.
* **Parameters:**
  - `bartype` -- the circuit bar type
* **Returns:** chip object or nil if none
* **Error states:** errors if `self.chip_objectpools` is nil

### `DoFocusHookups()`
* **Description:** Sets up focus direction links between chips and the shadow slot for navigation.
* **Parameters:** None
* **Returns:** nil
* **Error states:** errors if `self.chip_objectpools` is nil

### `OnControl(control, down)`
* **Description:** Handles controller input for navigation and unsocketing.
* **Parameters:**
  - `control` -- the control being pressed
  - `down` -- boolean indicating if the control is pressed (true) or released (false)
* **Returns:** true if handled, false otherwise
* **Error states:** errors if `self.chip_objectpools` is nil or TheInput is nil

### `GetHelpText()`
* **Description:** Generates help text for controller input in the upgrade modules display.
* **Parameters:** None
* **Returns:** string help text or nil if not using controller
* **Error states:** Crashes if TheInput is nil

## Events & listeners
**Listens to:**
- `onactivateskill_client` -- Triggers when a skill is activated; updates skill-related properties.
- `ondeactivateskill_client` -- Triggers when a skill is deactivated; updates skill-related properties.
- `onsocketeddirty1` -- Triggers when socketed data changes; updates shadow slot item.
- `onremove` -- Triggers when widget is removed; kills mouse handler.
- `controller_removing_module` -- Triggers when controller starts removing module; initiates module remover.
- `newactiveitem` -- Triggers when active item changes; updates module remover state.
- `continuefrompause` -- Triggers when game continues from pause; checks module remover state.

**Pushes:**
- `sethovertilehidemodifier` -- Pushes event to set hover tile hide modifier; used for tooltip control.