---
id: walkingplank
title: Walkingplank
description: Creates a floating platform prefab attached to boats that can be haunted by Wickerbeast attacks.
tags: [loot, hauntable, boat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ffc7a11a
system_scope: world
---

# Walkingplank

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`walkingplank` is a prefab generator function that creates floating wooden platforms used as boat extensions in DST. Each instance is associated with a boat via entity hierarchy and serves as a deployable walkable surface. It supports hauntable mechanics (used by Wickerbeast attacks), loot dropping (via uncraftable recipes), and visual fidelity through build-specific animations. The component itself does not define logic directly in the source—its functionality is handled by the attached `walkingplank` component (referenced only via tag in code) and the `hauntable` component.

## Usage example
```lua
-- Typical usage occurs internally when a boat is placed and walking planks are spawned:
-- No direct modder interaction required.
-- Example of hauntable usage:
if inst.components.hauntable then
    inst.components.hauntable:SetHauntValue(TUNING.HAUNT_TINY)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `hauntable`, `walkingplank`  
**Tags:** `walkingplank`, `ignorewalkableplatforms`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable