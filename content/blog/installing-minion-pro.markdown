---
#layout: post
title: "Installing Minion Pro"
date: "2012-11-10"
comments: true
categories: [Nerdery]
---

Setting up a new machine is usually a pain, especially if---like me---you have a bunch of additional stuff installed that isn't living in your user directory, like a TeX installation. Cloning from the old machine is often a good idea, but things don't always work as they should. And sometimes you just want to set up from scratch. I'm at the point where my most of my text editing and data analysis stuff can be up and running fairly quickly: install [Xcode](https://developer.apple.com/xcode/) via the App Store (or just the command-line tools if you want), then  [MacTeX](http://www.tug.org/mactex/), then [R](http://www.r-project.org), then [Emacs](http://emacsformacosx.com), then my [Starter Kit for the Social Sciences](http://www.kieranhealy.org/emacs-starter-kit.html), then my own [LaTeX style files](http://www.kieranhealy.org/latex-custom-kjh.html) and [bib files](https://github.com/kjhealy/socbibs). Other useful stuff after that includes [Pandoc](http://johnmacfarlane.net/pandoc/). Tedious! But at this point also fairly straightforward. 

One piece that always gives me a headache, though, is getting [Minion Pro](http://en.wikipedia.org/w/index.php?title=File:MinionPro.svg&page=1) set up for use with LaTeX. Minon is a terrific typeface and I use it for my papers. It's expensive to buy but often comes bundled with various Adobe products, notably Acrobat reader. If you have the font installed on your Mac somewhere, then there's a [package of stuff](http://www.ctan.org/tex-archive/fonts/minionpro/) available to get it to work with pdflatex. But it's a pain to install. Note at this point that, if you like, you can simply use [xelatex](http://en.wikipedia.org/wiki/XeTeX) instead to use all your installed fonts with latex. But because I have a debilitating obsessiveness in this regard, I know that xelatex doesn't let you use certain [microtype](http://en.wikipedia.org/wiki/Microtypography) features available to pdflatex. So I need to set up Minion Pro to work with pdflatex. Here is a shell script I came across that will do that for you automatically. Don't run it unless you know what you're doing, though. Seeing as I have to go through this any time I set up a new Mac, and always forget the steps, this is pretty useful. 

If you are a sensible person, of course, you will not even find yourself facing this ridiculous situation. 

{{< highlight bash >}}

#!/bin/sh
## Information
## http://carlo-hamalainen.net/blog/2007/12/11/installing-minion-pro-fonts/
## http://www.ctan.org/tex-archive/fonts/mnsymbol/

## 0.1: Install LCDF Typetools
## http://www.lcdf.org/type/
## If you use Homebrew (http://mxcl.github.com/homebrew/), then uncomment: 
# brew install lcdf-typetools 

## 0.2: If ~/tmp doesn't exist, create it.
# mkdir ~/tmp

## Destination. System wide:  
# DEST=`kpsexpand '$TEXMFLOCAL'`
## Or single-user only:
DEST=~/Library/texmf

## Downloader:
DOWNLOAD="curl -L -O"

## Directory where minion fonts can be found:
#MINIONSRC=/Applications/Adobe\ Reader.app/Contents/Resources/Resource/Font/
#MINIONSRC=~/tmp/minionsrc
MINIONSRC=~/Library/Fonts

## Everything gets done in a temporary directory
cd ~/tmp

## 1: MnSymbol
## http://www.ctan.org/tex-archive/fonts/mnsymbol/
$DOWNLOAD http://mirror.ctan.org/fonts/mnsymbol.zip 

unzip mnsymbol
cd mnsymbol/tex

## Generates MnSymbol.sty
latex MnSymbol.ins

mkdir -p $DEST/tex/latex/MnSymbol/      \
    $DEST/fonts/source/public/MnSymbol/ \
    $DEST/doc/latex/MnSymbol/

cp MnSymbol.sty $DEST/tex/latex/MnSymbol/MnSymbol.sty
cd .. # we were in mnsymbol/tex
cp source/* $DEST/fonts/source/public/MnSymbol/
cp MnSymbol.pdf README $DEST/doc/latex/MnSymbol/

mkdir -p $DEST/fonts/map/dvips/MnSymbol \
    $DEST/fonts/enc/dvips/MnSymbol      \
    $DEST/fonts/type1/public/MnSymbol   \
    $DEST/fonts/tfm/public/MnSymbol 
cp enc/MnSymbol.map $DEST/fonts/map/dvips/MnSymbol/
cp enc/*.enc $DEST/fonts/enc/dvips/MnSymbol/
cp pfb/*.pfb $DEST/fonts/type1/public/MnSymbol/
cp tfm/* $DEST/fonts/tfm/public/MnSymbol/

## I believe that this is not strictly needed if DEST is in the home
## tree on OSX, but might be needed otherwise
sudo mktexlsr
updmap --enable MixedMap MnSymbol.map

# $DOWNLOAD http://carlo-hamalainen.net/blog/myfiles/minionpro/mnsymbol-test.tex
# pdflatex mnsymbol-test.tex

## 2: MinionPro
mkdir -p ~/tmp/minionpro
cd ~/tmp/minionpro

$DOWNLOAD http://mirrors.ctan.org/fonts/minionpro/enc-2.000.zip
$DOWNLOAD http://mirrors.ctan.org/fonts/minionpro/metrics-base.zip
$DOWNLOAD http://mirrors.ctan.org/fonts/minionpro/metrics-full.zip
$DOWNLOAD http://mirrors.ctan.org/fonts/minionpro/scripts.zip

## This will make the otf directory, among other things.
unzip scripts.zip

cp $MINIONSRC/Minion*otf otf/

## Generate the pfb files
## This step requires that the LCDF type tools are installed.  Get them here:
##   http://www.lcdf.org/type/
./convert.sh

## Copy the pfb files to where they belong:
mkdir -p $DEST/fonts/type1/adobe/MinionPro
cp pfb/*.pfb $DEST/fonts/type1/adobe/MinionPro

SRC=`pwd`
cd $DEST
unzip $SRC/enc-2.000.zip
unzip $SRC/metrics-base.zip
unzip $SRC/metrics-full.zip
cd $SRC

sudo mktexlsr
updmap --enable MixedMap MinionPro.map

## Test:
# $DOWNLOAD http://carlo-hamalainen.net/blog/myfiles/minionpro/minionpro-test.tex
# pdflatex minionpro-test.tex


{{< /highlight >}}
