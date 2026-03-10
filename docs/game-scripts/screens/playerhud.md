---
id: playerhud
title: Playerhud
description: Manages the player's Heads-Up Display (HUD), including UI overlay hierarchy, screen transitions, input handling, target indicators, and status effect visuals.
tags: [ui, player, inventory, combat, environment]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 9b692978
system_scope: player
---

# Playerhud

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Playerhud` is the primary UI component for the player entity, responsible for constructing and managing the full Heads-Up Display hierarchy—including overlays (vignette, dropsplash, weather, sanity, etc.), screen modals (crafting, spell wheel, wardrobe, inspect screen), container widgets (chest UI), and target indicators. It handles input delegation via `PlayerController`, coordinates screen focus and priority (e.g., pause vs. crafting), and updates visuals in real-time based on game state, sanity, and environmental conditions.

## Usage example
```lua
-- Open the crafting menu for the player
local player = TheInput:GetPlayer()
if player ~= nil and player.HUD ~= nil then
    player.HUD:OpenCrafting("cooking")
end

-- Show a floating damage number at world position
local pos = player.transform:GetWorldPosition()
player.HUD:ShowPopupNumber(-10, 1, pos, 1.5, {r=1, g=0, b=0})

-- Toggle HUD visibility
player.HUD:Hide() -- or player.HUD:Show()

-- Open spell wheel from spellbook
local spellbook = player.components.spellbook
if spellbook ~= nil and spellbook:CanBeUsedBy(player) then
    player.HUD:OpenSpellWheel(spellbook.inst, spellbook.items, 2, 1.5, {bgimage="images/spellwheel_bg.tex"})
end
```

## Dependencies & tags
**Components used:**
- `playercontroller` — control priority, targeting state, and cancellation (`IsEnabled`, `IsAOETargeting`, `GetControllerTarget`, `CancelAOETargeting`, `ShouldPlayerHUDControlBeIgnored`, `OnUpdate`)
- `raindomewatcher` — rain dome status (`IsUnderRainDome`)
- `spellbook` — spell selection, sounds, and lifecycle (`CanBeUsedBy`, `SelectSpell`, `closeonexecute`, `closesound`, `executesound`, `focussound`, `opensound`)
- `skinner_beefalo` — referenced in comments only (no runtime use)

**Tags:**
- `"invincible"` — used to display godmode indicator
- `"dressable"` — determines opening of dressup avatar popup in `OpenPlayerInfoScreen`
- `"playerghost"` — forces `ShowPlayerStatusScreen` when opening command wheel
- `"fueldepleted"` — used to invalidate spell wheel when spellbook is out of fuel

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `overlayroot` | `Widget` | — | Root widget for visual overlays |
| `under_root` | `Widget` | — | Root for elements under the main HUD layer |
| `root` | `Widget` | — | Root widget for the HUD display |
| `over_root` | `Widget` | — | Root for elements above the main HUD layer |
| `popupstats_root` | `Widget` | — | Root for floating numbers and effects |
| `shown` | `boolean` | `true` | HUD visibility state |
| `serverpaused` | `boolean` | `false` | Internal server pause state |
| `modfocus` | `table` | `{}` | Tracks mod focus identifiers |
| `targetindicators` | `table` | `{}` | List of active `TargetIndicator` widgets |
| `controls` | `table` | — | Controls instance managing UI widgets |
| `playerstatusscreen` | `PlayerStatusScreen?` | `nil` | Currently active player status screen |
| `dressupAvatarPopUpcreen` | `DressupAvatarPopup?` | `nil` | (typo) Dressup avatar popup |
| `writeablescreen` | `WriteableWidget?` | `nil` | Currently open writeable screen |
| `ringmeter` | `RingMeter?` | `nil` | Ring timer widget |

## Main functions
### `PlayerHud:CreateOverlays(owner)`
* **Description:** Builds and configures the visual overlay hierarchy (vignette, dropsplash, weather overlays, sanity clouds, miasma, lunar burn, rain dome, rose glasses). Instantiates and adds overlay widgets to appropriate root containers.
* **Parameters:**  
  - `owner`: Player entity — provides sanity, status, and environment state to drive which overlays appear.
* **Returns:** None

### `PlayerHud:OnDestroy()`
* **Description:** Cleans up the HUD upon destruction — primarily kills `playerstatusscreen` if open.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OnLoseFocus()`
* **Description:** Handles loss of input focus — closes all screens/modals, hides hover, resets mouse visibility, clears focus flags.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OnGainFocus()`
* **Description:** Handles gain of input focus — enables mouse (if no controller), updates HUD size, shows hover, re-applies focus flags, toggles command wheel.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:Toggle(targetindicators)`
* **Description:** Toggles HUD visibility and optionally all target indicators.
* **Parameters:**  
  - `targetindicators`: Boolean — if truthy, toggles visibility of all entries in `self.targetindicators`.
