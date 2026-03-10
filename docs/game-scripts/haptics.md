---
id: haptics
title: Haptics
description: Defines static configuration tables for haptic and audio feedback effects used by the game's input and visual systems.
tags: [audio, fx, input, ui, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5ef3c123
system_scope: audio
---

# Haptics

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `haptics.lua` file is a self-contained configuration module that defines static data structures mapping game events and actions to haptic and audio feedback effects. It contains no runtime logic, components, or event handlers—only constant tables that describe how vibrations, sounds, or other sensory cues should be triggered in response to specific in-game conditions. As such, it serves as a reference layer for systems elsewhere in the codebase (e.g., input handlers, UI, or FX components) to query when deciding what feedback to emit.

## Usage example
```lua
-- Example: retrieving a haptic configuration for a UI button press
local haptic = require "haptics"
local feedback = haptics.USEBUTTON
-- feedback is a table like { vibrate = 0.1, sound = "ui/button_click", gain = 0.5 }
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `haptics.USEBUTTON` | `table?` | `nil` | Configuration for haptic/audio feedback when a UI button is used (e.g., pressed/activated). Contains keys like `vibrate`, `sound`, `gain`. |
| `haptics.NAVIGATE` | `table?` | `nil` | Configuration for haptic/audio feedback when navigating UI (e.g., scrolling or tabbing between elements). |
| `haptics.ERROR` | `table?` | `nil` | Configuration for negative feedback (e.g., failed action, invalid input). |
| `haptics.SUCCESS` | `table?` | `nil` | Configuration for positive feedback (e.g., successful crafting, selection). |
| `haptics.DANGER` | `table?` | `nil` | Configuration for high-priority feedback (e.g., taking damage, critical event). |

*Note: Exact key contents (e.g., `vibrate`, `sound`, `gain`) are inferred from typical DST haptic/audio conventions, but the actual structure is omitted in the source since no function bodies or usages are present.*

## Main functions
None.

## Events & listeners
None.