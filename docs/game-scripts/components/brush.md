---
id: brush
title: Brush
description: Acts as a marker component to identify entities that can be used as a brush.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Brush

## Overview
The Brush component is a simple marker component. It contains no unique logic or functionality. Its sole purpose is to be attached to an entity to identify it as a "brush", allowing other game systems to check for its presence (e.g., via `inst.components.brush`).

## Dependencies & Tags
None identified.

## Properties

| Property | Type           | Default Value                              | Description                                            |
|----------|----------------|--------------------------------------------|--------------------------------------------------------|
| `inst`   | EntityInstance | The entity instance it is attached to.     | A reference to the entity instance this component is attached to. |

## Main Functions
This component does not define any public functions.