* **Returns:** None

### `PlayerHud:Hide()`
* **Description:** Hides the HUD (`self.shown = false`) and calls `self.root:Hide()`. Also closes vote dialog and command picker for player status screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:Show()`
* **Description:** Shows the HUD (`self.shown = true`) and calls `self.root:Show()`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:GetFirstOpenContainerWidget()`
* **Description:** Returns the first open `ContainerWidget` in `self.controls.containers`.
* **Parameters:** None  
* **Returns:** First container widget or `nil`

### `PlayerHud:CloseContainer(container, side)`
* **Description:** Closes a container. If `side == true` and (controller attached or integrated backpack enabled), sets `rebuild_pending = true` instead of closing.
* **Parameters:**  
  - `container`: Container entity — returns early if `nil`.  
  - `side`: Boolean — controls deferred close.
* **Returns:** None

### `PlayerHud:OpenContainer(container, side)`
* **Description:** Opens a container via `ContainerWidget`. If `side == true` and (controller attached or integrated backpack enabled), sets `rebuild_pending = true`.
* **Parameters:**  
  - `container`: Container entity.  
  - `side`: Boolean.
* **Returns:** None

### `PlayerHud:TogglePlayerInfoPopup(player_name, data, show_net_profile, force)`
* **Description:** Closes dressup popup if open, then opens `PlayerInfoPopupScreen`.
* **Parameters:**  
  - `player_name`, `data`, `show_net_profile`, `force`: Passed through to `OpenPlayerInfoScreen`.
* **Returns:** None

### `PlayerHud:ShowEndOfMatchPopup(data)`
* **Description:** Creates and displays `EndOfMatchPopup` after a delay (2.5s on victory, 0 otherwise).
* **Parameters:**  
  - `data`: Table containing `victory` boolean.
* **Returns:** None

### `PlayerHud:OpenScreenUnderPause(screen)`
* **Description:** Inserts `screen` under top screen if pause is active; otherwise pushes to front end.
* **Parameters:**  
  - `screen`: Screen instance.
* **Returns:** None

### `PlayerHud:OpenItemManagerScreen()`
* **Description:** Pops gift item popup if valid, then opens it for first unopened item (if any).
* **Parameters:** None  
* **Returns:** `true` if opened, `false` otherwise

### `PlayerHud:CloseItemManagerScreen()`
* **Description:** Cancels pending `recentgiftstask` and pops gift popup.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:CloseCrafting(silent)`
* **Description:** Closes crafting menu; plays close sound unless `silent == true`.
* **Parameters:**  
  - `silent`: Boolean — suppresses sound.
* **Returns:** None

### `PlayerHud:OpenCrafting(search)`
* **Description:** Opens crafting menu; closes spell wheel, controller inventory, command wheel, and plays open sound.
* **Parameters:**  
  - `search`: Search string passed to crafting menu.
* **Returns:** None

### `PlayerHud:OpenWardrobeScreen(target)`
* **Description:** Opens wardrobe/groomer/scarecrow/Hermit Crab popup depending on target and game mode.
* **Parameters:**  
  - `target`: Optional target entity (e.g., scarecrow).
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseWardrobeScreen()`
* **Description:** Closes wardrobe screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenGroomerScreen(target, filter)`
* **Description:** Opens beefalo grooming popup.
* **Parameters:**  
  - `target`: Beefalo entity (asserted non-nil).  
  - `filter`: Optional filter table.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseGroomerScreen()`
* **Description:** Closes grooming popup.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenHermitCrabWardrobeScreen(target, filter)`
* **Description:** Opens hermit crab wardrobe popup.
* **Parameters:**  
  - `target`, `filter`: As above.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseHermitCrabWardrobeScreen()`
