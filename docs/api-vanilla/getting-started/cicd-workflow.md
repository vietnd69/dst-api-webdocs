---
id: cicd-workflow
title: CI/CD Workflow
sidebar_position: 18
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# CI/CD Workflow for DST Mods

Continuous Integration and Continuous Deployment (CI/CD) practices can significantly improve the quality and release process of your Don't Starve Together mods. This guide will walk you through setting up an automated workflow that helps you test, build, and deploy your mods more efficiently.

## Understanding CI/CD for DST Mods

### What is CI/CD?

- **Continuous Integration (CI)**: Automatically testing code changes when they're pushed to your repository
- **Continuous Deployment (CD)**: Automatically deploying successful builds to your users

### Benefits for DST Modders

- **Consistency**: Ensure your mod works across different environments
- **Quality**: Catch bugs before they reach users
- **Efficiency**: Automate repetitive tasks like testing and deployment
- **Reliability**: Reduce human error in the release process
- **Faster Updates**: Deliver fixes and features to users more quickly

## Setting Up a Basic CI/CD Pipeline

### Prerequisites

1. Your mod code in a Git repository (GitHub, GitLab, etc.)
2. Basic understanding of Git (see [Git Integration guide](git-integration.md))
3. A GitHub account (for GitHub Actions) or similar CI service

### GitHub Actions for DST Mods

GitHub Actions is a free CI/CD service for GitHub repositories that's easy to set up:

1. Create a `.github/workflows` directory in your mod repository
2. Create a YAML file (e.g., `ci.yml`) for your workflow configuration

Here's a basic workflow file for DST mods:

```yaml
name: DST Mod CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Lua
        uses: leafo/gh-actions-lua@v8
        with:
          luaVersion: "5.1"
          
      - name: Setup Luarocks
        uses: leafo/gh-actions-luarocks@v4
        
      - name: Install Luacheck
        run: luarocks install luacheck
        
      - name: Run Luacheck
        run: luacheck . --no-color -q

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Lua
        uses: leafo/gh-actions-lua@v8
        with:
          luaVersion: "5.1"
          
      - name: Setup Luarocks
        uses: leafo/gh-actions-luarocks@v4
        
      - name: Install Busted
        run: luarocks install busted
        
      - name: Run Tests
        run: busted -o TAP
```

## Linting and Testing DST Mods

### Lua Linting with Luacheck

Luacheck is a static analyzer that can catch common errors in your Lua code:

1. Create a `.luacheckrc` file in your mod's root directory:

```lua
-- .luacheckrc
std = {
    globals = {
        "GLOBAL",
        "TheWorld",
        "ThePlayer",
        "TheNet",
        "TheSim",
        "TUNING",
        "STRINGS",
        "ACTIONS",
        "EQUIPSLOTS",
        "RECIPETABS",
        "TECH",
        "SpawnPrefab",
        "CreateEntity",
        "AddComponent"
    }
}

-- Ignore these patterns
exclude_files = {
    ".luarocks/*",
    "lua_modules/*"
}
```

2. Run Luacheck manually:

```bash
luacheck .
```

### Unit Testing with Busted

Busted is a testing framework for Lua that can help you write unit tests for your mod:

1. Create a `spec` directory in your mod's root
2. Add test files with a `_spec.lua` suffix

Example test file (`spec/mymod_spec.lua`):

```lua
describe("MyMod", function()
    it("should calculate damage correctly", function()
        -- Require your mod's code
        local mymod = require("mymod")
        
        -- Test your function
        assert.are.equal(15, mymod.calculate_damage(10, 1.5))
    end)
end)
```

3. Run tests manually:

```bash
busted
```

## Automating Mod Deployment

### Workshop Deployment with SteamCMD

You can automate uploading your mod to the Steam Workshop using SteamCMD:

1. Create a deployment script (`deploy.sh`):

