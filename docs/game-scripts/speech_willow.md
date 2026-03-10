---
id: speech_willow
title: Speech Willow
description: Contains static string data for Willow's dialogue and speech patterns.
tags: [speech, character, dialogue, audio, willow]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 43a03a43
system_scope: player
---

# Speech Willow

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines static speech string collections used by the Willow character prefab in DST. It contains multiple lookup tables mapping contextual speech keys (e.g., `"onhurt"`, `"onrespawn"`, `"onburn"` etc.) to arrays of possible dialogue lines. It has no executable logic, constructors, event listeners, or function definitions—it serves purely as a data resource for the speech system to draw from.

## Usage example
This component is not instantiated or used directly by modders. The speech system internally accesses these strings using keys like `"onhurt"` or `"onburn"` from Willow's speech component (e.g., `inst.components.speech:PlayString("onhurt")`). Modders should not call or modify this file directly; instead, they should override Willow’s speech strings via prefab post-inits (e.g., `AddPrefabPostInit("willow", function(inst) ... end)`).

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | — | — | This file contains only static data tables; no properties defined. |

## Main functions
This file contains no functions.

## Events & listeners
This file contains no events and does not register or push any events.