---
id: mastupgrade_lamp
title: Mastupgrade Lamp
description: Manages the behavior and lifecycle of a ship mast-mounted lamp, including lamp state (on/off), destruction, and loot generation upon deconstruction or burning.
tags: [environment, structure, lighting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7dd63c4a
system_scope: environment
---

# Mastupgrade Lamp

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mastupgrade_lamp` is a prefab definition that creates two closely related prefabs: the interactive mast lamp (`mastupgrade_lamp`) and its inventory counterpart (`mastupgrade_lamp_item`). The lamp is designed to be placed on a ship's mast and reacts to events like being turned on/off, deconstructed, or burnt. It integrates with the `lootdropper` component to generate loot on destruction. The lamp also integrates with its parent mast entity by registering itself in the mast's `highlightchildren` list for UI highlighting purposes.

## Usage example
```lua
-- Typical usage in a mast upgrade recipe:
return Prefab("mastupgrade_lamp", fn, assets, prefabs)

-- In game code, event handlers are attached automatically; clients receive highlighting updates
-- via OnEntityReplicated on non- master simulation instances.
```

## Dependencies & tags
**Components used:** `lootdropper` (added via `inst:AddComponent("lootdropper")`), `tradable`, `inspectable`, `inventoryitem`, `upgrader` (only in `itemfn` variant).  
**Tags:** Adds `NOCLICK` and `DECOR` to the attached entity instance.

## Properties
No public properties.

## Main functions
The prefabs expose no standalone public methods beyond component APIs (e.g., `lootdropper:SpawnLootPrefab`). All behavior is driven via event listeners.

## Events & listeners
- **Listens to:**  
  - `onbuilt` – triggers visual and sound feedback on placement.  
  - `onremove` – clears the `_lamp` reference on the parent mast.  
  - `mast_burnt` – drops loot at the mast's position and spawns a collapse effect.  
  - `mast_lamp_on` – enables light, plays "full" animation, starts looping sound.  
  - `mast_lamp_off` – disables light, plays "off" animation, stops sound.  
  - `ondeconstructstructure` – spawns each ingredient in the recipe individually as loot.

- **Pushes:** None directly (uses `PushEvent` internally via event callbacks, but does not define new events).

