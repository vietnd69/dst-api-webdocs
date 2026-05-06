---
id: playerhud
title: Playerhud
description: Manages the player's heads-up display including overlays, containers, screens, and input handling.
tags: [ui, hud, player, screen, input]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: screens
source_hash: 42f1cf5e
system_scope: ui
---

# Playerhud

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`PlayerHud` is the primary screen class responsible for rendering and managing all player-facing UI elements during gameplay. It extends the `Screen` class and handles overlay effects (weather, sanity, status), container widgets (inventory, crafting), popup screens (wardrobe, cookbook, player info), and input control routing. The HUD manages focus states, controller/mouse input switching, and coordinates with `PlayerController` for gameplay input priority.

## Usage example
```lua
-- Access the player's HUD instance
local hud = ThePlayer.HUD

-- Open various screens through the HUD
hud:OpenCrafting()
hud:OpenSpellWheel(spellbook, spell_items, 200, 100)
hud:OpenWardrobeScreen(target_entity)

-- Check HUD state
if hud:IsCraftingOpen() then
    hud:CloseCrafting()
end

-- Show popup numbers for damage/healing
hud:ShowPopupNumber(50, 32, Vector3(0, 0, 0), 100, UICOLOURS.RED)
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- base Screen class extension
- `widgets/containerwidget` -- inventory/container UI
- `widgets/writeablewidget` -- text input for signs/books
- `widgets/controls` -- main HUD controls layout
- `widgets/uianim` -- animated UI elements
- `widgets/text` -- text rendering
- `widgets/widget` -- base widget class
- `easing` -- animation interpolation functions
- `widgets/iceover` -- ice overlay effect
- `widgets/fireover` -- fire overlay effect
- `widgets/bloodover` -- blood overlay effect
- `widgets/beefbloodover` -- beefalo blood overlay effect
- `widgets/heatover` -- heat overlay effect
- `widgets/fumeover` -- fume overlay effect
- `widgets/miasmaover` -- miasma overlay effect
- `widgets/miasmacloudsover` -- miasma clouds overlay effect
- `widgets/sandover` -- sandstorm overlay effect
- `widgets/sanddustover` -- sand dust overlay effect
- `widgets/moonstormover` -- moonstorm overlay effect
- `widgets/moonstormover_lightning` -- moonstorm lightning overlay effect
- `widgets/raindomeover` -- rain dome overlay effect
- `widgets/leafcanopy` -- leaf canopy overlay effect
- `widgets/mindcontrolover` -- mind control overlay effect
- `widgets/parasitethrallover` -- parasite thrall overlay effect
- `widgets/inkover` -- ink overlay effect
- `widgets/wagpunkui` -- wagpunk UI overlay effect
- `widgets/gogglesover` -- goggles overlay effect
- `widgets/nutrientsover` -- nutrients overlay effect
- `widgets/scrapmonocleover` -- scrap monocle overlay effect
- `widgets/nightvisionfruitover` -- night vision fruit overlay effect
- `widgets/inspectaclesover` -- inspectacles overlay effect
- `widgets/roseglassesover` -- rose glasses overlay effect
- `widgets/dronezapover` -- drone zap overlay effect
- `widgets/batover` -- bat overlay effect (Hallowed Nights)
- `widgets/flareover` -- flare overlay effect
- `widgets/lunarburnover` -- lunar burn overlay effect
- `widgets/wxpowerover` -- WX-78 power overlay effect
- `widgets/targetindicator` -- target indicator widget
- `widgets/eventannouncer` -- event announcer widget
- `widgets/popupnumber` -- popup number widget for damage/healing
- `widgets/ringmeter` -- ring meter widget for timed events
- `widgets/playeravatarpopup` -- player avatar popup widget
- `widgets/dressupavatarpopup` -- dressup avatar popup widget
- `widgets/upgrademodulesdisplay_inspecting` -- upgrade modules inspection widget
- `screens/redux/pausescreen` -- pause menu screen
- `screens/chatinputscreen` -- chat input screen
- `screens/playerstatusscreen` -- player status screen
- `screens/inputdialog` -- input dialog screen
- `screens/cookbookpopupscreen` -- cookbook popup screen
- `screens/plantregistrypopupscreen` -- plant registry popup screen
- `screens/playerinfopopupscreen` -- player info popup screen
- `screens/redux/scrapbookscreen` -- scrapbook screen
- `screens/redux/inspectaclesscreen` -- inspectacles screen
- `screens/redux/balatroscreen` -- Balatro minigame screen
- `screens/redux/pumpkincarvingscreen` -- pumpkin carving screen
- `screens/redux/pumpkinhatcarvingscreen` -- pumpkin hat carving screen
- `screens/redux/snowmandecoratingscreen` -- snowman decorating screen
- `screens/redux/wardrobepopupgridloadout` -- wardrobe screen
- `screens/redux/groomerpopupgridloadout` -- groomer screen
- `screens/redux/hermitcrabwardrobepopupgridloadout` -- hermit crab wardrobe screen
- `screens/redux/scarecrowpopupgridloadout` -- scarecrow clothing screen
- `screens/giftitempopup` -- gift item popup screen
- `widgets/redux/endofmatchpopup` -- end of match popup screen

**Components used:**
- `playercontroller` -- checks input focus, controller targeting state
- `raindomewatcher` -- checks if under rain dome for moisture effects
- `spellbook` -- spell wheel integration and spell selection
- `inventory` (replica) -- inventory state and item access
- `sanity` (replica) -- sanity state for vignette changes
- `rider` (replica) -- mount state for command wheel

**Tags:**
- `playerghost` -- checked for command wheel restrictions
- `dressable` -- checked for dressup avatar popup
- `invincible` -- godmode indicator display
- `fueldepleted` -- spellbook validity check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `overlayroot` | Widget | `nil` | Root widget for overlay effects (vignette, weather) |
| `under_root` | Widget | `nil` | Widget layer rendered under main HUD elements |
| `root` | Widget | `nil` | Main HUD widget container |
| `over_root` | Widget | `nil` | Widget layer rendered over main HUD elements |
| `popupstats_root` | Widget | `nil` | Widget container for popup stats (damage numbers, ring meters) |
| `owner` | Entity | `nil` | Player entity that owns this HUD |
| `controls` | Controls | `nil` | Main HUD controls widget instance |
| `vig` | UIAnim | `nil` | Sanity vignette overlay animation |
| `drops_vig` | UIAnim | `nil` | Rain drop splash overlay animation |
| `drops_alpha` | number | `0` | Current alpha value for rain drop overlay |
| `dropsplash` | boolean | `nil` | Flag indicating rain drop splash is active |
| `droptask` | Task | `nil` | Task for clearing rain drop splash |
| `leafcanopy` | Leafcanopy | `nil` | Leaf canopy overlay widget |
| `raindomeover` | RainDomeOver | `nil` | Rain dome overlay widget |
| `storm_root` | Widget | `nil` | Root widget for storm overlays |
| `storm_overlays` | Widget | `nil` | Container for storm overlay widgets |
| `sanddustover` | SandDustOver | `nil` | Sand dust storm overlay widget |
| `moonstormdust` | Image | `nil` | Moonstorm dust overlay image |
| `moonstormover_lightning` | MoonstormOver_Lightning | `nil` | Moonstorm lightning overlay widget |
| `miasmaclouds` | MiasmaCloudsOver | `nil` | Miasma clouds overlay widget |
| `mindcontrolover` | MindControlOver | `nil` | Mind control overlay widget |
| `parasitethrallover` | ParasiteThrallOver | `nil` | Parasite thrall overlay widget |
| `batover` | BatOver | `nil` | Bat overlay widget (Hallowed Nights event) |
| `sandover` | SandOver | `nil` | Sandstorm overlay widget |
| `moonstormover` | MoonstormOver | `nil` | Moonstorm overlay widget |
| `miasmaover` | MiasmaOver | `nil` | Miasma overlay widget |
| `gogglesover` | GogglesOver | `nil` | Goggles overlay widget |
| `nutrientsover` | NutrientsOver | `nil` | Nutrients overlay widget |
| `scrapmonocleover` | ScrapMonocleOver | `nil` | Scrap monocle overlay widget |
| `nightvisionfruitover` | NightVisionFruitOver | `nil` | Night vision fruit overlay widget |
| `inspectaclesover` | InspectaclesOver | `nil` | Inspectacles overlay widget |
| `roseglassesover` | RoseGlassesOver | `nil` | Rose glasses overlay widget |
| `bloodover` | BloodOver | `nil` | Blood overlay widget |
| `beefbloodover` | BeefBloodOver | `nil` | Beefalo blood overlay widget |
| `iceover` | IceOver | `nil` | Ice overlay widget |
| `fireover` | FireOver | `nil` | Fire overlay widget |
| `lunarburnover` | LunarBurnOver | `nil` | Lunar burn overlay widget |
| `heatover` | HeatOver | `nil` | Heat overlay widget |
| `fumeover` | FumeOver | `nil` | Fume overlay widget |
| `flareover` | FlareOver | `nil` | Flare overlay widget |
| `InkOver` | InkOver | `nil` | Ink overlay widget |
| `Wagpunkui` | WagpunkUI | `nil` | Wagpunk UI overlay widget |
| `dronezapover` | DroneZapOver | `nil` | Drone zap overlay widget |
| `wxpowerover` | WxPowerOver | `nil` | WX-78 power overlay widget |
| `clouds` | UIAnim | `nil` | Cloud overlay animation widget |
| `clouds_on` | boolean | `nil` | Flag indicating clouds overlay is active |
| `serverpause_underlay` | Image | `nil` | Server pause screen underlay image |
| `serverpaused` | boolean | `false` | Flag indicating server is paused |
| `eventannouncer` | Widget | `nil` | Event announcer widget |
| `playerstatusscreen` | Screen | `nil` | Reference to player status screen instance |
| `giftitempopup` | Screen | `nil` | Reference to gift item popup screen instance |
| `wardrobepopup` | Screen | `nil` | Reference to wardrobe popup screen instance |
| `groomerpopup` | Screen | `nil` | Reference to beefalo groomer popup instance |
| `hermitcrabwardrobepopup` | Screen | `nil` | Reference to hermit crab wardrobe popup instance |
| `playeravatarpopup` | Widget | `nil` | Reference to player avatar popup widget |
| `dressupAvatarPopUpcreen` | Widget | `nil` | Reference to dressup avatar popup widget |
| `playerinfoscreen` | Screen | `nil` | Reference to player info popup screen |
| `cookbookscreen` | Screen | `nil` | Reference to cookbook popup screen |
| `plantregistryscreen` | Screen | `nil` | Reference to plant registry popup screen |
| `scrapbookscreen` | Screen | `nil` | Reference to scrapbook screen |
| `inspectaclesscreen` | Screen | `nil` | Reference to inspectacles screen |
| `balatroscreen` | Screen | `nil` | Reference to Balatro minigame screen |
| `pumpkincarvingscreen` | Screen | `nil` | Reference to pumpkin carving screen |
| `pumpkinhatcarvingscreen` | Screen | `nil` | Reference to pumpkin hat carving screen |
| `snowmandecoratingscreen` | Screen | `nil` | Reference to snowman decorating screen |
| `writeablescreen` | WriteableWidget | `nil` | Reference to writeable widget for text input |
| `upgrademodulewidget` | UpgradeModulesDisplay_Inspecting | `nil` | Reference to upgrade module inspection widget |
| `ringmeter` | RingMeter | `nil` | Reference to ring meter widget |
| `targetindicators` | table | `nil` | Array of target indicator widgets |
| `modfocus` | table | `nil` | Mod input focus tracking table |
| `recentgifts` | table | `nil` | Stored gift data for transfer between screens |
| `recentgiftstask` | Task | `nil` | Pending task for clearing recent gifts |
| `endofmatchpopup` | EndOfMatchPopup | `nil` | Reference to end of match popup widget |
| `_CraftingHintAllRecipesEnabled` | boolean | `nil` | Cached profile setting for crafting hint |
| `shown` | boolean | `false` | Flag indicating HUD visibility state |

## Main functions
### `CreateOverlays(owner)`
* **Description:** Creates and initializes all overlay widgets for weather effects, sanity vignette, and status indicators. Called when setting the main character.
* **Parameters:** `owner` -- player entity that owns the HUD
* **Returns:** None
* **Error states:** None

### `OnDestroy()`
* **Description:** Cleans up HUD resources when the screen is destroyed. Pops camera offset and closes player status screen.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnLoseFocus()`
* **Description:** Called when HUD loses input focus. Re-enables mouse input, closes crafting/spell wheel/command wheel, and returns active item to inventory.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnGainFocus()`
* **Description:** Called when HUD gains input focus. Disables mouse if controller attached, updates control widget state.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Toggle(targetindicators)`
* **Description:** Toggles HUD visibility. Optionally hides/shows target indicators.
* **Parameters:** `targetindicators` -- boolean whether to toggle target indicators with HUD
* **Returns:** None
* **Error states:** None

### `Hide()`
* **Description:** Hides the HUD root widget and closes controller vote screen and user command picker.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Show()`
* **Description:** Shows the HUD root widget.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetFirstOpenContainerWidget()`
* **Description:** Returns the first open container widget from the controls containers table.
* **Parameters:** None
* **Returns:** ContainerWidget instance or `nil` if none open
* **Error states:** None

### `CloseContainer(container, side)`
* **Description:** Closes a container widget. Triggers inventory rebuild if side container with controller or integrated backpack.
* **Parameters:**
  - `container` -- container entity or `nil`
  - `side` -- boolean indicating side container
* **Returns:** None
* **Error states:** None

### `OpenContainer(container, side)`
* **Description:** Opens a container widget at the appropriate parent based on container type.
* **Parameters:**
  - `container` -- container entity or `nil`
  - `side` -- boolean indicating side container
* **Returns:** None
* **Error states:** None

### `OpenWardrobeScreen(target)`
* **Description:** Opens the wardrobe popup screen for clothing selection. Handles scarecrow or player wardrobe based on target.
* **Parameters:** `target` -- entity to dress or `nil` for player wardrobe
* **Returns:** `true` on success
* **Error states:** None

### `CloseWardrobeScreen()`
* **Description:** Closes the wardrobe popup screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenGroomerScreen(target, filter)`
* **Description:** Opens the beefalo groomer screen for skinning.
* **Parameters:**
  - `target` -- beefalo entity to groom (required)
  - `filter` -- optional filter for available skins
* **Returns:** `true` on success
* **Error states:** Errors if `target` is `nil` (assert failure)

### `CloseGroomerScreen()`
* **Description:** Closes the groomer popup screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenCookbookScreen()`
* **Description:** Opens the cookbook popup screen for recipe viewing.
* **Parameters:** None
* **Returns:** `true` on success
* **Error states:** None

