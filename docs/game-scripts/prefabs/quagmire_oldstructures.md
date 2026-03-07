---
id: quagmire_oldstructures
title: Quagmire Oldstructures
description: Defines prefabs for Quagmire-era decorative and structural props (e.g., rubble, carriage, clocktower) used in the old structures theme.
tags: [decor, environment, prefabs, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9168e502
system_scope: environment
---

# Quagmire Oldstructures

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines a set of prefabs used to populate decorative and structural elements in the Quagmire Old Structures biome. It exports two key prefabs: `quagmire_old_rubble` (a standalone decoration entity) and several structured prefabs (e.g., `quagmire_rubble_carriage`, `quagmire_rubble_clocktower`) created via `MakeStrcuture`. These prefabs are static, non-networked or non-interactive by default (tags `DECOR`, `NOCLICK`), and optionally host runtime-generated rubble particles around their base.

The prefabs are loaded only in the client world (`TheWorld.ismastersim` controls logic), and include:
- Base `quagmire_old_rubble` prefab for random rubble placement.
- Structured prefabs with optional animation states and per-instance decoration population (`PopulateDecor`) for clustered rubble effects.

## Usage example
```lua
-- Spawn a standalone rubble decoration
local rubble = SpawnPrefab("quagmire_old_rubble")
rubble.Transform:SetPosition(x, 0, z)

-- Spawn a structured item like the clocktower (with animation + embedded rubble decor)
local clocktower = SpawnPrefab("quagmire_rubble_clocktower")
clocktower.Transform:SetPosition(x, 0, z)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `DECOR` and `NOCLICK` to `quagmire_old_rubble`; adds `NOCLICK` to non-animated structured prefabs.

## Properties
No public properties.

## Main functions
Not applicable — this file is a prefab factory, not a component. It defines top-level functions for entity construction (`decorfn`, `common_fn`, `SpawnDecor`, `PopulateDecor`) and returns prefab definitions.

## Events & listeners
Not applicable — this file does not define or listen to events.