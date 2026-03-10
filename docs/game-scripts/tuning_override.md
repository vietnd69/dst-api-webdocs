---
id: tuning_override
title: Tuning Override
description: Registers placeholder functions for all known tuning hooks used by the game to allow modded overrides of season, weather, entity, and environment-related tuning tables.
tags: [tuning, seasons, weather, entity]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f54c44fb
system_scope: world
---

# Tuning Override

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`tuning_override.lua` is a top-level configuration file that provides default placeholder functions for a comprehensive list of tuning hook names used by Don't Starve Together. It does not implement a component in the ECS sense, but rather defines a return table mapping known tuning hook identifiers (e.g., `hounds`, `winter`, `weather`, `petrification`) to no-op functions (`dummyfn`). Modders can replace these entries in their own `modmain.lua` or tuning override files to inject custom tuning logic. This acts as a registry and contract for tuning modulation points.

## Usage example
```lua
-- In a mod's `modmain.lua`, override one or more tuning hooks:
local function MyWinterTuning(tuning)
    tuning.hibernation_start_time = 10
    return tuning
end

-- Load the override registry first (or rely on game-provided defaults)
local override = require("tuning_override")
override.winter = MyWinterTuning
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
None — this file returns a static table of function references; no runtime methods exist.

## Events & listeners
None — this file does not register or fire any events.

