---
id: controls
title: Controls
description: Manages the player HUD interface including action hints, crafting menus, status displays, and controller input feedback.
tags: [ui, hud, input, widgets]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 0c6e430d
system_scope: ui
---

# Controls

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Controls` is the primary HUD widget responsible for rendering player interface elements including action hints, status displays, crafting menus, inventory bars, and controller input feedback. It manages toast notifications, map screens, emote wheels, and command wheels. The widget adapts its layout based on game mode (standard, Lava Arena, Quagmire), split-screen configuration, and input method (controller vs. keyboard/mouse).

## Usage example
```lua
local owner = ThePlayer
local controls = Controls(owner)
controls:ShowStatusNumbers()
controls:SetDark(true)
controls:ShowCraftingAndInventory()
controls:ToggleMap()
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- base screen widget
- `widgets/button`, `widgets/animbutton`, `widgets/imagebutton` -- interactive UI elements
- `widgets/text`, `widgets/image`, `widgets/uianim` -- visual components
- `widgets/inventorybar` -- inventory display
- `widgets/widget` -- base widget class
- `widgets/crafttabs`, `widgets/redux/craftingmenu_hud` -- crafting interface
- `widgets/hoverer` -- tooltip display
- `widgets/mapcontrols` -- minimap controls
- `widgets/containerwidget` -- container UI
- `widgets/demotimer` -- demo timer widget
- `widgets/savingindicator` -- save indicator widget
- `widgets/uiclock` -- clock display widget
- `widgets/followtext` -- text that follows entities
- `widgets/statusdisplays` -- health/hunger/sanity displays
- `widgets/secondarystatusdisplays` -- secondary status displays
- `widgets/statusdisplays_lavaarena` -- Lava Arena mode status displays
- `widgets/statusdisplays_quagmire` -- Quagmire mode status displays
- `widgets/statusdisplays_quagmire_cravings` -- Quagmire hangriness display
- `widgets/quagmire_notificationwidget` -- Quagmire notifications
- `widgets/redux/chatqueue` -- chat queue widget
- `widgets/desync` -- desync indicator widget
- `widgets/worldresettimer` -- world reset timer widget
- `widgets/playerdeathnotification` -- player death notification
- `widgets/giftitemtoast` -- gift item toast notification
- `widgets/yotbtoast` -- Year of the Beast toast
- `widgets/skilltreetoast` -- skill tree toast notification
- `widgets/scrapbooktoast` -- scrapbook toast notification
- `widgets/votedialog` -- vote dialog widget
- `widgets/templates` -- UI templates
- `widgets/wheel`, `widgets/wheelitem` -- radial menu system
- `screens/mapscreen` -- full map interface
- `screens/quagmire_recipebookscreen` -- Quagmire recipe book screen
- `screens/redux/usercommandpickerscreen` -- user command picker screen
- `usercommands` -- user commands definitions
- `widgets/teamstatusbars` -- team status bars for Lava Arena
- `easing` -- animation interpolation

**Components used:**
- `playercontroller` -- accessed for ground actions, controller targeting, placement state, map controls, and controller_attack_target property
- `spellbook` -- checked for usability and closeonexecute property
- `inventory` (replica) -- checked for visibility state
- `rider` (replica) -- checked for mount state

