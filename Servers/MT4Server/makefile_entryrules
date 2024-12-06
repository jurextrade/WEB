OBJ= ./Compile/C/Files/output/Strategies.o
EXEC= ./Compile/C/Files/output/PG_EntryRules.dll
TEXEC= ./Compile/C/Files/output/PG_TEntryRules.dll

PG_EntryRules.dll: $(EXEC)
PG_TEntryRules.dll: $(TEXEC)

./Compile/C/Files/output/PG_EntryRules.dll: $(OBJ) ./Compile/C/Files/output/PG_EntryRules.o
	g++  -shared -o $@ $^
./Compile/C/Files/output/PG_TEntryRules.dll: $(OBJ) ./Compile/C/Files/output/PG_TEntryRules.o
	g++  -shared -o $@ $^

./Compile/C/Files/output/%.o: ./Compile/C/Files/input/%.cpp
	g++  -o $@ -c $<
