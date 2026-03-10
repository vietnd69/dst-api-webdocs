---
id: optionsscreen
title: Optionsscreen
description: Manages game options UI, including graphics, audio, input mapping, language, and settings, with full dirty-state tracking, platform-aware configuration, and network-safe persistence.
tags: [ui, settings, input, graphics, profile]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 14a01b6b
system_scope: ui
---

# Optionsscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
The Optionsscreen class implements the in-game options menu UI for Don't Starve Together. It handles user configuration for display (resolution, refresh rate, fullscreen), audio (volume, profanity filter), gameplay (HUD, camera, sensitivity), input (keyboard/controller mapping, control schemes), and language selection—including mod-provided language packs. It tracks unsaved changes ("dirty state"), validates and applies options globally or conditionally (e.g., platform-specific), and manages persistence through the Profile system. The screen coordinates multiple subcomponents (Subscreener tabs, scrollable control lists, spinners, tooltips) and integrates with TheFrontEnd, TheInputProxy, and graphics APIs for live configuration updates.

## Usage example
```lua
local prev_screen = TheFrontEnd:GetActiveScreen()
local options_screen = OptionsScreen(prev_screen)
TheFrontEnd:PushScreen(options_screen)

-- Later, user presses A or clicks Apply:
options_screen:ApplyChanges()
-- or to discard changes:
options_screen:RevertChanges()
```

## Dependencies & tags
**Components used:**
- `components/colourcube.lua` — used via `TheWorld.components.colourcube:SetDistortionModifier(value)` to update post-processing distortion.
**Tags:** (none found across all chunks)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `show_language_options` | boolean | false | true if language tab should be visible (based on prev_screen and platform) |
| `show_mod_language_options` | boolean | false | true if mod languages tab should be shown (only on Steam platforms) |
| `show_datacollection` | boolean | false | true if data collection checkbox should be shown |
| `options` | table | shallow copy | Read-only copy of current profile values (used as baseline) |
| `working` | table | shallow copy | Mutable copy of options used to track unsaved changes |
| `is_mapping` | boolean | false | true if control mapping is currently active |
| `dirty` | boolean | false | true if working values differ from baseline options |
| `letterbox` | widget | nil | Foreground letterbox widget for fade transitions |
| `root`, `bg`, `title`, `kit_puppet`, `onlinestatus` | widget | nil | UI container hierarchy |
| `action_menu`, `cancel_button`, `dialog`, `panel_root` | widget | nil | Action bar, cancel button, modal dialog, and main panel container |
| `subscreener` | Subscreener | nil | Tab navigation controller |
| `selected_tab` | string | "CONTROLS" | Currently active tab identifier |
| `devices` | array | {} | List of available input devices |
| `inputhandlers` | table | {} | Active input handler references |
| `active_list` | ScrollableList | nil | Scrollable list for current tab's controls/options |
| `grid`, `grid_graphics` | widget | nil | Layout grids for options and graphics panels |
| `kb_controllist`, `controller_controllist` | array | {} | Arrays of keyboard/controller control widgets |
| `kb_controlwidgets`, `controller_controlwidgets` | array | {} | Internal lists of control binding widgets |
| `apply_button`, `reset_button`, `tooltip` | widget | nil | Apply, Reset, and tooltip widgets |
| `mods_list`, `lang_grid` | widget | nil | Mod languages container and grid |
| `integratedbackpackSpinner` | spinner | nil | Integrated Backpack toggle spinner |
| `controls_header`, `controls_horizontal_line`, `controls_vertical_line` | widget | nil | UI markers for control panel layout |
| `column_in` | widget | nil | Column grouping for control panel layout |

## Main functions
### `FindEnableScreenFlashOptionsIndex(value)`
* **Description:** Finds the spinner index for screen flash option matching a numeric value (0, 1, or 2). Used for "Enable Screen Flash" spinner.
* **Parameters:** `value` — numeric option value.
* **Returns:** Index `1` (disabled), `2` (enabled), or defaults to `1`.

### `FindDistortionLevelOptionsIndex(value)`
* **Description:** Finds spinner index for color distortion level (0.0 to 1.0). Matches distortionLevelOptions entries.
* **Parameters:** `value` — distortion level float.
* **Returns:** Index `1`–`5`, defaults to `4` (STRONG) if no match.

### `FindAxisAlignedPlacementIntervalsOptionsIndex(value)`
* **Description:** Finds spinner index for axis-aligned placement intervals (grid snap).
* **Parameters:** `value` — numeric interval value from AXISALIGNMENT_VALUES.
* **Returns:** Index in 1–N of axisalignedplacementintervalsOptions, defaults to `2`.