**Tags:**
- `playerghost` -- checked to disable emotes when ghosted
- `moving`, `idle`, `channeling` -- checked for inspect action availability
- `inspectable` -- checked on target entities for inspect action

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns this HUD. |
| `playeractionhint` | FollowText | `nil` | Widget displaying action hints for targeted entities. |
| `attackhint` | FollowText | `nil` | Widget displaying attack action hint. |
| `groundactionhint` | FollowText | `nil` | Widget displaying ground interaction hints. |
| `blackoverlay` | Image | `nil` | Full-screen dark overlay for modal states. |
| `containerroot` | Widget | `nil` | Root widget for container UI elements. |
| `status` | StatusDisplays | `nil` | Primary status display widget (health/hunger/sanity). |
| `inv` | InventoryBar | `nil` | Inventory bar widget. |
| `craftingmenu` | CraftingMenu | `nil` | Crafting menu widget. |
| `commandwheel` | Wheel | `nil` | Command wheel for player actions. |
| `spellwheel` | Wheel | `nil` | Spell wheel for magic items. |
| `emote_wheel_standing` | table | `nil` | Emote wheel configuration for standing state. |
| `emote_wheel_mounted` | table | `nil` | Emote wheel configuration for mounted state. |
| `mapcontrols` | MapControls | `nil` | Minimap control widget. |
| `toastitems` | table | `{}` | Array of active toast notification widgets. |
| `craftingandinventoryshown` | boolean | `false` | Whether crafting and inventory are currently visible. |
| `craftingshown` | boolean | `true` | Whether crafting menu is enabled. |
| `dismounthintdelay` | number | `0` | Delay timer for dismount hint display. |
| `override_tooltip_pos` | Vector3 | `nil` | Optional override position for tooltips. |
| `playeractionhint_itemhighlight` | FollowText | `nil` | Widget highlighting item names in action hints. |
| `containerroot_under` | Widget | `nil` | Root widget for containers rendered under other UI. |
| `containerroot_over` | Widget | `nil` | Root widget for containers rendered over other UI. |
| `containerroot_side_behind` | Widget | `nil` | Root widget for side containers behind main UI. |
| `containerroot_side` | Widget | `nil` | Root widget for side containers (hidden by default). |
| `saving` | SavingIndicator | `nil` | Save indicator widget. |
| `toastlocations` | table | `{}` | Array of toast notification slot positions. |
| `item_notification` | GiftItemToast | `nil` | Gift item toast notification widget. |
| `yotb_notification` | YotbToast | `nil` | Year of the Beast toast notification widget. |
| `skilltree_notification` | SkillTreeToast | `nil` | Skill tree toast notification widget. |
| `scrapbook_notification` | ScrapbookToast | `nil` | Scrapbook toast notification widget. |
| `teamstatus` | TeamStatusBars | `nil` | Team status bars for Lava Arena mode. |
| `quagmire_hangriness` | Quagmire_StatusCravingDisplay | `nil` | Quagmire hangriness/craving display widget. |
| `quagmire_notifications` | Quagmire_NotificationWidget | `nil` | Quagmire notification widget. |
| `secondary_status` | SecondaryStatusDisplays | `nil` | Secondary status display widget. |
| `clock` | UIClock | `nil` | Clock display widget (cave clock). |
| `votedialog` | VoteDialog | `nil` | Vote dialog widget. |
| `chatqueue` | ChatQueue | `nil` | Local chat queue widget (Twitch). |
| `networkchatqueue` | ChatQueue | `nil` | Network global chat queue widget. |
| `containers` | table | `{}` | Array of active container widgets. |
| `demotimer` | DemoTimer | `nil` | Demo timer widget (disabled by default). |
| `mousefollow` | Widget | `nil` | Widget that follows mouse cursor. |
| `hover` | HoverText | `nil` | Hover tooltip widget. |
| `commandwheelroot` | Widget | `nil` | Root widget for command wheel. |
| `character_name` | string | `"generic"` | Character prefab name for emote assets. |
| `desync` | Desync | `nil` | Desync indicator widget (clients only). |
| `sidepanel` | Widget | `nil` | Side panel widget container for clock and status displays. |
| `worldresettimer` | PlayerDeathNotification | `nil` | Player death notification widget (also handles ghost mode state). |
| `top_root`, `topleft_root`, `topright_root`, `bottom_root`, `left_root`, `right_root`, `bottomright_root`, `topright_over_root` | Widget | `nil` | Auto-scaling root nodes for HUD layout. |

## Main functions
### `Class(Widget, function(self, owner) ... end)`
* **Description:** Constructor that initializes the Controls widget for a player entity. Sets up all HUD elements including status displays, inventory, crafting menu, action hints, toast notifications, and input wheels. Adapts layout based on game mode, split-screen configuration, and platform.
* **Parameters:**
  - `owner` -- player entity that owns this HUD
* **Returns:** Controls widget instance
* **Error states:** Errors if `owner` is nil when accessing `owner.HUD` or `owner.components` — no nil guard present in constructor.

### `ShowStatusNumbers()`
* **Description:** Enables numeric display on status bars (health, hunger, sanity values).
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.status` is nil (no guard present). `self.teamstatus` and `self.secondary_status` are conditionally accessed with nil checks before calling.

### `HideStatusNumbers()`
* **Description:** Disables numeric display on status bars.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.status` is nil (no guard present). `self.teamstatus` and `self.secondary_status` are conditionally accessed with nil checks before calling.

### `SetDark(val)`
* **Description:** Shows or hides the black overlay for modal/dark states.
* **Parameters:** `val` -- boolean, true to show overlay, false to hide
* **Returns:** None
* **Error states:** None

### `SetGhostMode(isghost)`
* **Description:** Sets ghost mode on status displays and world reset timer for dead players.
* **Parameters:** `isghost` -- boolean, true if player is a ghost
* **Returns:** None
* **Error states:** Errors if `self.status`, `self.secondary_status`, or `self.worldresettimer` is nil — no nil guards present.

### `MakeScalingNodes()`
* **Description:** Creates auto-scaling root nodes for HUD elements with proportional scaling and anchor points.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetHUDSize()`
* **Description:** Applies HUD scale settings from TheFrontEnd to all scaling nodes. Pushes `refreshhudsize` event to owner HUD.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD` is nil when pushing event.

