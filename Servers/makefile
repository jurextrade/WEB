OBJ= ./MT4Server/Compile/C/Files/output/Strategies.o
EXEC= ./MT4Server/Compile/C/Files/output/PG_EntryRules.dll
TEXEC= ./MT4Server/Compile/C/Files/output/PG_TEntryRules.dll

PG_EntryRules.dll: $(EXEC)
PG_TEntryRules.dll: $(TEXEC)

./MT4Server/Compile/C/Files/output/PG_EntryRules.dll: $(OBJ) ./MT4Server/Compile/C/Files/output/PG_EntryRules.o
	g++  -shared -o $@ $^
./MT4Server/Compile/C/Files/output/PG_TEntryRules.dll: $(OBJ) ./MT4Server/Compile/C/Files/output/PG_TEntryRules.o
	g++  -shared -o $@ $^

./MT4Server/Compile/C/Files/output/%.o: ./MT4Server/Compile/C/Files/input/%.cpp
	g++  -o $@ -c $<
