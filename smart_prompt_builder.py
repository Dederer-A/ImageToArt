import argparse
import fnmatch
import json
import os
import re
import shlex
import subprocess

# Default mandatory files and directories (from the Core Documents section of your index)
DEFAULT_CORE_FILES = [
    "AGENTS.md",
    "ai/AI_PHILOSOPHY.md",
    "ai/AI_INDEX.md",
    "ai/CODING_STANDARDS.md",
    "ai/GIT_WORKFLOW.md",
]

# Default list of paths and directories to exclude from the src/ tree view
DEFAULT_EXCLUDED_TREE_PATHS = [
    "src/components/ui",
]

# Hardcoded system directories to always ignore
DEFAULT_IGNORE_DIRS = {
    "__pycache__",
    "node_modules",
    ".git",
    "dist",
    ".vite",
    ".venv",
    ".idea",
    ".vscode",
    "build",
}

# Binary and asset extensions to skip automatically
EXCLUDED_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".svg",
    ".webp",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".rar",
    ".7z",
    ".pyc",
    ".pyo",
    ".pyd",
    ".lock",
    ".exe",
    ".bin",
    ".so",
    ".dll",
}

CONFIG_FILE = ".smart_prompt_config.json"
GITIGNORE_FILE = ".gitignore"


def load_gitignore_patterns(gitignore_path=GITIGNORE_FILE):
  """Loads ignore patterns from .gitignore file if present."""
  patterns = set()
  if os.path.exists(gitignore_path):
    try:
      with open(gitignore_path, "r", encoding="utf-8") as f:
        for line in f:
          line = line.strip()
          if not line or line.startswith("#"):
            continue
          # Strip trailing slashes and surrounding quotes
          clean_pattern = line.rstrip("/").strip("'\"")
          if clean_pattern:
            patterns.add(clean_pattern)
    except Exception as e:
      print(f"[Warning] Failed to read {gitignore_path}: {e}")
  return patterns


def load_config():
  """Loads configuration from a JSON file, falling back to defaults gracefully."""
  config = {
      "core_files": DEFAULT_CORE_FILES,
      "excluded_tree_paths": DEFAULT_EXCLUDED_TREE_PATHS,
  }
  if os.path.exists(CONFIG_FILE):
    try:
      with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        user_config = json.load(f)
        if isinstance(user_config, dict):
          if "core_files" in user_config:
            config["core_files"] = user_config["core_files"]
          if "excluded_tree_paths" in user_config:
            config["excluded_tree_paths"] = user_config["excluded_tree_paths"]
    except Exception as e:
      print(f"[Warning] Failed to load config file {CONFIG_FILE}: {e}. Using defaults.")
  return config


# Initialize configuration and gitignore patterns
config = load_config()
CORE_FILES = config["core_files"]
EXCLUDED_TREE_PATHS = config["excluded_tree_paths"]
GITIGNORE_PATTERNS = load_gitignore_patterns()


def should_ignore_path(path, base_dir=None):
  """Checks if a given file or directory path should be ignored based on

  system dirs, .gitignore patterns, excluded tree paths, and hidden attributes.
  """
  basename = os.path.basename(path)

  # Ignore hidden files/directories and core system dirs
  if basename.startswith(".") or basename in DEFAULT_IGNORE_DIRS:
    return True

  # Check against .gitignore patterns
  for pattern in GITIGNORE_PATTERNS:
    if fnmatch.fnmatch(basename, pattern):
      return True
    if base_dir:
      try:
        rel_path = os.path.relpath(path, base_dir)
        if fnmatch.fnmatch(rel_path, pattern) or any(
            fnmatch.fnmatch(p, pattern) for p in rel_path.split(os.sep)
        ):
          return True
      except ValueError:
        pass

  # Check excluded tree paths
  normalized_path = os.path.normpath(path)
  for excl in EXCLUDED_TREE_PATHS:
    norm_excl = os.path.normpath(excl)
    if normalized_path == norm_excl or normalized_path.startswith(norm_excl + os.sep):
      return True

  return False


def clean_path(path_str):
  """Cleans up paths dragged from Finder or VSCode, removing surrounding

  quotes, trailing escape spaces, and resolving relative paths.
  """
  path_str = path_str.strip("'\"")
  path_str = path_str.strip()

  if os.path.isabs(path_str):
    try:
      path_str = os.path.relpath(path_str, os.getcwd())
    except ValueError:
      pass

  return path_str


def parse_user_entries(raw_input):
  """Parses user input securely, correctly handling dragged-in paths

  wrapped in single or double quotes, and space/comma separation.
  """
  if not raw_input.strip():
    return []

  try:
    normalized_input = raw_input.replace(",", " ")
    tokens = shlex.split(normalized_input)
  except ValueError:
    tokens = re.split(r"[,;\s]+", raw_input)

  cleaned_entries = [clean_path(token) for token in tokens if token.strip()]
  return cleaned_entries


