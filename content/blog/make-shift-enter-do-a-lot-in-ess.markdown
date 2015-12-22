---
author: kjhealy
date: "2009-10-12"
#layout: post
slug: make-shift-enter-do-a-lot-in-ess
status: publish
title: 'Make Shift-Enter do a lot in ESS '
wordpress_id: '1545'
categories:
- Data
- R
---

If you use Emacs and ESS to run R, then here's a nice tweak I found on the [Emacs Wiki](http://www.emacswiki.org/). The following bit of elisp goes in your .emacs file (or equivalent). Starting with an R file in the buffer, hitting shift-enter vertically splits the window and starts R in the right-side buffer. If R is running and a region is highlighted, shift-enter sends the region over to R to be evaluated. If R is running and no region is highlighted, shift-enter sends the current line over to R. Repeatedly hitting shift-enter in an R file steps through each line (sending it to R), skipping commented lines. The cursor is also moved down to the bottom of the R buffer after each evaluation. Although you can of course use various emacs and ESS keystrokes to do all this (C-x-3, C-c-C-r, etc, etc) it's convenient to have them bound in a context-sensitive way to one command.

{{< highlight cl >}}

;; Adapted with one minor change from Felipe Salazar at
;; http://www.emacswiki.org/emacs/EmacsSpeaksStatistics

(setq ess-ask-for-ess-directory nil)
(setq ess-local-process-name "R")
(setq ansi-color-for-comint-mode 'filter)
(setq comint-scroll-to-bottom-on-input t)
(setq comint-scroll-to-bottom-on-output t)
(setq comint-move-point-for-output t)
(defun my-ess-start-R ()
  (interactive)
  (if (not (member "*R*" (mapcar (function buffer-name) (buffer-list))))
      (progn
        (delete-other-windows)
        (setq w1 (selected-window))
        (setq w1name (buffer-name))
        (setq w2 (split-window w1 nil t))
        (R)
        (set-window-buffer w2 "*R*")
        (set-window-buffer w1 w1name))))
(defun my-ess-eval ()
  (interactive)
  (my-ess-start-R)
  (if (and transient-mark-mode mark-active)
      (call-interactively 'ess-eval-region)
    (call-interactively 'ess-eval-line-and-step)))
(add-hook 'ess-mode-hook
          '(lambda()
             (local-set-key [(shift return)] 'my-ess-eval)))
(add-hook 'inferior-ess-mode-hook
          '(lambda()
             (local-set-key [C-up] 'comint-previous-input)
             (local-set-key [C-down] 'comint-next-input)))
(add-hook 'Rnw-mode-hook
          '(lambda()
             (local-set-key [(shift return)] 'my-ess-eval)))
(require 'ess-site)

{{< /highlight >}}

This is in my fork of the [Emacs Starter Kit](http://kjhealy.github.com/emacs-starter-kit/), by the way.
