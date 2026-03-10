---
id: globalvariableoverrides_monkey
title: Globalvariableoverrides Monkey
description: Overrides global variable defaults for the Monkey character’s enabled state and mod support.
tags: [character, monkey, mod]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 66e59880
system_scope: entity
---

# Globalvariableoverrides Monkey

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file sets global overrides for two key variables related to the Monkey character: `DISABLE_MOD_WARNING` and `MODS_ENABLED`. These variables control whether modding warnings are suppressed for the Monkey character and whether mods are considered enabled in the context of this character’s gameplay logic. The overrides ensure Monkey behaves correctly in modded environments without triggering unnecessary warnings.

## Usage example
This file does not define a component and is not used directly via `inst:AddComponent()`. Instead, it runs at preload time to configure global state. No runtime usage is required.

```lua
-- No usage needed; effects occur automatically when the file is loaded.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
Not applicable.

## Main functions
Not applicable.

## Events & listeners
Not applicable.