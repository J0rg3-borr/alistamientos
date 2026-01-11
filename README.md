# Dashboard de equipos (Next.js)

Proyecto pequeño que provee un dashboard para listar equipos de cómputo y guardar los registros en una hoja de Google Sheets llamada `listamiento`.

Pasos rápidos:

1. Copia `.env.example` a `.env.local` y completa `GOOGLE_SERVICE_ACCOUNT_KEY` y `SHEET_ID`.
2. Comparte la hoja de cálculo con el `client_email` del service account.
3. Instala dependencias:

```bash
npm install
```

4. Ejecuta en modo desarrollo:

```bash
npm run dev
```

Despliegue:
- Sube el repositorio a GitHub.
- En Vercel configura las variables de entorno equivalentes (`GOOGLE_SERVICE_ACCOUNT_KEY`, `SHEET_ID`).

Subir a GitHub (ejemplo):

```bash
git init
git add .
git commit -m "Inicial: dashboard equipos"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/TU_REPO.git
git push -u origin main
```

En Vercel:
- Importa el repo desde GitHub.
- Agrega las variables de entorno (`GOOGLE_SERVICE_ACCOUNT_KEY` y `SHEET_ID`).
- Despliega.

Notas de Google Sheets:
- Crea un service account en Google Cloud Console, genera la clave JSON y pégala en `GOOGLE_SERVICE_ACCOUNT_KEY` (escapando correctamente las nuevas líneas o usando el JSON completo entre comillas simples en `.env.local`).
- Comparte tu hoja de cálculo con el `client_email` del service account y nómbrala exactamente `listamiento` o ajusta el rango en `lib/googleSheets.js`.


Seguridad:
- Nunca subas la llave del service account en texto plano al repositorio.
