---
id: beefalo
title: Beefalo
description: Defines a forest room template named "BeefalowPlain" that procedurally populates the world with grass and beefalo entities during map generation.
tags: [world, room, spawn, generation]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 1bfad8b2
---
# Beefalo

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines the `BeefalowPlain` room using the `AddRoom` function, which specifies procedural room contents for map generation in the Forest world. It is not a component attached to entities, but rather a room configuration registered with the world generator. The room assigns a specific color tint, assigns `WORLD_TILES.SAVANNA` as the base tile type, and specifies that `grass` and `beefalo` prefabs should be distributed with certain probabilities when the room is placed in the world.

## Usage example
This file is not intended for manual instantiation or direct usage by modders. It registers a room definition during engine startup by calling `AddRoom("BeefalowPlain", {...})`. Room definitions like this are automatically loaded by the world generation system when building the map.

## Dependencies & tags
**Components used:** None — this file does not define or interact with components.  
**Tags:** None identified.

## Properties
No properties are defined in this file, as it only passes configuration data to the `AddRoom` function.

## Main functions
No functions are defined in this file. It is a top-level script that registers a room configuration via `AddRoom`.

## Events & listeners
No events or listeners are defined in this file.

