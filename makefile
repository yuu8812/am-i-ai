.PHONY: all functions hosting

all: functions hosting

functions:
	cd functions && yarn start &

hosting:
	cd hosting && yarn generate && yarn start &