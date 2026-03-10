---
id: quagmire_achievements
title: Quagmire Achievements
description: Defines achievement criteria and reward logic for the Quagmire seasonal event, including victory, tribute, chef, farmer, gatherer, and encore achievements with WXP-based progression and scoring rules.
tags: [achievements, quagmire, progression]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3d886a99
system_scope: player
---

# Quagmire Achievements

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file contains the static configuration for achievements unlocked during the Quagmire seasonal event in *Don't Starve Together*. It does not define a component class or entity behavior but instead declares a list of achievement definitions, grouped by categories (`encore`, `victory`, `tributes`, `chef`, `farmer`, `gatherer`), each with associated XP rewards, test conditions, and end-of-match evaluation functions. The definitions are consumed by the achievement system to track and award progress across players during a Quagmire match.

## Usage example
Achievement definitions are declared statically and returned by the script; they are never added to an entity or instantiated directly. A typical use case is internal to the game’s achievement tracking system, which loads and applies the definitions when evaluating match outcomes.

```lua
-- Achievements are registered globally by the event system using this file's return value.
-- The script is included in DST by the game when Quagmire season is active.
return {
    seasons = { 1 },
    eventid = "quagmire",
    achievements = Quagmire_Achievements,
}
```

## Dependencies & tags
**Components used:** `container` — accessed via `data.stewer.components.container:GetNumSlots()` for one achievement.  
**Tags:** None identified.

## Properties
No public properties. This is a pure data module returning static achievement definitions.

## Main functions
### `TestMatchTime(user, data, max_time)`
*   **Description:** Internal helper function used for time-based validation (currently commented out in source).
*   **Parameters:**  
    `user` (user object) — the player.  
    `data` (match data table) — contains match statistics, outcome, etc.  
    `max_time` (number) — maximum allowed time in seconds.  
*   **Returns:** `true` if the match was won and the match time is less than or equal to `max_time`; otherwise `false`.

### `TestForVictory(user, data)`
*   **Description:** Internal helper function for basic victory tests (currently commented out).
*   **Parameters:**  
    `user` (user object) — the player.  
    `data` (match data table) — match outcome data.  
*   **Returns:** `true` if `data.outcome.won` is `true`; otherwise `false`.

## Events & listeners
None. This file is a static data source and does not register or fire any events.