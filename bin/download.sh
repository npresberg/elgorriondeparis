#!/bin/sh -eu

REPO=https://github.com/npresberg/elgorriondeparis.git
BRANCH=gh-pages
DIR=../gorrion-$BRANCH
SRC=$PWD
PUBLIC=$SRC/public
DOMAIN=http://www.elgorriondeparis.com.ar
LOCAL=http://localhost:8080
SITEMAP=sitemap.xml
TODAY=$(date +%y-%m-%d)
CURL='curl --silent --retry 10 --retry-delay 1'

function killnode() {
	ps -s | grep '/node' | sed -r 's/ *([0-9]+) .*/\1/' | while read pid; do kill -9 $pid; done
}

function rmall() {
	find . -name "$1" -delete
}

killnode
NODE_ENV=production node app.js >/dev/null &

if [ -d $DIR ]; then
	cd $DIR
	git reset --hard HEAD
	git pull origin $BRANCH --rebase
else
	git clone -b $BRANCH --single-branch $REPO $DIR
	cd $DIR
fi

echo "updating static files..."
cp -ru $PUBLIC/* .
head -n5 $PUBLIC/$SITEMAP > $SITEMAP

rmall '*.html'
rmall '*.md'
rmall name.txt

function download() {
	path=$1
	dir=.$path
	out=${dir}index.html
	if [ -f $out ]; then
		return
	fi

	url=$LOCAL$path
	echo "downloading $path..."
	mkdir -p $dir
	$CURL $url -o $out
	# Build sitemap as it downloads
	add_to_sitemap $out $path
	# Look for other pages
	crawl $out
}

function add_to_sitemap() {
	if git diff $1 >/dev/null; then
		mod=$TODAY
	else
		mod=$(git log --date=short -n1 --format="%ad" $1)
	fi
	echo "	<url>" >> $SITEMAP
	echo "		<loc>$DOMAIN$2</loc>" >> $SITEMAP
	echo "		<changefreq>monthly</changefreq>" >> $SITEMAP
	echo "		<lastmod>$mod</lastmod>" >> $SITEMAP
	echo "	</url>" >> $SITEMAP
}

function crawl() {
	# TODO: Try tee and download & to parallelize
	echo "crawling $1..."
	cat $1 |\
		grep -Eo '<a[^>]+?href="(/[^/"][^"]+)"' |\
		grep -ve '.jpg' -e '.png' |\
		sed -r 's/.*href="([^"]+)"/\1/g' |\
		while read path; do
			download $path
		done
}

download '/'
download '/gracias/'
$CURL $LOCAL/404 -o 404.html

# http://www.google.com/webmasters/tools/ping?sitemap=http%3A%2F%2Fwww.elgorriondeparis.com.ar%2Fsitemap.xml
tail -n1 $PUBLIC/$SITEMAP >> $SITEMAP

killnode

git add -A
msg=$(cat $SRC/.git/COMMIT_EDITMSG)
git commit -m "$msg"
git push origin $BRANCH

exit