```bash
#!/bin/bash
# deploy.sh

# Variables
MOD_DIR="$1"
WORKSHOP_ID="$2"
STEAM_USERNAME="$3"
STEAM_PASSWORD="$4"

# Create temp directory for SteamCMD
mkdir -p ./steamcmd_temp
cd ./steamcmd_temp

# Download SteamCMD if needed
if [ ! -f "./steamcmd.sh" ]; then
    wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz
    tar -xvzf steamcmd_linux.tar.gz
fi

# Create workshop upload script
cat > workshop_upload.txt <<EOL
@ShutdownOnFailedCommand 1
@NoPromptForPassword 1
login $STEAM_USERNAME $STEAM_PASSWORD
workshop_build_item "$MOD_DIR"
quit
EOL

# Run SteamCMD with the upload script
./steamcmd.sh +runscript workshop_upload.txt
```

2. Add this to your GitHub Actions workflow:

```yaml
deploy:
  needs: test
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Workshop
      run: |
        chmod +x ./deploy.sh
        ./deploy.sh "$PWD" "${{ secrets.WORKSHOP_ID }}" "${{ secrets.STEAM_USERNAME }}" "${{ secrets.STEAM_PASSWORD }}"
      env:
        WORKSHOP_ID: ${{ secrets.WORKSHOP_ID }}
        STEAM_USERNAME: ${{ secrets.STEAM_USERNAME }}
        STEAM_PASSWORD: ${{ secrets.STEAM_PASSWORD }}
```

> **Note**: Store your Steam credentials as GitHub repository secrets for security.

## Advanced CI/CD Features

### Automated Version Bumping

Automatically update your mod's version in `modinfo.lua`:

```yaml
version-bump:
  runs-on: ubuntu-latest
  needs: test
  if: github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
        
    - name: Get commit count
      id: commit_count
      run: echo "::set-output name=count::$(git rev-list --count HEAD)"
      
    - name: Update version in modinfo.lua
      run: |
        sed -i "s/version = \"[0-9.]*\"/version = \"1.0.${{ steps.commit_count.outputs.count }}\"/" modinfo.lua
        
    - name: Commit version update
      uses: stefanzweifel/git-auto-commit-action@v4
      with:
        commit_message: "Bump version to 1.0.${{ steps.commit_count.outputs.count }}"
        file_pattern: modinfo.lua
```

### Automated Release Notes

Generate release notes from your commit messages:

```yaml
release-notes:
  runs-on: ubuntu-latest
  needs: deploy
  if: github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
        
    - name: Generate Release Notes
      id: release_notes
      run: |
        echo "NOTES<<EOF" >> $GITHUB_ENV
        echo "# What's New" >> $GITHUB_ENV
        echo "" >> $GITHUB_ENV
        git log --pretty=format:"- %s" $(git describe --tags --abbrev=0)..HEAD >> $GITHUB_ENV
        echo "" >> $GITHUB_ENV
        echo "EOF" >> $GITHUB_ENV
        
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: v1.0.${{ github.run_number }}
        release_name: Release v1.0.${{ github.run_number }}
        body: ${{ env.NOTES }}
```

## CI/CD for Larger Mods

### Monorepo Structure

For mods with multiple components:

```
my_mod/
├── modinfo.lua
├── modmain.lua
├── modules/
│   ├── feature1/
│   │   ├── scripts/
│   │   └── tests/
│   └── feature2/
│       ├── scripts/
│       └── tests/
├── .github/workflows/
│   └── ci.yml
└── scripts/
    ├── build.sh
    └── deploy.sh
```

### Matrix Testing

Test across different configurations:

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      lua-version: ['5.1', '5.2', '5.3']
      include:
        - lua-version: '5.1'
          dst-compatible: true
  steps:
    - uses: actions/checkout@v2
    
    - name: Setup Lua
      uses: leafo/gh-actions-lua@v8
      with:
        luaVersion: ${{ matrix.lua-version }}
