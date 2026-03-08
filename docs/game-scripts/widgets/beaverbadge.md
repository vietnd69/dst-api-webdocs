---
id: beaverbadge
title: Beaverbadge
description: Renders the beaver meter UI widget with dynamic arrow animation based on the current sanity level and full moon state.
tags: [ui, sanity, weather]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 55ab87c0
system_scope: ui
---

# Beaverbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BeaverBadge` is a UI widget that extends `Badge` to display the beaver (sanity) meter. It visually represents the current sanity level as a percentage and adjusts its arrow animation based on both the sanity value and whether a full moon is active. It is used in the HUD to provide visual feedback about the player’s sanity status, particularly for characters affected by sanity mechanics like the beaver.

## Usage example
```lua
local beaverbadge = BeaverBadge(player)
player:AddChild(beaverbadge)
beaverbadge:SetPercent(player.components.sanity.current, player.components.sanity:GetMax())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sanityarrow` | `UIAnim` | `nil` | Animated arrow child widget displayed under the badge number. |
| `isfullmoon` | boolean | `false` | Current full moon state, observed from `TheWorld.state.isfullmoon`. |
| `val` | number | `100` | Current sanity percentage value. |
| `arrowdir` | string | `nil` | Name of the currently playing arrow animation. |

## Main functions
### `UpdateArrow()`
* **Description:** Updates the arrow animation based on the current `val` and `isfullmoon` state. Plays `"arrow_loop_decrease_most"` if it’s a full moon and `val > 0`, otherwise plays `"neutral"`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only updates the animation if the target animation differs from the current `arrowdir`.

### `SetPercent(val, max)`
* **Description:** Updates the displayed percentage and triggers arrow animation updates. Overrides `Badge.SetPercent` to maintain visual synchronization with sanity state.
* **Parameters:**  
  - `val` (number) — the current sanity value.  
  - `max` (number) — the maximum sanity value (used by parent `Badge` logic).  
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** `watch:isfullmoon` — internal world state change callback (`OnIsFullMoon`) that updates `isfullmoon` and calls `UpdateArrow()`.