---
id: one
title: One
description: Represents a Tiled map file for the Hallway Armoury room's "one" layout configuration.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 28574d13
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout data for a specific variant (`one`) of the Hallway Armoury room in DST's world generation system. It is a Tiled map export (JSON-like table structure) describing tile placement (`BG_TILES` layer), coordinate system (`orthogonal`, 32×32 grid), and tileset metadata. It does *not* function as a component attached to entities; rather, it serves as procedural room layout data consumed by world generation systems.

## Usage example
Not applicable — this file returns static map metadata used internally by the game's room generation system, and is not instantiated or manipulated directly by modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — the file returns a plain Lua table of map configuration data with no component-level variables.

## Main functions
Not applicable — this file contains no functions.

## Events & listeners
Not applicable.