### `CloseCookbookScreen()`
* **Description:** Closes the cookbook popup screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenPlantRegistryScreen()`
* **Description:** Opens the plant registry popup screen.
* **Parameters:** None
* **Returns:** `true` on success
* **Error states:** None

### `ClosePlantRegistryScreen()`
* **Description:** Closes the plant registry popup screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenPlayerInfoScreen(player_name, data, show_net_profile, force)`
* **Description:** Opens player info popup or dressup avatar popup based on target entity tags.
* **Parameters:**
  - `player_name` -- string name of player
  - `data` -- table with player data including `inst`
  - `show_net_profile` -- boolean to show network profile
  - `force` -- boolean to force open
* **Returns:** `true` on success (non-dressable entities only), `nil` otherwise
* **Error states:** None

### `ClosePlayerInfoScreen()`
* **Description:** Closes the player info popup screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenScrapbookScreen()`
* **Description:** Opens the scrapbook screen for collected items.
* **Parameters:** None
* **Returns:** `true` on success
* **Error states:** None

### `CloseScrapbookScreen()`
* **Description:** Closes the scrapbook screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenInspectaclesScreen()`
* **Description:** Opens the inspectacles screen.
* **Parameters:** None
* **Returns:** `true` on success
* **Error states:** None

