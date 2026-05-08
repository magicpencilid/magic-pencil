import os, struct
dir = "/www/wwwroot/magic-pencil/public/images"
for f in sorted(os.listdir(dir)):
    if not f.startswith("slide"): continue
    path = os.path.join(dir, f)
    size = os.path.getsize(path) // 1024
    with open(path, "rb") as fp:
        data = fp.read(30)
    w = struct.unpack("<I", data[20:24])[0]
    h = struct.unpack("<I", data[24:28])[0]
    print(f"{f}: {w}x{h}, {size} KB")
