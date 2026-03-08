---
id: pethealthbadge
title: Pethealthbadge
description: Displays a pet's health as a badge with optional dual buff icons and directional health-change indicators.
tags: [ui, health, pet, buff]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 22a7e585
system_scope: ui
---

# Pethealthbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PetHealthBadge` is a UI widget component that visually represents a pet's health using a numeric percentage indicator, a dynamic arrow (for health change direction and magnitude), and up to two simultaneous buff icons. It extends the base `Badge` class and is specifically tailored for pet health display in the game's UI system. The component manages animated states for health increase/decrease, buff activation/deactivation, and supports runtime override of icon builds per buff symbol.

## Usage example
```lua
local pet_badge = CreateWidget(PetHealthBadge, owner, Colour.GREEN, "health_icon", Colour.RED)
pet_badge:SetValues(1, 0, 0.75, 1, 100, 0, 20, 0.1)
pet_badge:SetBuildForSymbol("my_custom_buff", "custom_buff_build")
pet_badge:ShowBuff(1)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Modder-editable lookup table mapping buff symbols to custom UI builds. |
| `default_symbol_build` | string | `iconbuild` | Default build used when a buff symbol lacks an override. |
| `default_symbol_build2` | string | `iconbuild` | Duplicate of `default_symbol_build`, used by `bufficon2`. |
| `arrow` | UIAnim | (created in constructor) | UI element displaying health-change direction via animation. |
| `bufficon` | UIAnim | (created in constructor) | First buff icon UI element (left side). |
| `bufficon2` | UIAnim | (created in constructor) | Second buff icon UI element (right side, mirrored horizontally). |
| `buffsymbol` | number | `0` | Active buff symbol currently shown on `bufficon`. |
| `buffsymbol2` | number | `0` | Active buff symbol currently shown on `bufficon2`. |
| `arrowdir` | number | `nil` | Cached last arrow direction; used to prevent redundant animation resets. |

## Main functions
### `SetBuildForSymbol(build, symbol)`
* **Description:** Registers a custom UI build for a given buff symbol, allowing mods to override the default icon used for that symbol in the badge.
* **Parameters:**  
  `build` (string) — name of the UI build asset to use for the symbol.  
  `symbol` (any) — key (typically a number or string) identifying the buff type.
* **Returns:** Nothing.

### `ShowBuff(symbol)`
* **Description:** Updates the first buff icon (`bufficon`) to display the specified symbol. Handles transitions between activate → idle, deactivate → none, or static updates.
* **Parameters:**  
  `symbol` (any) — identifier for the buff to show; `0` hides the icon.
* **Returns:** Nothing.
* **Error states:** No-op if the new symbol matches the currently displayed one (`self.buffsymbol`).

### `ShowBuff2(symbol)`
* **Description:** Updates the second buff icon (`bufficon2`) — a mirrored version — analogously to `ShowBuff`.
* **Parameters:**  
  `symbol` (any) — identifier for the secondary buff; `0` hides the icon.
* **Returns:** Nothing.
* **Error states:** No-op if the new symbol matches `self.buffsymbol2`.

### `SetValues(symbol, symbol2, percent, arrowdir, max_health, pulse, bonusmax, bonuspercent)`
* **Description:** Refreshes the entire badge state: sets both buff icons, updates the health percentage and bonus, adjusts the directional arrow animation, and triggers health-change pulses (green or red).
* **Parameters:**  
  `symbol` (any) — primary buff symbol (for `bufficon`).  
  `symbol2` (any) — secondary buff symbol (for `bufficon2`).  
  `percent` (number) — health as fraction of `max_health` (clamped to `>= 1/max_health` if non-zero).  
  `arrowdir` (number) — direction/magnitude of health change:  
    - `<= -2`: large decrease  
    - `-1`: slight decrease  
    - `0`: stable  
    - `1`: slight increase  
    - `>= 2`: large increase  
  `max_health` (number) — total max health used to compute absolute health for scaling.  
  `pulse` (number) — `1` triggers green pulse, `2` triggers red pulse; `0` disables pulse.  
  `bonusmax` (number) — unused in current implementation (argument present but ignored).  
  `bonuspercent` (number) — bonus health fraction used internally by `SetPercent`.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Reserved for future updates; currently empty.
* **Parameters:**  
  `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
None identified