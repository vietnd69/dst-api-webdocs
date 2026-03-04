---
id: trap_sleepingspider
title: Trap Sleepingspider
description: Defines a Tiled map layout for the sleeping spider ambush trap, containing spawn positions for the spider and decorative world objects.
tags: [trap, environment, level-design]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c63f6eb8
system_scope: environment
---

# Trap Sleepingspider

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_sleepingspider.lua` is a static map layout definition used for the "sleeping spider" ambush trap encountered in the Caves layer. It specifies tile data for background tiles and a list of objects (including a spider spawn point, decor, and walls) placed within a 32x32 grid. This file is processed by the world generation system to render the trap environment when players enter the designated area.

## Usage example
This file is not used directly as a component; it is referenced by world generation systems when spawning the sleeping spider trap room. Modders typically do not interact with this file directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file is a data-only layout definition returning a static Lua table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.