### `CloseInspectaclesScreen()`
* **Description:** Closes the inspectacles screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenBalatroScreen(target, jokers, cards)`
* **Description:** Opens the Balatro minigame screen.
* **Parameters:**
  - `target` -- target entity
  - `jokers` -- joker cards data
  - `cards` -- playing cards data
* **Returns:** `true` on success
* **Error states:** None

### `CloseBalatroScreen()`
* **Description:** Closes the Balatro screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenPumpkinCarvingScreen(target)`
* **Description:** Opens the pumpkin carving screen for Hallowed Nights event.
* **Parameters:** `target` -- pumpkin entity to carve
* **Returns:** `true` on success
* **Error states:** None

### `ClosePumpkinCarvingScreen()`
* **Description:** Closes the pumpkin carving screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenPumpkinHatCarvingScreen(target)`
* **Description:** Opens the pumpkin hat carving screen.
* **Parameters:** `target` -- pumpkin hat entity
* **Returns:** `true` on success
* **Error states:** None

### `ClosePumpkinHatCarvingScreen()`
* **Description:** Closes the pumpkin hat carving screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenSnowmanDecoratingScreen(target, obj)`
* **Description:** Opens the snowman decorating screen for Winter's Feast.
* **Parameters:**
  - `target` -- snowman entity
  - `obj` -- decoration object
