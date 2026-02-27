---
id: forcecompostable
title: Forcecompostable
description: Marks an entity as compostable in green or brown categories for compost heaps.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8de3ece8
---

# Forcecompostable

## Overview
This lightweight component flags an entity as compostable and assigns it to one or both composting categories—green (nitrogen-rich) or brown (carbon-rich)—based on its `green` and `brown` boolean flags. It serves as metadata for compost heap systems to determine acceptable input items.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(inherited)* | Reference to the owner entity. |
| `green` | `boolean` | `false` | Whether the entity is considered green compostable. |
| `brown` | `boolean` | `false` | Whether the entity is considered brown compostable. |

## Main Functions
No public functions are defined beyond constructor initialization.

## Events & Listeners
None.