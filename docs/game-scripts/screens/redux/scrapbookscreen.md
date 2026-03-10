---
id: scrapbookscreen
title: Scrapbookscreen
description: Manages the scrapbook UI screen, displaying unlocked game knowledge with filtering, search, and per-entry details, while handling player input, focus navigation, and state persistence.
tags: [ui, player, persistence, navigation, knowledge]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 9da3092c
system_scope: player
---

# Scrapbookscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
The `ScrapbookScreen` class implements the scrapbook interface, a player-facing UI that visually displays unlocked game knowledge (e.g., creatures, recipes, items). It manages data filtering by category and search text, grid layout with configurable columns, dynamic entry details panel with stats, photos, dependencies, crafting recipes, and character quotes, and handles keyboard/controller input, focus routing, and visibility flash indicators for unviewed items. It persists user preferences (e.g., column count) and viewed status via `TheScrapbookPartitions` and `Profile`, and integrates with the global `dataset` and localization system.

## Usage example
```lua
-- Open the scrapbook screen programmatically
TheMod:LoadPostInit(function()
    local function open_scrapbook()
        TheMod:PushEvent("open_scrapbook")
    end

    local function on_event()
        local screen = ScrapbookScreen()
        TheFrontEnd:PushScreen(screen)
    end

    TheMod:ListenForEvent("open_scrapbook", on_event, TheMod)
end)
```

## Dependencies & tags
**Components used:** `TheScrapbookPartitions`, `Profile`, `ThePlayer`, `TheFrontEnd`, `TheInput`, `TheNet`, `TheInventory`, `GetScrapbookIconAtlas`, `GetInventoryItemAtlas`, `STRINGS`, `RecipesFilter` (via `recipes_filter.lua`), `scrapbookdata` (via `screens/redux/scrapbookdata.lua`)
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | `nil` | Owning entity instance (typically `ThePlayer`) |
| `self.root` | `Widget` | `nil` | Main screen container root |
| `self.letterbox` | `Widget` | `nil` | Letterbox container for screen edges |
| `self.bg` | `Widget` | `nil` | Background layer |
| `self.title` | `Widget` | `nil` | Screen title widget |
| `self.dialog` | `Widget` | `nil` | Dialog container (left side) |
| `self.detailsroot` | `Widget` | `nil` | Container for entry details panel |
| `self.gridroot` | `Widget` | `nil` | Container for item grid panel |
| `self.item_grid` | `Widget` | `nil` | Scrolling grid of scrapbook entries |
| `self.details` | `Widget` | `nil` | Top-level details container widget |
| `self.menubuttons` | `Array<Widget>` | `{}` | Sidebar category buttons |
| `self.last_filter` | `String?` | `nil` | Previously selected category filter |
| `self.menubuttons_selected` | `String?` | `nil` | Currently selected category |
| `self.current_dataset` | `Array<Table>` | `{}` | Dataset entries for current category |
| `self.current_view_data` | `Array<Table>` | `{}` | View data after search/filter |
| `self.columns_setting` | `Number` | `3` | Column count for grid (1, 2, 3, or 7) |
| `self.searchbox` | `Widget` | `nil` | Search input widget |
| `self.topbuttons` | `Widget?` | `nil` | Top bar container (search, column toggle) |
| `self.clearflash` | `Widget?` | `nil` | Clear-flash button (non-controller mode only) |
| `self.cancel_button` | `Widget` | `nil` | Cancel/back button |
| `self.closing` | `Boolean` | `false` | Whether screen is being closed |
| `self.flashestoclear` | `Boolean` | `false` | Whether any flashes exist to clear |
| `self.focus_forward` | `Widget?` | `self.item_grid` | Widget receiving focus on open |
| `self.depsbuttons` | `Array<Widget>?` | `nil` | Dependency buttons in details panel |
| `self.character_panels_total` | `Number` | `0` | Total character quote panels |
| `self.current_panel` | `Number?` | `nil` | Index of currently shown character quote panel |
| `self.character_pannel_first` | `Widget?` | `nil` | First character quote panel widget |

## Main functions
### `GetPeriodString(period)`
* **Description:** Converts a period in ticks into a localized, human-readable time string using appropriate units (seconds, minutes, days). It maps ticks to days (≈60 ticks/second, 8 seconds/day) and formats using `STRINGS.SCRAPBOOK.DATA_*` entries.
* **Parameters:**  
  `period`: Number — time elapsed in ticks (e.g., 480 ≈ 8 seconds).
* **Returns:** String — formatted time string (e.g., `"2 minutes"` or `"1 day"`).

