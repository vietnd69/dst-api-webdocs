---
id: modsscreen
title: Modsscreen
description: Manages the in-game mod configuration screen, including mod list rendering, enable/disable toggling, updates, configuration, and applying changes with proper cleanup and reload workflows.
tags: [ui, mods, screen, workshop, configuration]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c6f845cb
system_scope: ui
---

# Modsscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
The `ModsScreen` class is a screen implementation in the DST UI system that presents a full-featured mod management interface. It supports switching between client and server mod lists, displaying mod metadata (icon, author, compatibility, warnings), toggling mods on/off, updating via workshop, opening mod links, configuration, cleaning, and batch updates. It tracks dirty state for unsaved changes, manages mod icon prefabs for safe reloading, handles controller and keyboard input, and orchestrates game restart and asset reloads when necessary.

## Usage example
```lua
local screen = ModsScreen(TheFrontEnd:GetPrevScreen())
TheFrontEnd:SetScreen(screen)
-- The screen automatically loads mod lists and starts workshop polling via constructor.
-- User interacts via UI buttons/controller. Changes are applied via screen:Apply().
-- If user cancels without saving, screen:Cancel() restores original mod state.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentmodtype` | `string` | `""` | Current tab ("client" or "server") being displayed |
| `dirty` | `boolean` | `false` | Indicates whether unsaved changes exist |
| `infoprefabs` | `table` | `{}` | List of mod icon prefabs currently loaded |
| `prev_screen` | `screen` | - | Reference to the screen being left; used for portal ownership transfer |
| `modnames_client`, `modnames_server` | `table` | `{}` | Lists of enabled client/server mod names |
| `modnames_client_dl`, `modnames_server_dl` | `table` | `{}` | Lists of disabled (downloaded) client/server mod names |
| `optionwidgets_client`, `optionwidgets_server` | `table` | `{}` | Arrays of mod list item widgets for client/server |
| `currentmodname` | `string` | `""` | Name of the currently selected mod |
| `last_client_modname`, `last_server_modname` | `string` | `""` | Last selected mod name per tab |
| `modconfigable`, `modupdateable`, `updateallenabled` | `boolean` | `false` | Flags indicating whether config/update buttons should be enabled |
| `updatetask` | `task` | `nil` | Periodic update polling task |
| `default_focus` | `widget` | `self.servermodsbutton` | Widget to focus on activation |
| `modlinks` | `table` | `{}` | Table of Top Mods links (top_mods links + featured button) |
| `featuredbutton` | `widget` | `nil` | Featured mod button widget |
| `controller_out_of_date` | `boolean` | `false` | Whether controller firmware is outdated |

## Main functions
### `Class(function(self, inst, prev_screen) ... end)`
* **Description:** Constructor for `ModsScreen`, subclass of `Screen`. Initializes UI layout, mod lists, event handlers, workshop update polling, and focus navigation.
* **Parameters:** 
  - `inst` — the entity instance (implicit via `Class`).
  - `prev_screen` — the screen being left; used for portal ownership transfer.
* **Returns:** None.

### `ModsScreen:OnDestroy()`
* **Description:** Cleanup handler when screen is destroyed. Restores portal ownership to `prev_screen` and calls base destructor.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:OnBecomeActive()`
* **Description:** Called when screen becomes active. Enables main menu and sets focus to appropriate widget (server list, client list, or buttons) depending on mod type and presence of controller.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:GenerateRandomPicks(num, numrange)`
* **Description:** Generates a table of `num` unique random integers in the range `[1, numrange]`.
* **Parameters:**
  - `num` — number of picks to generate.
  - `numrange` — inclusive upper bound for random numbers.
* **Returns:** Table of unique random integers.

### `ModsScreen:OnStatsQueried(result, isSuccessful, resultCode)`
* **Description:** Handles workshop stats query response. Parses JSON to populate `self.modlinks` with Top Mods titles and onClick callbacks, and sets `self.featuredbutton` if featured mod exists.
* **Parameters:**
  - `result` — JSON string response from `TheSim:QueryStats`.
  - `isSuccessful` — boolean indicating success.
  - `resultCode` — numeric status code.
* **Returns:** None.

### `ModsScreen:CreateTopModsPanel()`
* **Description:** Constructs the Top Mods section in the right panel (background, title, more button, five mod links, and featured mod section).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:DisableConfigButton(modWidget)`
* **Description:** Disables the config button, sets hover text to "no config", and hides the configuration indicator on the mod widget.
* **Parameters:**
  - `modWidget` — mod list item widget (optional); indicator is hidden on this widget if provided.
* **Returns:** None.

### `ModsScreen:EnableConfigButton(modWidget)`
* **Description:** Enables the config button, restores default config hover text, and shows the configuration indicator on the mod widget.
* **Parameters:**
  - `modWidget` — mod list item widget (optional); indicator is shown on this widget if provided.
* **Returns:** None.

### `ModsScreen:DisableUpdateButton(mode)`
* **Description:** Disables the update button and sets hover text based on `mode`. Common modes: `"uptodate"` or other (e.g., `"error"`).
* **Parameters:**
  - `mode` — string determining hover text.
* **Returns:** None.

### `ModsScreen:EnableUpdateButton(idx)`
* **Description:** Enables the update button and restores default hover text. `idx` is unused but included for future extensibility.
* **Parameters:**
  - `idx` — index of mod in list (not used in current implementation).
* **Returns:** None.

### `ModsScreen:CreateDetailPanel()`
* **Description:** Builds or rebuilds the mod details panel. If mods exist for the current type, populates fields: icon, name, author, compatibility, description, warning, and enable toggle state. Otherwise shows "no mods of this type" message.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:StartWorkshopUpdate()`
* **Description:** Initiates workshop stats query (`TheSim:QueryStats`) and schedules periodic workshop updates via `UpdateForWorkshop`.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:UpdateForWorkshop()`
* **Description:** Queries `KnownModIndex` to refresh mod lists (`modnames_client`, `modnames_server`, etc.), detects changes, rebuilds mod list widgets, updates download indicators, and refreshes the detail panel.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:SetModsList(listtype)`
* **Description:** Switches active mod type tab to `"client"` or `"server"`. Updates title, focuses correct mod list or button, and displays details for selected mod.
* **Parameters:**
  - `listtype` — string, `"client"` or `"server"`.
