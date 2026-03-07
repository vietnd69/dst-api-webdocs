---
id: warly
title: Warly
description: Defines the Warly player character prefab, including health, hunger, sanity, eating preferences, and food memory configuration for Don't Starve Together.
tags: [player, chef, food, settings]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a084c1b
system_scope: player
---

# Warly

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines the `warly` player character prefab. It extends `player_common.lua` to configure Warly's base stats, preferred food types, and food memory mechanics. Warly is a professional chef who gains benefits from eating well-prepared food, has elevated food memory tolerance, and starts with a custom inventory tailored to his cooking profession.

## Usage example
```lua
-- This file is not instantiated directly; it returns a prefab definition.
-- To use Warly as a character, reference it in the characters list via:
-- TheNet:GetServerGameMode() == "survival" and "warly" or similar logic.
local warly = require("prefabs/warly")
-- The returned value is passed to the character registration system.
```

## Dependencies & tags
**Components used:**  
- `health` (via `SetMaxHealth`)
- `sanity` (via `SetMax`)
- `hunger` (via `SetMax`, `SetRate`)
- `eater` (via `SetPrefersEatingTag`)
- `foodmemory` (via `SetDuration`, `SetMultipliers`, added conditionally in `master_postinit`)

**Tags added:**  
- `masterchef`
- `professionalchef`
- `expertchef`

## Properties
No public properties. This file only defines a prefab factory function and post-initialization callbacks.

## Main functions
Not applicable. This is not a component class but a prefab definition.

## Events & listeners
Not applicable. This file does not register or push events directly.