* **Description:** Closes hermit crab wardrobe popup.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenCookbookScreen()`
* **Description:** Opens cookbook screen.
* **Parameters:** None  
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseCookbookScreen()`
* **Description:** Closes cookbook screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenPlantRegistryScreen()`
* **Description:** Opens plant registry screen.
* **Parameters:** None  
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:ClosePlantRegistryScreen()`
* **Description:** Closes plant registry screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenPlayerInfoScreen(player_name, data, show_net_profile, force)`
* **Description:** Opens `DressupAvatarPopup` if target has `"dressable"` tag, otherwise opens `PlayerInfoPopupScreen`.
* **Parameters:**  
  - `player_name`: Player name string.  
  - `data`: Table with player data.  
  - `show_net_profile`: Boolean — show profile if networked player.  
  - `force`: Boolean — force open if screen already exists.
* **Returns:** `true` if `PlayerInfoPopupScreen` was opened

### `PlayerHud:ClosePlayerInfoScreen()`
* **Description:** Closes `PlayerInfoPopupScreen`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenScrapbookScreen()`
* **Description:** Opens scrapbook screen.
* **Parameters:** None  
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseScrapbookScreen()`
* **Description:** Closes scrapbook screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenInspectaclesScreen()`
* **Description:** Opens inspectacles screen.
* **Parameters:** None  
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseInspectaclesScreen()`
* **Description:** Closes inspectacles screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenBalatroScreen(target, jokers, cards)`
* **Description:** Opens Balatro screen.
* **Parameters:**  
  - `target`: Target entity.  
  - `jokers`: Jokers list.  
  - `cards`: Cards list.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseBalatroScreen()`
* **Description:** Closes Balatro screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenPumpkinCarvingScreen(target)`
* **Description:** Opens pumpkin carving screen.
* **Parameters:**  
  - `target`: Entity (pumpkin) to carve.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:ClosePumpkinCarvingScreen()`
* **Description:** Closes pumpkin carving screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenPumpkinHatCarvingScreen(target)`
* **Description:** Opens pumpkin hat carving screen.
* **Parameters:**  
  - `target`: Entity (pumpkin hat) to carve.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:ClosePumpkinHatCarvingScreen()`
* **Description:** Closes pumpkin hat carving screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenSnowmanDecoratingScreen(target, obj)`
* **Description:** Opens snowman decorating screen.
* **Parameters:**  
  - `target`: Snowman entity.  
  - `obj`: Decor object.
* **Returns:** `true` on success, `false` otherwise

### `PlayerHud:CloseSnowmanDecoratingScreen()`
* **Description:** Closes snowman decorating screen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:SetRecentGifts(item_types, item_ids)`
* **Description:** Sets recent gift data and cancels cleanup task.
* **Parameters:**  
  - `item_types`: Array of item type strings.  
  - `item_ids`: Array of item IDs.
* **Returns:** None

### `PlayerHud:ClearRecentGifts()`
* **Description:** Clears recent gift data and cancels pending task.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:RefreshControllers()`
* **Description:** Handles controller/mode transitions: rebuilds container layout, opens/closes overflow containers, refreshes crafting hint if changed.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:ShowWriteableWidget(writeable, config)`
* **Description:** Opens `WriteableWidget` for a writeable entity (e.g., book, sign), under pause if needed.
* **Parameters:**  
  - `writeable`: Writeable entity.  
  - `config`: Configuration table passed to widget.
* **Returns:** `WriteableWidget` instance

### `PlayerHud:CloseWriteableWidget()`
* **Description:** Closes and nils `writeablescreen`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:GoSane()`
* **Description:** Sets vignette animation state to `"basic"`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:GoInsane()`
* **Description:** Sets vignette animation state to `"insane"`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:GoEnlightened()`
* **Description:** Sets vignette animation state to `"basic"`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:SetMainCharacter(maincharacter)`
* **Description:** Associates HUD with player, initializes overlays, controls, and opens overflow container.
* **Parameters:**  
  - `maincharacter`: Player entity.
* **Returns:** None

### `PlayerHud:OnUpdate(dt)`
* **Description:** Per-frame update — hides/shows vignette based on render quality, manages godmode and history indicators, invalidates spell wheel if fuel depleted, updates leaf canopy.
* **Parameters:**  
  - `dt`: Delta time.
* **Returns:** None

### `PlayerHud:HideControllerCrafting()`
* **Description:** Animates crafting menu offscreen for controller transitions.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:ShowControllerCrafting()`
* **Description:** Animates crafting menu back onscreen.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:OpenControllerInventory()`
* **Description:** Opens controller inventory, plays open sound, updates HUD state. Calls `playercontroller.OnUpdate(0)`.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:CloseControllerInventory()`
* **Description:** Closes controller inventory, plays close sound, updates HUD state.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:HasInputFocus()`
* **Description:** Checks if HUD has input focus (any screen active or text processor/controller menus open).
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:SetModFocus(modname, focusid, hasfocus)`
* **Description:** Manages mod focus in `self.modfocus`.
* **Parameters:**  
  - `modname`: Mod identifier string.  
  - `focusid`: Focus identifier string.  
  - `hasfocus`: Boolean.
