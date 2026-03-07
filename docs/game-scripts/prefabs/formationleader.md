---
id: formationleader
title: Formationleader
description: Creates a non-persistent, non-interactive entity marker used to denote the leader of a formation group in DST.
tags: [ai, formation, marker]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 74ac8c1b
system_scope: entity
---

# Formationleader

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines the `formationleader` prefab, a lightweight, non-networked entity used internally to serve as a visual or logical marker for the leader of a formation group. It is not an interactive game object—its only properties are basic transform support and specific tags (`NOCLICK`, `NOBLOCK`, `formationleader`). It persists in the world only temporarily during gameplay and is not saved to disk.

## Usage example
This prefab is instantiated internally by the game logic (e.g., by the `formation` component or AI systems) and is not intended for direct use in mod code. A typical internal instantiation looks like:
```lua
local leader = Prefab("formationleader")()
leader.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None (the line `inst:AddComponent("formationleader")` appears to be present in the file, but no functional component named `"formationleader"` is referenced or required in the source—this may be an error or placeholder; if used elsewhere, it should be documented in related files.)  
**Tags:** Adds `NOCLICK`, `NOBLOCK`, and `formationleader`.

## Properties
No public properties.

## Main functions
Not applicable. This prefab is a static configuration and contains no functional methods.

## Events & listeners
None identified.
