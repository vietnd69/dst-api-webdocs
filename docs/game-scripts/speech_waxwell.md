---
id: speech_waxwell
title: Speech Waxwell
description: Contains declarative language data for the Waxwell speech system, used to define dialogue and narrative content.
tags: [language, dialogue, speech]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: 5a65a955
system_scope: ui
---

# Speech Waxwell

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `speech_waxwell.lua` file is a declarative data module containing nested table structures with string literals, representing dialogue entries and narrative content for the Waxwell character or related in-game speech systems. It does not define any executable logic—no functions, event listeners, or component behaviors—and serves solely as a data source for localization or dynamic speech rendering systems elsewhere in the codebase.

## Usage example
Typical usage involves loading this module and referencing its nested data tables directly in UI or dialogue systems, for example:
```lua
local waxwell_speech = require "speech_waxwell"
local intro_line = waxwell_speech.intro.greeting
ui.text:SetText(intro_line)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (No properties defined) | | | |

## Main functions
None identified  

## Events & listeners
None identified