* **Returns:** None

### `PlayerHud:IsControllerInventoryOpen()`
* **Description:** Checks if controller inventory screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsCraftingOpen()`
* **Description:** Checks if crafting screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsCommandWheelOpen()`
* **Description:** Checks if command wheel is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsControllerVoteOpen()`
* **Description:** Checks if controller vote screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsVoteOpen()`
* **Description:** Checks if any vote screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsPauseScreenOpen()`
* **Description:** Checks if pause screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsChatInputScreenOpen()`
* **Description:** Checks if chat input screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsConsoleScreenOpen()`
* **Description:** Checks if any console screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsMapScreenOpen()`
* **Description:** Checks if map screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsStatusScreenOpen()`
* **Description:** Checks if status screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsItemManagerScreenOpen()`
* **Description:** Checks if item manager screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsWardrobeScreenOpen()`
* **Description:** Checks if wardrobe screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsGroomerScreenOpen()`
* **Description:** Checks if groomer screen is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsPlayerAvatarPopUpOpen()`
* **Description:** Checks if player avatar popup is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:IsPlayerInfoPopUpOpen()`
* **Description:** Checks if player info popup is open.
* **Parameters:** None  
* **Returns:** Boolean

### `PlayerHud:OpenSpellWheel(invobject, items, radius, focus_radius, bgdata)`
* **Description:** Opens spell wheel UI with item configuration, sounds, and focus management.
* **Parameters:**  
  - `invobject`: Spellbook entity.  
  - `items`: Array of spell items.  
  - `radius`, `focus_radius`, `bgdata`: Visual configuration.
* **Returns:** None

### `PlayerHud:CloseSpellWheel(is_execute)`
* **Description:** Closes spell wheel, plays close sound unless `is_execute` is true, and fires `"closespellwheel"` on spellbook.
* **Parameters:**  
  - `is_execute`: Boolean — affects sound played.
* **Returns:** None

### `PlayerHud:GetCurrentOpenSpellBook()`
* **Description:** Returns the spellbook entity currently assigned to the spell wheel.
* **Parameters:** None  
* **Returns:** Entity or `nil`

