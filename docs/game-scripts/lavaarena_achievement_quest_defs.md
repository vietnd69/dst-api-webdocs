---
id: lavaarena_achievement_quest_defs
title: Lavaarena Achievement Quest Defs
description: Defines quest achievement templates and configuration for the Lava Arena seasonal event.
tags: [event, achievement, quest]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ddd75bee
system_scope: world
---

# Lavaarena Achievement Quest Defs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines the structure and configuration for achievement quests associated with the Lava Arena event in Don't Starve Together. It organizes achievements into categories (`daily`, `basic`, `challenge`, `specialized`) with associated XP rewards and restrictions (e.g., character sets, team-only). The definitions are processed into a normalized table structure consumed by the event’s server-side achievement system via `event_server_data`.

## Usage example
```lua
-- This file is a data definition and not instantiated as a component.
-- It is referenced by the event's server data system via:
-- local quest_defs = require("lavaarena_achievement_quest_defs")
-- Usage typically occurs during event initialization on the server.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
None identified.

## Events & listeners
None identified.