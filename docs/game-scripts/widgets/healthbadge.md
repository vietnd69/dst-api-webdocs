---
id: healthbadge
title: Healthbadge
description: UI widget that displays player health status, effigy indicators, buff icons, and WX-78 shield visualization on the HUD.
tags: [ui, widget, health, hud]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: widgets
source_hash: e50276f6
system_scope: ui
---

# HealthBadge

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`HealthBadge` is a UI widget that extends `Badge` to display comprehensive health-related information for a player entity. It shows health percentage, effigy resurrection indicators (including grave stones), active buffs, corrosive debuffs, health-over-time effects, acid sizzling status, and WX-78 electric shield visualization. The widget updates dynamically based on owner entity state changes and listens to various health-related events.

## Usage example
```lua
local HealthBadge = require "widgets/healthbadge"

-- Create a health badge for a player entity
local owner = ThePlayer
local healthbadge = HealthBadge(owner, "status_health", "status_health")

-- Show an effigy indicator
healthbadge:ShowEffigy("normal")

-- Display a buff icon (symbol index)
healthbadge:ShowBuff(5)

-- Update WX-78 shield percentage
healthbadge:SetWxShieldPercent(0.75, 0.5, 100, 50)

-- Hide the effigy when broken
healthbadge:HideEffigy("normal")
```

## Dependencies & tags
**External dependencies:**
- `widgets/badge` -- parent class extended by HealthBadge
- `widgets/uianim` -- UIAnim widget for animated elements
- `widgets/text` -- Text widget for shield number display
- `prefabs/wagboss_util` -- utility functions for lunar burn damage checks

**Components used:**
- `owner.replica.health` -- reads health state, fire damage, lunar burn flags
- `owner.replica.hunger` -- checks starving status
- `owner.replica.inventory` -- checks for regen-tagged equipped items
- `owner.player_classified` -- reads sleep healing state
- `owner:IsFreezing()` / `owner:IsOverheating()` -- temperature status checks
- `owner:HasTag()` -- checks for heatresistant and wx78_shield tags
- `owner:HasDebuff()` -- checks for wintersfeastbuff debuff
- `owner:IsAcidSizzling()` -- acid damage status

**Tags:**
- `wx78_shield` -- checked on construction to add WX shield UI
- `heatresistant` -- affects overheating arrow animation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Modders can add symbol-build pairs via SetBuildForSymbol(). |
| `default_symbol_build` | string | `"status_abigail"` | Default build used for buff symbol overrides. |
| `topperanim` | UIAnim | `nil` | Animated element above the health number. |
| `circleframe2` | UIAnim | `nil` | Secondary circle frame animation. |
| `sanityarrow` | UIAnim | `nil` | Arrow indicator showing health regen/damage direction. |
| `effigyanim` | UIAnim | `nil` | Standard effigy resurrection indicator animation. |
| `gravestoneeffigyanim` | UIAnim | `nil` | Grave stone effigy indicator animation (Wendy-specific). |
| `effigy` | boolean | `false` | Whether an effigy is currently active/shown. |
| `effigybreaksound` | string | `nil` | Sound path played when effigy breaks. |
| `bufficon` | UIAnim | `nil` | Buff icon display animation. |
| `buffsymbol` | number | `0` | Current buff symbol index (0 = none). |
| `corrosives` | table | `{}` | Tracks active corrosive debuff entities. |
| `hots` | table | `{}` | Tracks active health-over-time buff entities. |
| `small_hots` | table | `{}` | Tracks active small health regen buff entities. |
| `acidsizzling` | UIAnim | `nil` | Acid sizzling visual effect (created on demand). |
| `wxshieldanim` | UIAnim | `nil` | WX-78 shield bar animation (created on demand). |
| `wxshieldanimflicker` | UIAnim | `nil` | WX-78 shield flicker effect animation. |
| `wxshieldanimnum` | Text | `nil` | WX-78 shield numeric value display. |
| `canwxshieldcharge` | boolean | `nil` | Whether WX-78 can currently charge shield. |
| `wxshieldpercent` | number | `nil` | Current WX-78 shield percentage (0-1). |
| `wxshieldoverpenetrationthreshold` | boolean | `nil` | Whether shield is above penetration threshold. |
| `arrowdir` | string | `nil` | Current sanity arrow animation direction. |

## Main functions
### `Class(Badge, function(self, owner, art, iconbuild) ... end)`
* **Description:** Constructor that initializes the HealthBadge widget. Extends Badge class and sets up all health-related UI elements including effigy indicators, buff icons, WX-78 shield visuals, and event listeners for health state changes.
* **Parameters:**
  - `owner` -- player entity that owns this badge
  - `art` -- art build name for the badge
  - `iconbuild` -- icon build name for the badge
* **Returns:** HealthBadge instance
* **Error states:** Errors if `owner` is nil when accessing owner properties or calling owner:HasTag().

### `SetBuildForSymbol(build, symbol)`
* **Description:** Registers a custom build for a specific buff symbol. Modders can use this to override default symbol builds.
* **Parameters:**
  - `build` -- string build name to use for the symbol
  - `symbol` -- number symbol index to override
