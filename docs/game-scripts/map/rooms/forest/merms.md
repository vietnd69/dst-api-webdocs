---
id: merms
title: Merms
description: Defines the MermTown room template for forest worlds, specifying tile type, visual color, and spawn rules for merm-related structures and entities.
tags: [map, room, spawning]
sidebar_position: 1
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: dc2741cc
---
# Merms

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script registers a map room template named `"MermTown"` in forest worlds. It defines the room's tile type (`WORLD_TILES.MARSH`), a semi-transparent purple color overlay, and the distribution rules for prefabs spawned within the room. The room is intended to generate merm-themed structures such as merm houses and tentacles alongside environmental assets like reeds and ponds. No entity component or logic is implemented here; this file solely contributes to world generation and procedural room placement.

## Usage example
This script does not define a reusable component class and is not intended for manual instantiation by modders. It is executed during world generation to define room templates. Therefore, no usage example is applicable for direct component usage.

## Dependencies & tags
**Components used:** None — this script does not interact with entity components.
**Tags:** None — this script does not manage entity tags.

## Properties
No properties are defined — this script does not instantiate a component class.

## Main functions
No main functions — this script executes top-level registration logic.

## Events & listeners
No events or listeners — this script does not register or emit events.

