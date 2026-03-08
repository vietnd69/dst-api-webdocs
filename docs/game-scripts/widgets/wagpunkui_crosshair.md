---
id: wagpunkui_crosshair
title: Wagpunkui Crosshair
description: Renders a visual crosshair animation used for targeting feedback during weapon Swing actions.
tags: [ui, visual, targeting]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5cb9a96b
system_scope: ui
---

# Wagpunkui_crosshair

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Wagpunkui_crosshair` is a UI widget subclassed from `UIAnim` that displays a looping crosshair animation (named `distance_meter`) using the `wagstaff_armor_target` animation bank and build. It is intended for visual feedback during targeting — likely tied to ranged weapon usage or distance estimation mechanics. The widget is centered on screen and configured to remain non-clickable.

## Usage example
```lua
local crosshair = CreateWidget("Wagpunkui_crosshair", owner)
-- The crosshair is automatically centered and plays the "distance_meter" loop
-- No further manual updates required unless repositioning is needed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
This widget does not define any additional public methods beyond those inherited from `UIAnim`. All configuration occurs in the constructor.

## Events & listeners
None identified