---
id: frontend
title: Frontend
description: Manages the UI system, including screen stack, fading, input routing, help text, and debug tools in Don't Starve Together.
tags: [ui, screen, input, debug, fade]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3f8070fa
system_scope: ui
---

# Frontend

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The Frontend component serves as the central UI coordinator in Don't Starve Together, managing the screen stack, overlay systems (fading, title animations), input routing, help text generation, and debug UI tools like IMGUI and debug panels. It owns the `screenstack`, input-related repeat timers, save indicators, and global UI widgets (e.g., server pause, console log, help text), providing a unified layer between game events and widget interaction.

## Usage example
```lua
local front = TheFrontEnd

-- Push a new screen onto the stack
front:PushScreen(MyScreen())

-- Fade between screens
front:FadeToScreen(front:GetActiveScreen(), function() return MyNewScreen() end, nil, "white")

-- Show save indicator during a save operation
front:ShowSavingIndicator()
DoSave()
front:HideSavingIndicator()

-- Update fade manually (e.g., for custom effects)
front:SetFadeLevel(0.5, 0.5, 1.0)

-- Toggle IMGUI debug panel
front:ToggleImgui(MyDebugNodeClass)
```

## Dependencies & tags
**Components used:** None directly attached via `AddComponent`. Uses other widgets, screen classes, and external modules including: `DebugPanel2`, `DebugEntity`, `DebugNodes`, `DebugMenu`, `ConsoleScreen`, `DebugMenuScreen`, `PopupDialogScreen`, `PopupDialogScreenRedux`, `Text`, `UIAnim`, `Image`, `ServerPauseWidget`, `SoundEmitter`, `GraphicsOptions`, `TwitchOptions`, `AccountManager`, `MotdManager`.  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.screenstack` | Table | `{}` | Stack of active screen widgets. |
| `self.screenroot`, `self.overlayroot` | Widget | — | Root containers for screen and overlay widgets. |
| `self.consoletext` | Text | — | Console output text widget. |
| `self.serverpausewidget` | ServerPauseWidget | — | Widget showing server pause reason. |
| `self.blackoverlay`, `self.topblackoverlay`, etc. | Image | — | Fade overlay images (bottom/top layer). |
| `self.helptext`, `self.helptextbg`, `self.helptexttext`, `self.helptextstring` | Widget/Text | — | Help text display components. |
| `self.saving_indicator` | UIAnim | — | Save indicator (console only). |
| `self.title`, `self.subtitle` | Text | — | Title/subtitle widgets for title screen. |
| `self.gameinterface` | Entity | — | Entity hosting global components (sound, graphics, twitch, account). |
| `self.alpha`, `self.fade_*`, `self.fadedir`, etc. | Various | — | Fade state variables (alpha, direction, timers, callbacks). |
| `self.repeat_time`, `self.scroll_repeat_time`, etc. | Number | — | Input repeat delay timers. |
| `self.updating_widgets` | Table | `{}` | List of widgets to update per frame. |
| `self.num_pending_saves`, `self.save_indicator_time_left`, etc. | Number/Boolean | — | Save-related state flags. |
| `self.debug_panels`, `self.imgui`, `self.debugMenu` | Table/Boolean | — | Debug panel/IMGUI state (if `CAN_USE_DBUI`). |
| `self.match_results` | Table | `{}` | Per-game results to pass after server reset. |
| `self.MotdManager` | MotdManager | — | Message of the day manager. |
| `self.focus_locked` | Boolean | `false` | Whether focus is locked. |
| `self.tracking_mouse` | Boolean | `true` | Whether mouse is being tracked for hover. |
| `self.offline` | Boolean | `false` | Offline mode flag. |
| `self.topFadeHidden` | Boolean | — | Whether top fade overlays are hidden. |

## Main functions
### `FrontEnd:ShowSavingIndicator()`
* **Description:** Shows the save indicator if saving is enabled and indicator exists (console only). Increments `num_pending_saves`. No-op if `self.saving_indicator` is nil or saving disabled.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:HideSavingIndicator()`
* **Description:** Decrements `num_pending_saves` when a save completes. No-op if `self.saving_indicator` is nil or `num_pending_saves <= 0`.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:HideTopFade()`
* **Description:** Hides all top-layer fade overlays (`topblackoverlay`, `topwhiteoverlay`, `topvigoverlay`, `topswipeoverlay`) and sets `self.topFadeHidden = true`.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:ShowTopFade()`
* **Description:** Shows top-layer fade overlays based on `self.fade_type` and `self.topFadeHidden`.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:GetFocusWidget()`
* **Description:** Returns the deepest focused widget in the top screen.
* **Parameters:** None
* **Returns:** Widget or `nil` if screen stack is empty.

### `FrontEnd:GetIntermediateFocusWidgets()`
* **Description:** Returns a list of widgets from the focus chain (excluding deepest focus).
* **Parameters:** None
* **Returns:** Array of Widgets, or `{}`.

### `FrontEnd:GetHelpText()`
* **Description:** Collects and concatenates help text from active screen, intermediate widgets, and focused widget, respecting exclusivity.
* **Parameters:** None
* **Returns:** String — help text or `""`.

### `FrontEnd:UpdateHelpTextSize(num_lines)`
* **Description:** Adjusts help text background scale, widget size, and region size based on line count and splitscreen scale.
* **Parameters:**  
  * `num_lines` — number of lines of text.
* **Returns:** None

### `FrontEnd:StopTrackingMouse(autofocus)`
* **Description:** Sets `self.tracking_mouse = false`. Optionally sets default focus on active screen.
* **Parameters:**  
  * `autofocus` — boolean — whether to set default focus.
* **Returns:** None

### `FrontEnd:IsControlsDisabled()`
* **Description:** Checks if controls are disabled (fade level > 0, fading out, or global error widget present).
* **Parameters:** None
* **Returns:** boolean — true if controls disabled.

### `FrontEnd:OnFocusMove(dir, down)`
* **Description:** Handles controller D-pad input for UI focus navigation. Plays mouseover sound and stops mouse tracking.
* **Parameters:**  
  * `dir` — direction enum (MOVE_UP, etc.)  
  * `down` — boolean — key press (`true`) or release (`false`).
* **Returns:** boolean — true if handled.

### `FrontEnd:OnControl(control, down)`
* **Description:** Handles generic control input (buttons, keys). Routes to focused screen, opens debug console/menu, toggles log/debug render, etc. Returns `false` if controls are disabled.
* **Parameters:**  
  * `control` — control enum (e.g., `CONTROL_PRIMARY`, `CONTROL_OPEN_DEBUG_CONSOLE`)  
  * `down` — boolean — key press/release.
* **Returns:** boolean — true if handled.

### `FrontEnd:ShowTitle(text, subtext)`
* **Description:** Sets and shows title/subtitle widgets and starts tile fade-in animation.
* **Parameters:**  
  * `text` — title string  
  * `subtext` — subtitle string
* **Returns:** None

### `FrontEnd:DoTitleFade(dt)`
* **Description:** Animates title/subtitle alpha using easing (`inOutCubic`) based on `fade_title_time`. Triggers fade-out when fully in.
* **Parameters:**  
  * `dt` — delta time (clamped to `1/30`).
* **Returns:** None

### `FrontEnd:StartTileFadeIn()`
* **Description:** Begins title fade-in. Sets flags and resets time.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:StartTileFadeOut()`
* **Description:** Begins title fade-out. Sets flags.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:HideTitle()`
* **Description:** Hides title/subtitle and resets fade flags/time.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:LockFocus(lock)`
* **Description:** Sets `self.focus_locked` flag.
* **Parameters:**  
  * `lock` — boolean
