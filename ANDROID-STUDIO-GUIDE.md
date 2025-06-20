# 🏗️ CloudFarm Air - Guia Android Studio

## 🎯 Situação Atual

✅ **Capacitor configurado e pronto!**
✅ **Android Studio deve estar abrindo agora**
✅ **Todas as otimizações implementadas**

## 📱 Próximos Passos no Android Studio

### **1. Aguardar Gradle Sync**
- Aguarde o Android Studio terminar de sincronizar
- Você verá uma barra de progresso na parte inferior
- Pode demorar 2-5 minutos na primeira vez

### **2. Verificar se Tudo Carregou**
- Na árvore de arquivos à esquerda, você deve ver:
  - `app/` (pasta principal)
  - `manifests/AndroidManifest.xml`
  - `java/com.cloudfarm.air/MainActivity`
  - `res/` (recursos)

### **3. Gerar APK Assinado**

#### **Opção A: APK Debug (Mais Rápido)**
1. Clique em **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Aguarde o build completar
3. Clique em **locate** quando aparecer a notificação
4. APK estará em: `android/app/build/outputs/apk/debug/`

#### **Opção B: APK Release (Recomendado)**
1. Clique em **Build** → **Generate Signed Bundle / APK**
2. Selecione **APK** → **Next**
3. **Criar Keystore:**
   - Clique em **Create new...**
   - Escolha um local para salvar (ex: `cloudfarm-keystore.jks`)
   - Preencha os dados:
     - **Password**: (sua senha segura)
     - **Alias**: cloudfarm-air
     - **Password**: (mesma senha)
     - **Validity**: 25 years
     - **Name**: CloudFarm
     - **Organization**: CloudFarm
     - **Country**: BR
4. Clique **OK** → **Next**
5. Selecione **release** → **Finish**

### **4. Localizar o APK**
- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`

## 🚀 Testar o APK

### **No Emulador Android Studio:**
1. Clique no ícone do celular na barra superior
2. Crie um emulador se não tiver (Pixel 6, API 33)
3. Arraste o APK para o emulador

### **No Dispositivo Real:**
1. Ative **Opções do desenvolvedor** no Android
2. Ative **Depuração USB**
3. Conecte via USB
4. Arraste o APK para o dispositivo
5. Ou use: `adb install app-release.apk`

## 🔧 Script Automático

Para builds futuros, use o script:
```bash
# Windows
scripts/build-apk.bat

# Ou manualmente:
npm run build
npx cap copy android
npx cap sync android
npx cap open android
```

## 🎨 Personalizar Ícones (Opcional)

Se quiser trocar os ícones padrão:

1. **Gerar ícones**: Abra `icon-generator.html` no navegador
2. **No Android Studio**:
   - Clique com direito em `res/` → **New** → **Image Asset**
   - Escolha **Launcher Icons (Adaptive and Legacy)**
   - Upload seus ícones PNG
   - Clique **Next** → **Finish**

## 📋 Checklist Final

- [ ] Gradle sync completou sem erros
- [ ] Build APK executou com sucesso
- [ ] APK instalou no dispositivo/emulador
- [ ] App abre e funciona corretamente
- [ ] Todas as funcionalidades testadas
- [ ] Performance satisfatória

## 🆘 Problemas Comuns

### **Gradle Sync Failed**
```bash
# No terminal do projeto:
cd android
./gradlew clean
cd ..
npx cap sync android
```

### **APK Não Instala**
- Verificar se "Fontes desconhecidas" está habilitado
- Tentar desinstalar versão anterior primeiro
- Verificar logs: `adb logcat`

### **App Não Abre**
- Verificar permissões no AndroidManifest.xml
- Testar versão debug primeiro
- Verificar logs no Android Studio

## 🎉 Resultado Final

**Parabéns!** Você terá um APK nativo do CloudFarm Air pronto para:
- ✅ Instalar em qualquer Android 5.0+
- ✅ Distribuir para usuários
- ✅ Publicar na Google Play Store
- ✅ Funcionar offline (básico)
- ✅ Performance otimizada para mobile

---

**📱 Tamanho esperado do APK: 8-12 MB**
**🚀 Compatibilidade: Android 5.0+ (API 21+)** 