* **Returns:** `true` on success
* **Error states:** None

### `CloseSnowmanDecoratingScreen()`
* **Description:** Closes the snowman decorating screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetRecentGifts(item_types, item_ids)`
* **Description:** Stores recent gift data for transfer between gift popup and wardrobe screens.
* **Parameters:**
  - `item_types` -- array of item type strings
  - `item_ids` -- array of item ID strings
* **Returns:** None
* **Error states:** None

### `ClearRecentGifts()`
* **Description:** Clears stored recent gift data and cancels pending clear task.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RefreshControllers()`
* **Description:** Refreshes controller state when continuing from pause. Rebuilds inventory if controller mode or integrated backpack state changed.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowWriteableWidget(writeable, config)`
* **Description:** Opens writeable widget for text input on signs, books, etc.
* **Parameters:**
  - `writeable` -- entity with writeable component or `nil`
  - `config` -- configuration table
* **Returns:** WriteableWidget instance or `nil` if writeable is `nil`
* **Error states:** None

### `CloseWriteableWidget()`
* **Description:** Closes the writeable widget if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GoSane()`
* **Description:** Plays the basic sanity vignette animation.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.vig` is `nil` (no nil guard on `self.vig:GetAnimState()`)

### `GoInsane()`
* **Description:** Plays the insane vignette animation.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.vig` is `nil` (no nil guard on `self.vig:GetAnimState()`)

