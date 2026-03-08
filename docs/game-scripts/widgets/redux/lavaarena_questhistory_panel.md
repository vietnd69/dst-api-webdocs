---
id: lavaarena_questhistory_panel
title: Lavaarena Questhistory Panel
description: Displays a scrollable grid of completed Lava Arena quests with statistics, using a custom scrolling layout and achievement data.
tags: [ui, quests, event, panel, scrolling]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b7fb8a8e
system_scope: ui
---

# Lavaarena Questhistory Panel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LavaarenaQuestHistoryPanel` is a UI widget that renders a scrollable panel showing a player's completed Lava Arena quests, organized chronologically, along with summary statistics for daily wins and matches. It inherits from `Widget` and uses the `ScrollingGrid` template to display quest entries, pulling data from `EventAchievements` and formatting strings via `STRINGS.UI`. This panel is a specialized UI component for the Lava Arena event and integrates with localization, achievement parsing, and UI rendering systems.

## Usage example
```lua
local panel = LavaarenaQuestHistoryPanel("lavaarena", 1)
panel:SetPosition(0, 0)
self:AddChild(panel)
-- The panel populates automatically on creation using the provided festival_key and season
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `achievements_root` | Widget | `nil` | Root container widget for all visual elements in the panel. |
| `grid` | Widget (ScrollingGrid) | `nil` | The scrollable grid widget holding individual quest rows. |
| `focus_forward` | Widget | `self.grid` | The widget to receive focus when navigating into this panel. |
| `default_focus` | Widget | `self.grid` | The default widget to receive focus on entry. |
| `parent_default_focus` | Widget or `nil` | `self.grid` or `nil` | The widget to receive focus when exiting (set based on scrollbar visibility). |

## Main functions
### `GetCompletedQuests(festival_key, season)`
* **Description:** Retrieves and processes all unlocked Lava Arena quests for the given festival and season, categorizing them into daily wins, daily matches, and general completed quests (sorted by version/day descending).
* **Parameters:**  
  `festival_key` (string) — Identifier for the event festival (e.g., `"lavaarena"`).  
  `season` (number) — Season index for the event.  
* **Returns:** `details` (table) with keys `num_daily_wins` (number), `num_daily_matches` (number), and `completed_quests` (array of quest info tables).  
* **Error states:** No explicit error handling is present.

### `_BuildStatsPanel(quest_details)`
* **Description:** Constructs and returns a `Widget` containing summary statistics: count of completed quests, daily wins, and daily matches. Displays icons that change based on whether the counts are zero (locked state).
* **Parameters:**  
  `quest_details` (table) — The object returned by `GetCompletedQuests`.  
* **Returns:** `stats` (Widget) — A container widget with title, icons, and stat text.

### `_BuildAchievementsExplorer(festival_key, season, completed_quests)`
* **Description:** Builds and returns a `ScrollingGrid` widget for rendering completed quests in a two-column grid with scrolling. Each row displays quest icon, title, type/description (including character and personal/team type), XP value, and optional decorative lines.
* **Parameters:**  
  `festival_key` (string) — Event festival identifier.  
  `season` (number) — Season index.  
  `completed_quests` (array) — List of parsed quest info tables.  
* **Returns:** `grid` (Widget) — A `ScrollingGrid` instance configured with `ScrollWidgetsCtor` and `ScrollWidgetApply` functions for row creation and population.  
* **Error states:** Quest rows without associated `quest_info` are hidden automatically.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.