"""Generate the Phase 03 neural core in Blender and export it as GLB.

Run from the repository root with Blender 4.x:
  blender --background --python scripts/blender/export_neural_core.py
"""
from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "models" / "neural-core-hero.glb"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def emission_material(name: str, base_color, emission_color, strength: float):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.48
    bsdf.inputs["Roughness"].default_value = 0.28
    bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
    bsdf.inputs["Emission Strength"].default_value = strength
    return mat

outer = emission_material("CoreShell", (0.04, 0.06, 0.16), (0.22, 0.30, 1.0), 2.2)
inner = emission_material("CoreInner", (0.08, 0.12, 0.28), (0.28, 0.85, 1.0), 3.5)
node_mat = emission_material("Neuron", (0.1, 0.16, 0.4), (0.42, 0.55, 1.0), 4.0)

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1.08, location=(0, 0, 0))
core = bpy.context.object
core.name = "CoreShell_Hi"
core.data.materials.append(outer)

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=0.78, location=(0, 0, 0))
inner_core = bpy.context.object
inner_core.name = "CoreInner_Hi"
inner_core.data.materials.append(inner)

for axis, rotation in enumerate(((0, 0, 0), (math.radians(60), 0, math.radians(25)), (0, math.radians(60), math.radians(-22)))):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.48 + axis * 0.18, minor_radius=0.025, major_segments=128, minor_segments=12)
    ring = bpy.context.object
    ring.name = f"Orbit_{axis:02d}"
    ring.rotation_euler = rotation
    ring.data.materials.append(node_mat)

count = 32
for i in range(count):
    y = 1 - (i / max(count - 1, 1)) * 2
    radius = math.sqrt(max(0, 1 - y * y))
    theta = i * math.pi * (3 - math.sqrt(5))
    distance = 1.72 + (i % 4) * 0.12
    position = Vector((math.cos(theta) * radius * distance, y * distance, math.sin(theta) * radius * distance))
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.055, location=position)
    node = bpy.context.object
    node.name = f"Neuron_{i:02d}"
    node.data.materials.append(node_mat)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(OUTPUT), export_format="GLB", use_selection=False, export_apply=True, export_yup=True)
print(f"Exported {OUTPUT}")
