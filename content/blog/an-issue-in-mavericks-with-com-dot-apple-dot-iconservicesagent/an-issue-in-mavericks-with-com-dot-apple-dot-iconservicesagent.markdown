---
#layout: post
title: "An issue in Mavericks with com.apple.IconServicesAgent"
date: "2014-01-07"
slug: "an-issue-in-mavericks-with-com-dot-apple-dot-iconservicesagent"
comments: true
categories: [IT,Nerdery,Apple]
---

**Executive Summmary:** If you are having an issue with `IconServicesAgent` consuming all your CPU time, open a terminal window and do this:

`mkdir ${TMPDIR}/com.apple.IconServices`

This will resolve the issue. Read on for more details.


Recently I started having an intermittent problem with a process called `com.apple.IconServicesAgent` on my Mac. [Google tells me](https://www.google.com/#q=com.apple.iconservicesagent) that I am not alone, but diagnosing the issue and solving it has proven quite annoying. The symptoms are straightforward. You're working away and then you notice that this process is consuming an awful lot of RAM and as much processor time as it can. As best I can tell the Agent is responsible for managing the display of icons and icon previews, and the problem *may* be triggered by opening a Finder window containing icons that haven't been rendered in a while. But I can't re-create it on demand. Looking at the Console messages shows that the Agent tries to create files in a temporary location in `/var/` but is having permission to do this denied. The Console log becomes clogged with thousands and thousands of lines that look like this:

{{% img src="https://kieranhealy.org/files/misc/icon-services-console.png" %}}

If you take a look at the named directory in Terminal that the Agent is trying to write to, you'll find it isn't there---hence the "failed to write ..." error. So, let's create it:

{{% img src="https://kieranhealy.org/files/misc/icon-services-mkdir.png" %}}

The effect is immediate:

{{% img src="https://kieranhealy.org/files/misc/icon-services-cpu.png" %}}

Inside the directory the needed files are now created and IconServicesAgent returns to its normal state of quietude.

{{% img src="https://kieranhealy.org/files/misc/icon-services-ls.png" %}}

Looking at the parent directory, we see it has few temporary files and a bunch of temporary directories presumably created by other Agents or Applications:

{{% img src="https://kieranhealy.org/files/misc/icon-services-others.png" %}}

You can see that the permissions on the other directories aren't the same as the `com.apple.IconServices` one we created, but they also just seem to be ordinary user-level stuff. I'm not sure why the IconServicesAgent isn't able to create the directory it needs.

As for fixing it, any *particular* time you find it happening you can just go to the relevant temporary location in `/var/` and create a `com.apple.IconServices` directory inside it. Although the temporary directory is a long hash string, it's associated with an environment variable. So to solve the problem whenever it occurs, simply open a Terminal and do this:

`mkdir ${TMPDIR}/com.apple.IconServices`

That'll do it. I hope that this is necessary at most only *once* per startup or proper login cycle (i.e. that the use of the relevant `/var/` locations by the Agent stays the same even if I put the Mac to sleep for a while and have to unlock it on wake). That seems to be the case so far, but I'm really not sure. Naturally I don't relish the prospect of doing that regularly. The fact that it's a permissions issue makes you think that doing a magical "Repair Permissions" from Disk Utility might actually fix things for once, but that doesn't seem to be the case. There are some other proposed solutions floating around, but most of them were just the usual "Try this generic thing" or seemed [maybe more sensible](https://gist.github.com/walesmd/7315613) but didn't work for me. I imagine a proper fix will eventually show up in a system update.

Browsing around Apple's Discussion Forums looking for a solution to this, I came across some hair-raising (or spine-chilling) moments. For example, one discussion talked about maybe using Activity Monitor to forcibly kill the IconServicesAgent process if it was getting out of hand, which led to a bit of chat about other processes that seemed to be taking up a lot of memory and presumably deserved the same fate:

{{% img src="https://kieranhealy.org/files/misc/icon-services-arrgh.png" %}}

Force-quitting `kernel_task` is, as they sometimes say in nerdland, not recommended.
