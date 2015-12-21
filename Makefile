## Build and deploy http://kieranhealy.org

SSH_USER = khealy@kieranhealy.org
DOCUMENT_ROOT = ~/kieranhealy.org
PUBLIC_DIR = public/

all: deploy

server: css
	hugo server -ws .

deploy: site
	rsync -crzve 'ssh -p 22' $(PUBLIC_DIR) $(SSH_USER):$(DOCUMENT_ROOT)

site: css .FORCE
	hugo 
	find public -type d -print0 | xargs -0 chmod 755
	find public -type f -print0 | xargs -0 chmod 644

css:
	touch static/css/stylesheet.css
	rm -f static/css/stylesheet.css
	cat static/css/poole.css static/css/syntax.css > static/css/stylesheet.css
	java -jar ~/bin/yuicompressor-2.4.8.jar static/css/stylesheet.css -o static/css/stylesheet-min.css --charset utf-8

.FORCE:
