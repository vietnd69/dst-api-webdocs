---
id: resurrectionstone
title: Resurrectionstone
description: Static layout configuration for the Resurrection Stone stage, defining its tilemap and object placement.
tags: [map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e4f81522
system_scope: world
---

# Resurrectionstone

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout for the Resurrection Stone stage in Don't Starve Together. It specifies the Tiled map data structure used to render the stage's background tiles and object placements (e.g., resurrection stone, pig heads). Static layout files like this are consumed by the world generation system to instantiate physical stage environments and are not components attached to game entities.

## Usage example
This file is not used directly in mod code as a component. Instead, it is referenced by worldgen systems when spawning the Resurrection Stone map stage. No direct instantiation or Lua modification is expected for typical modding.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a JSON-serializable map configuration, not an ECS component.

## Main functions
Not applicable — this file returns raw map data and contains no executable logic.

## Events & listeners
None identified