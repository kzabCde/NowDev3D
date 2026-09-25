#!/usr/bin/env python3
"""Validate GLB structure and accessor bounds without third-party dependencies."""
from __future__ import annotations

import json
import struct
import sys
from pathlib import Path

COMPONENT_BYTES = {5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4}
TYPE_COMPONENTS = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT2": 4,
    "MAT3": 9,
    "MAT4": 16,
}


def validate(path: Path) -> None:
    data = path.read_bytes()
    if len(data) < 20:
        raise ValueError("file is too small to be a GLB")

    magic, version, declared_length = struct.unpack_from("<4sII", data, 0)
    if magic != b"glTF":
        raise ValueError(f"bad magic {magic!r}")
    if version != 2:
        raise ValueError(f"unsupported GLB version {version}")
    if declared_length != len(data):
        raise ValueError(f"declared length {declared_length} != actual {len(data)}")

    offset = 12
    chunks: dict[bytes, bytes] = {}
    while offset < len(data):
        if offset + 8 > len(data):
            raise ValueError("truncated chunk header")
        chunk_length, chunk_type = struct.unpack_from("<I4s", data, offset)
        offset += 8
        end = offset + chunk_length
        if end > len(data):
            raise ValueError(f"chunk {chunk_type!r} exceeds file bounds")
        chunks[chunk_type] = data[offset:end]
        offset = end

    if offset != len(data):
        raise ValueError("chunk walk did not end at EOF")
    if b"JSON" not in chunks:
        raise ValueError("missing JSON chunk")

    document = json.loads(chunks[b"JSON"].rstrip(b" \t\r\n\x00").decode("utf-8"))
    binary = chunks.get(b"BIN\x00", b"")
    buffers = document.get("buffers", [])
    if buffers:
        declared_buffer_length = int(buffers[0].get("byteLength", 0))
        if declared_buffer_length > len(binary):
            raise ValueError(
                f"buffer byteLength {declared_buffer_length} exceeds BIN chunk {len(binary)}"
            )

    views = document.get("bufferViews", [])
    for index, view in enumerate(views):
        start = int(view.get("byteOffset", 0))
        length = int(view.get("byteLength", 0))
        if start < 0 or length < 0 or start + length > len(binary):
            raise ValueError(
                f"bufferView[{index}] range {start}:{start + length} exceeds BIN {len(binary)}"
            )

    for index, accessor in enumerate(document.get("accessors", [])):
        if "bufferView" not in accessor:
            continue
        view_index = int(accessor["bufferView"])
        if not 0 <= view_index < len(views):
            raise ValueError(f"accessor[{index}] references invalid bufferView {view_index}")
        view = views[view_index]
        component_type = int(accessor["componentType"])
        accessor_type = accessor["type"]
        if component_type not in COMPONENT_BYTES or accessor_type not in TYPE_COMPONENTS:
            raise ValueError(f"accessor[{index}] has unsupported component/type")
        element_size = COMPONENT_BYTES[component_type] * TYPE_COMPONENTS[accessor_type]
        count = int(accessor.get("count", 0))
        accessor_offset = int(accessor.get("byteOffset", 0))
        stride = int(view.get("byteStride", element_size))
        required = accessor_offset if count == 0 else accessor_offset + (count - 1) * stride + element_size
        view_length = int(view.get("byteLength", 0))
        if required > view_length:
            raise ValueError(
                f"accessor[{index}] needs {required} bytes but bufferView[{view_index}] has {view_length}"
            )


def main() -> int:
    paths = [Path(arg) for arg in sys.argv[1:]]
    if not paths:
        paths = sorted(Path("public/models").glob("*.glb"))
    if not paths:
        print("No GLB assets found", file=sys.stderr)
        return 1
    failed = False
    for path in paths:
        try:
            validate(path)
            print(f"GLB OK  {path}")
        except Exception as exc:  # noqa: BLE001 - CI validator should report all files
            failed = True
            print(f"GLB BAD {path}: {exc}", file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
