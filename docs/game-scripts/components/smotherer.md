---
id: smotherer
title: Smotherer
description: A placeholder component with no functional logic, intended for potential future use in game systems.
tags: [placeholder]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d1f36c66
system_scope: entity
---

# Smotherer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Smotherer` is a minimal, non-functional component attached to entities via the Entity Component System (ECS). It currently contains no executable logic, properties, or event handling beyond storing a reference to its owning instance (`self.inst`). It serves as a structural stub, possibly reserved for future implementation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("smotherer")
-- No methods or behavior are currently exposed by this component
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No public methods defined

## Events & listeners
None identified
