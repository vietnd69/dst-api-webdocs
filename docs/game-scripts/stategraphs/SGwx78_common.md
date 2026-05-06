---
id: SGwx78_common
title: SGwx78 Common
description: Helper functions for building WX-78 stategraph states.
tags: [stategraph, helper, wx78]
sidebar_position: 10
last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: dataconfig
source_hash: 0dae64e9
system_scope: entity
---

# SGwx78 Common

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
This data configuration file provides helper functions for constructing stategraph states specific to the WX-78 character. It defines a table of functions that add spinning, shielding, screeching, and baking states to stategraphs. These functions are called during the WX-78 prefab construction to build its animation state machine.

## Usage example
```lua
local SGWX78Common = require("stategraphs/SGwx78_common")
local states = {}
SGWX78Common.AddWX78SpinStates(states)
SGWX78Common.AddWX78ShieldStates(states)
SGWX78Common.AddWX78ScreechStates(states)
SGWX78Common.AddWX78BakeState(states)
-- Attach states to WX-78 entity's stategraph
```

## Dependencies & tags
**External dependencies:**
- `components/dynamicmusic` — Provides `ShouldPlayDangerMusic` for danger music playback during combat actions.

**Components used:**
- `locomotor` -- Stop, GetRunSpeed, WantsToMoveForward
- `playercontroller` -- IsEnabled, IsAnyOfControlsPressed, RemotePausePrediction
- `skilltreeupdater` -- IsActivated
- `combat` -- CanTarget, IsAlly, SetTarget, TargetIs
- `health` -- IsDead
- `inventory` -- GetEquippedItem
- `talker` -- ShutUp, IgnoreAll, StopIgnoringAll
- `efficientuser` -- AddMultiplier, RemoveMultiplier
- `aoediminishingreturns` -- mult property
- `lunarhailbuildup` -- DoWorkToRemoveBuildup, IsBuildupWorkable
- `pickable` -- Pick, CanBePicked, IsStuck
- `sleeper` -- WakeUp
- `wx78_abilitycooldowns` -- RestartAbilityCooldown

**Tags:**
- `prespin` -- added/removed in states
- `wx_shielding` -- added/removed
- `wx_screeching` -- added/removed
- `busy` -- added/removed
- `dizzy` -- added/removed
- `nopredict` -- added/removed
- `overridelocomote` -- added/removed

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SGWX78Common` | table | --- | Top-level table containing helper functions for WX-78 stategraph states. |
| `AddWX78SpinStates` | function | --- | Adds spin states (wx_spin_start, wx_spin, wx_spin_dizzy) to the stategraph. Handles spin movement, target selection, and damage efficiency. |
| `AddWX78ShieldStates` | function | --- | Adds shield states (wx_shield_pre, wx_shield_on, wx_shield_idle, etc.) to the stategraph. Handles shield activation, damage mitigation, and taunting behavior. |
| `AddWX78ScreechStates` | function | --- | Adds screech states (wx_screech_pre, wx_screech_loop, wx_screech_pst) to the stategraph. Handles screech animation, panic effect application, and cooldown management. |
| `AddWX78BakeState` | function | --- | Adds bake state (wx_bake) to the stategraph. Handles food brick spawning and animation timing for baking actions. |

## Main functions
**None.**

## Events & listeners
**None.**