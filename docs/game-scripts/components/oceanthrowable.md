---
id: oceanthrowable
title: Oceanthrowable
description: Manages the attachment and configuration of the complexprojectile component for entities intended to be thrown into ocean water.
tags: [projectile, ocean, water, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f65c6490
system_scope: entity
---

# Oceanthrowable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oceanthrowable` is a lightweight component responsible for ensuring that an entity can be launched as a projectile specifically for ocean contexts. It dynamically adds the `complexprojectile` component if not already present and invokes a configurable callback function (`onaddprojectilefn`) to customize the projectile's setup. This component is typically attached to prefabs that are intended to be thrown by the player into ocean bodies of water (e.g., rocks, spears, or other throwable items).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanthrowable")

-- Optionally define custom projectile configuration
inst.components.oceanthrowable:SetOnAddProjectileFn(function(proj_inst)
    proj_inst.components.complexprojectile:SetSpeed(20)
    proj_inst.components.complexprojectile:SetGravity(0.5)
end)

-- Trigger projectile attachment and setup
inst.components.oceanthrowable:AddProjectile()
```

## Dependencies & tags
**Components used:** `complexprojectile`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onaddprojectilefn` | function or nil | `nil` | Optional callback invoked when `AddProjectile` is called, allowing custom configuration of the added `complexprojectile` component. |

## Main functions
### `SetOnAddProjectileFn(fn)`
* **Description:** Sets the optional callback function that will be executed when `AddProjectile` is called.
* **Parameters:** `fn` (function or nil) — A function accepting one argument (the instance to which `complexprojectile` was added), or `nil` to remove the callback.
* **Returns:** Nothing.

### `AddProjectile()`
* **Description:** Ensures the entity has the `complexprojectile` component; if missing, it adds the component. If `onaddprojectilefn` is set, it is invoked with the instance as its argument.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `complexprojectile` is already present, it simply invokes the callback (if set) and returns without re-adding.

## Events & listeners
None identified.