### `OnUpdate(dt)`
* **Description:** Main update loop called every frame. Handles screen size changes, controller mode detection, action hint updates, target highlighting, and hint overlap prevention. Updates controller action hints based on playercontroller state.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** None
* **Error states:** Errors if `self.owner` is nil or if `self.owner.components.playercontroller` is nil during controller mode checks.

### `DelayControllerSpellWheelHint()`
* **Description:** Sets a 0.5 second delay before showing dismount hint, used when spell wheel is active.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HighlightActionItem(itemIndex, itemInActions)`
* **Description:** Highlights a specific action line in the action hint text by separating item name from commands with different colors.
* **Parameters:**
  - `itemIndex` -- integer index of the line to highlight, or nil
  - `itemInActions` -- boolean indicating if item is in action hints vs ground hints
* **Returns:** None
* **Error states:** Errors if `self.owner.components.playercontroller.controller_target` is nil when `itemIndex` is provided.

### `ShowMap(world_position)`
* **Description:** Opens the map screen. For Quagmire mode, opens recipe book instead. Can focus on a specific world position.
* **Parameters:** `world_position` -- Vector3 world position to focus on, or nil
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD` is nil.

### `FocusMapOnWorldPosition(mapscreen, worldx, worldz)`
* **Description:** Centers and zooms the map on a specific world coordinate, accounting for camera heading.
* **Parameters:**
  - `mapscreen` -- MapScreen instance
  - `worldx` -- number, world X coordinate
  - `worldz` -- number, world Z coordinate
* **Returns:** `nil` if mapscreen or minimap is nil
* **Error states:** None

### `HideMap()`
* **Description:** Closes the map screen if currently open.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD` is nil.

### `ToggleMap()`
* **Description:** Opens or closes the map screen. Respects map control availability and game mode restrictions.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD` is nil.

### `DoShowCrafting_Internal()`
* **Description:** Internal function to show crafting menu if not disabled by game mode.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.craftingmenu` is nil.

### `DoHideCrafting_Internal()`
* **Description:** Internal function to hide crafting menu and close via HUD.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD` is nil.

### `ShowCrafting()`
* **Description:** Enables crafting display flag and shows crafting menu if inventory is also shown.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HideCrafting()`
* **Description:** Disables crafting display flag, hides menu, and notifies inventory of crafting hidden state.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inv` is nil.

### `ShowCraftingAndInventory()`
* **Description:** Shows both crafting menu and inventory bar. Toggles toast and status display crafting states. Shows side container roots.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inv`, `self.status`, or `self.secondary_status` is nil.

### `HideCraftingAndInventory()`
* **Description:** Hides crafting menu and inventory bar. Closes controller inventory, hides side container roots, and closes spell wheel.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inv` or `self.spellwheel` is nil.

### `BuildEmoteWheel(character_name, emote_groups)`
* **Description:** Constructs emote wheel configuration from emote groups. Adjusts wheel radius based on emote count.
* **Parameters:**
  - `character_name` -- string prefab name for emote assets
  - `emote_groups` -- table of emote group configurations
* **Returns:** table containing emote wheel configuration
* **Error states:** None

### `BuildCommandWheel(is_splitscreen)`
* **Description:** Builds the command wheel with emotes, chat, player list, user commands, and invite options. Adjusts scale based on splitscreen and platform.
* **Parameters:** `is_splitscreen` -- boolean for split-screen mode
* **Returns:** None
* **Error states:** Errors if `self.commandwheel` is nil.

### `GetTooltipPos(hoverer)`
* **Description:** Returns the tooltip position, using override if set, otherwise calls FunctionOrValue helper.
* **Parameters:** `hoverer` -- HoverText widget instance
* **Returns:** Vector3 position or result of FunctionOrValue call
* **Error states:** None

### `OverrideTooltipPos(pos_or_pos_x, pos_y, pos_z)`
* **Description:** Sets an override position for tooltips. Accepts either a Vector3 or three separate coordinates.
* **Parameters:**
  - `pos_or_pos_x` -- Vector3 or number X coordinate
  - `pos_y` -- number Y coordinate (if first param is number)
  - `pos_z` -- number Z coordinate (if first param is number)
* **Returns:** None
* **Error states:** None

### `ManageToast(toast, remove)`
* **Description:** Manages toast notification positioning in the toast slot array. Adds or removes toasts and collapses remaining toasts to fill gaps.
* **Parameters:**
  - `toast` -- toast widget instance
  - `remove` -- boolean, true to remove toast, false to add
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `seamlessplayerswap` -- stops updating when player swap begins (triggered on swap source)
- **Listens to:** `finishseamlessplayerswap` -- shows crafting and inventory if visible after swap completes (triggered on swap target)
- **Pushes:** `refreshhudsize` -- fired to owner HUD when HUD scale changes