### `ScrapbookScreen:SetPlayerKnowledge()`
* **Description:** Iterates over the global `dataset`, setting `knownlevel` for each entry by querying `TheScrapbookPartitions:GetLevelFor(prefab)`. Marks entries as unlocked in the UI.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:LinkDeps()`
* **Description:** Builds bidirectional dependency links in the dataset: for each `data.deps`, ensures the dependent entry exists in reverse. Skips entries with duplicate `data.entry` keys to prevent re-linking.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:FilterData(search_text, search_set)`
* **Description:** Filters `search_set` (defaults to all dataset entries) by `search_text`, matching against normalized item names and subcategories. If `search_text` is empty, restores the previous filter (`self.last_filter`). Updates `self.current_view_data` in-place.
* **Parameters:**  
  `search_text`: String — search query (trimmed and lowercased internally).  
  `search_set`: Table? — optional subset of dataset to filter; if `nil`, uses `self:CollectType(dataset)`.
* **Returns:** None.

### `ScrapbookScreen:SetSearchText(search_text)`
* **Description:** Normalizes `search_text` and calls `FilterData`, then refreshes the grid view. Used for real-time search input updates.
* **Parameters:**  
  `search_text`: String — raw user input.
* **Returns:** None.

### `ScrapbookScreen:MakeSearchBox(box_width, box_height)`
* **Description:** Constructs and returns a search text entry widget with event hooks (e.g., on text change), focus handling, and input validation. Includes a clear button that resets the search.
* **Parameters:**  
  `box_width`: Number — width in screen units.  
  `box_height`: Number — height in screen units.
* **Returns:** Widget — fully configured search box widget.

### `ScrapbookScreen:CollectType(set, filter)`
* **Description:** Filters `set` by `filter` type (e.g., `"creature"`) and returns a list of known entries (where `knownlevel > 0`). Unknown entries are padded with a `"FILLER"` placeholder to maintain consistent layout. Ensures only `SCRAPBOOK_CATS` types are included if sidebar buttons exist.
* **Parameters:**  
  `set`: Table — dataset to filter (usually the global `dataset`).  
  `filter`: String? — optional type filter (e.g., `"creature"`); if `nil`, collects all types.
* **Returns:** Table — filtered list of entries, with `"FILLER"` placeholders appended.

### `ScrapbookScreen:updatemenubuttonflashes()`
* **Description:** Updates sidebar category buttons to show/hide "new item" flash animations. Iterates over dataset: if an item is known but not yet viewed (`IsViewedInScrapbook(prefab) == false`), its category button is flagged. Toggles visibility of the clear-flash button (`self.clearflash`) if any flashes exist.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:SetGrid()`
* **Description:** Rebuilds the item grid via `BuildItemGrid`, repopulates with `self.current_view_data`, pads with `"FILLER"` entries to align grid dimensions, updates sidebar button flashes, resets focus, and plays a page-flip sound (`"portalswitch"`).
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:SelectMenuItem(dir)`
* **Description:** Rotates selection through sidebar buttons (`"down"` = next category, else previous). Updates `self.current_dataset`, `self.current_view_data`, and grid to match the selected category. Defaults to `"creature"` if no category is selected.
* **Parameters:**  
  `dir`: String — `"down"` for next category, otherwise previous.
* **Returns:** None.

### `ScrapbookScreen:SelectSideButton(category)`
* **Description:** Highlights the sidebar button matching `category`, hides selection state on others, and stores `category` in `self.last_filter` and `self.menubuttons_selected`.
* **Parameters:**  
  `category`: String — category key (e.g., `"creature"`).
* **Returns:** None.

### `ScrapbookScreen:MakeSideBar()`
* **Description:** Dynamically builds sidebar category buttons, including category name, progress percentage, and flash indicators for unviewed items. Filters available buttons against `SCRAPBOOK_CATS`.
* **Parameters:** None.
* **Returns:** None (populates `self.menubuttons` and adds widgets to `self.root`).

### `ScrapbookScreen:updatemenubuttonnewitem(data, setting)`
* **Description:** Marks a specific item (`data.prefab`) in its category button (`data.type`) as new/unviewed if `setting` is `true`, by adding it to `button.newcreatures`. Shows/hides the flash on the button if any items in its list are marked as new.
* **Parameters:**  
  `data`: Table — must contain `type` and `prefab`.  
  `setting`: Boolean — whether to mark item as new/unviewed.
* **Returns:** None.

