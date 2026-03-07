---
id: temp_beta_msg
title: Temp Beta Msg
description: A temporary message display item used in rifts events to convey boss kill timers and beta-gamestate information.
tags: [rifts, message, boss, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8594050d
system_scope: inventory
---

# Temp Beta Msg

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`temp_beta_msg` is an in-game item prefabricated for use during Rifts events. It functions as a mutable message display object that holds and updates descriptive text about boss encounter timers (`killtime`). It integrates with the `inspectable` component for dynamic description updates, `inventoryitem` for visual representation, and `fuel` for burnability. This item is not persistent across saves without explicit serialization via `OnSave`/`OnLoad` logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("inventoryitem")
inst:AddComponent("fuel")

-- Set up description and fuel behavior like the prefab does
inst.components.inspectable:SetDescription(STRINGS.TEMP_BETA_MSG.RIFTS6_BASIC)
inst.components.inventoryitem:ChangeImageName("mapscroll")
inst.components.fuel.fuelvalue = TUNING.SMALL_FUEL

-- Update kill timer for a boss
inst.SetKillTime = rifts5_SetKillTime
inst:SetKillTime(120, "wagboss_robot_possessed")
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `fuel`, `erasablepaper`, `smallburnable`, `smallpropagator`, `hauntablelaunch`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ver` | string | `"rifts6"` | Version marker for save/load compatibility. |
| `killtime` | number | `0` | Encoded kill timer value (seconds, rounded to nearest integer). |
| `boss` | string | `nil` | Name of the boss associated with the message. |
| `SetKillTime` | function | `rifts5_SetKillTime` | Method to dynamically update description with boss name and kill time. |
| `OnSave` | function | `OnSave` | Serialization handler for `killtime`, `boss`, and `ver`. |
| `OnLoad` | function | `OnLoad` | Deserialization handler to restore description and state. |

## Main functions
### `SetKillTime(killtime, prefabname)`
*   **Description:** Updates the `killtime` and `boss` values and recalculates the inspectable description using localized strings and format substitution. Typically called during rifts boss initialization or save migration.
*   **Parameters:**  
    `killtime` (number) — Approximate time in seconds before boss death, rounded to nearest integer.  
    `prefabname` (string | `nil`) — The prefab name of the boss; used to look up the display name in `STRINGS.NAMES`.
*   **Returns:** Nothing.
*   **Error states:** Uses `string.upper(prefabname or "wagboss_robot_possessed")` as fallback; no explicit error handling for invalid strings.

## Events & listeners
- **Listens to:** None  
- **Pushes:** `imagechange` — triggered indirectly via `inventoryitem:ChangeImageName("mapscroll")` during prefabrication.