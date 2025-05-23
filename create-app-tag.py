#!/usr/bin/env python3

import subprocess
import sys
import os
import re
import argparse


def get_latest_tag(repo_path: str) -> str:
    """
    Returns the highest semver tag in the given repo by sorting tags
    with `git tag --list --sort=-v:refname` and taking the first.
    """
    result = subprocess.run(
        ["git", "tag", "--list", "--sort=-v:refname"],
        cwd=repo_path,
        capture_output=True,
        text=True,
        check=True
    )
    tags = [t.strip() for t in result.stdout.splitlines() if t.strip()]
    if not tags:
        print(f"No tags found in {repo_path}", file=sys.stderr)
        sys.exit(1)
    return tags[0]


def bump_version(tag: str, bump_type: str) -> str:
    """
    Given a tag like v1.23.1, returns the new tag:
      --minor => v1.23.2 (patch bump)
      --major => v1.24.0 (minor bump)
    """
    m = re.match(r"v(\d+)\.(\d+)\.(\d+)$", tag)
    if not m:
        raise ValueError(f"Tag '{tag}' is not in v<major>.<minor>.<patch> format")
    major, minor, patch = map(int, m.groups())
    if bump_type == "minor":
        patch += 1
    elif bump_type == "major":
        minor += 1
        patch = 0
    else:
        raise ValueError("bump_type must be 'minor' or 'major'")
    return f"v{major}.{minor}.{patch}"


def create_and_push_tag(repo_path: str, new_tag: str) -> None:
    """
    Creates and pushes the given tag in the specified repo.
    """
    subprocess.run(["git", "tag", new_tag], cwd=repo_path, check=True)
    subprocess.run(["git", "push", "origin", new_tag], cwd=repo_path, check=True)


def main():
    parser = argparse.ArgumentParser(
        description="Create Git tags across multiple repositories."
    )
    parser.add_argument(
        "repos",
        nargs='+',
        help="Paths to local Git repositories",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--minor",
        action="store_true",
        help="Bump patch version (v1.23.1 -> v1.23.2)",
    )
    group.add_argument(
        "--major",
        action="store_true",
        help="Bump minor version (v1.23.1 -> v1.24.0)",
    )
    args = parser.parse_args()

    bump_type = "minor" if args.minor else "major"

    for repo in args.repos:
        if not os.path.isdir(os.path.join(repo, '.git')):
            print(f"Skipping {repo}: not a Git repository", file=sys.stderr)
            continue
        print(f"Processing {repo}...")
        latest = get_latest_tag(repo)
        print(f"  Latest tag: {latest}")
        new_tag = bump_version(latest, bump_type)
        print(f"  Creating new tag: {new_tag}")
        create_and_push_tag(repo, new_tag)
        print(f"  Pushed {new_tag} to origin\n")


if __name__ == '__main__':
    main()