* **Returns:** None

### `FrontEnd:SendScreenEvent(type, message)`
* **Description:** Forwards event to top screen.
* **Parameters:**  
  * `type` — event type  
  * `message` — payload string
* **Returns:** None

### `FrontEnd:GetSound()`
* **Description:** Returns the SoundEmitter component on `self.gameinterface.entity`.
* **Parameters:** None
* **Returns:** SoundEmitter instance.

### `FrontEnd:GetGraphicsOptions()`
* **Description:** Returns the GraphicsOptions component on `self.gameinterface.entity`.
* **Parameters:** None
* **Returns:** GraphicsOptions instance.

### `FrontEnd:GetTwitchOptions()`
* **Description:** Returns the TwitchOptions component on `self.gameinterface.entity`.
* **Parameters:** None
* **Returns:** TwitchOptions instance.

### `FrontEnd:GetAccountManager()`
* **Description:** Returns the AccountManager component on `self.gameinterface.entity`.
* **Parameters:** None
* **Returns:** AccountManager instance.

### `FrontEnd:SetFadeLevel(alpha, time, time_total)`
* **Description:** Updates overlay tints and alpha based on fade type (`white`, `black`, `swipe`, `alpha`). Handles top/bottom overlays and widget-level alpha.
* **Parameters:**  
  * `alpha` — fade intensity (`0`–`1`)  
  * `time`, `time_total` — fade progress (used for swipe animation).