### `GoEnlightened()`
* **Description:** Plays the basic enlightened vignette animation.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.vig` is `nil` (no nil guard on `self.vig:GetAnimState()`)

### `SetMainCharacter(maincharacter)`
* **Description:** Sets the owner player entity and initializes HUD components. Listens for sanity state events.
* **Parameters:** `maincharacter` -- player entity or `nil`
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Updates HUD each frame. Handles vignette visibility, history recording indicator, godmode indicator, and spell wheel validity checks.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** None
* **Error states:** None

### `OpenControllerInventory()`
* **Description:** Opens the controller inventory screen. Closes crafting, spell wheel, and command wheel.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CloseControllerInventory()`
* **Description:** Closes the controller inventory screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HasInputFocus()`
* **Description:** Returns whether the HUD currently has input focus locked. Checks active screen, text processor, and various widget states.
* **Parameters:** None
* **Returns:** `true` if input focus is locked, `false` otherwise
* **Error states:** None

### `SetModFocus(modname, focusid, hasfocus)`
* **Description:** Tracks mod input focus state for priority handling.
* **Parameters:**
  - `modname` -- string mod name
  - `focusid` -- string or number focus identifier
  - `hasfocus` -- boolean whether mod has focus
* **Returns:** None
* **Error states:** None

### `IsControllerInventoryOpen()`
* **Description:** Returns whether controller inventory is currently open.
* **Parameters:** None
* **Returns:** `true` if open, `false` otherwise
* **Error states:** None

### `IsCraftingOpen()`
* **Description:** Returns whether crafting menu is currently open.
* **Parameters:** None
* **Returns:** `true` if open, `false` otherwise
* **Error states:** None

### `IsCommandWheelOpen()`
* **Description:** Returns whether command wheel is currently open.
* **Parameters:** None
* **Returns:** `true` if open, `false` otherwise
* **Error states:** None

### `IsPauseScreenOpen()`
* **Description:** Returns whether pause screen is currently the active screen.
* **Parameters:** None
* **Returns:** `true` if pause screen is active, `false` otherwise
* **Error states:** None

### `IsChatInputScreenOpen()`
* **Description:** Returns whether chat input screen is currently the active screen.
* **Parameters:** None
* **Returns:** `true` if chat input is active, `false` otherwise
* **Error states:** None

### `IsMapScreenOpen()`
* **Description:** Returns whether map screen is currently the active screen.
* **Parameters:** None
* **Returns:** `true` if map is active, `false` otherwise
* **Error states:** None

### `IsWardrobeScreenOpen()`
* **Description:** Returns whether wardrobe or scarecrow clothing screen is open.
* **Parameters:** None
* **Returns:** `true` if wardrobe screen is active, `false` otherwise
* **Error states:** None

### `IsGroomerScreenOpen()`
* **Description:** Returns whether groomer popup screen is open.
* **Parameters:** None
* **Returns:** `true` if groomer screen is active, `false` otherwise
* **Error states:** None

### `IsPlayerAvatarPopUpOpen()`
* **Description:** Returns whether player avatar popup is open and valid.
* **Parameters:** None
* **Returns:** `true` if popup is open and valid, `false` otherwise
* **Error states:** None

### `OpenCrafting(search)`
* **Description:** Opens the crafting menu. Closes spell wheel and controller inventory first.
* **Parameters:** `search` -- optional search string for crafting
* **Returns:** None
* **Error states:** None

### `CloseCrafting(silent)`
* **Description:** Closes the crafting menu if open.
* **Parameters:** `silent` -- boolean to suppress close sound
* **Returns:** None
* **Error states:** None

### `IsSpellWheelOpen()`
* **Description:** Returns whether spell wheel is currently open.
* **Parameters:** None
* **Returns:** `true` if spell wheel is open, `false` otherwise
* **Error states:** None

### `GetCurrentOpenSpellBook()`
* **Description:** Returns the currently open spellbook entity from spell wheel.
* **Parameters:** None
* **Returns:** Spellbook entity or `nil`
* **Error states:** None

### `OpenSpellWheel(invobject, items, radius, focus_radius, bgdata)`
* **Description:** Opens the spell wheel with spell items. Handles spell selection callbacks and focus sounds.
* **Parameters:**
  - `invobject` -- spellbook inventory entity
  - `items` -- array of spell item data tables
  - `radius` -- number for wheel radius
  - `focus_radius` -- number for focus radius
  - `bgdata` -- optional table with build, bank, anim for background
* **Returns:** None
* **Error states:** Errors if `invobject.components.spellbook` is accessed when `invobject` has no spellbook component (no nil guard in execute callback)

### `CloseSpellWheel(is_execute)`
* **Description:** Closes the spell wheel. Plays execute or close sound based on reason.
* **Parameters:** `is_execute` -- boolean whether closing due to spell execution
* **Returns:** None
* **Error states:** None

### `OpenCommandWheel()`
* **Description:** Opens the command wheel for player communication and actions. Rebuilds wheel if invite or mount state changed.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CloseCommandWheel()`
* **Description:** Closes the command wheel if open. Re-enables inventory and crafting.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowPlayerStatusScreen(click_to_close, onclosefn)`
* **Description:** Shows the player status screen with character stats and options.
* **Parameters:**
  - `click_to_close` -- boolean whether clicking closes screen
  - `onclosefn` -- optional callback function on close
* **Returns:** None
* **Error states:** None

### `InspectSelf()`
* **Description:** Opens player info popup for self-inspection. Checks controller target and player controller enabled state.
* **Parameters:** None
* **Returns:** `true` on success, `false` otherwise
* **Error states:** Errors if `self.owner` is `nil` (no nil guard before accessing `self.owner.components`)

### `OnControl(control, down)`
* **Description:** Handles control input events for HUD. Routes controls to appropriate widgets and handles pause, crafting, inventory, chat, and status toggles.
* **Parameters:**
  - `control` -- CONTROL_* constant
  - `down` -- boolean whether control is pressed down
* **Returns:** `true` if control was handled, `false` otherwise
* **Error states:** None

### `OnRawKey(key, down)`
* **Description:** Stub for raw key handling. Reserved for dev testing.
* **Parameters:**
  - `key` -- keyboard key code
  - `down` -- boolean whether key is pressed down
* **Returns:** `true` if handled by base, `false` otherwise
* **Error states:** None

### `UpdateDrops(camera)`
* **Description:** Updates rain drop splash overlay alpha based on moisture delta events.
* **Parameters:** `camera` -- camera instance for position reference
* **Returns:** None
* **Error states:** None

### `UpdateClouds(camera)`
* **Description:** Updates cloud overlay visibility and alpha based on camera distance. Plays wind sound when clouds are visible.
* **Parameters:** `camera` -- camera instance with distance properties
* **Returns:** None
* **Error states:** None

### `AddTargetIndicator(target, data)`
* **Description:** Adds a target indicator widget for the specified target entity.
* **Parameters:**
  - `target` -- entity to indicate
  - `data` -- optional data table for indicator
* **Returns:** None
* **Error states:** None

### `HasTargetIndicator(target)`
* **Description:** Returns whether a target indicator exists for the specified target.
* **Parameters:** `target` -- entity to check
* **Returns:** `true` if indicator exists, `false` otherwise
* **Error states:** None

### `RemoveTargetIndicator(target)`
* **Description:** Removes and kills the target indicator widget for the specified target.
* **Parameters:** `target` -- entity whose indicator to remove
* **Returns:** None
* **Error states:** None

### `ShowPopupNumber(val, size, pos, height, colour, burst)`
* **Description:** Shows a popup number widget (damage/healing values) at world position.
* **Parameters:**
  - `val` -- number value to display
  - `size` -- number font size
  - `pos` -- Vector3 world position
  - `height` -- number display height
  - `colour` -- colour table for text
  - `burst` -- boolean for burst animation
* **Returns:** None
* **Error states:** None

### `ShowRingMeter(pos, duration, starttime)`
* **Description:** Shows a ring meter widget for timed events (minigames, charging).
* **Parameters:**
  - `pos` -- Vector3 world position
  - `duration` -- number duration in seconds
  - `starttime` -- optional start time override
* **Returns:** None
* **Error states:** None

### `HideRingMeter(success, duration)`
* **Description:** Hides the ring meter with flash or fade animation.
* **Parameters:**
  - `success` -- boolean whether to flash (success) or fade (failure)
  - `duration` -- number animation duration
* **Returns:** None
* **Error states:** None

### `SetServerPaused(paused)`
* **Description:** Shows or hides the server pause underlay based on paused state.
* **Parameters:** `paused` -- boolean paused state
* **Returns:** None
* **Error states:** None

### `OffsetServerPausedWidget(serverpausewidget)`
* **Description:** Sets offset on server pause widget based on event announcer position.
* **Parameters:** `serverpausewidget` -- pause widget to offset
* **Returns:** None
* **Error states:** None

### `IsUpgradeModuleWidgetInputFocus()`
* **Description:** Returns whether upgrade module widget has input focus.
* **Parameters:** None
* **Returns:** `true` if widget has focus, `false` otherwise
* **Error states:** None

### `ShowUpgradeModuleWidget()`
* **Description:** Shows the upgrade module inspection widget for WX-78 power system.
* **Parameters:** None
* **Returns:** UpgradeModulesDisplay_Inspecting instance
* **Error states:** None

### `CloseUpgradeModuleWidget()`
* **Description:** Closes the upgrade module widget if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `TryStopInspectingModules(nomoduleremover)`
* **Description:** Stops module inspection. Optionally skips if using module remover.
* **Parameters:** `nomoduleremover` -- boolean to skip if using remover
* **Returns:** `true` if inspection stopped, `false` otherwise
* **Error states:** None

### `GetCurrentDrone()`
* **Description:** Returns the current drone entity from drone zap overlay.
* **Parameters:** None
* **Returns:** Drone entity or `nil`
* **Error states:** Errors if `self.dronezapover` is `nil` (no nil guard before `GetDrone()` call)

### `ShowEndOfMatchPopup(data)`
* **Description:** Shows end of match popup for event games (Lava Arena, Quagmire).
* **Parameters:** `data` -- table with `victory` boolean
* **Returns:** None
* **Error states:** None

### `OpenScreenUnderPause(screen)`
* **Description:** Opens a screen, inserting under pause screen if pause is open or pushing normally.
* **Parameters:** `screen` -- screen instance to open
* **Returns:** None
* **Error states:** None

### `OpenItemManagerScreen()`
* **Description:** Opens gift item popup if unopened items exist in inventory.
* **Parameters:** None
* **Returns:** `true` if item opened, `false` otherwise
* **Error states:** None

### `CloseItemManagerScreen()`
* **Description:** Closes gift item popup and schedules recent gifts clear.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OpenHermitCrabWardrobeScreen(target, filter)`
* **Description:** Opens hermit crab wardrobe screen for skinning.
* **Parameters:**
  - `target` -- hermit crab entity
  - `filter` -- optional skin filter
