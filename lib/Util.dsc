id='rNd(n,x)' algoritmo='no' expresión='ent(10^n*x+0.499999)/10^n' tipo='función' 
id='r4d(x)' algoritmo='no' expresión='ent(10000*x+0.4999)/10000' tipo='función' 
id='htox(s)' algoritmo='sí' expresión='X' local='X' inicio='X=0' hacer='X=(s==&squot;0&squot;)?0:X;X=(s==&squot;1&squot;)?1:X;X=(s==&squot;2&squot;)?2:X;X=(s==&squot;3&squot;)?3:X;X=(s==&squot;4&squot;)?4:X;X=(s==&squot;5&squot;)?5:X;X=(s==&squot;6&squot;)?6:X;X=(s==&squot;7&squot;)?7:X;X=(s==&squot;8&squot;)?8:X;X=(s==&squot;9&squot;)?9:X;X=(s==&squot;a&squot;)?10:X;X=(s==&squot;b&squot;)?11:X;X=(s==&squot;c&squot;)?12:X;X=(s==&squot;d&squot;)?13:X;X=(s==&squot;e&squot;)?14:X;X=(s==&squot;f&squot;)?15:X;X=(s==&squot;A&squot;)?10:X;X=(s==&squot;B&squot;)?11:X;X=(s==&squot;C&squot;)?12:X;X=(s==&squot;D&squot;)?13:X;H=(s==&squot;E&squot;)?14:X;H=(s==&squot;F&squot;)?15:X;' tipo='función' 
id='hhtox(ss)' algoritmo='sí' expresión='(htox(s1)*16+htox(s2)+1)/256' local='s1,s2' hacer='s1=_substring_(ss,0,1);s2=_substring_(ss,1,2);' tipo='función' 
id='HX' vector='sí' evaluar='una-sola-vez' tamaño='16' expresión='HX[0]=&squot;0&squot;;HX[1]=&squot;1&squot;;HX[2]=&squot;2&squot;;HX[3]=&squot;3&squot;;HX[4]=&squot;4&squot;;HX[5]=&squot;5&squot;;HX[6]=&squot;6&squot;;HX[7]=&squot;7&squot;;HX[8]=&squot;8&squot;;HX[9]=&squot;9&squot;;HX[10]=&squot;a&squot;;HX[11]=&squot;b&squot;;HX[12]=&squot;c&squot;;HX[13]=&squot;d&squot;;HX[14]=&squot;e&squot;;HX[15]=&squot;f&squot;;' tipo='vector' 
id='HEX(x)' algoritmo='sí' expresión='HX[ent(n/16)]+HX[n%16]' inicio='n=ent(x*255.99)' tipo='función' 
id='isNum(x)' algoritmo='no' expresión='(_Num_(x)!=&squot;NaN&squot;)' tipo='función' 
id='ROMAN' vector='sí' evaluar='una-sola-vez' tamaño='20' expresión='&squot;I&squot;;&squot;II&squot;;&squot;III&squot;;&squot;IV&squot;;&squot;V&squot;;&squot;VI&squot;;&squot;VII&squot;;&squot;VIII&squot;;&squot;IX&squot;;&squot;X&squot;;&squot;XI&squot;;&squot;XII&squot;;&squot;XIII&squot;;&squot;XIV&squot;;&squot;XV&squot;;&squot;XVI&squot;;&squot;XVII&squot;;&squot;XVIII&squot;;&squot;XIX&squot;;&squot;XX&squot;;' tipo='vector' 
id='_____SYMBOLS_____' expresión='0' tipo='variable' 
id='SYMBOL' vector='sí' evaluar='una-sola-vez' tamaño='120' tipo='vector' 
id='initSYMBOL()' algoritmo='sí' expresión='n' local='str,n' inicio='str=&squot;&squot;;str=str+&squot;+−·×÷αβγδεζηθικλμνξοπρςστυφχψω√±½¼°²³₀₁₂₃∞∢∅∈∴∧∨≦≧≡≠⏊′″‴‛’‟”&squot;;str=str+&squot;+−·×÷ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ ΣΤΥΦΧΨΩ√±½¼°²³₀₁₂₃∞∢∅∈∴∧∨≦≧≡≠⏊′″‴‛’‟”&squot;;n=0' hacer='SYMBOL[n]=_substring_(str,n,n+1);n=n+1' mientras='n<120' tipo='función' 
id='_____ORDENAR_____' expresión='0' tipo='variable' 
id='ORDEN' vector='sí' evaluar='una-sola-vez' tamaño='100' tipo='vector' 
id='QUE' vector='sí' evaluar='una-sola-vez' tamaño='100' tipo='vector' 
id='initORDEN(N)' algoritmo='sí' expresión='1' local='n' inicio='n=0' hacer='ORDEN[n]=n;n=n+1' mientras='n<N' tipo='función' 
id='exchangeQUE(i,j)' algoritmo='sí' expresión='1' local='aux' hacer='aux=QUE[i];QUE[i]=QUE[j];QUE[j]=aux;aux=ORDEN[i];ORDEN[i]=ORDEN[j];ORDEN[j]=aux' tipo='función' 
id='ordenaQUE(N)' algoritmo='sí' expresión='1' local='i,j' inicio='initORDEN(N);initQUE(N);i=0;j=1' hacer='(QUE[j]<QUE[i])?exchangeQUE(i,j):&squot;&squot;;j=j+1;i=(j>=N)?i+1:i;j=(j>=N)?i+1:j' mientras='i+1<N' tipo='función' info='Simple Sort' 
id='_____XML_____' expresión='0' tipo='variable' 
id='extract(str,label)' algoritmo='sí' expresión='s' local='ix0,ix1,s' hacer='ix0=_indexOf_(str,&squot;<&squot;+label+&squot;>&squot;)+_length_(&squot;<&squot;+label+&squot;>&squot;);ix1=_indexOf_(str,&squot;</&squot;+label+&squot;>&squot;);s=((0<=ix0)&(ix0<ix1))?_substring_(str,ix0,ix1):&squot;&squot;;' tipo='función' 
id='skip(str,label)' algoritmo='sí' expresión='(ix1>=0)?_substring_(str,ix1+_length_(&squot;</&squot;+label+&squot;>&squot;),_length_(str)):str' local='ix1' inicio='ix1=_indexOf_(str,&squot;</&squot;+label+&squot;>&squot;)' hacer=';' tipo='función' 
id='_____STRINGS_____' expresión='0' tipo='variable' 
id='trim(str)' algoritmo='sí' expresión='str' hacer='str=_replace_(str,&squot;\r&squot;,&squot;&squot;);str=_replace_(str,&squot;\n&squot;,&squot;&squot;);//str=_replace_(str,&squot; &squot;,&squot;&squot;);str=_replace_(str,&squot; &squot;,&squot;&squot;) // el espacio que html respeta;' tipo='función'