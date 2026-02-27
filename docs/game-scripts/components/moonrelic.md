---
id: moonrelic
title: Moonrelic
description: A minimal placeholder component with no functional logic, only storing a reference to its owner entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 07e73a6e
---

# Moonrelic

## Overview
The Moonrelic component serves as a minimal container that attaches to an entity (`inst`) and stores a reference to it. It contains no logic, properties beyond the instance reference, or event handling — functioning purely as a structural placeholder.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned at construction) | Reference to the entity this component is attached to. |

## Main Functions
None defined beyond the constructor.

## Events & Listeners
None.