* **Returns:** `true` on success
* **Error states:** None

### `CloseHermitCrabWardrobeScreen()`
* **Description:** Closes hermit crab wardrobe screen if open.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `TogglePlayerInfoPopup(player_name, data, show_net_profile, force)`
* **Description:** Toggles player info popup, closing dressup avatar if open.
* **Parameters:**
  - `player_name` -- string player name
  - `data` -- player data table
  - `show_net_profile` -- boolean
  - `force` -- boolean
* **Returns:** None
* **Error states:** None

### `RemoveDressupWidget()`
* **Description:** Removes and kills the dressup avatar popup widget.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HideControllerCrafting()`
* **Description:** Moves crafting menu off-screen for controller mode.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowControllerCrafting()`
* **Description:** Moves crafting menu on-screen for controller mode.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsControllerCraftingOpen()`
* **Description:** Deprecated. Returns whether controller crafting is open. Use `IsCraftingOpen()` instead.
* **Parameters:** None
* **Returns:** `true` if crafting is open, `false` otherwise
* **Error states:** None

### `IsCraftingBlockingGameplay()`
* **Description:** Deprecated. Always returns `false`.
* **Parameters:** None
* **Returns:** `false`
* **Error states:** None

### `IsControllerVoteOpen()`
* **Description:** Returns whether controller vote dialog is open.
* **Parameters:** None
* **Returns:** `true` if vote is open, `false` otherwise
* **Error states:** None

### `IsVoteOpen()`
* **Description:** Returns whether vote dialog is open.
* **Parameters:** None
* **Returns:** `true` if vote is open, `false` otherwise
* **Error states:** None

### `IsConsoleScreenOpen()`
* **Description:** Returns whether console screen is the active screen.
* **Parameters:** None
* **Returns:** `true` if console is active, `false` otherwise
* **Error states:** None

### `IsStatusScreenOpen()`
* **Description:** Returns whether player status screen is the active screen.
* **Parameters:** None
* **Returns:** `true` if status screen is active, `false` otherwise
* **Error states:** None

### `IsItemManagerScreenOpen()`
* **Description:** Returns whether gift item popup is the active screen.
* **Parameters:** None
* **Returns:** `true` if item manager is active, `false` otherwise
* **Error states:** None

### `IsPlayerInfoPopUpOpen()`
* **Description:** Returns whether player info popup screen (`self.playerinfoscreen`) is open and valid.
* **Parameters:** None
* **Returns:** `true` if popup is open and valid, `false` otherwise
* **Error states:** None

## Events & listeners
**Listens to:**
- `continuefrompause` (TheWorld) -- calls `RefreshControllers()` when game continues from pause
- `endofmatch` (TheWorld) -- calls `ShowEndOfMatchPopup()` with match result data
- `debug_rebuild_skilltreedata` (TheGlobalInstance) -- calls `OpenPlayerInfoScreen()` for debug
- `deactivateworld` (TheWorld, client only) -- closes player avatar popup and player status screen on world reset
- `ms_closepopups` (self.inst, server only) -- calls `onclosepopups` handler
- `moisturedelta` (owner) -- triggers rain drop splash effect when moisture increases
- `gosane` (owner) -- calls `GoSane()` to change vignette
- `goinsane` (owner) -- calls `GoInsane()` to change vignette
- `goenlightened` (owner) -- calls `GoEnlightened()` to change vignette
- `newactiveitem` (owner) -- closes spell wheel when active item changes

**Pushes:**
- `refreshcrafting` (owner) -- pushed when crafting hint profile setting changes
- `openspellwheel` (invobject) -- pushed when spell wheel opens on spellbook entity
- `closespellwheel` (invobject) -- pushed when spell wheel closes on spellbook entity