### `FindNPCChatOptionsIndex(value)`
* **Description:** Finds spinner index for NPC chat priority (LOW, HIGH, MAX).
* **Parameters:** `value` — CHATPRIORITIES constant.
* **Returns:** Index `1`–`3`, defaults to `1`.

### `PresetControl(id, modifier, ismodified)`
* **Description:** Constructs a preset control descriptor for scheme presets (e.g., `"rstick"`).
* **Parameters:** `id` — scheme identifier, `modifier` — control ID, `ismodified` — boolean flag.
* **Returns:** `{ id = id, modifier = modifier, ismodified = ismodified }`.

### `IsPresetControl(control)`
* **Description:** Checks if control is a preset control descriptor.
* **Parameters:** `control` — any value.
* **Returns:** Boolean.

### `IsCameraControlScheme1(self)` – `IsCameraControlScheme7(self)`
* **Description:** Predicate returning true if current camera+inventory scheme matches the given integer ID (1–7).
* **Parameters:** `self` — OptionsScreen instance.
* **Returns:** Boolean.

### `NotCameraControlScheme1(self)`
* **Description:** Inverse of `IsCameraControlScheme1`.
* **Parameters:** `self`
* **Returns:** Boolean.

### `NotCameraControlScheme4to7(self)`
* **Description:** Returns true if current scheme `is <4` or >7.
* **Parameters:** `self`
* **Returns:** Boolean.

### `GetResolutionString(w, h)`
* **Description:** Formats resolution as `"W x H"`.
* **Parameters:** `w`, `h` — integers.
* **Returns:** Formatted string.

### `SortKey(data)`
* **Description:** Generates a sortable integer key from resolution `{ w, h }`.
* **Parameters:** `data` — `{ w, h }`.
* **Returns:** Integer key (`w * 16777216 + h * 65536`).

### `ValidResolutionSorter(a, b)`
* **Description:** Comparison function for sorting resolution lists.
* **Parameters:** `a`, `b` — `{ text, data = { w, h, hz, idx } }`.
* **Returns:** Boolean.

### `GetDisplays()`
* **Description:** Queries connected displays.
* **Parameters:** None.
* **Returns:** Array of `{ text = "Display N", data = display_id }`.

### `GetRefreshRates(display_id, mode_idx)`
* **Description:** Queries refresh rates for a given display mode.
* **Parameters:** `display_id`, `mode_idx`.
* **Returns:** Array of `{ text = "Hz", data = refresh_rate }`.

### `GetDisplayModes(display_id)`
* **Description:** Queries all valid display modes (resolutions + hz) for a display.
* **Parameters:** `display_id`.
* **Returns:** Sorted array of `{ text = "W x H", data = { w, h, hz, idx } }`.

### `GetDisplayModeIdx(display_id, w, h, hz)`
* **Description:** Returns index of display mode matching resolution and hz.
* **Parameters:** `display_id`, `w`, `h`, `hz`.
* **Returns:** Integer index or `nil`.

### `GetDisplayModeInfo(display_id, mode_idx)`
* **Description:** Returns resolution and hz for a display mode.
* **Parameters:** `display_id`, `mode_idx`.
* **Returns:** `w`, `h`, `hz`.

### `OptionsScreen:MakeBackButton()`
* **Description:** Creates and positions the back/cancel button.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:_RefreshScreenButtons()`
* **Description:** Shows/hides cancel button and action menu based on controller presence.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:OnControl(control, down)`
* **Description:** Handles global input commands (e.g., close, apply, reset). Calls `ApplyChanges()`, `RevertChanges()`, or `Close()` depending on control.
* **Parameters:** `control` — CONTROL_* constant, `down` — boolean.
* **Returns:** Boolean (true if handled).

### `OptionsScreen:ApplyChanges()`
* **Description:** Validates pending changes, prompts for graphics changes if needed, then saves and closes.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:Close(fn)`
* **Description:** Triggers fade-out back to previous screen via TheFrontEnd:FadeBack.
* **Parameters:** `fn` — optional callback.
* **Returns:** None.

### `OptionsScreen:ConfirmRevert()`
* **Description:** Shows confirmation dialog for reverting unsaved changes.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:ConfirmApply()`
* **Description:** Shows confirmation dialog before saving.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:GetHelpText()`
* **Description:** Builds localized help string (e.g., "Press [A] to apply, [B] to cancel") based on context.
* **Parameters:** None.
* **Returns:** String.

### `OptionsScreen:Accept()`
* **Description:** Invokes Save() then closes.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:Save(cb)`
* **Description:** Persists self.working to profile and calls cb when done.
* **Parameters:** `cb` — optional callback.
* **Returns:** None.

