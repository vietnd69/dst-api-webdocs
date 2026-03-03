---
id: trap_icestaff
title: Trap Icestaff
description: A static map layout defining spawn positions for an ice staff and multiple ice hounds in Don't Starve Together.
tags: [map, spawn, environment, trap]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 65f7000d
system_scope: environment
---

# Trap Icestaff

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_icestaff.lua` is a Tiled map layout file used to define a deterministic spawn configuration in the game world. It specifies a fixed placement of one `icestaff` object and five `icehound` entities within a 32x32 tile area (512x512 world units). This layout is typically used by world generation systems or event triggers to place an ice-based trap scenario — likely during specific events such as the "Staff Hounds" scenario or seasonal/miniboss encounters.

This file is not an ECS component, but a data structure consumed by the engine's map loading system to instantiate prefabs at designated coordinates.

## Usage example
This layout is not instantiated directly in mod code. Instead, it is referenced by worldgen or scenario systems, for example via a taskset or static_layout entry. Modders may load or inspect it using Tiled-compatible tooling, but runtime usage occurs internally during world generation.

## Dependencies & tags
**Components used:** None identified (data-only layout file, no ECS component logic)  
**Tags:** None identified (no tag manipulation)

## Properties
No public properties — this file exports a static Lua table conforming to the Tiled JSON schema, containing world layout metadata.

## Main functions
No functions — this file defines no executable logic or methods.

## Events & listeners
Not applicable — this file contains no event listeners or event-emitting logic.