def copy_to_clipboard(text):
  """Copies text to clipboard using pyperclip if available,

  otherwise falls back to native OS commands (like pbcopy on macOS).
  """
  try:
    import pyperclip

    pyperclip.copy(text)
    return True
  except ImportError:
    pass

  if os.name == "posix" and os.uname().sysname == "Darwin":
    try:
      process = subprocess.Popen(
          "pbcopy", env={"LANG": "en_US.UTF-8"}, stdin=subprocess.PIPE
      )
      process.communicate(text.encode("utf-8"))
      return True
    except Exception as e:
      print(f"[Warning] Failed to use pbcopy fallback: {e}")

  return False


def resolve_path_to_files(path_entry):
  """Recursively collects files from a directory or returns a single file,

  skipping ignored directories/files (including .gitignore) and binary extensions.
  """
  collected_files = set()

  if "*" in path_entry:
    base_dir = path_entry.split("*")[0]
    if os.path.exists(base_dir):
      for root, dirs, filenames in os.walk(base_dir):
        dirs[:] = [
            d for d in dirs if not should_ignore_path(os.path.join(root, d), base_dir)
        ]
        for file in filenames:
          full_path = os.path.join(root, file)
          ext = os.path.splitext(file)[1].lower()
          if ext not in EXCLUDED_EXTENSIONS and not should_ignore_path(
              full_path, base_dir
          ):
            collected_files.add(full_path)
  elif os.path.isdir(path_entry):
    for root, dirs, filenames in os.walk(path_entry):
      dirs[:] = [
          d for d in dirs if not should_ignore_path(os.path.join(root, d), path_entry)
      ]
      for file in filenames:
        full_path = os.path.join(root, file)
        ext = os.path.splitext(file)[1].lower()
        if ext not in EXCLUDED_EXTENSIONS and not should_ignore_path(
            full_path, path_entry
        ):
          collected_files.add(full_path)
  elif os.path.isfile(path_entry):
    ext = os.path.splitext(path_entry)[1].lower()
    if ext not in EXCLUDED_EXTENSIONS and not should_ignore_path(path_entry):
      collected_files.add(path_entry)

  return list(collected_files)


def read_file_safely(file_path):
  """Safely reads a file trying multiple common encodings."""
  for enc in ["utf-8", "cp1251", "latin-1"]:
    try:
      with open(file_path, "r", encoding=enc) as f:
        return f.read()
    except UnicodeDecodeError:
      continue
    except Exception as e:
      return f"# Error reading file: {e}"
  return "# Error: Could not decode file with supported encodings (utf-8, cp1251, latin-1)."


def parse_ai_index(index_path="ai/AI_INDEX.md"):
  """Parses AI_INDEX.md and extracts conditional workflow blocks."""
  if not os.path.exists(index_path):
    print(f"Warning: {index_path} not found.")
    return []

  content = read_file_safely(index_path)
  rules = []
  pattern = r"If you (.*?):\s*Read:\s*((?:\s+-?\s*[\w\./\-\*]+)+)"
  matches = re.findall(pattern, content, re.IGNORECASE)

  for condition, files_block in matches:
    files = [
        line.strip().lstrip("- ")
        for line in files_block.split("\n")
        if line.strip()
    ]
    rules.append({"condition": condition.lower(), "files": files})

  return rules


def select_dynamic_files(task_description, rules):
  """Matches the task description against condition keywords from the index."""
  task_lower = task_description.lower()
  selected_files = set()
  matched_conditions = []

  for rule in rules:
    cond = rule["condition"]
    keywords = [w for w in re.findall(r"\w+", cond) if len(w) > 3]

    match_count = sum(1 for kw in keywords if kw in task_lower)
    if match_count >= 2 or cond in task_lower:
      matched_conditions.append(rule["condition"])
      for f in rule["files"]:
        resolved = resolve_path_to_files(f)
        selected_files.update(resolved)

  return list(selected_files), matched_conditions


def generate_directory_tree(start_dir="src"):
  """Generates a text-based tree representation of a directory,

  respecting exclusion lists and .gitignore patterns.
  """
  if not os.path.exists(start_dir):
    return f"Directory '{start_dir}' not found."

  tree_lines = []

  def walk(current_dir, current_prefix):
    try:
      items = sorted(os.listdir(current_dir))
    except PermissionError:
      return

    valid_items = []
    for item in items:
      path = os.path.join(current_dir, item)
      if should_ignore_path(path, start_dir):
        continue
      valid_items.append((item, path))

    for index, (item, path) in enumerate(valid_items):
      is_last = index == len(valid_items) - 1
      connector = "└── " if is_last else "├── "
      tree_lines.append(f"{current_prefix}{connector}{item}")

      if os.path.isdir(path):
        extension = "    " if is_last else "│   "
        walk(path, current_prefix + extension)

  tree_lines.append(start_dir + "/")
  walk(start_dir, "")
  return "\n".join(tree_lines)