### `OptionsScreen:RevertChanges()`
* **Description:** Discards changes: copies self.options back to self.working and refreshes visuals.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:MakeDirty()`
* **Description:** Marks screen as having unsaved changes (sets self.dirty = true).
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:MakeClean()`
* **Description:** Marks screen as clean (self.dirty = false).
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:IsDirty()`
* **Description:** Compares self.working vs self.options for any changes.
* **Parameters:** None.
* **Returns:** Boolean.

### `OptionsScreen:IsGraphicsDirty()`
* **Description:** Checks only for display (res/freq/fullscreen) changes.
* **Parameters:** None.
* **Returns:** Boolean.

### `OptionsScreen:ChangeGraphicsMode()`
* **Description:** Applies display mode via graphics options (res, hz, fullscreen).
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:ConfirmGraphicsChanges(fn)`
* **Description:** Shows apply graphics dialog; accepts/reverts based on user selection.
* **Parameters:** `fn` — ignored.
* **Returns:** None.

### `OptionsScreen:ApplyVolume()`
* **Description:** Applies audio volumes from self.working to TheMixer.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:Apply()`
* **Description:** Applies all working options globally (profanity filter, camera, HUD, input, language, distortion).
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:LoadDefaultControls()`
* **Description:** Loads default control mapping and marks screen dirty.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:LoadCurrentControls()`
* **Description:** Loads current control mapping and marks screen clean.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:MapControl(deviceId, controlId, controlName)`
* **Description:** Starts control mapping session via TheInputProxy:MapControl and shows mapping popup.
* **Parameters:** `deviceId` — integer device ID (0 = keyboard), `controlId` — control index, `controlName` — optional override string.
* **Returns:** None.

### `OptionsScreen:OnControlMapped(deviceId, controlId, inputId, hasChanged)`
* **Description:** Called after mapping completes; updates UI and marks dirty if mapping changed.
* **Parameters:** `deviceId`, `controlId`, `inputId`, `hasChanged`.
* **Returns:** None.

### `OptionsScreen:_BuildActionMenu()`
* **Description:** Builds action bar (Apply, Reset) menu.
* **Parameters:** None.
* **Returns:** Menu widget.