* **Returns:** None
* **Error states:** None

### `ShowBuff(symbol)`
* **Description:** Displays a buff icon on the health badge. Plays activate animation when changing symbols, deactivate when clearing.
* **Parameters:** `symbol` -- number buff symbol index (0 clears the buff)
* **Returns:** None
* **Error states:** None

### `UpdateBuff(symbol)`
* **Description:** Alias for ShowBuff(). Updates the displayed buff icon.
* **Parameters:** `symbol` -- number buff symbol index
* **Returns:** None
* **Error states:** None

### `ShowEffigy(effigy_type)`
* **Description:** Shows the effigy resurrection indicator. Supports "grave" type for Wendy's gravestone effigy.
* **Parameters:** `effigy_type` -- string effigy type ("grave" or other)
* **Returns:** None
* **Error states:** None

### `HideEffigy(effigy_type)`
* **Description:** Hides the effigy indicator and schedules a break sound to play after animation completes.
* **Parameters:** `effigy_type` -- string effigy type ("grave" or other)
* **Returns:** None
* **Error states:** None

### `AddWxShield()`
* **Description:** Creates and initializes WX-78 electric shield UI elements. Called automatically if owner has "wx78_shield" tag on construction.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateNums()`
* **Description:** Adjusts health number position and shows/hides WX shield number based on shield percentage.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.num` is nil when calling SetScale/SetPosition.

### `SetWxCanShieldCharge(canshieldcharge)`
* **Description:** Updates whether WX-78 can currently charge shield. Triggers animation state change if charge capability changed.
* **Parameters:** `canshieldcharge` -- boolean whether shield can charge
* **Returns:** None
* **Error states:** Errors if `self.wxshieldanimflicker` is nil when accessing GetAnimState().

### `GetWxShieldIdleAnim()`
* **Description:** Returns the appropriate idle animation name based on shield charge state and penetration threshold.
* **Parameters:** None
* **Returns:** string animation name ("full", "half", "full_pulse", or "half_pulse")
* **Error states:** None

### `PlayWxShieldIdle()`
* **Description:** Plays the WX shield idle animation (determined by GetWxShieldIdleAnim).
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.wxshieldanimflicker` is nil.

### `PushWxShieldIdle()`
* **Description:** Pushes the WX shield idle animation onto the animation queue.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.wxshieldanimflicker` is nil.

### `SetWxShieldPercent(newpercent, oldpercent, maxshield, penetrationthreshold)`
* **Description:** Updates WX-78 shield percentage display. Plays appropriate transition animations and sounds based on shield state changes (activate, break, threshold crossing).
* **Parameters:**
  - `newpercent` -- number new shield percentage (0-1), defaults to current if nil
  - `oldpercent` -- number previous shield percentage (0-1), defaults to current if nil
  - `maxshield` -- number maximum shield value (default 100)
  - `penetrationthreshold` -- number threshold for full/half shield state
* **Returns:** None
* **Error states:** Errors if `self.wxshieldanim`, `self.wxshieldanimflicker`, or `self.wxshieldanimnum` are nil.

### `OnGainFocus()`
* **Description:** Called when the widget gains focus. Shows WX shield number if shield is active.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnLoseFocus()`
* **Description:** Called when the widget loses focus. Hides WX shield number display.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetPercent(val, max, penaltypercent)`
* **Description:** Sets the health percentage display. Also updates the topper animation based on penalty percentage.
* **Parameters:**
  - `val` -- number current health value
  - `max` -- number maximum health value
  - `penaltypercent` -- number penalty percentage (default 0)
* **Returns:** None
* **Error states:** Errors if `self.topperanim` is nil when accessing GetAnimState().

### `OnUpdate(dt)`
* **Description:** Periodic update function that refreshes the sanity arrow animation based on owner health state (freezing, overheating, starving, acid sizzling, corrosives, health regen, etc.).
* **Parameters:** `dt` -- number delta time since last update
* **Returns:** None
* **Error states:** Errors if `self.owner` or `self.owner.replica` is nil when accessing properties. Returns early if server is paused.

## Events & listeners
- **Listens to:** `animover` on effigyanim.inst -- hides effigy animation when deactivate animation completes
- **Listens to:** `animover` on gravestoneeffigyanim.inst -- hides grave effigy animation when deactivate animation completes
- **Listens to:** `startcorrosivedebuff` on owner -- tracks corrosive debuff entities in corrosives table
- **Listens to:** `onremove` on corrosive debuff entities -- removes debuff from corrosives table when debuff ends
- **Listens to:** `starthealthregen` on owner -- tracks health-over-time buff entities in hots table
- **Listens to:** `onremove` on hot debuff entities -- removes buff from hots table when buff ends
- **Listens to:** `startsmallhealthregen` on owner -- tracks small health regen entities in small_hots table
- **Listens to:** `stopsmallhealthregen` on owner -- removes small health regen from tracking
- **Listens to:** `onremove` on small hot debuff entities -- removes buff from small_hots table when buff ends
- **Listens to:** `isacidsizzling` on owner -- creates/removes acid sizzling visual effect based on state