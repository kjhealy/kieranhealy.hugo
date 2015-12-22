---
author: kjhealy
date: "2010-02-16"
#layout: post
slug: easily-display-information-about-r-objects-in-emacsess
status: publish
title: 'Easily display information about R objects in Emacs/ESS '
wordpress_id: '1612'
categories:
- Data
- IT
- Sociology
---

I found [this post](http://blogisticreflections.wordpress.com/2009/10/01/r-object-tooltips-in-ess/) that provides a nice function for conveniently showing some information about R objects in ESS mode. ESS already shows some information about functions as you type them (in the status bar) but this has wider scope. Move the point over an R object (a function, a data frame, etc), hit C-c C-g and a tooltip pops up showing some relevant information about the object, such as the arguments a function takes or a basic summary for a vector and so on. As written it's a little unwieldy to use it on large dataframes, but it would be easy to modify the function used to summarize a particular class of object. Here's the code:

{{< highlight common-lisp >}}

;; Via http://blogisticreflections.wordpress.com/2009/10/01/r-object-tooltips-in-ess/
;;
;; ess-R-object-tooltip.el
;; 
;; I have defined a function, ess-R-object-tooltip, that when
;; invoked, will return a tooltip with some information about
;; the object at point.  The information returned is
;; determined by which R function is called.  This is controlled
;; by an alist, called ess-R-object-tooltip-alist.  The default is
;; given below.  The keys are the classes of R object that will
;; use the associated function.  For example, when the function
;; is called while point is on a factor object, a table of that
;; factor will be shown in the tooltip.  The objects must of course
;; exist in the associated inferior R process for this to work.
;; The special key "other" in the alist defines which function
;; to call when the class is not mached in the alist.  By default,
;; the str function is called, which is actually a fairly useful
;; default for data.frame and function objects.
;; 
;; The last line of this file shows my default keybinding.
;; I simply save this file in a directory in my load-path
;; and then place (require 'ess-R-object-tooltip) in my .emacs

;; the alist
(setq ess-R-object-tooltip-alist
      '((numeric    . "summary")
        (factor     . "table")
        (integer    . "summary")
        (lm         . "summary")
        (other      . "str")))

(defun ess-R-object-tooltip ()
  "Get info for object at point, and display it in a tooltip."
  (interactive)
  (let ((objname (current-word))
        (curbuf (current-buffer))
        (tmpbuf (get-buffer-create "**ess-R-object-tooltip**")))
    (if objname
        (progn
          (ess-command (concat "class(" objname ")\n")  tmpbuf )
          (set-buffer tmpbuf)
          (let ((bs (buffer-string)))
            (if (not(string-match "\(object .* not found\)\|unexpected" bs))
                (let* ((objcls (buffer-substring
                                (+ 2 (string-match "\".*\"" bs))
                                (- (point-max) 2)))
                       (myfun (cdr(assoc-string objcls
                                                ess-R-object-tooltip-alist))))
                  (progn
                    (if (eq myfun nil)
                        (setq myfun
                              (cdr(assoc-string "other"
                                                ess-R-object-tooltip-alist))))
                    (ess-command (concat myfun "(" objname ")\n") tmpbuf)
                    (let ((bs (buffer-string)))
                      (progn
                        (set-buffer curbuf)
                        (tooltip-show-at-point bs 0 30)))))))))
    (kill-buffer tmpbuf)))

;; my default key map
(define-key ess-mode-map "\C-c\C-g" 'ess-R-object-tooltip)

(provide 'ess-R-object-tooltip)

{{< /highlight >}}

There's also a quick screencast of it in action:

Pretty handy. I've incorporated this into the [Emacs Starter Kit](http://kjhealy.github.com/emacs-starter-kit/).
