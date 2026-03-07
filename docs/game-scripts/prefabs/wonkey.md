---
id: wonkey
title: Wonkey
description: Defines the Wonkey player character by configuring health, hunger, sanity, locomotion, food affinity, and visual/talker assets.
tags: [player, character, customization]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 80f62919
system_scope: player
---

# Wonkey

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wonkey.lua` defines the `wonkey` player character prefab for *Don't Starve Together*. It extends `player_common.lua` and customizes the entity with Wonkey-specific stats (health, hunger, sanity, movement speed), food affinity for cave bananas, and unique visual/talker assets. This file does not define a standalone component but rather serves as a character template that configures a player entity using existing components.

## Usage example
Wonkey is instantiated automatically by the game as a playable character and does not require direct component usage. However, a modder could extend its behavior like this:
```lua
local wonkey = Prefab("wonkey")
wonkey.prefabname = "wonkey"
wonkey.asset = "anim/player_idles_wonkey.zip"
wonkey.sound = "sound/webber.fsb"
wonkey.tags = {"wonkey", "monkey"}
-- Access via inst.components.health, inst.components.foodaffinity, etc.
```

## Dependencies & tags
**Components used:** `foodaffinity`, `health`, `hunger`, `sanity`, `locomotor`
**Tags:** Adds `wonkey`, `monkey` (via `common_postinit`)

## Properties
No public properties are defined or stored directly in this file. Configuration uses external constants (e.g., `TUNING.*`) and component API calls.

## Main functions
Not applicable — this file defines a prefab, not a component with reusable methods.

## Events & listeners
Not applicable — this file does not register or fire events.