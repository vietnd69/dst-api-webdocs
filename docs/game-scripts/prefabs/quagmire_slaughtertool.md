---
id: quagmire_slaughtertool
title: Quagmire Slaughtertool
description: Provides the UI action string for the Quagmire slaughtering mechanic, used when interacting with compatible targets.
tags: [quagmire, action, ui]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4c80b4ed
system_scope: ui
---

# Quagmire Slaughtertool

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_slaughtertool` prefab is an inventory item that supplies the dynamic action string displayed in the UI when performing a slaughter action in the Quagmire. It does not perform combat or logic itself, but serves as the source of the string returned by `GetSlaughterActionString`. The string is randomly selected from `STRINGS.ACTIONS.SLAUGHTER` and cached per target for `.1` seconds to avoid flickering.

## Usage example
```lua
local inst = ThePlayer
if inst.components.inventory ~= nil then
    inst.components.inventory:Equip("quagmire_slaughtertool")
end

-- Later, when a compatible target is in range:
local action_str = inst:GetSlaughterActionString(inst, target_entity)
-- action_str now holds a randomized slaughtering action phrase
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetSlaughterActionString(inst, target)`
*   **Description:** Returns a randomizedslaughter action string from `STRINGS.ACTIONS.SLAUGHTER`, cached per target for `.1` seconds to prevent UI flicker on repeated calls.
*   **Parameters:** 
    * `inst` (entity) — the inst拥有 the function (typically the player).
    * `target` (entity) — the target being slaughtered; used for cache invalidation.
*   **Returns:** string — a randomly selected action phrase.
*   **Error states:** Returns `nil` only if `GetRandomItem` fails (e.g., `STRINGS.ACTIONS.SLAUGHTER` is empty), but this is not expected in normal operation.

## Events & listeners
None identified