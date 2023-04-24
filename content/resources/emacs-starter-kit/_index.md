---
type: page
title: "An Emacs Starter Kit for the Social Sciences"
aliases:
    - /resources/emacs-starter-kit.html
---
  
<p>
To accompany the <a href="http://www.kieranhealy.org/files/misc/workflow-apps.pdf">Choosing Your Workflow Applications</a> paper, here is <a href="https://github.com/kjhealy/emacs-starter-kit">the Emacs Starter Kit for the Social Sciences</a>. It is a version of Phil Hagelberg's <a href="http://github.com/technomancy/emacs-starter-kit/tree">emacs starter kit</a> by way of <a href="http://eschulte.github.com/emacs-starter-kit/" title="Emacs Starter Kit">Eric Schulte's</a> Org-Mode implementation. I've made some further tweaks and added some tools of particular use to social scientists. The starter-kit includes up-to-date versions of <a href="http://ess.r-project.org/">Emacs Speaks Statistics</a>, <a href="http://www.gnu.org/software/auctex/" title="AUCTeX - Sophisticated document creation">AucTeX</a>, <a href="http://philjackson.github.com/magit/" title="It's Magit!">Magit</a>, <a href="http://jblevins.org/projects/markdown-mode/" title="Emacs markdown-mode">Markdown mode</a>, <a href="http://code.google.com/p/yasnippet/" title="yasnippet - Project Hosting on Google Code">Yasnippet</a>, and assorted other useful bits and pieces. It should work immediately on MacOS with the current version of Emacs.
</p>
<p>

<a href="http://kieranhealy.org/files/misc/emacs-starter-kit.jpg"><img src="https://kieranhealy.org/files/misc/emacs-starter-kit.jpg" caption="The Obligatory Screenshot, showing the Solarized (Dark) Theme"></a>

</p>

<p>

<a href="http://kieranhealy.org/files/misc/emacs-starter-kit-light.png"><img src="https://kieranhealy.org/files/misc/emacs-starter-kit-light.png" alt="Solarized (Light) Theme. Some other themes are also included."></a>

</p>
<p>
What's the motivation for the starter kit? Emacs is a very powerful editor but it is less useful out-of-the-box than it might be, in part because many convenient settings and modes are not activated by default. The starter kit is a drop-in set of nice default settings. The idea is for you to be able to download GNU Emacs, put the starter kit into <code>~/.emacs.d/</code>, and get to work. If you already use Emacs and have a <code>.emacs</code> file or <code>~/.emacs.d</code> directory, the starter kit is designed to replace them, while leaving a place for you to easily append your own customizations.
</p>
<p>
The starter kit is designed to be used with the current version of GNU Emacs. It will probably not work with <a href="http://aquamacs.org/" title="Aquamacs: Emacs for MacOS">Aquamacs</a> without modification. More detailed commentary and documentation is provided inside the kit's <code>.org</code> files. 
</p>
<h2>
Installation Instructions (MacOS)
</h2>

<h3>Before you Begin</h3>
<p>If you want to use the tools that the starter-kit works with—LaTeX, R, Git, Pandoc, and all the rest—then you will need to install them on your Mac. The ground floor is Apple's own suite of Developer Tools, which allow you to compile software yourself and include things like Git. The most straightforward way to get these tools is to open the Terminal app (which can be found in the Applications folder, inside a folder named "Utilities"). At the command prompt (<code>$</code>), type the following, and hit enter:

<pre>$ xcode-select --install</pre>

A dialog box will appear asking whether you want to install the tools. Choose "Install" and wait for the process to complete. 
</p>

<p>If you have used Emacs before and already have a <code>.emacs</code> file or <code>.emacs.d</code> directory, back them up and then delete them. See below for details on how to add customizations to the kit.</p>

<h3>Getting the Starter Kit</h3>
<p>You have two choices. You can <a href="https://github.com/kjhealy/emacs-starter-kit/archive/master.zip">download a <code>.zip</code> file of the kit</a>. This will give you a static snapshot of the most recent version. But if you want to keep up with changes to the kit, you should clone the source code using git rather than simply copying a static version of it. You should be using version control on your plain-text documents anyway, so I recommend this second option.</p> 

<h3>
Prerequisites
</h3>

<p>
<strong>0.1 Get Emacs</strong>. <a href="http://emacsformacosx.com/" title="GNU Emacs For MacOS">Download Emacs here</a>. Alternatively, if you are comfortable with <a href="https://brew.sh">Homebrew</a>, compile and install it from there. 
</p>
<p>
<strong>0.2 Install a Modern TeX Distribution and the Skim PDF reader</strong>. If you are using MacOS, <a href="http://www.tug.org/mactex/" title="MacTeX - TeX Users Group">download MacTeX here</a> and install it.
</p>
<p>
<strong>0.3 Install R and Pandoc</strong>. These are not strictly required for the installation to work, and you can skip this step if you like. But you will probably be using them anyway, if you're not already. If you're doing statistical work you will probably want to use R or Stata. R is free and you can <a href="http://www.r-project.org">download it here</a>. Pandoc is a very useful utility that lets you convert easily between many different forms of plain-text markup (such as Markdown, HTML, LaTeX, and others). <a href="http://pandoc.org/">Get Pandoc here</a>.
</p>
<p>
<strong>0.4 Note your user name</strong> or the name of your computer. If you don't know either, open the Terminal application and do
</p>
<pre>
$ whoami
</pre>
<p>
for your user name and
</p>
<pre>
$ hostname
</pre>
<p>
for the system name. You will need to know your login name to activate the final customization file properly. You can use the system name as well (or instead).
</p>
<h3>
Setup
</h3>
<p>
<strong>1.</strong> If you downloaded a <code>.zip</code> file of the kit, you must uncompress it, move the resulting folder to the top level of your home director and rename it <code>.emacs.d</code>. Assuming the downloaded zip file is in your <code>~/Downloads</code> folder, open a Terminal window and do this:</p>

<pre>
$ cd ~/Downloads
$ unzip emacs-starter-kit-master.zip
$ mv emacs-starter-kit-master ~/.emacs.d
</pre>

Alternatively, if you are using git (the preferred method), then clone the starter kit from github. Open a Terminal window and do this:
</p>
<pre>
$ git clone git://github.com/kjhealy/emacs-starter-kit ~/.emacs.d
</pre>
<p>
<strong>2.</strong> Inside the file <code>kjhealy.org</code>, change the paths to any BibTeX databases as described at the top of that file.
</p>
<p>
<strong>3.</strong> Rename the starter kit's <code>kjhealy.org</code> file to that of <code>%your-username%.org</code> or <code>%your-systemname%.org</code>, based on the information you noted in 0.4 above. This is where you can add in any of your own further customizations to Emacs.
</p>
<p>
<strong>4.</strong> Launch Emacs.
</p>
<p>
When you first start Emacs after installing the starter-kit, it will try to download packages from the official <a href="http://http://elpa.gnu.org" title="Welcome to ELPA">GNU ELPA repository</a>. Each package will be fetched, compiled by Emacs, and stored in the <code>~/.emacs.d</code> directory. This process is sometimes prone to hiccups as packages are fetched from the server, so please be patient with it. If it doesn't get everything first time around, quit and relaunch Emacs, and it will try again.



</p>
<p>
<strong>5.</strong> (Optional.) Once Emacs is up and running, do <code>M-x starter-kit-compile</code> to byte-compile the starter-kit's files, for slightly faster loading.
</p>