* **Returns:** None

### `FrontEnd:GetFadeLevel()`
* **Description:** Returns current fade alpha.
* **Parameters:** None
* **Returns:** number — `self.alpha`.

### `FrontEnd:DoFadingUpdate(dt)`
* **Description:** Advances fade animation using easing (`inOutCubic`/`outCubic`) based on `self.fadedir` and `self.fade_time`. Calls callback on completion.
* **Parameters:**  
  * `dt` — delta time.
* **Returns:** None

### `FrontEnd:UpdateConsoleOutput()`
* **Description:** Updates console text with output from `GetConsoleOutputList()`.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:_RefreshRepeatDelay(control)`
* **Description:** Adjusts `self.repeat_time` based on input velocity and `repeat_reps` (ninja > fast > base).
* **Parameters:**  
  * `control` — control enum.
* **Returns:** None

### `FrontEnd:Update(dt)`
* **Description:** Main update loop: handles IMGUI polling, cheater reload, saving indicator, console log, fading, title animation, screen updates, input repeat timers (spinner/scroll/menu nav), hover focus, IMGUI rendering, widget updates, and help text display.
* **Parameters:**  
  * `dt` — delta time.
* **Returns:** None

### `FrontEnd:PushShowHelpTextForEverything()`
* **Description:** Increments `self.showhelptextforeverything` counter (used for debug/show-all-help).
* **Parameters:** None
* **Returns:** None

### `FrontEnd:PopShowHelpTextForEverything()`
* **Description:** Decrements `self.showhelptextforeverything` counter.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:DoHoverFocusUpdate(manual_update)`
* **Description:** Updates hover/focus state under mouse when tracking mouse is enabled.
* **Parameters:**  
  * `manual_update` — boolean — whether to update entities under mouse.
* **Returns:** None

### `FrontEnd:StartUpdatingWidget(w)`
* **Description:** Adds widget `w` to `self.updating_widgets` set for per-frame updates.
* **Parameters:**  
  * `w` — Widget
* **Returns:** None

### `FrontEnd:StopUpdatingWidget(w)`
* **Description:** Removes widget `w` from `self.updating_widgets`.
* **Parameters:**  
  * `w` — Widget
* **Returns:** None

### `FrontEnd:InsertScreenAtIndex(screen, idx)`
* **Description:** Inserts screen into stack and tree at specified index; maintains front-most ordering.
* **Parameters:**  
  * `screen` — Screen widget  
  * `idx` — index
* **Returns:** None

### `FrontEnd:InsertScreenUnderTop(screen)`
* **Description:** Inserts screen directly under top of stack.
* **Parameters:**  
  * `screen` — Screen widget
* **Returns:** None

### `FrontEnd:PushScreen(screen)`
* **Description:** Pushes a new screen onto the stack: activates it, sets focus, calls `OnBecomeActive`, adjusts serverpausewidget offset.
* **Parameters:**  
  * `screen` — Screen widget
* **Returns:** None

### `FrontEnd:ClearScreens()`
* **Description:** Destroys and removes all screens from stack.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:ShowConsoleLog()`
* **Description:** Shows console text widget.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:HideConsoleLog()`
* **Description:** Hides console text widget.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:SetConsoleLogPosition(x, y, z)`
* **Description:** Sets console text position.
* **Parameters:**  
  * `x, y, z` — position coordinates
* **Returns:** None

### `FrontEnd:DoFadeIn(time_to_take)`
* **Description:** Starts fade-in animation.
* **Parameters:**  
  * `time_to_take` — fade duration
* **Returns:** None

### `FrontEnd:Fade(in_or_out, time_to_take, cb, fade_delay_time, delayovercb, fadeType)`
* **Description:** Starts fade animation (in/out). Sets fade state variables and top overlays.
* **Parameters:**  
  * `in_or_out` — FADE_IN / FADE_OUT  
  * `time_to_take` — duration  
  * `cb` — completion callback  
  * `fade_delay_time`, `delayovercb` — optional delay parameters  
  * `fadeType` — `"white"`, `"black"`, `"swipe"`, `"alpha"`
* **Returns:** None

### `FrontEnd:FadeToScreen(existing_screen, new_screen_fn, fade_complete_cp, fade_type)`
* **Description:** Fades out, pushes new screen (via `new_screen_fn`), then fades in.
* **Parameters:**  
  * `existing_screen` — screen to hide  
  * `new_screen_fn` — function returning new screen  
  * `fade_complete_cp` — optional callback  
  * `fade_type` — fade type string
* **Returns:** None

### `FrontEnd:FadeBack(fade_complete_cb, fade_type, fade_out_complete_cb)`
* **Description:** Fades out, pops screen, fades in, shows active screen.
* **Parameters:**  
  * `fade_complete_cb` — callback after full fade  
  * `fade_type` — fade type  
  * `fade_out_complete_cb` — callback after fade-out
* **Returns:** None

### `FrontEnd:PopScreen(screen)`
* **Description:** Pops a specific or top screen: destroys it, calls `OnBecomeInactive`, sets focus to new top, updates serverpausewidget offset.
* **Parameters:**  
  * `screen` — optional specific screen to pop
* **Returns:** None

### `FrontEnd:ClearFocus()`
* **Description:** Focuses top screen (if any).
* **Parameters:** None
* **Returns:** None

### `FrontEnd:GetActiveScreen()`
* **Description:** Returns top screen or `nil`.
* **Parameters:** None
* **Returns:** Screen widget or `nil`.

### `FrontEnd:GetOpenScreenOfType(screenname)`
* **Description:** Returns first screen in stack with matching name (reverse order).
* **Parameters:**  
  * `screenname` — string
* **Returns:** Screen or `nil`.

### `FrontEnd:GetScreenStackSize()`
* **Description:** Returns `#self.screenstack`.
* **Parameters:** None
* **Returns:** number — stack size.

### `FrontEnd:ShowScreen(screen)`
* **Description:** Clears screens, then pushes `screen`.
* **Parameters:**  
  * `screen` — Screen widget
* **Returns:** None

### `FrontEnd:SetForceProcessTextInput(takeText, widget)`
* **Description:** Steals text input processing for a specific widget (e.g., text box).
* **Parameters:**  
  * `takeText` — boolean  
  * `widget` — widget to handle text input
* **Returns:** None

### `FrontEnd:OnRawKey(key, down)`
* **Description:** Routes raw key input to focused screen or debug handler.
* **Parameters:**  
  * `key` — key enum  
  * `down` — boolean
* **Returns:** boolean — true if handled.

### `FrontEnd:OnTextInput(text)`
* **Description:** Routes text input to focused screen or active text processor widget.
* **Parameters:**  
  * `text` — string
* **Returns:** boolean — true if handled.

### `FrontEnd:GetProportionalHUDScale()`
* **Description:** Returns HUD scale factor based on profile and resolution using linear easing and optional resolution scaling.
* **Parameters:** None
* **Returns:** number — scale factor.

### `FrontEnd:GetHUDScale()`
* **Description:** Returns HUD scale factor (simplified version).
* **Parameters:** None
* **Returns:** number — scale factor.

### `FrontEnd:GetCraftingMenuScale()`
* **Description:** Returns crafting menu scale factor.
* **Parameters:** None
* **Returns:** number — scale factor.

