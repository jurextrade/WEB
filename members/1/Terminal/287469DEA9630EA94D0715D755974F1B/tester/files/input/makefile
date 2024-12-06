OBJ= ../output/R_A.o ../output/R_D.o ../output/R_E.o ../output/R_F.o ../output/R_G.o ../output/R_J.o ../output/R_M.o ../output/R_O.o ../output/R_Q.o ../output/R_T.o ../output/R_U.o ../output/R_W.o ../output/R_Y.o ../output/R_Other.o ../output/Progress.o ../output/PG_SystemObjects.o ../output/PG_Logicals.o
EXEC= ../output/PG_EntryRules.dll
TEXEC= ../output/PG_TEntryRules.dll

PG_EntryRules.dll: $(EXEC)
PG_TEntryRules.dll: $(TEXEC)

../output/PG_EntryRules.dll: $(OBJ) ../output/PG_EntryRules.o
	g++  -shared -o $@ $^
../output/PG_TEntryRules.dll: $(OBJ) ../output/PG_TEntryRules.o
	g++  -shared -o $@ $^

../output/%.o: %.cpp
	cc -o $@ -c $<