* **Returns:** None.

### `ModsScreen:DoFocusHookups()`
* **Description:** Configures focus navigation for all interactive widgets (mod lists, buttons, mod links, update/clean buttons, etc.), including controller-specific logic.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:OnControl(control, down)`
* **Description:** Handles screen-wide input. Supports:
  - `CONTROL_CANCEL` → cancel screen,
  - `CONTROL_MENU_START` → apply mod changes,
  - `CONTROL_MENU_BACK` → clean all mods,
  - `CONTROL_MENU_MISC_2` → update all mods.
* **Parameters:**
  - `control` — enum key/controller control ID.
  - `down` — boolean: true on key press, false on release.
* **Returns:** Boolean: true if event handled, else false.

### `ModsScreen:RefreshControls()`
* **Description:** Re-applies focus hookups to update navigation after dynamic UI changes (e.g., list rebuild).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:GetBestModStatus(modname)`
* **Description:** Returns status string for a mod based on enabled state and known issues: `"WORKING_NORMALLY"`, `"DISABLED_ERROR"`, or `"DISABLED_MANUAL"`.
* **Parameters:**
  - `modname` — string mod identifier.
* **Returns:** String status.

### `ModsScreen:ShowModDetails(idx, client_mod)`
* **Description:** Highlights selected mod in list and populates detail panel with icon, name, author, description, compatibility, warning, and enable toggle state. Updates config/update button states accordingly.
* **Parameters:**
  - `idx` — index into current mod list (`client_mod` determines which list).
  - `client_mod` — boolean: true for client list, false for server list.
* **Returns:** None.

### `ModsScreen:OnConfirmEnable(restart, modname)`
* **Description:** Toggles enabled state for `modname`. If enabling and mod is incompatible, shows compatibility warning. Triggers game restart if required by `restart` flag.
* **Parameters:**
  - `restart` — boolean: whether to restart after enable/disable.
  - `modname` — string mod identifier.
* **Returns:** None.

### `ModsScreen:EnableCurrent(idx)`
* **Description:** Toggles enable/disable state of currently selected mod. Prompts for restart if required.
* **Parameters:**
  - `idx` — index into current mod list.
* **Returns:** None.

### `ModsScreen:ModLinkCurrent()`
* **Description:** Opens the workshop/forum link for the currently selected mod using `ModManager:GetLinkForMod`.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:MoreMods()`
* **Description:** Opens Klei forums mod page in the system browser.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:MoreWorkshopMods()`
* **Description:** Opens Steam Workshop page for DST in the system browser.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:MakeDirty()`
* **Description:** Marks screen as having unsaved changes.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:MakeClean()`
* **Description:** Marks screen as clean (no unsaved changes).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:IsDirty()`
* **Description:** Returns whether the screen has unsaved changes.
* **Parameters:** None.
* **Returns:** Boolean.

### `ModsScreen:Cancel(extrapop)`
* **Description:** Handles cancel action. If dirty, prompts to discard changes; otherwise restores cached mod state and exits screen with fade.
* **Parameters:**
  - `extrapop` — boolean: whether an extra screen pop is needed.
* **Returns:** None.

### `ModsScreen:Apply()`
* **Description:** Applies mod changes: saves mod state, unloads prefabs, forces asset reset (`TheSim:ResetAssets`), and resets simulation (`TheSim:ResetSimulation`).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:ConfigureSelectedMod()`
* **Description:** Opens configuration screen for the currently selected mod if it is configurable (`modconfigable`).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:UpdateSelectedMod()`
* **Description:** Triggers workshop update for the currently selected mod if updateable (`modupdateable`).
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:LoadModInfoPrefabs(prefabtable)`
* **Description:** Loads prefabs from `prefabtable` into the engine for mod icon rendering.
* **Parameters:**
  - `prefabtable` — table of prefab names to load.
* **Returns:** None.

### `ModsScreen:UnloadModInfoPrefabs(prefabtable)`
* **Description:** Unloads prefabs in `prefabtable` and clears the table.
* **Parameters:**
  - `prefabtable` — table of prefab names to unload.
* **Returns:** None.

### `ModsScreen:ReloadModInfoPrefabs()`
* **Description:** Safely reloads mod icon prefabs: loads new prefabs first, then unloads old ones, preventing refcount issues.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:GetHelpText()`
* **Description:** Returns localized help string describing key/controller controls for the screen.
* **Parameters:** None.
* **Returns:** String of control help.

### `ModsScreen:CleanAllButton()`
* **Description:** Shows confirmation dialog for cleaning all mods; if confirmed, runs `TheSim:CleanAllMods`, disables all mods, saves state, and triggers reset.
* **Parameters:** None.
* **Returns:** None.

### `ModsScreen:UpdateAllButton()`
* **Description:** Shows confirmation dialog for updating all outdated mods; if confirmed, runs `TheSim:UpdateWorkshopMod` for each outdated mod.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners
- **Listens to:** None explicitly — no `inst:ListenForEvent` calls are present in the source.
- **Pushes:** None explicitly — no `inst:PushEvent` calls are present in the source.