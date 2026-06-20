# Run workflows locally (MacOS guide)

If you want to run the GitHub Actions workflow locally, you can use the [act](https://nektosact.com).

## Installation

```bash
brew install act
```

## Usage (under root of the repository)

```bash
act push --container-architecture linux/amd64 -P ubuntu-latest=catthehacker/ubuntu:act-latest --bind
```