def generate_targeted_prompt(
    task_description, dynamic_files, matched_conditions, manual_entries
):
  """Generates a structured prompt optimized for LLM token prefix caching.

  Static documentation goes first, dynamic task files and context go last.
  """
  output = []
  lang_map = {
      "py": "python",
      "md": "markdown",
      "json": "json",
      "ts": "typescript",
      "js": "javascript",
      "vue": "vue",
      "html": "html",
      "css": "css",
  }

  # --- 1. STATIC PREFIX (High Caching Efficiency) ---
  core_files_resolved = []
  for core_entry in CORE_FILES:
    resolved = resolve_path_to_files(core_entry)
    core_files_resolved.extend(resolved)

  # Deduplicate while preserving original order
  seen = set()
  unique_core_files = [
      f for f in core_files_resolved if not (f in seen or seen.add(f))
  ]

  output.append("# Core Project Documentation & Standards\n\n---\n")
  for file_path in unique_core_files:
    if os.path.exists(file_path) and os.path.isfile(file_path):
      output.append(f"## File: `{file_path}`\n")
      ext = os.path.splitext(file_path)[1].lstrip(".")
      lang = lang_map.get(ext, "")
      output.append(f"```{lang}")
      output.append(read_file_safely(file_path))
      output.append("```\n\n")
    else:
      print(f"[Warning] Core path not found or is a directory: {file_path}")

  # Project structure tree
  output.append("## Project Structure (`src/`)\n")
  output.append("```text\n")
  output.append(generate_directory_tree("src"))
  output.append("\n```\n\n---\n")

  # --- 2. DYNAMIC CONTEXT (Task-Specific Files) ---
  task_files_to_load = set()
  task_files_to_load.update(dynamic_files)
  for entry in manual_entries:
    if entry:
      task_files_to_load.update(resolve_path_to_files(entry))

  # Exclude core files from dynamic list to prevent duplication
  task_files_to_load = task_files_to_load - set(unique_core_files)

  print("\n[Final set of task-specific files included]")
  for f in sorted(task_files_to_load):
    print(f"  - {f}")
  print("-" * 40)

  if task_files_to_load:
    output.append("# Task-Specific Context Files\n\n---\n")
    for file_path in sorted(task_files_to_load):
      if os.path.exists(file_path) and os.path.isfile(file_path):
        output.append(f"## File: `{file_path}`\n")
        ext = os.path.splitext(file_path)[1].lstrip(".")
        lang = lang_map.get(ext, "")
        output.append(f"```{lang}")
        output.append(read_file_safely(file_path))
        output.append("```\n\n")
      else:
        print(f"[Warning] Path not found or is a directory skipping: {file_path}")

  # --- 3. TASK CONTEXT & INSTRUCTIONS (At the very end) ---
  output.append("# Task Context\n")
  if matched_conditions:
    output.append(f"**Matched Workflows:** {', '.join(matched_conditions)}\n")
  output.append(f"**Task:** {task_description}\n")

  return "\n".join(output)


if __name__ == "__main__":
  parser = argparse.ArgumentParser(
      description="Smart Prompt Builder via AI_INDEX optimized for Token Caching."
  )
  parser.add_argument("task", nargs="?", help="Task description")
  parser.add_argument(
      "files", nargs="*", help="Additional files or directories"
  )
  args = parser.parse_args()

  user_task = args.task
  if not user_task:
    print("--- Smart Prompt Builder via AI_INDEX ---")
    user_task = input(
        "What task are you going to work on? (e.g., 'modify image engine'): "
    )

  if not user_task.strip():
    print("Task description cannot be empty.")
    exit(1)

  # Step 1: Parse and analyze AI_INDEX immediately after task entry
  rules = parse_ai_index("ai/AI_INDEX.md")
  dynamic_files, matched_conditions = select_dynamic_files(user_task, rules)

  print("\n[AI_INDEX Analysis]")
  if matched_conditions:
    print("  Found matching workflow sections:")
    for cond in matched_conditions:
      print(f"    - If you {cond}")
  else:
    print(
        "  No matching conditional workflows found in ai/AI_INDEX.md for this"
        " task."
    )

  # Step 2: Handle manual entries from CLI or interactive prompt
  manual_entries = []
  if args.files:
    for entry in args.files:
      manual_entries.extend(parse_user_entries(entry))
  else:
    additional_input = input(
        "\nAdditional files or directories separated by comma or space (leave"
        " empty if none): "
    )
    manual_entries = parse_user_entries(additional_input)

  # Step 3: Generate prompt and copy
  prompt_text = generate_targeted_prompt(
      user_task, dynamic_files, matched_conditions, manual_entries
  )

  # Calculate statistics
  prompt_bytes = prompt_text.encode("utf-8")
  size_kb = len(prompt_bytes) / 1024
  approx_tokens = len(prompt_text) // 4

  success = copy_to_clipboard(prompt_text)

  print("\n[Prompt Statistics]")
  print(f"  - Size: {size_kb:.2f} KB")
  print(f"  - Estimated tokens: ~{approx_tokens}")

  if success:
    print(
        "\n[Done] The tailored minimum context has been copied to your"
        " clipboard."
    )
  else:
    print(
        "\n[Error] Could not copy to clipboard. Neither pyperclip nor pbcopy"
        " was successful."
    )