```

## Integrating with Project Management

### GitHub Issues Integration

Link commits to issues for better tracking:

```yaml
issues:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    
    - name: Parse Commit Messages
      id: parse
      run: |
        ISSUES=$(git log --format=%B -n 1 ${{ github.sha }} | grep -o '#[0-9]\+' | sed 's/#//g')
        echo "::set-output name=issues::$ISSUES"
    
    - name: Add Labels to Issues
      if: steps.parse.outputs.issues != ''
      uses: actions/github-script@v4
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const issues = '${{ steps.parse.outputs.issues }}'.split(' ');
          for (const issue of issues) {
            if (issue) {
              github.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: parseInt(issue),
                labels: ['in-next-release']
              });
            }
          }
```

### Automated Notifications

Send notifications to Discord when a new version is deployed:

```yaml
notify:
  runs-on: ubuntu-latest
  needs: deploy
  steps:
    - name: Discord Notification
      uses: sarisia/actions-status-discord@v1
      with:
        webhook: ${{ secrets.DISCORD_WEBHOOK }}
        title: "New Mod Version Deployed!"
        description: "Version 1.0.${{ github.run_number }} is now available on the Workshop!"
        color: 0x0000FF
```

## Best Practices for DST Mod CI/CD

1. **Start Simple**: Begin with basic linting and testing before adding complex automation
2. **Secure Credentials**: Always use repository secrets for sensitive information
3. **Test Locally First**: Ensure your CI scripts work locally before committing them
4. **Incremental Adoption**: Add CI/CD features gradually as your mod grows
5. **Version Control Everything**: Include all CI/CD configuration in your repository
6. **Document Your Process**: Add a section in your README explaining your CI/CD workflow

## Example Projects

For reference, here are some DST mod projects that implement good CI/CD practices:

1. **DST Mod Dev Tools**
   - A mod that improves the development/testing experience
   - Features a well-structured GitHub Actions workflow
   - GitHub Repository: [dstmodders/mod-dev-tools](https://github.com/dstmodders/mod-dev-tools)
   - Steam Workshop: [Mod Dev Tools](https://steamcommunity.com/sharedfiles/filedetails/?id=2220506640)

## Example Complete Workflow

Here's a complete example combining all the features discussed:

```yaml
name: DST Mod CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Lua
        uses: leafo/gh-actions-lua@v8
        with:
          luaVersion: "5.1"
      - name: Setup Luarocks
        uses: leafo/gh-actions-luarocks@v4
      - name: Install Luacheck
        run: luarocks install luacheck
      - name: Run Luacheck
        run: luacheck . --no-color -q

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Lua
        uses: leafo/gh-actions-lua@v8
        with:
          luaVersion: "5.1"
      - name: Setup Luarocks
        uses: leafo/gh-actions-luarocks@v4
      - name: Install Busted
        run: luarocks install busted
      - name: Run Tests
        run: busted -o TAP

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Package Mod
        run: |
          mkdir -p ./dist
          cp -r modinfo.lua modmain.lua scripts images anim ./dist/
      - name: Upload Artifact
        uses: actions/upload-artifact@v2
        with:
          name: mod-package
          path: ./dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Download Artifact
        uses: actions/download-artifact@v2
        with:
          name: mod-package
          path: ./dist
      - name: Deploy to Workshop
        run: |
          chmod +x ./scripts/deploy.sh
          ./scripts/deploy.sh "./dist" "${{ secrets.WORKSHOP_ID }}" "${{ secrets.STEAM_USERNAME }}" "${{ secrets.STEAM_PASSWORD }}"
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v1.0.${{ github.run_number }}
          release_name: Release v1.0.${{ github.run_number }}
          body: |
            ## What's Changed
            ${{ github.event.head_commit.message }}
            
            [Full Changelog](https://github.com/${{ github.repository }}/compare/v1.0.${{ github.run_number - 1 }}...v1.0.${{ github.run_number }})
      - name: Discord Notification
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "New Mod Version Deployed!"
          description: "Version 1.0.${{ github.run_number }} is now available on the Workshop!"
```

## See also

- [Git Integration](git-integration.md) - For version control setup
- [Useful Extensions and Tools](useful-extensions.md) - For additional development tools
- [Testing Environment](testing-environment.md) - For setting up a testing environment
- [Project Management Tools](project-management.md) - For integrating with project management 