### `ScrapbookScreen:ClearFlashes()`
* **Description:** Marks all known items (`knownlevel > 0`) as viewed via `TheScrapbookPartitions:SetViewedInScrapbook(prefab)` and refreshes the grid.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:MakeBottomBar()`
* **Description:** Creates the "Clear Flash" button, visible only in non-controller mode. On click, calls `ClearFlashes()`.
* **Parameters:** None.
* **Returns:** None (adds `self.clearflash`).

### `ScrapbookScreen:MakeTopBar()`
* **Description:** Builds the top UI bar: includes search box, column count toggle buttons (1, 2, 3, or 7), and binds the search box. Updates `self.columns_setting` and saves it persistently via `Profile:SetScrapbookColumnsSetting`.
* **Parameters:** None.
* **Returns:** None (adds `self.searchbox`, `self.topbuttons`, column toggle buttons).

### `ScrapbookScreen:MakeBackButton()`
* **Description:** Adds a standard back button that calls `Close()` on click.
* **Parameters:** None.
* **Returns:** None (adds `self.cancel_button`).

### `ScrapbookScreen:Close(fn)`
* **Description:** Ends the screen with a fade-out transition via `TheFrontEnd:FadeBack`. Optionally invokes `fn` upon completion.
* **Parameters:**  
  `fn`: Function? — optional callback to execute on close.
* **Returns:** None.

### `ScrapbookScreen:GetData(name)`
* **Description:** Retrieves a dataset entry by name (`dataset[name]`). Used to look up entry data for details and navigation.
* **Parameters:**  
  `name`: String — prefab name or key in `dataset`.
* **Returns:** Table? — `dataset[name]` or `nil` if not found.

### `ScrapbookScreen:BuildItemGrid()`
* **Description:** Constructs a scrolling grid widget (`ScrollWidgetsCtor`) for scrapbook entries. Binds widgets to entry data, handles icons/names/subcategories, and includes flash indicators. Includes dynamic grid layout with `columns_setting`.
* **Parameters:** None.
* **Returns:** Widget — `TEMPLATES.ScrollingGrid` instance.

### `calculteRotatedHeight(angle,w,h)`
* **Description:** Computes the vertical bounding box height of a rectangle of size `w×h` rotated by `angle` degrees (used for UI alignment of rotated assets).
* **Parameters:**  
  `angle`: Number — rotation in degrees.  
  `w`, `h`: Numbers — original width and height.
* **Returns:** Number — rotated height.

### `calculteRotatedWidth(angle,w,h)`
* **Description:** Computes the horizontal bounding box width of a rectangle of size `w×h` rotated by `angle` degrees.
* **Parameters:**  
  `angle`: Number — rotation in degrees.  
  `w`, `h`: Numbers — original width and height.
* **Returns:** Number — rotated width.

### `ScrapbookScreen:PopulateInfoPanel(entry)`
* **Description:** Constructs and returns the details panel widget for a given `entry` (e.g., a prefab). Dynamically builds panels for stats, photos/animations, dependencies, crafting recipes (via `CRAFTING_FILTERS`), and character quotes. Uses helper functions to render text, images, and custom blocks with randomized attachments and rotations. Handles known-level filtering and controller navigation.
* **Parameters:**  
  `entry`: String/Number — entry ID used to fetch data via `self:GetData(entry)`.
* **Returns:** Widget — page widget containing all UI elements for the entry.

### `ScrapbookScreen:CycleChraterQuotes(dir)`
* **Description:** Cycles between character quote panels (left or right). Hides current panel, increments/decrements `self.current_panel` cyclically, and shows the next panel with appropriate face button scaling. No-op if only one panel exists.
* **Parameters:**  
  `dir`: String — `"left"` for previous, otherwise next.
* **Returns:** None.

### `ScrapbookScreen:OnControl(control, down)`
* **Description:** Handles input controls for navigation and interaction. Includes: `CONTROL_CANCEL` (close), `CONTROL_MENU_L2/R2` (switch between grid and details), `CONTROL_START` (cycle column counts), `CONTROL_MISC_2` (cycle categories), `CONTROL_MISC_1` (clear flashes), `CONTROL_BACK` (cycle character quotes). Returns `true` if handled.
* **Parameters:**  
  `control`: Control enum — e.g., `CONTROL_CANCEL`, `CONTROL_MENU_L2`.  
  `down`: Boolean — `true` if pressed (not released).
* **Returns:** Boolean — `true` if the control was handled; otherwise delegates to base.

### `ScrapbookScreen:GetHelpText()`
* **Description:** Returns a concatenated, localized string of help text for all active controls, including entries for character quotes, view cycling, search, and clearing flashes. Conditional on screen state and controller presence.
* **Parameters:** None.
* **Returns:** String — help text with `"  "` separators.

### `ScrapbookScreen:DoFocusHookups()`
* **Description:** Configures keyboard/controller focus transitions between key widgets (`item_grid` ↔ `searchbox`). Dependency and character panel hooks are currently commented out.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:OnDestroy()`
* **Description:** Clean-up on screen destruction: unpause any autopaused state and calls base `OnDestroy`.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:OnBecomeActive()`
* **Description:** Activates screen: calls base `OnBecomeActive`, pushes `"scrapbookopened"` event on `ThePlayer`.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:OnBecomeInactive()`
* **Description:** Deactivates screen: calls base `OnBecomeInactive`.
* **Parameters:** None.
* **Returns:** None.

### `ScrapbookScreen:SelectEntry(entry)`
* **Description:** Re-populates the details panel with a new entry if different from current and valid. Triggers page-flip sound and updates focus hookups.
* **Parameters:**  
  `entry`: Entry ID to select.
* **Returns:** None.

### `ScrapbookScreen:DEBUG_REIMPORT_DATASET()`
* **Description:** Hot-reloads `scrapbookdata.lua` module. Conditionally clears `"skeleton"` or `"shallow_grave"` entries based on whether player skeletons are available.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners
- **Pushes:**  
  `"scrapbookopened"` — sent on `ThePlayer` when screen becomes active.

- **Listens to:** None