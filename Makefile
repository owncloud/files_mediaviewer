SHELL := /bin/bash

YARN := $(shell command -v yarn 2> /dev/null)
ifndef YARN
    $(error yarn is not available on your system, please install yarn)
endif
GIT := $(shell command -v git 2> /dev/null)
ifndef GIT
    $(error git is not available on your system, please install git)
endif


app_name=files_mediaviewer
build_dir=$(CURDIR)/build
dist_dir=$(build_dir)/dist
src_files=README.md LICENSE CHANGELOG.md
src_dirs=appinfo js l10n templates
all_src=$(src_dirs) $(src_files)

occ=$(CURDIR)/../../occ
private_key=$(HOME)/.owncloud/certificates/$(app_name).key
certificate=$(HOME)/.owncloud/certificates/$(app_name).crt
sign=$(occ) integrity:sign-app --privateKey="$(private_key)" --certificate="$(certificate)"
sign_skip_msg="Skipping signing, either no key and certificate found in $(private_key) and $(certificate) or occ can not be found at $(occ)"
ifneq (,$(wildcard $(private_key)))
ifneq (,$(wildcard $(certificate)))
ifneq (,$(wildcard $(occ)))
	CAN_SIGN=true
endif
endif
endif

.DEFAULT_GOAL := help

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

##
## Build targets
##--------------------------------------

.PHONY: dist
dist:                       ## Build distribution
dist: js-deps build-js distdir sign package

.PHONY: js-deps
js-deps:
	$(YARN) install

.PHONY: build-js
build-js:
	$(YARN) run build

.PHONY: distdir
distdir:
	rm -rf $(dist_dir)
	mkdir -p $(dist_dir)/$(app_name)
	cp -R $(all_src) $(dist_dir)/$(app_name)
	rm -Rf $(dist_dir)/$(app_name)/l10n/.tx

.PHONY: sign
sign:
ifdef CAN_SIGN
	$(sign) --path="$(dist_dir)/$(app_name)"
else
	@echo $(sign_skip_msg)
endif

.PHONY: package
package:
	tar --format=gnu -czf $(dist_dir)/$(app_name).tar.gz -C $(dist_dir) $(app_name)

##
## l10n
##--------------------------------------

.PHONY: l10n-clean
l10n-clean:
	cd l10n && make clean

.PHONY: l10n-read
l10n-read: js-deps
	cd l10n && make makemessages

.PHONY: l10n-write
l10n-write: l10n/l10n.pl
	perl l10n/l10n.pl files_mediaviewer write

.PHONY: l10n-push
l10n-push:
	cd l10n && tx -d push -s

.PHONY: l10n-pull
l10n-pull:
	cd l10n && tx -d pull -a --minimum-perc=15

l10n/l10n.pl:
	wget -qO l10n/l10n.pl https://rawgit.com/ownclouders/7f3e2bdf09e6c7258850d770c0edaf0b/raw/d3ad1673b5449900f85a04f95cdf7e7149140c4f/l10n.pl