### `OptionsScreen:UpdateMenu()`
* **Description:** Enables/disables Apply and toggles Reset visibility based on tab and dirty state.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:OnDestroy()`
* **Description:** Cancels active mapping and removes event listeners.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:RefreshControls()`
* **Description:** Rebuilds control binding display (keyboard/controller lists).
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:_DoFocusHookups()`
* **Description:** Configures focus navigation between widgets.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:DoInit()`
* **Description:** Initializes input devices and device list.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:_BuildMenu(subscreener)`
* **Description:** Builds left-side tab menu (Controls, Advanced, Graphics, Settings, Languages).
* **Parameters:** `subscreener` — Subscreener instance.
* **Returns:** Menu widget.

### `OptionsScreen:_BuildLangButton(region_size, button_height, lang_id)`
* **Description:** Creates language selection button.
* **Parameters:** `region_size`, `button_height`, `lang_id`.
* **Returns:** ListItemBackground widget.

### `OptionsScreen:_BuildModLangButton(region_size, button_height, mod_data, last_item)`
* **Description:** Creates mod-language button (opens mod page URL).
* **Parameters:** `region_size`, `button_height`, `mod_data`, `last_item`.
* **Returns:** ListItemBackground or nil.

### `OptionsScreen:_BuildModLangButtonRow(region_size, button_height, language_mods, index)`
* **Description:** Builds a two-column row for mod-language buttons.
* **Parameters:** `region_size`, `button_height`, `language_mods`, `index`.
* **Returns:** row widget.

### `OptionsScreen:_BuildLanguages()`
* **Description:** Builds the Languages tab content.
* **Parameters:** None.
* **Returns:** LANG_ROOT widget.

### `BuildSectionTitle(text, region_size)`
* **Description:** Helper to create section header (gold text + divider).
* **Parameters:** `text`, `region_size`.
* **Returns:** title_root widget.

### `EnabledOptionsIndex(enabled)`
* **Description:** Returns `2` for true, `1` for false.
* **Parameters:** `enabled` — boolean.
* **Returns:** Integer `1` or `2`.

### `CreateTextSpinner(...)`, `CreateNumericSpinner(...)`, `CreateCheckBox(...)`
* **Description:** Helper constructors for option UI rows.
* **Parameters:** Label, tooltip, default value, spinner data, etc.
* **Returns:** spinner or button widget.

### `AddSpinnerTooltip(widget, tooltip, tooltipdivider)`
* **Description:** Attaches focus-based tooltip logic to widget (shows tooltip on focus).
* **Parameters:** `widget`, `tooltip`, `tooltipdivider`.
* **Returns:** None.

### `onlosefocus(is_enabled)`
* **Description:** Tooltip cleanup handler; hides tooltip on widget parent loss of focus.
* **Parameters:** `is_enabled` — boolean (unused).
* **Returns:** None.

### `MakeSpinnerTooltip(root)`
* **Description:** Creates and positions a text tooltip at (90, -275) with word wrap.
* **Parameters:** `root` — parent widget.
* **Returns:** Tooltip text widget.

### `OptionsScreen:_BuildGraphics()`
* **Description:** Constructs the Graphics tab UI with platform-aware spinner grouping and layout.
* **Parameters:** None.
* **Returns:** graphicsroot widget.

### `OptionsScreen:_BuildSettings()`
* **Description:** Constructs the Settings tab (audio, HUD, input, profanity, data collection).
* **Parameters:** None.
* **Returns:** settingsroot widget.

### `OptionsScreen:_BuildAdvancedSettings()`
* **Description:** Constructs the Advanced Settings tab (camera, crafting, sensitivity, cloud saves).
* **Parameters:** None.
* **Returns:** advancedsettingsroot widget.

### `OptionsScreen:_PopulateLayout(root, device)`
* **Description:** Creates a controller layout image with localized labels (PS4, Vita, XBONE, Switch).
* **Parameters:** `root`, `device` — DEVICE_* constant.
* **Returns:** layout widget.

### `OptionsScreen:_BuildController()`
* **Description:** Builds the console Controller tab UI.
* **Parameters:** None.
* **Returns:** controlsroot widget.

### `OptionsScreen:_BuildControlGroup(is_valid_fn, device_type, initial_device_id, control, index)`
* **Description:** Builds a control binding widget (label + binding button + optional unbind).
* **Parameters:** `is_valid_fn`, `device_type`, `initial_device_id`, `control`, `index`.
* **Returns:** group widget or nil.

### `OptionsScreen:_BuildSchemeGroup(is_valid_fn, device_type, initial_device_id, scheme, index)`
* **Description:** Builds a control scheme spinner widget.
* **Parameters:** `is_valid_fn`, `device_type`, `initial_device_id`, `scheme`, `index`.
* **Returns:** group widget or nil.

### `OptionsScreen:_CollectKeyboardControlWidgets()`
* **Description:** Builds keyboard control widgets into self.kb_controlwidgets.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:_CollectControllerControlWidgets()`
* **Description:** Builds controller control widgets into self.controller_controlwidgets and attaches gamepad handlers.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:_BuildControls()`
* **Description:** Builds the Controls tab with scrollable keyboard and controller lists.
* **Parameters:** None.
* **Returns:** controlsroot widget.

### `OptionsScreen:_RebuildControllerControls(focusschemeid)`
* **Description:** Rebuilds controller controls list while preserving scroll position and focus.
* **Parameters:** `focusschemeid` — identifier of control scheme to refocus on.
* **Returns:** None.

### `OptionsScreen:InitializeSpinners(first)`
* **Description:** Populates all spinners with current working values; optionally sets up change-tracking callbacks.
* **Parameters:** `first` — if true, enable change-indicator callbacks.
* **Returns:** None.

### `OptionsScreen:UpdateDisplaySpinner()`
* **Description:** Updates the display spinner with current fullscreen display ID.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:UpdateRefreshRatesSpinner()`
* **Description:** Updates refresh rate spinner for current display/mode.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:UpdateResolutionsSpinner()`
* **Description:** Updates resolution spinner; enables/disables dependent spinners based on fullscreen.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:ChangeControlScheme(schemeId, value)`
* **Description:** Updates working control scheme; handles side effects for CAM_AND_INV (auto-unmap Character Command Wheel).
* **Parameters:** `schemeId`, `value`.
* **Returns:** None.

### `OptionsScreen:OnBecomeActive()`
* **Description:** Activates screen: auto-focuses CONTROLS section if default_section is "CONTROLSCHEME", enables kit_puppet.
* **Parameters:** None.
* **Returns:** None.

### `OptionsScreen:OnBecomeInactive()`
* **Description:** Disables kit_puppet.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners
**Listens to:**
- `TheInput:AddControlMappingHandler(...)` — registers input mapping completion handler.
**Pushes:**
- `TheFrontEnd:PushScreen(screen)` — pushes modal dialogs (confirm revert/apply/graphics changes).
- `TheFrontEnd:PopScreen()` — pops dialogs on close/confirm.
- `TheFrontEnd:FadeBack(screen, callback)` — closes options screen and returns to prev_screen.
- `TheFrontEnd:FadeToScreen(screen, callback)` — switches to ModsScreen (only for mod language URLs).
- `TheInputProxy:MapControl(...)` — triggers async control mapping sequence.