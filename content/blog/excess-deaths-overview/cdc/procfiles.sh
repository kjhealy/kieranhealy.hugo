#!/bin/bash

shopt -s nullglob

## Get files from above
echo "Getting PNGs from parent directory"
cp -f ../*_patch.png .
cp -f ../*_patch.pdf .
cp -f ../*_overlay.png .

### Rename *_patch.png to *_patch_thumb.png

echo "Renaming files ..."
for patchname in *_patch.png; do

	filename=$(basename -- "$fpatchname")
	extension="${patchname##*.}"
	filename="${patchname%.*}"


  cp -f "$patchname" "./${filename}_thumb.png"

done

mv united_states_overlay.png usa_overlay.png
mv united_states_patch_thumb.png usa_patch_thumb.png
mv united_states_patch.png usa_patch.png
mv united_states_patch.pdf usa_patch.pdf

### Shrink to thumbnail size
echo "Shrinking patch files to thumbnails ..."

mogrify -resize 240x480 -format png *patch_thumb.png

## Add overlays

echo "Adding overlays to thumbnails ..."

for filename in *_overlay.png; do

n=${filename%%_overlay.png}

echo $filename
echo $n

composite -resize '1x1<' -gravity center $filename ${n}_patch_thumb.png ${n}_patch_thumb.png

done

echo "Removing overlay files"
rm -f *_overlay.png

echo "Done."