### `FrontEnd:UpdateRepeatDelays()`
* **Description:** Updates repeat delay values based on crafting/inventory sensitivity profiles.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:OnMouseButton(button, down, x, y)`
* **Description:** Handles mouse click. Sets tracking, routes to screen, and optionally to debug handler.
* **Parameters:**  
  * `button`, `down`, `x`, `y` — mouse event parameters
* **Returns:** boolean — true if handled.

### `FrontEnd:OnMouseMove(x, y)`
* **Description:** Tracks mouse movement for hover focus updates.
* **Parameters:**  
  * `x`, `y` — mouse coordinates
* **Returns:** boolean — true (always handled).

### `FrontEnd:OnSaveLoadError(operation, filename, status)`
* **Description:** Shows appropriate save/load error dialog (damaged, failed) with retry/overwrite/cancel options.
* **Parameters:**  
  * `operation` — `SAVELOAD.OPERATION` enum  
  * `filename` — string  
  * `status` — `SAVELOAD.STATUS` enum
* **Returns:** None

### `FrontEnd:IsScreenInStack(screen)`
* **Description:** Checks if `screen` is in `self.screenstack`.
* **Parameters:**  
  * `screen` — Screen widget
* **Returns:** boolean.

### `FrontEnd:SetOfflineMode(isOffline)`
* **Description:** Sets `self.offline` flag.
* **Parameters:**  
  * `isOffline` — boolean
* **Returns:** None

### `FrontEnd:GetIsOfflineMode()`
* **Description:** Gets `self.offline` flag.
* **Parameters:** None
* **Returns:** boolean.

### `FrontEnd:ToggleImgui(node)`
* **Description:** Enables/disables IMGUI and creates debug panel if not already open. Shows warning dialog if threaded render is on.
* **Parameters:**  
  * `node` — debug panel node class or `nil`
* **Returns:** None

### `FrontEnd:IsDebugPanelOpen(nodename)`
* **Description:** Checks if a debug panel for `nodename` is open.
* **Parameters:**  
  * `nodename` — string
* **Returns:** boolean.

### `FrontEnd:CloseDebugPanel(nodename)`
* **Description:** Closes and removes debug panel by `nodename`.
* **Parameters:**  
  * `nodename` — string
* **Returns:** None

### `FrontEnd:CreateDebugPanel(node)`
* **Description:** Creates and opens a new debug panel (via `DebugPanel2`). Enables IMGUI if needed.
* **Parameters:**  
  * `node` — debug panel node
* **Returns:** DebugPanel2 instance.

### `FrontEnd:FindOpenDebugPanel(node)`
* **Description:** Returns first open debug panel of type `node` (via `:is_a`).
* **Parameters:**  
  * `node` — debug panel node class
* **Returns:** DebugPanel2 or `nil`.

### `FrontEnd:GetNumberOpenDebugPanels(node)`
* **Description:** Counts open debug panels of type `node`.
* **Parameters:**  
  * `node` — debug panel node class
* **Returns:** number.

### `FrontEnd:GetSelectedDebugPanel()`
* **Description:** Returns currently selected debug panel.
* **Parameters:** None
* **Returns:** DebugPanel2 or `nil`.

### `FrontEnd:SetImguiFontSize(font_size)`
* **Description:** Sets IMGUI font size, saves to profile.
* **Parameters:**  
  * `font_size` — number
* **Returns:** None

### `FrontEnd:OnRenderImGui(dt)`
* **Description:** Renders all debug panels in a loop, handling errors, auto-closing panels, and rendering `self.debugMenu`.
* **Parameters:**  
  * `dt` — delta time
* **Returns:** None

### `FrontEnd:IsImGuiWindowFocused(flags)`
* **Description:** Checks IMGUI window focus state.
* **Parameters:**  
  * `flags` — imgui focus flags (optional)
* **Returns:** boolean.

### `FrontEnd:SetServerPauseText(source)`
* **Description:** Updates server pause widget text.
* **Parameters:**  
  * `source` — string
* **Returns:** None

### `FrontEnd:SetGlobalErrorWidget(...)`
* **Description:** Caches error and shows global error widget if not already active.
* **Parameters:**  
  * `...` — variadic arguments
* **Returns:** None

### `FrontEnd:ResetGlobalErrorWidget()`
* **Description:** Resets cached global error state.
* **Parameters:** None
* **Returns:** None

### `FrontEnd:CheckCachedError()`
* **Description:** Pushes cached error as widget if none exists.
* **Parameters:** None
* **Returns:** None

## Events & listeners
**Listens to:** None explicitly in this chunk  
**Pushes:** None explicitly in this chunk