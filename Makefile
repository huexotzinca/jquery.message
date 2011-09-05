JS_VER = $(shell cat config.json | grep -Po '"JS_VERSION"\s*:\s*\".*\"' | perl -pe 's/"JS_VERSION"\s*:\s*//; s/"//g;')
JS_NAME = $(shell cat config.json | grep -Po '"JS_NAME"\s*:\s*\".*\"' | perl -pe 's/"JS_NAME"\s*:\s*//; s/"//g;')
JS_AUTHOR = $(shell cat config.json | grep -Po '"JS_AUTHOR"\s*:\s*\".*\"' | perl -pe 's/"JS_AUTHOR"\s*:\s*//; s/"//g;')

SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist/${JS_VER}

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/ajax.js\
	${SRC_DIR}/noticer.js\
	${SRC_DIR}/modal.js\
	${SRC_DIR}/modal/alert.js\
	${SRC_DIR}/modal/prompt.js\
	${SRC_DIR}/modal/confirm.js\
	${SRC_DIR}/message.js
	

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JS_OUT = ${DIST_DIR}/${JS_NAME}.js
JS_OUT_MIN = ${DIST_DIR}/${JS_NAME}.min.js


SIZZLE_DIR = ${SRC_DIR}/sizzle

VER = sed "s/@VERSION/${JS_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

all: update_submodules core

core: javascript min lint
	@@echo ${JS_NAME} "build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

javascript: ${JS_OUT}

${JS_OUT}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${JS_NAME} " ->" ${JS_OUT}

	@@cat ${MODULES} | \
		sed 's/.function..jQuery...{//' | \
		sed 's/}...jQuery..;//' | \
		sed 's/@DATE/'"${DATE}"'/' | \
		sed 's/@JS_NAME/'"${JS_NAME}"'/' | \
		sed 's/@JS_AUTHOR/'"${JS_AUTHOR}"'/' | \
		${VER} > ${JS_OUT} ;

lint: javascript
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking" ${JS_NAME} "against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test" ${JS_NAME} "against JSLint."; \
	fi
	
min: javascript ${JS_OUT_MIN}

${JS_OUT_MIN}: ${JS_OUT}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying" ${JS_NAME} "->" ${JS_OUT_MIN}; \
		${COMPILER} ${JS_OUT} > ${JS_OUT_MIN}.tmp; \
		${POST_COMPILER} ${JS_OUT_MIN}.tmp > ${JS_OUT_MIN}; \
		rm -f ${JS_OUT_MIN}.tmp; \
		echo "Generating main" ${JS_NAME} "proyect files";\
		cp ${JS_OUT} ${JS_NAME}.js;\
		echo "      creating ->" ${JS_NAME}".js in main folder.";\
		cp ${JS_OUT_MIN} ${JS_NAME}.min.js;\
		echo "      creating ->" ${JS_NAME}".min.js in main folder.";\
		cp ${DIST_DIR}/${JS_NAME}.css ${JS_NAME}.css;\
		echo "      creating ->" ${JS_NAME}".css in main folder.";\
	else \
		echo "You must have NodeJS installed in order to minify" ${JS_NAME}"."; \
	fi

.PHONY: all javascript lint min clean distclean update_submodules pull_submodules pull core

