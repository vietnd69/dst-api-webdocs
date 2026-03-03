---
id: shaver
title: Shaver
description: Placeholder component with no implemented logic; exists solely to register custom actions via componentactions.lua.
tags: [action, placeholder]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 72c5fb7e
system_scope: entity
---

# Shaver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shaver` is an empty component implementation that serves only as a registration point for custom actions defined in `componentactions.lua`. It does not contain any logic, properties, event listeners, or behavioral methods. Its sole purpose is to allow the entity it is attached to support context-sensitive actions defined externally.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shaver")
-- Custom actions are defined in componentactions.lua and attached via inst:MakeAuthority()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No main functions

## Events & listeners
None identified
