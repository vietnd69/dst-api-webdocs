---
id: countdown
title: Countdown
description: Displays the number of days until the next game build update on the main screen.
tags: [ui, time]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 17f44900
system_scope: ui
---

# Countdown

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Countdown` is a UI widget that renders a countdown timer showing how many days remain until the next scheduled game build update. It is used on the main screen to inform players of upcoming updates or build freshness. It calculates time differences using client-side OS time and a hardcoded timezone offset (`klei_tz`), and decides whether to display based on specific thresholds relative to the build date and update schedule.

## Usage example
```lua
local countdown = CreateWidget("Countdown")
countdown:ShouldShowCountdown({year = 2026, month = 4, day = 15, hour = 13})
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Uses `STRINGS.UI.MAINSCREEN.*` localization keys.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or nil | `nil` | The entity that owns this widget (typically unused, set during construction). |
| `daysuntilanim` | UIAnim | created in constructor | Animated visual element showing a status indicator ("about", "coming", "fresh"). |
| `daysuntiltext` | Text | created in constructor | Text element displaying the day count message. |
| `days_until_string` | string | nil | Cached string used for the display text. |

## Main functions
### `ShouldShowCountdown(date)`
* **Description:** Determines whether the countdown should be visible based on the provided date and current build time. Returns `true` and updates display if the update is imminent (≤14 days), recently released (≤2 days), or in a refresh window.
* **Parameters:** `date` (table) — a table in the format `{year, month, day, hour}` representing the next update time.
* **Returns:** `boolean` — `true` if the countdown should be shown; otherwise `false`.
* **Error states:** Returns `false` if `date` is `nil` or not a table.

### `SetDisplay(days_until, days_since, build_update_diff)`
* **Description:** Sets the text and animation state of the countdown based on time deltas. Only the `days_until` value is required for decision logic; the others are optional helper values.
* **Parameters:**  
  - `days_until` (number) — estimated days until next update (can be negative).  
  - `days_since` (number) — days since the last build.  
  - `build_update_diff` (number) — difference between build date and update date, in days.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if both `days_until` and `days_since` are `nil`.

## Events & listeners
None identified.