---
id: brush
title: Brush
description: A placeholder component with no implemented functionality, likely reserved for future use or placeholder objects.
tags: [placeholder]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 38f697f8
system_scope: entity
---

# Brush

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Brush` is a minimal, non-functional component that currently only stores a reference to its owning entity (`self.inst`). It serves no active gameplay logic and appears to be a stub or placeholder. Its presence in the codebase suggests it may be reserved for future expansion or used as a marker in entity definitions where a component is required syntactically but no behavior is needed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brush")
-- No functional methods are available on this component.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
No public functions.

## Events & listeners
None identified.
