---
id: git-integration
title: Using Git
sidebar_position: 16
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Using Git with DST Modding

Git is a powerful version control system that can significantly improve your Don't Starve Together mod development workflow. This guide will walk you through setting up Git for your DST mods, establishing best practices, and integrating it with your development process.

## Why Use Git for DST Modding?

- **Version History**: Track changes to your mod over time
- **Branching**: Work on new features without affecting your stable release
- **Collaboration**: Make it easier for multiple people to work on the same mod
- **Backup**: Keep your mod code safe in remote repositories
- **Issue Tracking**: Manage bugs and feature requests effectively
- **Release Management**: Tag specific versions for release

## Setting Up Git for DST Mods

### Installing Git

1. Download and install Git from the [official website](https://git-scm.com/downloads)
2. Verify installation by opening a terminal/command prompt and typing:
   ```bash
   git --version
   ```

### Configuring Git

Set up your identity for commits:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Creating a Git Repository for Your Mod

1. Navigate to your mod's directory:
   ```bash
   cd path/to/your/mod
   ```

2. Initialize a new Git repository:
   ```bash
   git init
   ```

3. Create a `.gitignore` file to exclude unnecessary files:
   ```
   # DST mod specific ignores
   _tmp/
   *.bak
   *.tmp

   # OS specific files
   .DS_Store
   Thumbs.db

   # Editor files
   .vscode/
   *.sublime-workspace
   .idea/
   ```

4. Add your files to Git:
   ```bash
   git add .
   ```

5. Make your first commit:
   ```bash
   git commit -m "Initial commit of my DST mod"
   ```

## Git Workflow for DST Modding

### Basic Workflow

1. Make changes to your mod files
2. Stage changes:
   ```bash
   git add .
   ```
   Or for specific files:
   ```bash
   git add modmain.lua scripts/prefabs/myitem.lua
   ```

3. Commit changes with a descriptive message:
   ```bash
   git commit -m "Add new item prefab with custom effects"
   ```

4. View your commit history:
   ```bash
   git log
   ```

### Using Branches

Branches are useful for developing new features without affecting your main mod:

1. Create a new branch:
   ```bash
   git checkout -b new-feature
   ```

2. Make changes and commit them to the new branch
3. Switch back to the main branch:
   ```bash
   git checkout main
   ```

4. Merge your changes when ready:
   ```bash
   git merge new-feature
   ```

### Tagging Releases

When you release a new version of your mod:

```bash
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
```

View all tags:
```bash
git tag
```

## Remote Repositories

### GitHub Integration

1. Create a GitHub account if you don't have one
2. Create a new repository on GitHub
3. Connect your local repository:
   ```bash
   git remote add origin https://github.com/yourusername/your-mod-repo.git
   ```

4. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

### Cloning an Existing Mod Repository

To work on an existing mod repository:

```bash
git clone https://github.com/username/mod-repo.git
cd mod-repo
```

## Best Practices for DST Mod Version Control

### Commit Messages

Write clear, descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- First line should be a concise summary (50 chars or less)
- Optionally follow with a blank line and detailed description

Example:
```
Add custom crafting recipe for magic staff

- Added recipe to custom crafting tab
- Balanced ingredient requirements
- Added recipe unlock condition based on sanity
```

### Branching Strategy

A simple but effective branching strategy for mods:

- `main` - Stable, released versions
- `develop` - Working branch for next release
- Feature branches - For individual features
- Hotfix branches - For urgent fixes to released versions

### Managing Mod Versions

1. Update your `modinfo.lua` version number
2. Commit the change:
   ```bash
   git commit -m "Bump version to 1.1.0"
   ```

3. Tag the release:
   ```bash
   git tag -a v1.1.0 -m "Version 1.1.0"
   ```

4. Push tags to GitHub:
   ```bash
   git push origin --tags
   ```

## Integrating Git with VSCode

If you're using VSCode for DST modding:

1. Open your mod folder in VSCode
2. Access Git features through the Source Control tab (Ctrl+Shift+G)
3. Stage, commit, and push changes directly from the interface
4. View diffs, history, and branches visually

## Handling Mod Assets with Git

### Large Files

For large binary files (like animations or textures):

1. Consider using [Git LFS](https://git-lfs.github.com/) (Large File Storage)
2. Install Git LFS:
   ```bash
   git lfs install
   ```

3. Track large file types:
   ```bash
   git lfs track "*.tex"
   git lfs track "*.zip"
   git lfs track "*.bin"
   ```

4. Commit the `.gitattributes` file:
   ```bash
   git add .gitattributes
   git commit -m "Configure Git LFS"
   ```

## Collaborative Modding with Git

### Pull Requests

For collaborative mods:

1. Contributors fork the repository
2. Make changes in their fork
3. Submit pull requests to the main repository
4. Mod owner reviews and merges changes

### Issue Tracking

Use GitHub Issues to:

- Track bugs in your mod
- Manage feature requests
- Organize your development roadmap
- Communicate with users and contributors

## Troubleshooting Git Issues

### Resolving Merge Conflicts

When Git can't automatically merge changes:

1. Open the conflicted files (marked with `<<<<<<<`, `=======`, and `>>>>>>>`)
2. Edit the files to resolve conflicts
3. Save the files
4. Stage the resolved files:
   ```bash
   git add .
   ```

5. Complete the merge:
   ```bash
   git commit
   ```

### Reverting Changes

To undo commits:

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Revert a specific commit (creates a new commit)
git revert commit_hash
```

## See also

- [VSCode Setup](vscode-setup.md) - For setting up VSCode with Git integration
- [First Mod](first-mod.md) - For creating your first DST mod
- [Troubleshooting Guide](troubleshooting-guide.md) - For resolving common modding issues
- [API Updates](api-updates.md) - For tracking changes to the DST API 
