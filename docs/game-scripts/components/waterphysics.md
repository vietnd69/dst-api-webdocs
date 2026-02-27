---
id: waterphysics
title: Waterphysics
description: Provides simple restitution-based physics for entity movement in water by storing a single bounce coefficient.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8a16ae08
---

# Waterphysics

## Overview
A minimal physics component that stores a restitution (bounciness) value—set to `1` by default—for use in simulating how an entity behaves when interacting with water. It serves as a foundational data holder rather than a full simulation system.

## Dependencies & Tags
None identified.

## Properties

| Property     | Type   | Default Value | Description                                      |
|--------------|--------|---------------|--------------------------------------------------|
| `restitution`| number | `1`           | Coefficient of restitution used for bounce calculations in water. |

## Main Functions
This component does not define any public methods beyond its constructor.

## Events & Listeners
None.