### `PlayerHud:OpenCommandWheel()`
* **Description:** Opens command wheel (invite, mount, etc.), manages pause state and sound.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:CloseCommandWheel()`
* **Description:** Closes command wheel.
* **Parameters:** None  
* **Returns:** None

### `PlayerHud:ShowPlayerStatusScreen(click_to_close, onclosefn)`
* **Description:** Opens or reuses `PlayerStatusScreen`, sets callbacks, shows it.
* **Parameters:**  
  - `click_to_close`: Boolean.  
  - `onclosefn`: Callback function.
* **Returns:** None

### `PlayerHud:InspectSelf()`
* **Description:** Toggles player info popup for self, if allowed.
* **Parameters:** None  
* **Returns:** Boolean

### `OnControl(control, down)`
* **Description:** Handles gameplay input controls (crafting, inventory, spell wheel, map, chat, pause, inspect). Delegates priority via `PlayerController:ShouldPlayerHUDControlBeIgnored`.
* **Parameters:**  
  - `control`: Integer control constant.  
  - `down`: Boolean — `true` for press, `false` for release.
* **Returns:** Boolean — `true` if handled, `nil` otherwise

### `OnRawKey(key, down)`
* **Description:** Handles raw keyboard input for dev/debugging.
* **Parameters:**  
  - `key`: String key identifier.  
  - `down`: Boolean.
* **Returns:** Boolean — `true` if handled by base class, `nil` otherwise

### `UpdateDrops(camera)`
* **Description:** Manages `drops_vig` alpha based on rain/drip events (fade in/out with fixed rates).
* **Parameters:**  
  - `camera`: Unused — present for signature compatibility.
* **Returns:** None

### `UpdateClouds(camera)`
* **Description:** Manages cloud/fog visuals and ambient sound using `easing.outCubic`.
* **Parameters:**  
  - `camera`: Camera instance (uses `distance`, `mindist`, `maxdist`, `dollyzoom`).
* **Returns:** None

### `AddTargetIndicator(target, data)`
* **Description:** Creates and adds a `TargetIndicator` widget to `self.targetindicators`.
* **Parameters:**  
  - `target`: Entity to track.  
  - `data`: Visual/config table.
* **Returns:** None

### `HasTargetIndicator(target)`
* **Description:** Checks if `TargetIndicator` for `target` is active.
* **Parameters:**  
  - `target`: Entity to search.
* **Returns:** Boolean — `true` if found, `nil` if `self.targetindicators` is `nil`/empty

### `RemoveTargetIndicator(target)`
* **Description:** Removes `TargetIndicator` for `target`, calls `:Kill()` to clean up.
* **Parameters:**  
  - `target`: Entity.
* **Returns:** None

### `ShowPopupNumber(val, size, pos, height, colour, burst)`
* **Description:** Adds a floating numeric indicator to `popupstats_root`.
* **Parameters:**  
  - `val`: Number to display.  
  - `size`: Integer size class (small/large).  
  - `pos`: WorldPosition vector.  
  - `height`: Vertical offset.  
  - `colour`: RGB(A) color table.  
  - `burst`: Boolean or number (e.g., for multi-damage).
* **Returns:** None

### `ShowRingMeter(pos, duration, starttime)`
* **Description:** Creates or reuses `RingMeter` widget and starts countdown.
* **Parameters:**  
  - `pos`: WorldPosition.  
  - `duration`: Timer duration in seconds.  
  - `starttime`: Optional start time offset.
* **Returns:** None

### `HideRingMeter(success, duration)`
* **Description:** Animates and removes `ringmeter` — `FlashOut` on success, `FadeOut` otherwise.
* **Parameters:**  
  - `success`: Boolean — determines animation type.  
  - `duration`: Animation duration.
* **Returns:** None

### `SetServerPaused(paused)`
* **Description:** Toggles `serverpause_underlay` visibility based on `paused` and profile setting.
* **Parameters:**  
  - `paused`: Boolean.
* **Returns:** None

### `OffsetServerPausedWidget(serverpausewidget)`
* **Description:** Offsets `serverpausewidget` to align with `eventannouncer`.
* **Parameters:**  
  - `serverpausewidget`: Widget instance to reposition.
* **Returns:** None

## Events & listeners
### Listens to:
- `"continuefrompause"` (`TheWorld`) → calls `RefreshControllers()`
- `"endofmatch"` (`TheWorld`) → calls `ShowEndOfMatchPopup(data)`
- `"debug_rebuild_skilltreedata"` (`TheGlobalInstance`) → calls `OpenPlayerInfoScreen()`
- `"deactivateworld"` (`TheWorld`) → client-side cleanup of popups (non-mastersim only)
- `"ms_closepopups"` (`TheWorld`) → calls `self.onclosepopups` (mastersim only)
- `"moisturedelta"` (`owner`) → updates dropsplash alpha
- `"gosane"` (`owner`) → calls `GoSane()`
- `"goinsane"` (`owner`) → calls `GoInsane()`
- `"goenlightened"` (`owner`) → calls `GoEnlightened()`
- `"newactiveitem"` (`owner`) → calls `CloseSpellWheel()` if item set
- `"closespellwheel"` (`pushed by HUD`) → closes spell wheel via spellbook lifecycle
- `"openspellwheel"` (`pushed by HUD`) → opens spell wheel via spellbook lifecycle

### Pushes:
- `"refreshcrafting"` (`owner`) — fired via `OnUpdate` when crafting hint setting changes
- `"closespellwheel"` (`spellbook`) — fired on spell wheel close
- `"openspellwheel"` (`spellbook`) — fired on spell wheel open