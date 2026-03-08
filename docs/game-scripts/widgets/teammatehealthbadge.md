---
id: teammatehealthbadge
title: Teammatehealthbadge
description: Renders a player's health and optional pet health as a UI badge in Lava Arena scenarios.
tags: [ui, health, lava-arena, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a1428239
system_scope: ui
---

# Teammatehealthbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TeammateHealthBadge` is a specialized UI widget that visually displays a teammate’s current health status and optional pet health within Lava Arena matches. It extends `Badge`, and integrates with the `healthsyncer` and `pethealthbar` components to update health percentage, direction (increasing/decreasing), and pet heart indicators. It also renders the player's name with a dynamic banner layout.

## Usage example
```lua
local badge = TeammateHealthBadge(owner)
badge:SetPlayer(player_entity)
-- Subsequent health updates are handled automatically via event callbacks
```

## Dependencies & tags
**Components used:** `healthsyncer`, `pethealthbar`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `player` | entity or `nil` | `nil` | The player entity whose health this badge represents. |
| `userid` | string or `nil` | `nil` | User ID of the player, assigned when `SetPlayer()` is called. |
| `arrowdir` | number | `0` | Current health trend direction: `-2`/`-1` (decreasing), `0` (stable), `1`/`2` (increasing). |
| `percent` | number | `0` | Last known health percentage (clamped to ≥ `0.001`). |
| `pet_heart` | `Badge` or `nil` | `nil` | Optional badge showing pet health. |

## Main functions
### `SetPlayer(player)`
* **Description:** Assigns a player entity to the badge, sets up event listeners for health updates, configures the player name, health icon, and conditionally adds pet health support.
* **Parameters:** `player` (table) — Player entity with `userid`, `name`, `playercolour`, `prefab`, and optional `components.healthsyncer` / `components.pethealthbar`.
* **Returns:** Nothing.
* **Error states:** If a previous player was assigned, it removes prior event callbacks and cleans up pet health components.

### `SetPercent(val)`
* **Description:** Updates the displayed health percentage and triggers visual feedback (green/red pulse, status arrow update) based on the change in health.
* **Parameters:** `val` (number) — Health percentage (will be clamped to ≥ `0.001` if `0`).
* **Returns:** Nothing.
* **Error states:** Calls `Badge.SetPercent(self, val)` internally; relies on `RefreshStatus()` to update trend arrow.

### `RefreshStatus()`
* **Description:** Updates the status arrow animation and warning tint based on health trend and absolute percentage.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Uses `healthsyncer:GetOverTime()` and `GetPercent()`; does nothing if `healthsyncer` is `nil`.

### `AddPet()`
* **Description:** Creates and positions a secondary pet health badge if the player has a `pethealthbar` component.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Adds event callbacks for `"clientpethealthdirty"` and `"clientpethealthsymboldirty"`.

### `RemovePetHealth()`
* **Description:** Cleans up the pet health badge and removes associated event callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshPetHealth()`
* **Description:** Updates the pet health badge’s symbol (e.g., Abigail’s heart variant) and percentage.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `pethealthbar` is `nil` or invalid; clamps `percent` to ≥ `0.001`.

### `IsShowingPet()`
* **Description:** Returns whether the pet health badge is currently visible.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `pet_heart` exists and is visible.

## Events & listeners
- **Listens to:**
  - `"clienthealthdirty"` (on player) — updates health percentage via `SetPercent`.
  - `"clienthealthstatusdirty"` (on player) — calls `RefreshStatus`.
  - `"clientpethealthdirty"` (on player) — calls `RefreshPetHealth`.
  - `"clientpethealthsymboldirty"` (on player) — calls `RefreshPetHealth`.
- **Pushes:** None.