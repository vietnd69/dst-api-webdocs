---
id: sanitybadge
title: Sanitybadge
description: Renders the sanity/lunacy indicator UI widget, including animations for sanity changes, rate direction, and ghost drain state.
tags: [ui, sanity, health]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d628cd7d
system_scope: ui
---

# Sanitybadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SanityBadge` is a UI widget component that visually represents a player's sanity or lunacy level using animated symbols and directional arrows. It inherits from `Badge`, integrates with the `sanity` replica component, and dynamically switches appearance and animations based on the current sanity mode (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`). It also handles visual feedback for sanity change rate, penalty overlays, ghost drain, and transitions between modes.

## Usage example
```lua
local badge = AddChildWidget(owner, "sanitybadge")
badge.owner = some_entity_with_sanity_replica
badge:StartUpdating()
badge:SetPercent(80, 100, 0) -- val, max, penalty
badge:PulseGreen() -- or PulseRed()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `sleeping` on owner; no tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sanitymode` | `SANITY_MODE_...` | `SANITY_MODE_INSANITY` | Current sanity mode (insanity or lunacy), used to select visual style. |
| `val`, `max` | number | `100`, `100` | Current and maximum sanity/lunacy values. |
| `penaltypercent` | number | `0` | Fraction (0–1) of penalty overlay to display. |
| `ghost` | boolean | `false` | Whether ghost drain is active. |
| `arrowdir` | string | `nil` | Current animation state of the sanity rate arrow. |
| `transition_task` | `Task` | `nil` | Delayed task for mode transition completion. |
| `topperanim` | `UIAnim` | — | Overlay animation for penalty indicator (e.g., crack effect). |
| `circleframe2` | `UIAnim` | — | Animated circle frame for sanity/lunacy transitions. |
| `sanityarrow` | `UIAnim` | — | Directional arrow anim showing sanity change direction/rate. |
| `ghostanim` | `UIAnim` | — | Anim for ghost drain visual effect. |

## Main functions
### `DoTransition()`
* **Description:** Switches visual assets between sanity and lunacy modes (e.g., background, icon, colors) and refreshes the percentage animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:**none.

### `SetPercent(val, max, penaltypercent)`
* **Description:** Updates the displayed sanity/lunacy value, penalty overlay, and initiates transition animations if the mode changed.
* **Parameters:**  
  `val` (number) — Current sanity/lunacy amount.  
  `max` (number) — Maximum sanity/lunacy amount.  
  `penaltypercent` (number, optional) — Penalty overlay amount (0–1). Defaults to `0`.
* **Returns:** Nothing.
* **Error states:**none.

### `SpawnTransitionFX(anim)`
* **Description:** Spawns a temporary UI animation effect at the badge's position during mode transitions.
* **Parameters:**  
  `anim` (string) — Name of the animation to play (`"transition_sanity"` or `"transition_lunacy"`).
* **Returns:** Nothing.
* **Error states:** If `self.parent` is `nil`, no FX is spawned.

### `PulseGreen()`
* **Description:** Triggers a green pulse animation if in sanity mode; otherwise (lunacy mode), triggers a red pulse.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:**none.

### `PulseRed()`
* **Description:** Triggers a red pulse animation if in sanity mode; otherwise (lunacy mode), triggers a green pulse.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:**none.

### `OnUpdate(dt)`
* **Description:** Updates the sanity arrow direction and ghost drain animation based on the owner's `sanity` replica data. Skipped if the server is paused.
* **Parameters:**  
  `dt` (number) — Time since last frame.
* **Returns:** Nothing.
* **Error states:**none.

## Events & listeners
- **Listens to:**  
  `animover` (on `ghostanim.inst`) — Triggers `OnGhostDeactivated`, which hides the ghost animation after deactivation completes.  
  `animover` (on FX `UIAnim`) — Triggers `RemoveFX`, which removes the temporary FX widget after animation completes.  
- **Pushes:** None.