# how to use 
# `npm run build
# npm install -g serve
# serve -s`

# eith docker compose becode it just give the indexing page


#!/bin/bash

# npm install .
# npm install next react react-dom --save
# npm install --save @headlessui/react @heroicons/react

npm install .
npm install react react-dom --save

if [ "$MODE" == "dev" ]; then
	echo "mode [dev]..."
	npm run dev
else
	echo "mode [prod]..."
	npm run build
	npm run start
fi
