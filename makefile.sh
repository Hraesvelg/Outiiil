#!/bin/bash

# Comment in header
head -n 6 content_scripts/main.js >> main.js

# Compress abstract class in order
uglifyjs content_scripts/class/Utils.js >> main.js
uglifyjs content_scripts/class/Class.js >> main.js
uglifyjs content_scripts/class/Armee.js >> main.js
uglifyjs content_scripts/class/Rapport.js >> main.js
uglifyjs content_scripts/class/Boite.js >> main.js
uglifyjs content_scripts/class/Page.js >> main.js

# Compress all other class
for file in content_scripts/boite/*.js content_scripts/page/*.js
do
	uglifyjs $file >> main.js
done

# Add main function in file
tail -n +6 content_scripts/main.js >> main.js

# Move file in content_scripts directory
mv main.js content_scripts/

# Clean content_script directory
rm -R content_scripts/page content_scripts/boite content_scripts/class
