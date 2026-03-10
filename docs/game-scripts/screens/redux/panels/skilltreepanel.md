---
id: skilltreepanel
title: Skilltreepanel
description: A UI panel widget that hosts and manages the skill tree interface in the Redux UI system.
tags: [ui, panel, skilltree]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c31bb5a7
system_scope: ui
---

# Skilltreepanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SkillTreePanel` is a UI panel component that serves as a container for the skill tree interface in the Redux UI system. It inherits from `Widget` and positions a `SkillTreeWidget` instance as its primary child, configuring focus forwarding to enable keyboard/controller navigation to the embedded skill tree.

## Usage example
```lua
local SkillTreePanel = require "screens/redux/panels/skilltreepanel"
local panel = SkillTreePanel(parent_screen)
parent_screen:AddChild(panel)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
None identified (all functionality is handled via inherited `Widget` methods and composition with `SkillTreeWidget`)

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified