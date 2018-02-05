
#!/bin/bash

cd mwc-nfv-hackathon/backend
python backend.py &
cd ../wizard
npm run build
npm run serve
#http-server -p 3000 dist
