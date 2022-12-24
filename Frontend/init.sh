# # npm i
apt-get update
apt-get upgrade
apt install -y curl xsel
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
echo 'before sleep'
sleep 2
echo 'after sleep'
source ~/.bashrc
echo 'after source'
nvm install node
cd APP
npm run build
npm install -g serve
serve -s --no-clipboard
