TESTS = $(shell find test/ -iname \*.test.js)

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--require should \
	--reporter spec \
	$(TESTS)

.PHONY: test