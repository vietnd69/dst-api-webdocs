---
id: spillagmites
title: Spillagmites
description: Registers cave room templates populated with stalagmites, pillars, spider holes, and other ambient cave debris for world generation.
tags: [world, room, generation]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 1adba95c
---
# Spillagmites

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines five static cave room templates—`SpillagmiteForest`, `DropperCanyon`, `StalagmitesAndLights`, `SpidersAndBats`, and `ThuleciteDebris`—as well as two variants (`BGSpillagmite` and `BGSpillagmiteRoom`) used in the underground layer. Each room template specifies visual properties (`colour`, `value`), world tile type, tags, and a probabilistic distribution of ambient prefabs such as stalagmites, pillars, spider holes, and rare features like fissures or thulecite. It relies on the `map/room_functions` module to register and format room definitions via `AddRoom` and `Roomify`.

## Usage example
This file is not used as a component; it is a world generation configuration script executed during world initialization. It is not intended for direct instantiation or manual use in mod code.

```lua
-- Example: Loading the room definitions is automatic during worldgen.
-- No manual usage is required or supported.
-- These room templates are referenced by worldgen tasks and tasksets.
```

## Dependencies & tags
**Components used:** None — this file is a world generation configuration and does not attach components or use component APIs.
**Tags:** All room definitions include the tag `"Hutch_Fishbowl"`.

## Properties
None — this file does not define a component class or any persistent instance properties.

## Main functions
This file does not define any functional methods. It only defines reusable room configurations for use by the world generation system.

## Events & listeners
This file does not define any event listeners or push any events.

