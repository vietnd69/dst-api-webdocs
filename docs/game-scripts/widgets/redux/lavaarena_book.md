---
id: lavaarena_book
title: Lavaarena Book
description: Manages the Lava Arena seasonal event book UI, rendering tabbed panels for progression, community unlocks, and quest history.
tags: [ui, seasonal, event, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cfd82aa3
system_scope: ui
---

# Lavaarena Book

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LavaarenaBook` is a UI widget that provides the main interface for the Lava Arena seasonal event's information hub. It renders a backdrop container with navigation tabs, dynamically building and switching between panels for Lava Arena progression, community unlocks, and quest history. It respects whether the event is active to adjust tab availability. It inherits from `Widget` and integrates with the Redux UI framework, including focus management and panel lifecycle handling.

## Usage example
```lua
local book = LavaarenaBook(main_menu_widget, secondary_left_menu, season)
book:DoInit()
-- Panel switching and focus is handled automatically via tab selection or controller inputs (L2/R2)
-- Use book:OnControl(CONTROL_MENU_L2, false) to switch tabs programmatically
```

## Dependencies & tags
**Components used:** None (pure UI widget; no `inst.components.X` calls)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `main_menu_widget` | Widget? | `nil` | Reference to the parent/main menu widget for focus routing. |
| `secondary_left_menu` | Widget? | `nil` | Reference to a secondary left-side menu for focus routing. |
| `season` | string | `nil` | The season identifier used by progression/quest panels. |
| `root` | Widget | - | Root widget container for all book elements. |
| `tab_root` | Widget | - | Container widget specifically for tab buttons. |
| `backdrop` | Image | - | Visual background element (900×550px). |
| `tabs` | table | `{}` | List of tab button widgets. |
| `last_selected` | ImageButton? | `nil` | The currently selected tab button. |
| `panel` | Widget? | `nil` | The currently active panel widget. |

## Main functions
### `GetTabButtonData()`
* **Description:** Returns the list of tab configurations, conditionally including the Progression tab only when the Lava Arena festival is active.
* **Parameters:** None.
* **Returns:** `table` — Array of tab descriptors with keys `x` (number), `text` (string), and `build_panel_fn` (function returning Widget).
* **Error states:** None.

### `:_MakeTab(data, index)`
* **Description:** Constructs and configures a single tab button (`ImageButton`) with localized text, scale, colors, and click handler to switch panels.
* **Parameters:** 
  * `data` (table) — Tab descriptor containing `x`, `text`, and `build_panel_fn`.
  * `index` (number) — 1-based position in the tab list, used for `_tabindex`.
* **Returns:** `ImageButton` — Fully configured tab button instance.
* **Error states:** None.

### `:BuildTabs(button_data)`
* **Description:** Builds and positions all tab buttons within `tab_root`, inserting them into the `self.tabs` array.
* **Parameters:** `button_data` (table) — Unused (implementation calls `GetTabButtonData()` internally).
* **Returns:** Nothing.

### `:DoInit()`
* **Description:** Initializes the book UI by constructing `tab_root`, backdrop, building tabs, and selecting/activating the first tab panel.
* **Parameters:** None.
* **Returns:** Nothing.

### `:_DoFocusHookups()`
* **Description:** Configures focus routing between the book's panel, main menu, and secondary left menu for keyboard/controller navigation (using `MOVE_LEFT`/`MOVE_RIGHT`).
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnControlTabs(control, down)`
* **Description:** Handles tab switching via controller inputs `CONTROL_MENU_L2` (left) and `CONTROL_MENU_R2` (right). Only triggers on `down == false`.
* **Parameters:** 
  * `control` (string) — Controller control identifier.
  * `down` (boolean) — Whether the button is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the control was handled; `false` otherwise.

### `:OnUpdate(dt)`
* **Description:** Propagates the update tick to the active panel, if any, enabling periodic panel logic (e.g., animations or state refresh).
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `:OnControl(control, down)`
* **Description:** Top-level control handler; delegates tab-switching logic to `OnControlTabs` after base-class handling.
* **Parameters:** Same as `OnControlTabs`.
* **Returns:** `boolean` — `true` if handled; `false` otherwise.

### `:GetHelpText()`
* **Description:** Returns localized help text describing how to switch tabs using controller inputs.
* **Parameters:** None.
* **Returns:** `string` — Human-readable help string (e.g., `"←/→ Change tab"`).

## Events & listeners
* **Listens to:** None identified.
* **Pushes:** None identified.