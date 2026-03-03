---
id: spider_blocker_easy_b
title: Spider Blocker Easy B
description: A static layout file defining map content for a spider-blocking area, specifying background tiles and object placements including spider dens at growth stage 1 or 2.
tags: [map, layout, blocker, spider]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 8d6002e0
system_scope: world
---

# Spider Blocker Easy B

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled map export used for defining static world layout in Don't Starve Together. It contains background tile data and an object layer with placements for environmental assets (evergreen trees and spider dens). The spider dens are annotated with `"data.growable.stage"` properties to indicate their initial growth stage (`1` or `2`). This layout likely serves as a map section that physically blocks or guides player movement during early-game progression.

## Usage example
Static layouts like this are not used as entities or components directly in Lua. Instead, they are loaded by the world generation system during map assembly. No direct code usage occurs in mod files.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a pure data export from the Tiled map editor.

## Main functions
Not applicable.

## Events & listeners
Not applicable.