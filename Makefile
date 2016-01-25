### Build and deploy http://kieranhealy.org

### Apart from hugo, you will need rsync to deploy
### the site, and the java-based yuicompressor to
### minify the CSS.

SSH_USER = khealy@kieranhealy.org
STAGING_USER = kjhealy@kjhealy.co
DOCUMENT_ROOT = ~/kieranhealy.org
STAGING_ROOT = ~/public/kjhealy.co/public_html
PUBLIC_DIR = public/

all: deploy

staging: site
	rsync -crzve 'ssh -p 22' $(PUBLIC_DIR) $(STAGING_USER):$(STAGING_ROOT)

server: css
	hugo server -ws .

deploy: compress site
	rsync -crzve 'ssh -p 22' $(PUBLIC_DIR) $(SSH_USER):$(DOCUMENT_ROOT)

compress: css
	java -jar ~/bin/yuicompressor-2.4.8.jar static/css/stylesheet.css -o static/css/stylesheet-min.css --charset utf-8

site: css .FORCE
	hugo 
	find public -type d -print0 | xargs -0 chmod 755
	find public -type f -print0 | xargs -0 chmod 644

css:
	touch static/css/stylesheet.css 
	rm -f static/css/stylesheet.css
	cat static/css/kube.css static/css/demo.css static/css/syntax.css static/css/bigfoot-default.css > static/css/stylesheet.css

clean:
	rm -rf public/

.FORCE:
