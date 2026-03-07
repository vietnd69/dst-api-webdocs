---
id: quagmire_beefalo
title: Quagmire Beefalo
description: Defines the Quagmire variant of the beefalo creature, including its visual appearance, physics, and tags.
tags: [entity, creature, overridable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 87d1fd3b
system_scope: entity
---

# Quagmire Beefalo

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_beefalo` prefab defines a variant of the beefalo creature specific to the Quagmire worldgen. It inherits standard beefalo behavior through the server-side `master_postinit` hook but overrides visual assets (such as animation builds) to match the Quagmire theme. This is a client-side prefab definition only; core logic is handled externally via `event_server_data`.

## Usage example
```lua
local inst = Prefab("quagmire_beefalo", beefalo, assets, prefabs)
local entity = SpawnPrefab("quagmire_beefalo")
-- The entity is fully initialized with appropriate physics, animations, and tags.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `beefalo`, `animal`, `largecreature`, `canbeslaughtered`.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component.

## Events & listeners
Not applicable — this is a prefab definition, not a component.