---
id: spider_blocker_easy
title: Spider Blocker Easy
description: Defines a static map layout used as a beginner-friendly spider den blocker with three spider dens and vegetation.
tags: [spider, terrain, map, level-design]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 033725da
system_scope: world
---

# Spider Blocker Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (`spider_blocker_easy.lua`) used by Don't Starve Together's world generation system. It specifies a 40×40 tile layout (640×640 world units) with background tiles and placed objects to serve as a low-difficulty spider den barrier. The layout includes three spider dens of varying growth stages (two at stage 2, one at stage 3), along with a mix of evergreen and tall evergreen trees to block spider spawn paths and provide environmental features.

This layout is not a runtime entity component but a data structure consumed by DST's world generation and room placement systems to construct static terrain and object configurations during map generation.

## Usage example
Static layouts like this are loaded and applied by the game's `static_layouts` task system and are not directly instantiated or used in Lua code by modders. They are referenced indirectly via room/task configurations.

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties. This file is a data-only module returning a Tiled map format structure.

## Main functions
Not applicable. This file is a pure data definition and contains no functional code or exported functions.

## Events & listeners
Not applicable.