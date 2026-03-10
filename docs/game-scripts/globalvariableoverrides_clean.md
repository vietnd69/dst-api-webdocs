---
id: globalvariableoverrides_clean
title: Globalvariableoverrides Clean
description: Applies conditional overrides to global variables during game initialization based on world generation settings.
tags: [world, config, initialization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: d41d8cd9
system_scope: world
---

# Globalvariableoverrides_clean

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`globalvariableoverrides_clean.lua` is a game initialization script responsible for applying conditional overrides to global variables based on active world generation settings. It ensures that gameplay-critical global values—such as season lengths, weather behavior, and environmental constants—are adjusted dynamically according to the current world configuration. This file does not define a component but rather executes as part of the startup sequence to enforce world-specific rules.

## Usage example
This file is executed automatically during game startup and is not intended for direct use by modders. However, a modder might inspect or extend override logic by hooking into `GLOBAL._G` after initialization completes.

```lua
-- Example of checking an overridden global after world load
if GLOBAL.RESEARCH_CAVE_DOORS ~= nil then
    print("Cave door research override applied")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file contains only top-level conditional logic that modifies `GLOBAL` variables.

## Main functions
Not applicable — no functions are defined.

## Events & listeners
Not applicable — no event handling occurs in this file.