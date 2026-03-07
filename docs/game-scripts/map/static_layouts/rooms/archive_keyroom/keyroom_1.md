---
id: keyroom_1
title: Keyroom 1
description: Defines the layout and static object placement for the Archive Keyroom in DST, used during the Ruins gameplay sequence.
tags: [map, environment, ruins]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 38d59f75
system_scope: environment
---

# Keyroom 1

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout (not a component in the ECS sense) for the Archive Keyroom used in the Ruins event sequence. It specifies Tiled map format data including tile layers and object placements for props like pillars, chandeliers, statues, furniture, and interactive points of interest. The layout is consumed by the world generation system to render the physical structure of the keyroom during Ruins gameplay.

## Usage example
This file is not used directly as a component. It is loaded as a static layout asset by the map generation system when the Archive Keyroom is instantiated during Ruins. Modders typically interact with it indirectly via worldgen scripts or static layout references.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable