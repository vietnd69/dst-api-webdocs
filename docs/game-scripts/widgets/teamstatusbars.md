---
id: teamstatusbars
title: Teamstatusbars
description: Manages and displays health status bars for teammates (other players and their pets) in the UI during multiplayer sessions.
tags: [ui, multiplayer, health]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 62a97b65
system_scope: ui
---

# Teamstatusbars

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TeamStatusBars` is a UI widget that dynamically maintains and positions health status bars for all teammates (other players and their pets) in a multiplayer game. It inherits from `Widget`, manages a dynamic list of `TeammateHealthBadge` children, and updates their order and visibility based on the current `AllPlayers` list. It supports toggling numeric health indicators and repositioning bars when the team composition changes.

## Usage example
```lua
local owner = ThePlayer
local team_bars = TeamStatusBars(owner)
team_bars:ShowStatusNumbers()
-- Team bars automatically update as players join/leave or pets spawn/despawn
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthbars` | table | `{}` | List of `TeammateHealthBadge` child widgets currently active. |
| `owner` | entity (widget parent) | — | The entity owning this widget (typically the local player). |

## Main functions
### `SetPercent(val, max, penaltypercent)`
* **Description:** Delegates setting health percentage to `Badge.SetPercent`, presumably to update the visual health fill level of the team status bars.
* **Parameters:**  
  - `val` (number) — current health value.  
  - `max` (number) — maximum health value.  
  - `penaltypercent` (number) — penalty factor (e.g., for status effects).  
* **Returns:** Nothing.  
* **Error states:** Relies on `Badge.SetPercent` — no internal validation reported.

### `OnUpdate(dt)`
* **Description:** Refreshes the list of health bars to match the current teammates (`AllPlayers` excluding the local player). It adds/removes badges, assigns new players to existing bars, handles pet visibility changes, and repositions bars if needed.
* **Parameters:**  
  - `dt` (number) — delta time since last frame (unused in logic, per signature).  
* **Returns:** Nothing.  
* **Error states:** May reposition bars and toggle the `stick` animation on the previous-to-last bar depending on bar count changes.

### `ShowStatusNumbers()`
* **Description:** Makes the health number labels visible on all active team bars (and pet bars if applicable).
* **Parameters:** None.  
* **Returns:** Nothing.

### `HideStatusNumbers()`
* **Description:** Hides the health number labels on all active team bars.
* **Parameters:** None.  
* **Returns:** Nothing.

### `RespostionBars()`
* **Description:** Calculates and applies positions for all health bars, spacing them vertically. Accounts for pets by applying extra vertical spacing when a pet is displayed.
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Notes:** Uses hardcoded layout constants: base position `(60, -60)`, bar spacing `-75`, and pet spacing `-16`.

## Events & listeners
- **Listens to:** None identified (event listeners are not present in the source).
- **Pushes:** None identified.