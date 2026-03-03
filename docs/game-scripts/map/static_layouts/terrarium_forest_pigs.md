---
id: terrarium_forest_pigs
title: Terrarium Forest Pigs
description: Static map layout definition for the Terrarium forest biome with pig-themed decorative and functional objects.
tags: [map, static_layout, terrarium]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c97615ac
system_scope: world
---

# Terrarium Forest Pigs

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for a 5×5 tile forest-themed area used in the Terrarium biome. It specifies tile layer data for background tiles and an object group containing placement definitions for in-game objects such as `terrariumchest`, `pigtorch`, `berrybush2`, `sapling`, and `flower`. The layout is structured using Tiled map format metadata and does not contain any ECS components, constructors, or runtime logic — it is a purely declarative configuration used during world generation to instantiate environment assets.

## Usage example
This file is not used directly by mod code. Instead, it is consumed by the game's world generation system when loading the Terrarium biome. Modders typically do not interact with this file directly; it serves as input data for map loading.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a raw table of static layout configuration used by the engine.

## Main functions
No main functions — this is a data-only file returning a static configuration table.

## Events & listeners
Not applicable.