---
id: healthbadge
title: Healthbadge
description: Renders a dynamic UI badge overlay that visually represents health status, buffs, effigies, and various status effects (e.g., freezing, healing, corrosion) for an entity.
tags: [ui, status, visual]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 490c1911
system_scope: ui
---

# Healthbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`HealthBadge` is a specialized UI widget that extends `Badge` to provide rich, animated visual feedback for a player or entity's health-related state. It integrates with the entity's health, hunger, and debuff components to display status arrows, effigy indicators, buff icons, and visual FX (e.g., acid sizzling). It is typically attached to entities with a `health` component (e.g., players) to offer real-time, client-side status visualization.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("healthbadge")
-- Optional: set a custom symbol → build mapping
inst.components.healthbadge:SetBuildForSymbol("status_custom", 1)
-- Optional: display a buff with symbol ID
inst.components.healthbadge:ShowBuff(1)
-- Optional: show/hide effigy state
inst.components.healthbadge:ShowEffigy("grave")
inst.components.healthbadge:HideEffigy("grave")
```

## Dependencies & tags
**Components used:** `health` (via `replica.health`), `hunger` (via `replica.hunger`), `inventory` (via `replica.inventory`), `player_classified` (via `player_classified.issleephealing`)
**Tags:** None added or removed directly; reads `heatresistant`, `regen` tags and debuff `"wintersfeastbuff"` for conditionals.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Map of symbol IDs to build names for custom buff icons. |
| `default_symbol_build` | string | `"status_abigail"` | Fallback build for buff icons. |
| `effigy` | boolean | `false` | Tracks whether an effigy indicator is currently shown. |
| `effigybreaksound` | string or nil | `nil` | Sound path to play when effigy animation finishes deactivating. |
| `corrosives`, `hots`, `small_hots` | tables | `{}`, `{}`, `{}` | Track active corrosive, hot, and small hot debuffs via event keys. |
| `acidsizzling` | UIAnim or nil | `nil` | Anim instance for acid sizzle FX; created on demand. |

## Main functions
### `SetBuildForSymbol(build, symbol)`
* **Description:** Registers a custom build name for a given buff symbol ID, allowing mods to override default buff icon animations.
* **Parameters:** `build` (string) – asset build name (e.g., `"status_mybuff"`); `symbol` (number) – symbol ID key.
* **Returns:** Nothing.

### `ShowBuff(symbol)`
* **Description:** Updates the buff icon based on the provided symbol ID, playing activate/deactivate or idle animations as needed.
* **Parameters:** `symbol` (number) – symbol ID (`0` hides the buff).
* **Returns:** Nothing.

### `UpdateBuff(symbol)`
* **Description:** Alias for `ShowBuff(symbol)`. Provided for API consistency.
* **Parameters:** `symbol` (number) – symbol ID.
* **Returns:** Nothing.

### `ShowEffigy(effigy_type)`
* **Description:** Shows the appropriate effigy animation (`status_health` or `status_wendy_gravestone`) for the given type (`"grave"` or otherwise).
* **Parameters:** `effigy_type` (string) – either `"grave"` or another string (e.g., `"effigy"`).
* **Returns:** Nothing.

### `HideEffigy(effigy_type)`
* **Description:** Plays the effigy deactivation animation and schedules sound playback after 7 frames.
* **Parameters:** `effigy_type` (string) – either `"grave"` or another string.
* **Returns:** Nothing.

### `SetPercent(val, max, penaltypercent)`
* **Description:** Updates the health bar fill percentage and adjusts the top animation (e.g., health arrow) based on penalty.
* **Parameters:** `val` (number) – current value; `max` (number) – maximum value; `penaltypercent` (number, optional) – penalty ratio (0–1). Defaults to `0`.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically updates the health arrow animation state based on entity status conditions (e.g., freezing, overheating, healing, acid sizzling).
* **Parameters:** `dt` (number) – time elapsed since last frame.
* **Returns:** Nothing.
* **Error states:** Early-exits without update if `TheNet:IsServerPaused()`.

## Events & listeners
- **Listens to:**
  - `startcorrosivedebuff`, `starthealthregen`, `startsmallhealthregen` – registers active debuffs and attaches `onremove` callbacks.
  - `stopsmallhealthregen` – explicitly removes small hot debuffs and their callbacks.
  - `isacidsizzling` – toggles the acid sizzle FX.
  - `animover` (on `effigyanim`, `gravestoneeffigyanim`) – triggers hiding the effigy when deactivation animation ends.
- **Pushes:** No events are pushed by this component.

