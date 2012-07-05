test:
	@./node_modules/.bin/mocha -u bdd -R spec

testintegration:
	@./node_modules/.bin/mocha -u bdd -R spec $(shell find testintegration/*.js)

.PHONY: test testintegration
